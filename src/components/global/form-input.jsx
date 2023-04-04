import PropTypes from "prop-types"
import { memo, useEffect, useRef } from "react"
import PageTitle from "@/components/global/page-title"

const FormInput = ({
  label,
  type,
  disabled,
  placeholder,
  required,
  desc,
  autoFocus,
  value = "",
  onChange = () => {},
}) => {
  const inputRef = useRef(null)
  const changeValue = (e) => {
    onChange(e.target.value)
  }
  useEffect(() => {
    autoFocus && inputRef.current.focus()
  }, [])
  return (
    <div className="relative">
      {label !== "" && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {type === "color" && value && (
            <span className="ml-3 text-black">{value}</span>
          )}
          {required && <span className="text-primary ml-1"> *</span>}
          {desc && (
            <span className="text-xs ml-3 text-gray-800">
              (콤마로 구분하여 입력해주세요. (ex. 모션1,모션2)
            </span>
          )}
        </label>
      )}

      {type === "color" && value && (
        <span
          className="block w-1/3 absolute left-0 z-2 h-7 border pointer-events-none"
          style={{ background: value }}
        ></span>
      )}
      <input
        className={`${
          type === "color"
            ? "w-1/3"
            : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        }`}
        value={`${type === "color" ? (value ? value : "#000000") : value}`}
        type={type}
        ref={inputRef}
        onChange={(e) => changeValue(e)}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "number", "color"]),
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  desc: PropTypes.string,
}

FormInput.defaultProps = {
  value: "",
  type: "text",
  disabled: false,
  autoFocus: false,
  onChange: null,
  required: true,
}
export default FormInput
