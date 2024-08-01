import { clx } from '@/utils/helpers'

interface CaptionControlProps {
  handleMinimize: () => void
  handleMaximize: () => void
  handleClose: () => void
  isFocused: boolean
}

export default function CaptionControl(props: CaptionControlProps) {
  return (
    <div className={clx('caption-controls', props.isFocused && 'focus')}>
      <button
        type="button"
        className="caption-control caption-control-minimize"
        onClick={props.handleMinimize}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 14H4v-4h16" />
        </svg>
      </button>
      <button
        type="button"
        className="caption-control caption-control-maximize"
        onClick={props.handleMaximize}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
        </svg>
      </button>
      <button
        type="button"
        className="caption-control caption-control-close"
        onClick={props.handleClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
          />
        </svg>
      </button>
    </div>
  )
}
