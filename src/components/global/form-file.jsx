import { useRef } from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export default function FormFile({
  label,
  max,
  multiple,
  required,
  value,
  modify,
  onChange = () => {},
}) {
  const inputRef = useRef(null)
  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files)
    if (modify || max == "1") {
      onChange(newFiles)
      return
    }
    const allFiles = [...value, ...newFiles.slice(0, max - value.length)]
    onChange(allFiles)
  }
  const handleDelete = (index) => {
    console.log(index)
    console.log(value)
    const idx = value.findIndex((el, i) => {
      return i === index
    })
    value.splice(idx, 1)
    onChange(value)
  }

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-primary ml-1"> *</span>}
      </label>
      <div className="relative cursor-pointer">
        <input
          className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-800 dark:focus:border-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-800 "
          ref={inputRef}
          type="file"
          accept="image/*"
          max={max}
          required={required}
          multiple={multiple}
          onChange={handleChange}
        />
        <span className="absolute ml-2 z-1 w-100 h-8 text-sm left-28 top-5 w-7/12 bg-gray-50 pointer-events-none">
          {value?.length === 1
            ? value[0].fileName || value[0].name
            : value?.length >= 2
            ? `파일 ${value.length}개`
            : "선택된 파일 없음"}
        </span>
      </div>
      {value?.length > 0 && !modify && max !== 1 && (
        <ul className="flex flex-wrap gap-3">
          {value.map((file, index) => (
            <li
              key={`${file.name || file.fileName}_${index}`}
              className="flex items-center mt-2 p-2 px-4 bg-gray-100 text-xs rounded-full"
            >
              {file.name || file.fileName}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="ml-2"
              >
                <FontAwesomeIcon className="text-sm" icon={faTimes} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
FormFile.propTypes = {
  file: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  modify: PropTypes.bool,
}

FormFile.defaultProps = {
  file: () => {},
  required: true,
  max: 1,
  multiple: false,
  disabled: false,
  autoFocus: false,
  onChange: null,
  modify: false,
}
