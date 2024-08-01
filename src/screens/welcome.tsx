import { invoke } from '@tauri-apps/api/core'

export default function WelcomeScreen() {
  return (
    <div className="flex size-full flex-col items-center justify-center dark:bg-black">
      <div className="max-w-lg space-y-4 text-center dark:text-white">
        <h1 className="font-bold text-4xl">Welcome to Tauri!</h1>
        <p className="font-normal text-medium leading-7">
          This screen is intended to be simple as possible. <br />
          To see the invoke command in action, open the settings.
        </p>
        <p className="mt-6 font-normal text-base">
          Brought to you by{' '}
          <button
            type="button"
            className="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => invoke('open_with_shell', { url: 'https://twitter.com/riipandi' })}
          >
            Aris Ripandi
          </button>{' '}
          and the{' '}
          <button
            type="button"
            className="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => invoke('open_with_shell', { url: 'https://tauri.app' })}
          >
            Tauri team
          </button>
          .
        </p>
      </div>
    </div>
  )
}
