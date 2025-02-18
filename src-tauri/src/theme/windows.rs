/*!
 * Portions of this file are based on code from `wyhaya/tauri-plugin-theme`.
 * Credits to wyhaya: https://github.com/wyhaya/tauri-plugin-theme
 */

use super::{save_theme_state, Theme};
use tauri::{AppHandle, Manager, Runtime};
use webview2_com::Microsoft::Web::WebView2::Win32::*;
use windows_core::Interface;

#[tauri::command]
#[specta::specta]
pub fn set_theme<R: Runtime>(app: AppHandle<R>, theme: Theme) -> Result<(), &'static str> {
    save_theme_state(&app, theme)?;

    for (_, window) in app.webview_windows() {
        let (app, app2) = (app.clone(), app.clone());
        // Window
        let hwnd = window.hwnd().unwrap_or_else(|_| app.restart());
        darkmode::try_window_theme(hwnd, theme, false);
        // Webview
        window
            .with_webview(move |view| unsafe {
                let controller = view.controller();
                let coreview = controller.CoreWebView2().unwrap_or_else(|_| app.restart());
                let webview = coreview.cast::<ICoreWebView2_13>().unwrap_or_else(|_| app.restart());
                let profile = webview.Profile().unwrap_or_else(|_| app.restart());
                let theme = match theme {
                    Theme::Dark => COREWEBVIEW2_PREFERRED_COLOR_SCHEME_DARK,
                    Theme::Light => COREWEBVIEW2_PREFERRED_COLOR_SCHEME_LIGHT,
                    Theme::System => COREWEBVIEW2_PREFERRED_COLOR_SCHEME_AUTO,
                };
                profile.SetPreferredColorScheme(theme).unwrap_or_else(|_| app.restart());
            })
            .unwrap_or_else(|_| app2.restart());
    }
    Ok(())
}

// From: https://github.com/tauri-apps/tao/blob/2c6de758ac656c0621d20da7c1649adfb8847066/src/platform_impl/windows/dark_mode.rs
mod darkmode {
    // Copyright 2014-2021 The winit contributors
    // Copyright 2021-2023 Tauri Programme within The Commons Conservancy
    // SPDX-License-Identifier: Apache-2.0

    use crate::Theme;
    use std::ffi::c_void;
    use std::sync::LazyLock;
    /// This is a simple implementation of support for Windows Dark Mode,
    /// which is inspired by the solution in https://github.com/ysc3839/win32-darkmode
    use windows::{
        core::{s, w, PCSTR, PSTR},
        Win32::{
            Foundation::{BOOL, HANDLE, HMODULE, HWND, WPARAM},
            Graphics::Dwm::{DwmSetWindowAttribute, DWMWA_USE_IMMERSIVE_DARK_MODE},
            System::LibraryLoader::*,
            UI::{Accessibility::*, WindowsAndMessaging::*},
        },
    };

    static HUXTHEME: LazyLock<isize> =
        LazyLock::new(|| unsafe { LoadLibraryA(s!("uxtheme.dll")).unwrap_or_default().0 as _ });

    static WIN10_BUILD_VERSION: LazyLock<Option<u32>> = LazyLock::new(|| {
        let version = windows_version::OsVersion::current();
        if version.major == 10 && version.minor == 0 {
            Some(version.build)
        } else {
            None
        }
    });

    static DARK_MODE_SUPPORTED: LazyLock<bool> = LazyLock::new(|| {
        // We won't try to do anything for windows versions < 17763
        // (Windows 10 October 2018 update)
        match *WIN10_BUILD_VERSION {
            Some(v) => v >= 17763,
            None => false,
        }
    });

    /// Attempt to set a theme on a window, if necessary.
    /// Returns the theme that was picked
    pub fn try_window_theme(hwnd: HWND, preferred_theme: Theme, redraw_title_bar: bool) {
        if *DARK_MODE_SUPPORTED {
            let is_dark_mode = match preferred_theme {
                Theme::System => should_use_dark_mode(),
                Theme::Dark => true,
                Theme::Light => false,
            };
            refresh_titlebar_theme_color(hwnd, is_dark_mode, redraw_title_bar);
        }
    }

    fn refresh_titlebar_theme_color(hwnd: HWND, is_dark_mode: bool, redraw_title_bar: bool) {
        if let Some(ver) = *WIN10_BUILD_VERSION {
            if ver < 18362 {
                let mut is_dark_mode_bigbool: i32 = is_dark_mode.into();
                unsafe {
                    let _ = SetPropW(
                        hwnd,
                        w!("UseImmersiveDarkModeColors"),
                        HANDLE(&mut is_dark_mode_bigbool as *mut _ as _),
                    );
                }
            } else {
                let dark_mode = BOOL::from(is_dark_mode);
                unsafe {
                    let _ = DwmSetWindowAttribute(
                        hwnd,
                        DWMWA_USE_IMMERSIVE_DARK_MODE,
                        &dark_mode as *const BOOL as *const c_void,
                        std::mem::size_of::<BOOL>() as u32,
                    );
                }
                if redraw_title_bar {
                    unsafe { DefWindowProcW(hwnd, WM_NCACTIVATE, None, None) };
                    unsafe { DefWindowProcW(hwnd, WM_NCACTIVATE, WPARAM(true.into()), None) };
                }
            }
        }
    }

    fn should_use_dark_mode() -> bool {
        should_apps_use_dark_mode() && !is_high_contrast()
    }

    fn should_apps_use_dark_mode() -> bool {
        const UXTHEME_SHOULDAPPSUSEDARKMODE_ORDINAL: u16 = 132;
        type ShouldAppsUseDarkMode = unsafe extern "system" fn() -> bool;
        static SHOULD_APPS_USE_DARK_MODE: LazyLock<Option<ShouldAppsUseDarkMode>> = LazyLock::new(|| unsafe {
            if HMODULE(*HUXTHEME as _).is_invalid() {
                return None;
            }

            GetProcAddress(
                HMODULE(*HUXTHEME as _),
                PCSTR::from_raw(UXTHEME_SHOULDAPPSUSEDARKMODE_ORDINAL as usize as *mut _),
            )
            .map(|handle| std::mem::transmute(handle))
        });

        SHOULD_APPS_USE_DARK_MODE
            .map(|should_apps_use_dark_mode| unsafe { (should_apps_use_dark_mode)() })
            .unwrap_or(false)
    }

    fn is_high_contrast() -> bool {
        const HCF_HIGHCONTRASTON: u32 = 1;

        let mut hc = HIGHCONTRASTA {
            cbSize: 0,
            dwFlags: Default::default(),
            lpszDefaultScheme: PSTR::null(),
        };

        let ok = unsafe {
            SystemParametersInfoA(
                SPI_GETHIGHCONTRAST,
                std::mem::size_of_val(&hc) as _,
                Some(&mut hc as *mut _ as _),
                Default::default(),
            )
        };

        ok.is_ok() && (HCF_HIGHCONTRASTON & hc.dwFlags.0) != 0
    }
}
