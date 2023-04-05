import {useState, useEffect} from 'react'
import DatePicker from 'react-datepicker'
import {useController} from 'react-hook-form'
import PropTypes from 'prop-types'
import ko from 'date-fns/locale/ko'
import 'react-datepicker/dist/react-datepicker.css'

const Datepicker = ({
                        control = null,
                        name = '',
                        range = true,
                        size = 'sm',
                        label = '',
                        required = false,
                        placeholder = '시작일',
                        placeholderEnd = '종료일',
                        description = '' ?? {},
                        className = '',
                        disabled = false,
                        time = false,
                        timeIntervals = 5,
                        showMonthYearPicker = false,
                        minDate,
                        maxDate,
                        ...props
                    }) => {
    const [focus, setFocus] = useState(false)

    const [touched, setTouched] = useState([])

    const {
        field: {
            ref,
            onChange,
            onBlur,
            value = range ? {startDate: null, endDate: null} : null,
            ...field
        },
        fieldState: {error = {}, isTouched, isDirty, invalid}
    } = useController({
        control,
        name
    })

    useEffect(() => {
        const t = range ? 2 : 1
        if (touched.length === t) {
            onBlur()
        }
    }, [touched])

    const startMin = range
        ? value?.startDate && value.startDate < minDate
            ? value.startDate
            : minDate
        : null
    const startMax = range
        ? value?.endDate && value.endDate < maxDate
            ? value.endDate
            : maxDate
        : null
    const endMin = range
        ? value?.startDate && value.startDate > minDate
            ? value.startDate
            : minDate
        : null
    const endMax = range
        ? value?.endDate && value.endDate > maxDate
            ? value.endDate
            : maxDate
        : null

    return (
        <span
            className={`form-date block relative ${className} ${
                focus ? 'z-100' : ''
            }`}
        >
      {label && (
          <label
              className={`block w-100 label text-${size} tooltip-right tooltip-error tooltip ${
                  (!isDirty || isTouched) && JSON.stringify(error) !== `{}`
                      ? 'tooltip-open text-error'
                      : ''
              }`}
              data-tip={error?.message}
              htmlFor={name}
          >
              {label}
              {required && <span className="text-error inline-block ml-1">*</span>}
          </label>
      )}
            <span className={`input-group input-group-${size} inline-flex`}>
        <div className="datepicker-wrap w-full mt-2">
          <DatePicker
              showMonthYearPicker={showMonthYearPicker}
              closeOnScroll={(e) =>
                  e.target === document.querySelector('.drawer-content')
              }
              // wrapperClassName={}
              popperClassName="not-prose"
              locale={ko}
              dateFormat={time ? 'yyyy-MM-dd  HH:mm' : 'yyyy-MM-dd'}
              {...field}
              placeholderText={placeholder}
              onChange={(date) => {
                  if (range) {
                      onChange({
                          startDate: date,
                          endDate: date <= value.endDate ? value.endDate : null
                      })
                  } else {
                      onChange(date)
                  }
                  setTouched([...new Set([...touched, 0])])
                  setFocus(false)
              }}
              onFocus={() => {
                  setFocus(true)
              }}
              onBlur={() => {
                  setTouched([...new Set([...touched, 0])])
                  setFocus(false)
              }}
              fixedHeight
              isClearable
              showPopperArrow={false}
              selectsStart
              selected={range ? value.startDate : value}
              startDate={range ? value.startDate : value}
              endDate={range ? value.endDate : value}
              minDate={range ? startMin : minDate}
              maxDate={range ? startMax : maxDate}
              showTimeSelect={time}
              timeFormat="HH:mm"
              timeIntervals={timeIntervals}
              autoComplete="off"
              customInput={
                  <input
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      type="text"
                      ref={ref}
                      disabled={disabled}
                  />
              }
              renderCustomHeader={({
                                       monthDate,
                                       decreaseYear,
                                       increaseYear,
                                       customHeaderCount,
                                       decreaseMonth,
                                       increaseMonth,
                                       prevMonthButtonDisabled,
                                       nextMonthButtonDisabled
                                   }) => (
                  <div className="flex justify-between pl-2 pr-2">
                      <button
                          type="button"
                          aria-label="Previous Month"
                          className="btn no-animation border-gray-400 btn-outline p-0 w-6 h-6 min-h-min"
                          onClick={showMonthYearPicker ? decreaseYear : decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                          >
                              <path
                                  fillRule="evenodd"
                                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                  clipRule="evenodd"
                              />
                          </svg>
                      </button>
                      <span className="bg-transparent text-lg">
                  {monthDate.toLocaleString('ko-KR', {
                      month: 'numeric',
                      year: 'numeric'
                  })}
                </span>
                      <button
                          type="button"
                          aria-label="Next Month"
                          className="btn no-animation border-gray-400 btn-outline p-0 w-6 h-6 min-h-min"
                          onClick={showMonthYearPicker ? increaseYear : increaseMonth}
                          disabled={nextMonthButtonDisabled}
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                          >
                              <path
                                  fillRule="evenodd"
                                  d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                  clipRule="evenodd"
                              />
                          </svg>
                      </button>
                  </div>
              )}
          />
        </div>
                {range && (
                    <div className="datepicker-wrap w-full">
                        <DatePicker
                            showMonthYearPicker={showMonthYearPicker}
                            closeOnScroll={(e) =>
                                e.target === document.querySelector('.drawer-content')
                            }
                            popperClassName="not-prose"
                            locale={ko}
                            dateFormat={time ? 'yyyy-MM-dd  HH:mm' : 'yyyy-MM-dd'}
                            {...field}
                            placeholderText={placeholderEnd}
                            onChange={(date) => {
                                if (range) {
                                    onChange({startDate: value.startDate, endDate: date})
                                } else {
                                    onChange(date)
                                }
                                setTouched([...new Set([...touched, 1])])
                                setFocus(false)
                            }}
                            onFocus={() => {
                                setFocus(true)
                            }}
                            onBlur={() => {
                                setTouched([...new Set([...touched, 1])])
                                setFocus(false)
                            }}
                            minDate={range ? endMin : minDate}
                            maxDate={range ? endMax : maxDate}
                            fixedHeight
                            isClearable
                            showPopperArrow={false}
                            selectsEnd
                            selected={range ? value.endDate : value}
                            startDate={range ? value.startDate : value}
                            endDate={range ? value.endDate : value}
                            showTimeSelect={time}
                            timeFormat="HH:mm"
                            timeIntervals={timeIntervals}
                            autoComplete="off"
                            customInput={
                                <input
                                    className={`input input-${size} input-bordered w-full bg-white`}
                                    type="text"
                                    ref={ref}
                                    disabled={disabled}
                                />
                            }
                            renderCustomHeader={({
                                                     monthDate,
                                                     decreaseYear,
                                                     increaseYear,
                                                     customHeaderCount,
                                                     decreaseMonth,
                                                     increaseMonth,
                                                     prevMonthButtonDisabled,
                                                     nextMonthButtonDisabled
                                                 }) => (
                                <div className="flex justify-between pl-2 pr-2">
                                    <button
                                        type="button"
                                        aria-label="Previous Month"
                                        className="btn no-animation border-gray-400 btn-outline p-0 w-6 h-6 min-h-min"
                                        onClick={showMonthYearPicker ? decreaseYear : decreaseMonth}
                                        disabled={prevMonthButtonDisabled}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <span className="bg-transparent text-lg">
                    {monthDate.toLocaleString('ko-KR', {
                        month: 'numeric',
                        year: 'numeric'
                    })}
                  </span>
                                    <button
                                        type="button"
                                        aria-label="Next Month"
                                        className="btn no-animation border-gray-400 btn-outline p-0 w-6 h-6 min-h-min"
                                        onClick={showMonthYearPicker ? increaseYear : increaseMonth}
                                        disabled={nextMonthButtonDisabled}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        />
                    </div>
                )}
      </span>
            {description && (
                <span className="pl-1 label-text-alt">{description}</span>
            )}
            <style jsx>{`
              .input-group > :global(.datepicker-wrap .input) {
                border-radius: 0;
              }

              .input-group > :first-child,
              .input-group > :global(.datepicker-wrap:first-child .input) {
                border-top-left-radius: var(--rounded-btn, 0.5rem);
                border-bottom-left-radius: var(--rounded-btn, 0.5rem);
              }

              .input-group > :global(.datepicker-wrap + .datepicker-wrap .input) {
                margin-left: -1px;
              }

              .input-group > :last-child:not(.react-datepicker__tab-loop),
              .input-group > :global(.datepicker-wrap:last-child .input) {
                border-top-right-radius: var(--rounded-btn, 0.5rem);
                border-bottom-right-radius: var(--rounded-btn, 0.5rem);
              }
            `}</style>
    </span>
    )
}
Datepicker.propTypes = {
    control: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    size: PropTypes.string,
    label: PropTypes.string,
    timeIntervals: PropTypes.number,
    placeholder: PropTypes.string,
    placeholderEnd: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    showMonthYearPicker: PropTypes.bool,
    disabled: PropTypes.bool,
    range: PropTypes.bool,
    time: PropTypes.bool,
    required: PropTypes.bool
}
export default Datepicker
