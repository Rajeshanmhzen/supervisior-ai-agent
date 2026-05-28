import React, { useState } from 'react'

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
  readOnly?: boolean
  disabled?: boolean
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  required = true,
  className,
  onChange,
  rightAdornment,
  readOnly = false,
  disabled = false,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const isFloated = isFocused || hasValue || (value !== undefined && value !== '')

  return (
    <div className="inputBox">
      <input
        type={type}
        value={value}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.value)
          setHasValue(e.target.value !== '')
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value !== '')
        }}
        name={name}
        placeholder=" "
        className={className}
        style={rightAdornment ? { paddingRight: "2.5rem" } : undefined}
      />
      <label htmlFor={name} className={`labelline ${isFloated ? 'is-floated' : ''}`}>
        {label}
      </label>
      {rightAdornment && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightAdornment}
        </div>
      )}
    </div>
  )
}

export default InputField
