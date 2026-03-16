// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

import { invoke } from '@tauri-apps/api/core'

export interface DemoService {
  greet: (name: string) => Promise<string>
}

function defineService(): DemoService {
  return {
    async greet(name: string) {
      return await invoke<string>('greet', { name })
    }
  }
}

export const demoService = defineService()
export default defineService()
