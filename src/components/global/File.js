import {useController} from 'react-hook-form'
import PropTypes from 'prop-types'
import {useState, useRef, useCallback, useEffect} from 'react'
import Image from 'next/image'

const File = ({
                  control = null,
                  type = '',
                  name = '',
                  multiple = true,
                  maxSize = 10,
                  maxLength = 5,
                  label = '',
                  required = false,
                  className = '',
                  disabled = false,
                  description = '' ?? {},
                  accept = '',
                  size = 'sm',
                  onChange = () => {
                  },
                  onBlur = () => {
                  },
                  onFocus = () => {
                  },
                  ...props
              }) => {
    const [focus, setFocus] = useState(false)
    const maxFileSize = 1024 * 1024 * maxSize
    //const { modalOpen } = useModal()
    //const { toast } = useToast()

    const [selectedIdx, setSelectedIdx] = useState(null)
    const [previewUrls, setPreviewUrls] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef(null)
    const {
        field: {ref, value, ...field},
        fieldState: {error}
    } = useController({
        control,
        name
    })

    const handleDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
        if (e.dataTransfer.files) {
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        handleFileChange(e)
        setIsDragging(false)
    }

    const initDragEvents = useCallback(() => {
        if (dragRef.current !== null) {
            dragRef.current.addEventListener('dragenter', handleDragIn)
            dragRef.current.addEventListener('dragleave', handleDragOut)
            dragRef.current.addEventListener('dragover', handleDragOver)
            dragRef.current.addEventListener('drop', handleDrop)
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop])

    const resetDragEvents = useCallback(() => {
        if (dragRef.current !== null) {
            dragRef.current.removeEventListener('dragenter', handleDragIn)
            dragRef.current.removeEventListener('dragleave', handleDragOut)
            dragRef.current.removeEventListener('dragover', handleDragOver)
            dragRef.current.removeEventListener('drop', handleDrop)
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop])

    useEffect(() => {
        initDragEvents()
        return () => resetDragEvents()
    }, [initDragEvents, resetDragEvents])

    const handleFileChange = async (e) => {
        const selectedFiles =
            e.type === 'drop' ? e.dataTransfer.files : e.target.files

        let newFiles = Array.from(selectedFiles).filter((newFile) => {
            const result = value
                .map((exFile) => `${exFile.size}${exFile.name}${exFile.lastModified}`)
                .includes(`${newFile.size}${newFile.name}${newFile.lastModified}`)
            if (result) {
                //toast('error', `"${newFile.name}" 파일이 중복되어 제외되었습니다.`)
            }
            return !result
        })
        newFiles = newFiles.filter((file) => {
            const result = file.size > maxFileSize
            if (result) {
                // toast(
                //   'error',
                //   `"${file.name}" 파일의 용량이 ${maxSize}메가를 초과하여 제외되었습니다.`
                // )
            }
            return !result
        })
        newFiles = newFiles.filter((file, index) => {
            const result = index + 1 > maxLength - value.length // 3  2
            if (result) {
                // toast(
                //   'error',
                //   `"${file.name}" 파일이 최대 파일 개수(${maxLength})를 초과하여 제외되었습니다.`
                // )
            }
            return !result
        })

        field.onChange([...value, ...newFiles])
        e.target.value = ''
    }

    const handleRemoveFile = (file2) => {
        const newFiles = [...value]
        const idx = newFiles.findIndex((file1) => {
            return (
                `${file1.size}${file1.name}${file1.lastModified}` ===
                `${file2.size}${file2.name}${file2.lastModified}`
            )
        })
        newFiles.splice(idx, 1)
        field.onChange(newFiles)
    }

    const handlePreviewFile = (idx) => {
        console.log(idx)
        setSelectedIdx(idx)
        //modalOpen('FilePreview')
    }

    useEffect(() => {
        ;(async () => {
            const newPreviewUrls = await Promise.all(value.map(readFile))
            setPreviewUrls([...newPreviewUrls])
        })()
    }, [value])

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = () => {
                resolve({
                    url: fileReader.result,
                    size: file.size,
                    name: file.name,
                    lastModified: file.lastModified
                })
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
            fileReader.readAsDataURL(file)
        })
    }

    return (
        <span className={`form-file w-full ${className} not-prose`}>
      {/* label */}
            {label && (
                <label
                    className={`label text-${size} tooltip-right tooltip-error tooltip ${
                        error ? 'tooltip-open text-error' : ''
                    }`}
                    data-tip={error?.message}
                    htmlFor={name}
                >
                    {label}
                    {required && <span className="text-error inline-block ml-1">*</span>}
                </label>
            )}
            <span className={`relative w-full flex flex-wrap gap-3 max-md:gap-2`}>
        {/* preview list */}
                {type === 'preview' && (
                    <ul className="file-preview-list">
                        {value.length !== 0 && (
                            <>
                                {previewUrls.map((previewUrl, idx) => {
                                    return (
                                        <li
                                            className=""
                                            key={`${previewUrl.size}${previewUrl.name}${previewUrl.lastModified}`}
                                        >
                      <span
                          className="file-image"
                          onClick={() => handlePreviewFile(idx)}
                      >
                        <Image
                            src={previewUrl.url}
                            alt={previewUrl.name}
                            width={100}
                            height={100}
                        />
                      </span>

                                            <button
                                                type="button"
                                                className="btn-delete h-5 w-5 btn btn-xs btn-circle min-h-0"
                                                onClick={() => handleRemoveFile(previewUrl)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </li>
                                    )
                                })}
                            </>
                        )}
                        {/* preview type */}
                        <li>
                            {maxLength > value.length && (
                                <label
                                    htmlFor={name}
                                    ref={dragRef}
                                    className={`preview-btn btn flex-col justify-content-center no-animation gap-2 p-0 hover:text-neutral hover:border-neutral hover:bg-base-100 ${
                                        isDragging
                                            ? 'bg-base-100 border-success text-success'
                                            : disabled || maxLength <= value.length
                                                ? 'btn-disabled'
                                                : 'bg-white border-base-300 text-base-content'
                                    } ${focus ? 'file-focus' : ''}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-6 w-6 max-sm:h-5 max-sm:w-5"
                                    >
                                        <path
                                            d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z"/>
                                        <path
                                            d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/>
                                    </svg>
                                    <span className="text-xs max-sm:hidden">파일 업로드</span>
                                </label>
                            )}
                        </li>
                    </ul>
                )}

                {/* drag & drop type */}
                {type === 'drop' && (
                    <label
                        htmlFor={name}
                        ref={dragRef}
                        className={`btn preview no-animation min-h-[6rem] w-full gap-2 p-4 h-auto hover:text-neutral hover:border-neutral hover:bg-base-100  ${
                            isDragging
                                ? 'bg-base-100 border-success text-success'
                                : disabled || maxLength <= value.length
                                    ? 'btn-disabled'
                                    : 'bg-white border-base-300 text-base-content'
                        } ${focus ? 'file-focus' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                        </svg>
                        파일을 마우스로 끌어 오세요.
                    </label>
                )}

                {/*  normal type */}
                {type === '' && (
                    <label
                        htmlFor={name}
                        ref={dragRef}
                        className={`btn btn-outline btn-${size} text-xs gap-2 bg-white hover:text-neutral hover:border-neutral hover:bg-base-100 ${
                            disabled || maxLength <= value.length ? 'btn-disabled' : ''
                        } ${focus ? 'file-focus' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z"/>
                            <path
                                d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/>
                        </svg>
                        파일 업로드
                    </label>
                )}

                {/* input file */}
                <input
                    id={name}
                    className={`input absolute opacity-0 h-1 w-1 pointer-events-none`}
                    type="file"
                    name={name}
                    ref={ref}
                    disabled={disabled || maxLength <= value.length}
                    multiple={multiple}
                    accept={type === 'preview' ? 'image/*' : accept}
                    onChange={async (e) => {
                        onChange(e)
                        await handleFileChange(e)
                    }}
                    onFocus={(e) => {
                        onFocus(e)
                        setFocus(true)
                    }}
                    onBlur={(e) => {
                        onBlur(e)
                        field.onBlur()
                        setFocus(false)
                    }}
                />
      </span>

            {/* file-name list */}
            {value.length !== 0 && type !== 'preview' ? (
                <ul className="file-list w-full">
                    {value.map((file, idx) => {
                        return (
                            <li key={`${file.size}${file.name}${file.lastModified}`}>
                <span className="file-name">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                    />
                  </svg>
                  <span>{file.name}</span>
                </span>

                                <button
                                    type="button"
                                    className="btn btn-xs btn-outline pl-1 pr-1"
                                    onClick={() => handleRemoveFile(file)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <></>
            )}

            {description && (
                <span className="pl-1 label-text-alt">{description}</span>
            )}

            <style lang="scss" jsx>{`
              input::file-selector-button {
                height: 100%;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                line-height: 0;
                box-sizing: content-box;
                padding: 0 1rem;
                border: none;
              }

              .file-list {
                margin-top: 10px;
              }

              .file-list li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 2rem;
                gap: 0.5rem;
                padding-left: 0.75rem;
                padding-right: 0.25rem;
                min-height: 2rem;
                font-size: 0.875rem;
                border-radius: var(--rounded-btn, 0.5rem);
                transition-property: background-color;
                transition-duration: 200ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              }

              .file-list li + li {
                margin-top: 0;
              }

              .file-list li:hover {
                background-color: hsl(var(--b2, var(--b1)));
              }

              .file-list li .file-name {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                flex: 1 1 auto;
                width: 0;
              }

              .file-list li .file-name > svg {
                flex: 0 0 auto;
              }

              .file-list li .file-name > span {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .file-preview-list {
                --file-preview-list-gap: 0.5rem;
                display: flex;
                gap: var(--file-preview-list-gap);
                flex-wrap: wrap;
                width: 100%;
                min-width: 300px;
                max-width: 500px;
              }

              .file-preview-list li {
                --file-preview-list-gap: 0.5rem;
                --file-preview-list-width: calc((100% - var(--file-preview-list-gap) * 4) * 0.2);
                position: relative;
                height: 0;
                padding-top: var(--file-preview-list-width);
                width: var(--file-preview-list-width);
                flex: 0 1 var(--file-preview-list-width);
              }

              .preview-btn {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                font-size: 0.5rem;
              }

              .file-preview-list li .file-image {
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
                border-radius: var(--rounded-btn);
              }

              .file-preview-list li .btn-delete {
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(40%, -40%);
              }

              .file-preview-list li .file-image :global(img) {
                height: 100%;
                width: 100%;
                object-fit: cover;
              }

              .file-focus {
                outline: 2px solid hsla(var(--bc) / 0.2);
                outline-offset: 2px;
              }
            `}</style>

            {/*<FilePreview previewUrls={previewUrls} selectedIdx={selectedIdx} />*/}
    </span>
    )
}
File.propTypes = {
    control: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    accept: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    required: PropTypes.bool
}
export default File
