import { invoke } from '@tauri-apps/api/core'

export default function WelcomeScreen() {
  return (
    <div className="size-full items-center justify-center flex flex-col dark:bg-black">
      <div className="text-center max-w-lg space-y-4 dark:text-white">
        <h1 className="font-bold text-4xl">Welcome to Tauri!</h1>
        <p className="font-normal text-medium leading-7">
          This screen is intended to be simple as possible. <br />
          To see the invoke command in action, open the settings.
        </p>
        <p className="font-normal text-base mt-6">
          Brought to you by{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
            onClick={() => invoke('open_with_shell', { url: 'https://twitter.com/riipandi' })}
          >
            Aris Ripandi
          </button>{' '}
          and the{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
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
