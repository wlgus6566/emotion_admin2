import PropTypes from "prop-types"

const FormTextarea = ({
  label,
  disabled,
  value,
  rows,
  onChange = () => {},
  placeholder,
}) => {
  const changeValue = (e) => {
    onChange(e.target.value)
  }

  return (
    <div>
      {label && (
        <label
          htmlFor={`input_${label}`}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <textarea
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        id={`input_${label}`}
        value={value}
        onChange={(e) => changeValue(e)}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  )
}

FormTextarea.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
}

FormTextarea.defaultProps = {
  value: "",
  disabled: false,
  rows: 8,
  onChange: null,
}

export default FormTextarea
