import { MinusIcon, PlusIcon } from 'lucide-react'

export function NumberInput({ defaultValue, onChange }: any) {
  return (
    <div className="flex items-center justify-between gap-x-1.5 px-1.5 h-full">
      <button
        type="button"
        className="size-5 p-0.5 inline-flex justify-center items-center rounded border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600"
      >
        <MinusIcon className="flex-shrink-0 size-4" strokeWidth={1.6} />
      </button>
      <input
        type="text"
        className="h-full p-0 w-full bg-transparent border-0 text-base text-neutral-800 text-center focus:ring-0 dark:text-white"
        maxLength={3}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <button
        type="button"
        className="size-5 p-0.5 inline-flex justify-center items-center rounded border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600"
      >
        <PlusIcon className="flex-shrink-0 size-4" strokeWidth={1.6} />
      </button>
    </div>
  )
}
