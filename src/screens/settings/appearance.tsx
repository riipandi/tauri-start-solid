import { Suspense, useId } from 'react'

import { NumberInput } from '@/components/elements/input'
import PageLoader from '@/components/loader'

export function SettingAppearance() {
  const editorFontFamilyId = useId()

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex size-full flex-col justify-start pb-4">
        <section className="space-y-5">
          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="font-semibold text-base leading-6 dark:text-white">
                Editor Font Family
              </h2>
              <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                Change the default font used in query editor.
              </p>
            </div>

            <div className="flex w-1/3 flex-1 items-center">
              <div className="w-full">
                <label htmlFor={editorFontFamilyId} className="sr-only">
                  Editor Font
                </label>
                <select
                  id={editorFontFamilyId}
                  className="block w-full rounded-lg border-neutral-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:focus:ring-neutral-600"
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
              <h2 className="font-semibold text-base leading-6 dark:text-white">
                Editor Font Size
              </h2>
              <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                Change the default font size used in editor.
              </p>
            </div>

            <div className="flex w-1/3 flex-1 items-center">
              <div className="inline-block h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
                <NumberInput defaultValue={1} />
              </div>
            </div>
          </div>
        </section>

        <hr className="my-6 border-neutral-200 dark:border-neutral-600" />

        <section className="space-y-5">
          <div className="flex flex-1 justify-between space-x-4">
            <div className="w-2/3 pr-2">
              <h2 className="font-semibold text-base leading-6 dark:text-white">
                Table Font Family
              </h2>
              <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                Change the default font used in data table.
              </p>
            </div>

            <div className="flex w-1/3 flex-1 items-center">
              <div className="w-full">
                <label htmlFor="editor-font-family" className="sr-only">
                  Table Font
                </label>
                <select
                  id="editor-font-family"
                  className="block w-full rounded-lg border-neutral-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:focus:ring-neutral-600"
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
              <h2 className="font-semibold text-base leading-6 dark:text-white">Table Font Size</h2>
              <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                Change the default font size used in data table.
              </p>
            </div>

            <div className="flex w-1/3 flex-1 items-center">
              <div className="inline-block h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
                <NumberInput defaultValue={1} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  )
}
