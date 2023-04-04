import React, { useState, useEffect } from "react"

function Checkbox({ label, value, onChange, isChecked }) {
  return (
    <div
      className={`${
        isChecked ? "bg-primary text-white" : "bg-white text-black"
      } flex items-center text-center transition border border-gray-200 rounded-full dark:border-gray-700`}
    >
      <input
        id={value}
        type="checkbox"
        value={value}
        checked={isChecked}
        onChange={onChange}
        className="w-0 h-0"
      />
      <label
        htmlFor={value}
        className="w-full py-3 text-sm font-medium font-bold cursor-pointer"
      >
        {label}
      </label>
    </div>
  )
}

export default function FormCheckboxGroup({
  onChange,
  value = [],
  label,
  checkboxes = [],
}) {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(value)

  function handleCheckboxChange(event) {
    const value = event.target.value
    const selectedIndex = selectedCheckboxes.indexOf(value)
    let newSelectedCheckboxes = [...selectedCheckboxes]

    if (selectedIndex === -1) {
      newSelectedCheckboxes.push(value)
    } else {
      newSelectedCheckboxes.splice(selectedIndex, 1)
    }
    setSelectedCheckboxes(newSelectedCheckboxes)
  }

  useEffect(() => {
    if (onChange) {
      onChange(selectedCheckboxes)
    }
  }, [selectedCheckboxes])

  return (
    <div>
      <label
        htmlFor="countries"
        className="block mb-4 mt-8 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label} <span className="text-primary ml-1">*</span>
      </label>
      <ul className="grid grid-cols-5 gap-4 p-4 bg-red-50 w-full text-sm font-medium text-gray-900 rounded-lg">
        {checkboxes.map((checkbox) => (
          <li key={checkbox.value} className="w-full">
            <Checkbox
              label={checkbox.label}
              value={checkbox.value}
              isChecked={selectedCheckboxes.includes(checkbox.value)}
              onChange={handleCheckboxChange}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
