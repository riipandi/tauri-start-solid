import { MinusIcon, PlusIcon } from 'lucide-react'

export function NumberInput({ defaultValue, onChange }: any) {
  return (
    <div className="flex h-full items-center justify-between gap-x-1.5 px-1.5">
      <button
        type="button"
        className="inline-flex size-5 items-center justify-center rounded border border-neutral-200 bg-white p-0.5 text-neutral-800 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600 dark:hover:bg-neutral-800"
      >
        <MinusIcon className="size-4 flex-shrink-0" strokeWidth={1.6} />
      </button>
      <input
        type="text"
        className="h-full w-full border-0 bg-transparent p-0 text-center text-base text-neutral-800 focus:ring-0 dark:text-white"
        maxLength={3}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <button
        type="button"
        className="inline-flex size-5 items-center justify-center rounded border border-neutral-200 bg-white p-0.5 text-neutral-800 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600 dark:hover:bg-neutral-800"
      >
        <PlusIcon className="size-4 flex-shrink-0" strokeWidth={1.6} />
      </button>
    </div>
  )
}
