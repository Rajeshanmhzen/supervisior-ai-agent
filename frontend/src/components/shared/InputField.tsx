import React from 'react'

type InputFieldProps = {
  label: string
  name?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
  rightAdornment?: React.ReactNode
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  required = true,
  onChange,
  rightAdornment,
}: InputFieldProps) => {
  return (
    <div className="inputBox">
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        name={name}
        placeholder=" "
        style={rightAdornment ? { paddingRight: "2.5rem" } : undefined}
      />
      <label htmlFor={name} className="labelline">{label}</label>
      {rightAdornment && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightAdornment}
        </div>
      )}
    </div>
  )
}

export default InputField
