import { Suspense, useId } from 'react'

import { NumberInput } from '@/components/elements/input'
import PageLoader from '@/components/loader'

export function SettingAppearance() {
  const editorFontFamilyId = useId()

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex flex-col size-full justify-start pb-4">
        <section className="space-y-5">
          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="text-base font-semibold leading-6 dark:text-white">
                Editor Font Family
              </h2>
              <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                Change the default font used in query editor.
              </p>
            </div>

            <div className="w-1/3 flex flex-1 items-center">
              <div className="w-full">
                <label htmlFor={editorFontFamilyId} className="sr-only">
                  Editor Font
                </label>
                <select
                  id={editorFontFamilyId}
                  className="py-3 px-4 pe-9 block w-full border-neutral-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                >
                  <option selected>JetBrains Mono NL</option>
                  <option>CommitMono</option>
                  <option>Monaco</option>
                  <option>Roboto Mono</option>
                  <option>Consolas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="text-base font-semibold leading-6 dark:text-white">
                Editor Font Size
              </h2>
              <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                Change the default font size used in editor.
              </p>
            </div>

            <div className="w-1/3 flex flex-1 items-center">
              <div className="h-8 inline-block border border-neutral-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <NumberInput defaultValue={1} />
              </div>
            </div>
          </div>
        </section>

        <hr className="my-6 border-neutral-200 dark:border-neutral-600" />

        <section className="space-y-5">
          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="text-base font-semibold leading-6 dark:text-white">
                Table Font Family
              </h2>
              <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                Change the default font used in data table.
              </p>
            </div>

            <div className="w-1/3 flex flex-1 items-center">
              <div className="w-full">
                <label htmlFor="editor-font-family" className="sr-only">
                  Table Font
                </label>
                <select
                  id="editor-font-family"
                  className="py-3 px-4 pe-9 block w-full border-neutral-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                >
                  <option selected>JetBrains Mono NL</option>
                  <option>CommitMono</option>
                  <option>Monaco</option>
                  <option>Roboto Mono</option>
                  <option>Consolas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="text-base font-semibold leading-6 dark:text-white">Table Font Size</h2>
              <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                Change the default font size used in data table.
              </p>
            </div>

            <div className="w-1/3 flex flex-1 items-center">
              <div className="h-8 inline-block border border-neutral-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                <NumberInput defaultValue={1} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  )
}
