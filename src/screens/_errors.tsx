import { DefaultTitleBar } from '@/components/titlebar'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeftCircleIcon } from 'lucide-react'

export function BlankScreen() {
  return null
}

export function NotFound() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // @ref: https://reactrouter.com/en/main/components/link#state
  const backPath = () => (state?.previous ? -1 : '/') as string

  return (
    <div className="root-error">
      <DefaultTitleBar />
      <div className="main-container">
        <div className="disable-select mx-auto flex size-full h-vh flex-col rounded-[10px] bg-transparent">
          <div className="flex flex-1 flex-col items-center justify-center space-y-8">
            <h1 className="font-bold text-2xl dark:text-white">Not Found</h1>
            <div className="mt-6">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-x-2 rounded-md border px-3 py-1.5 text-blue-light hover:text-blue-light/80"
                onClick={() => navigate(backPath())}
              >
                <ChevronLeftCircleIcon className="size-4" strokeWidth={1.6} />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
