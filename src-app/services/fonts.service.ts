import { invoke } from '@tauri-apps/api/core'

export interface FontInfo {
  family: string
  style: string
  full_name: string
  path: string
}

export interface FontCacheInfo {
  timestamp: number
  ui_count: number
  editor_count: number
  is_valid: boolean
}

export interface FontsService {
  getAvailableUIFonts: () => Promise<FontInfo[]>
  getAvailableEditorFonts: () => Promise<FontInfo[]>
  refreshFontCache: () => Promise<FontCacheInfo>
  getFontCacheInfo: () => Promise<FontCacheInfo>
}

function defineService(): FontsService {
  return {
    async getAvailableUIFonts() {
      return await invoke<FontInfo[]>('get_available_ui_fonts')
    },

    async getAvailableEditorFonts() {
      return await invoke<FontInfo[]>('get_available_editor_fonts')
    },

    async refreshFontCache() {
      return await invoke<FontCacheInfo>('refresh_font_cache')
    },

    async getFontCacheInfo() {
      return await invoke<FontCacheInfo>('get_font_cache_info')
    }
  }
}

export const fontsService = defineService()
export default defineService()
