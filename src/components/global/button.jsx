import PropTypes from "prop-types"

export default function Button({
  name,
  size,
  type,
  color,
  onClick = () => {},
}) {
  return (
    <>
      <button
        onClick={onClick}
        type={type}
        className={`${
          size === "lg"
            ? "px-5 py-3 text-lg w-full"
            : size === "md"
            ? "px-5 py-2.5 text-sm"
            : size === "sm"
            ? "px-3.5 py-2 text-sm"
            : ""
        } ${
          color === "blue"
            ? "bg-indigo-600 hover:bg-indigo-800"
            : color === "black"
            ? "bg-gray-700 hover:bg-gray-900"
            : color === "primary"
            ? "bg-primary hover:bg-red-600"
            : ""
        } text-white font-bold rounded-lg text-lg text-center outline-none`}
      >
        {name}
      </button>
    </>
  )
}
Button.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
}
Button.defaultProps = {
  size: "md",
  color: "primary",
  onChange: null,
  required: true,
}
