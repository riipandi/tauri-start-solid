//! Menu manager module
//! Centralizes menu creation and handles platform-specific menu differences

use super::common::{create_predefined_menu_item, get_common_menus};
use crate::core::menu::types::{MenuItem, MenuItemType};
use tauri::Runtime;
use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};

/// Build a Tauri menu from our menu item definitions
pub fn create_app_menu<R: Runtime>(app: &tauri::App<R>) -> tauri::Result<tauri::menu::Menu<R>> {
    let menu_items = get_menu_items();
    let mut menu_builder = MenuBuilder::new(app);

    for item in menu_items {
        if let MenuItemType::Submenu = item.item_type {
            let submenu = build_submenu(app, &item)?;
            menu_builder = menu_builder.item(&submenu);
        }
    }

    menu_builder.build()
}

/// Get all menu items for the application
fn get_menu_items() -> Vec<MenuItem> {
    let mut items = Vec::new();

    // App menu (macOS only)
    #[cfg(target_os = "macos")]
    items.push(MenuItem::submenu("App", super::macos::get_app_menu_items()));

    // Add commond menus (File, Edit, View, Window, Help)
    items.extend(get_common_menus());

    items
}

/// Build a submenu from a MenuItem definition
fn build_submenu<R: Runtime>(app: &tauri::App<R>, menu_item: &MenuItem) -> tauri::Result<tauri::menu::Submenu<R>> {
    let mut submenu_builder = SubmenuBuilder::new(app, &menu_item.label);

    // Special case for About menu on macOS
    #[cfg(target_os = "macos")]
    if menu_item.label == "App" {
        for child in &menu_item.children {
            if child.id == "about" {
                submenu_builder = submenu_builder.about(Some(AboutMetadata { ..Default::default() }));
                continue;
            }
            submenu_builder = add_item_to_submenu(app, submenu_builder, child)?;
        }
    } else {
        for child in &menu_item.children {
            submenu_builder = add_item_to_submenu(app, submenu_builder, child)?;
        }
    }

    submenu_builder.build()
}

/// Add a menu item to a submenu builder
fn add_item_to_submenu<'a, R: Runtime>(
    app: &'a tauri::App<R>,
    submenu_builder: SubmenuBuilder<'a, R, tauri::App<R>>,
    item: &MenuItem,
) -> tauri::Result<SubmenuBuilder<'a, R, tauri::App<R>>> {
    match &item.item_type {
        MenuItemType::Regular => {
            let mut item_builder = MenuItemBuilder::new(&item.label).id(&item.id);

            if let Some(accelerator) = &item.accelerator {
                item_builder = item_builder.accelerator(accelerator);
            }

            if !item.enabled {
                item_builder = item_builder.enabled(false);
            }

            let menu_item = item_builder.build(app)?;
            Ok(submenu_builder.item(&menu_item))
        }
        MenuItemType::Separator => Ok(submenu_builder.separator()),
        MenuItemType::Predefined(predefined_type) => {
            let predefined = create_predefined_menu_item(app, predefined_type)?;
            Ok(submenu_builder.item(&predefined))
        }
        MenuItemType::Submenu => {
            // Handle nested submenus
            let nested_submenu = build_submenu(app, item)?;
            Ok(submenu_builder.item(&nested_submenu))
        }
    }
}
