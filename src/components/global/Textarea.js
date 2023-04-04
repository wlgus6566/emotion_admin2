import {useController} from 'react-hook-form'
import PropTypes from 'prop-types'
import {useState} from 'react'

const Textarea = ({
                      control,
                      size = 'sm',
                      name = '',
                      label = '',
                      required = false,
                      placeholder = '',
                      className = '',
                      disabled = false,
                      resize = false,
                      maxLength = false ?? 0,
                      description = '' ?? {},
                      onChange = () => {
                      },
                      onBlur = () => {
                      },
                      rows = 7,
                      ...props
                  }) => {
    const {
        field,
        fieldState: {error, isTouched, isDirty, invalid}
    } = useController({
        control,
        name
    })
    const [count, setCount] = useState(0)
    const FieldListener = {
        ...field,
        onChange: (e) => {
            if (maxLength && e.target.value.length > maxLength) {
                e.target.value = e.target.value.slice(0, maxLength)
            }
            setCount(e.target.value.length)
            onChange(e)
            field.onChange(e.target.value)
        },
        onBlur: (e) => {
            onBlur(e)
            field.onBlur()
        }
    }

    return (
        <span className={`form-textarea ${className}`}>
      {label && (
          <label
              className={`label text-${size} tooltip-right tooltip-error tooltip ${
                  (!isDirty || isTouched) && error ? 'tooltip-open text-error' : ''
              }`}
              data-tip={error?.message}
              htmlFor={name}
          >
              {label}
              {required && <span className="text-error inline-block ml-1">*</span>}
          </label>
      )}
            <span className="block relative">
        <textarea
            id={name}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                resize ? '' : 'resize-none'
            } block textarea-${size} w-full`}
            {...FieldListener}
            autoComplete="off"
            maxLength={maxLength || 524288}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
        />
                {maxLength && (
                    <span className="absolute top-50 bottom-2 right-2 label-text-alt">
            ({count}/{maxLength})
          </span>
                )}
      </span>
            {description && (
                <span className="pl-1 label-text-alt">{description}</span>
            )}
    </span>
    )
}
Textarea.propTypes = {
    control: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maxLength: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number
}
export default Textarea
