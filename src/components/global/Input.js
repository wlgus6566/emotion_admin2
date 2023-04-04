import { useController } from "react-hook-form"
import PropTypes from "prop-types"
import { useState } from "react"

const Input = ({
  control = null,
  type = "text",
  size = "sm",
  name = "",
  label = "",
  required = false,
  prefix,
  suffix,
  mask = "default",
  placeholder = "",
  className = "",
  disabled = false,
  readOnly = false,
  maxLength = false ?? 0,
  description = "" ?? {},
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  })
  const [count, setCount] = useState(0)
  const valueMask = () => {
    if (!field.value) return ""
    if (mask === "tel") {
      const onlyNumbers = String(field.value).replace(/[^0-9]/g, "")
      return onlyNumbers.slice(0, 11).replace(/\B(?=(\d{4})+(?!\d))/g, "-")
    }
    if (mask === "price") {
      let onlyNumbers = String(field.value).replace(/[^0-9]/g, "")
      return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return field.value
  }
  const FieldListener = {
    ...field,
    // value: field.value,
    value: valueMask(),
    onChange: (e) => {
      let val = e.target.value
      if (mask === "tel") {
        val = e.target.value.replaceAll("-", "")
      }
      if (mask === "price") {
        val = e.target.value.replaceAll(",", "")
      }
      if (maxLength && val.length > maxLength) {
        val = val.slice(0, maxLength)
      }
      setCount(val.length)
      onChange(e)
      field.onChange(val)
    },
    onBlur: (e) => {
      onBlur(e)
      field.onBlur()
    },
    onFocus: (e) => {
      onFocus(e)
    },
  }

  return (
    <div className={`block ${className}`}>
      {label && (
        <span>
          <label
            className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${
              error ? "tooltip-open text-error" : ""
            }`}
            htmlFor={name}
          >
            {label}
            {required && (
              <span className="text-error inline-block ml-1">*</span>
            )}
          </label>
        </span>
      )}
      <span className="block relative">
        <span>
          {prefix && <>{prefix}</>}
          <input
            id={name}
            className={`${
              type === "color"
                ? "w-1/3"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            }`}
            type={type}
            {...FieldListener}
            autoComplete="off"
            maxLength={maxLength || 524288}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
          />
          {suffix && <>{suffix}</>}
        </span>
        {maxLength && (
          <span className="absolute top-1/2 h-4 right-2 -mt-2 label-text-alt">
            ({count}/{maxLength})
          </span>
        )}
      </span>
      {error && (
        <span className="text-xs mt-2 ml-1 text-primary">{error.message}</span>
      )}

      {description && (
        <span className="pl-1 label-text-alt">{description}</span>
      )}
    </div>
  )
}
Input.propTypes = {
  control: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  mask: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}
export default Input
