import { useEffect, useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import ko from "date-fns/locale/ko"
import "react-datepicker/dist/react-datepicker.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import PropTypes from "prop-types"

registerLocale("ko", ko)
const FormDatepicker = ({
  label,
  name,
  required,
  value,
  onChange = () => {},
}) => {
  const [date, setDate] = useState(new Date())

  function formatDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear().toString()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const changeValue = (date) => {
    onChange(formatDate(date))
    setDate(date)
  }
  useEffect(() => {
    !value && onChange(formatDate(date))
  }, [])
  return (
    <div className="relative">
      <label
        htmlFor={`datepicker_${name}`}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {!date.length < 10 && (
        <span className="absolute left-2.5 pr-3 top-10 z-10 bg-gray-50 text-sm pointer-events-none">
          {String(value)}
        </span>
      )}

      <DatePicker
        locale="ko"
        required={required}
        selected={date}
        value={date}
        dateFormat="yyyy-MM-dd"
        onChange={(date) => changeValue(date)}
        id={`datepicker_${name}`}
        className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-10" />
    </div>
  )
}

FormDatepicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]),
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
}

FormDatepicker.defaultProps = {
  value: "",
  label: "",
  name: "",
  disabled: false,
  required: true,
  onChange: null,
}

export default FormDatepicker
