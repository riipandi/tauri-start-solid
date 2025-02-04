import CalendarPrimitive from '@corvu/calendar'
import * as Lucide from 'lucide-solid'
import { Index } from 'solid-js'
import type { VoidComponent } from 'solid-js'

export const Calendar: VoidComponent = () => {
  return (
    <div>
      <CalendarPrimitive mode="single">
        {(props) => (
          <div class="my-4 rounded-md bg-corvu-100 p-3 shadow-md md:my-8">
            <div class="flex items-center justify-between">
              <CalendarPrimitive.Nav
                action="prev-month"
                aria-label="Go to previous month"
                class="size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
              >
                <Lucide.ChevronLeft size="18" />
              </CalendarPrimitive.Nav>
              <CalendarPrimitive.Label class="text-sm">
                {formatMonth(props.month)} {props.month.getFullYear()}
              </CalendarPrimitive.Label>
              <CalendarPrimitive.Nav
                action="next-month"
                aria-label="Go to next month"
                class="size-7 rounded bg-corvu-200/50 p-[5px] hover:bg-corvu-200"
              >
                <Lucide.ChevronRight size="18" />
              </CalendarPrimitive.Nav>
            </div>
            <CalendarPrimitive.Table class="mt-3">
              <thead>
                <tr>
                  <Index each={props.weekdays}>
                    {(weekday) => (
                      <CalendarPrimitive.HeadCell
                        abbr={formatWeekdayLong(weekday())}
                        class="w-8 pb-1 font-normal text-xs opacity-50"
                      >
                        {formatWeekdayShort(weekday())}
                      </CalendarPrimitive.HeadCell>
                    )}
                  </Index>
                </tr>
              </thead>
              <tbody>
                <Index each={props.weeks}>
                  {(week) => (
                    <tr>
                      <Index each={week()}>
                        {(day) => (
                          <CalendarPrimitive.Cell class="p-0">
                            <CalendarPrimitive.CellTrigger
                              day={day()}
                              class="corvu-selected:!bg-corvu-300 size-8 rounded-md corvu-today:bg-corvu-200/50 text-sm focus-visible:bg-corvu-200/80 disabled:pointer-events-none disabled:opacity-40 lg:hover:bg-corvu-200/80"
                            >
                              {day().getDate()}
                            </CalendarPrimitive.CellTrigger>
                          </CalendarPrimitive.Cell>
                        )}
                      </Index>
                    </tr>
                  )}
                </Index>
              </tbody>
            </CalendarPrimitive.Table>
          </div>
        )}
      </CalendarPrimitive>
    </div>
  )
}

const { format: formatWeekdayLong } = new Intl.DateTimeFormat('en', {
  weekday: 'long',
})
const { format: formatWeekdayShort } = new Intl.DateTimeFormat('en', {
  weekday: 'short',
})
const { format: formatMonth } = new Intl.DateTimeFormat('en', {
  month: 'long',
})
