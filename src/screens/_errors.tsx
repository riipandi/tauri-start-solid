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
        <div className="mx-auto h-vh size-full flex flex-col bg-transparent disable-select rounded-[10px]">
          <div className="flex-1 flex flex-col justify-center items-center space-y-8">
            <h1 className="text-2xl font-bold dark:text-white">Not Found</h1>
            <div className="mt-6">
              <button
                type="button"
                className="text-blue-light hover:text-blue-light/80 border rounded-md flex items-center gap-x-2 px-3 py-1.5 cursor-pointer"
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
