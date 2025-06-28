import React from 'react'
import { ThemedInput } from '@/components/ui'
import { BaseInputComponentProps } from '@/types'

const BaseInput: React.FC<BaseInputComponentProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  variant = 'send',
  rightElement,
  leftElement,
  className = '',
  inputClassName = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helpText,
  helpTextClassName = '',
  type = 'text',
  inputRef,
  onClick,
  readOnly,
  ...rest
}) => {
  const baseContainerClass = variant === 'send' ? 'w-full mb-3' : 'flex-1'

  return (
    <ThemedInput
      label={label}
          value={value}
      onChange={onChange}
          placeholder={placeholder}
      type={type}
          disabled={disabled}
      error={error}
      helpText={helpText}
      fullWidth={variant === 'send'}
      className={`${baseContainerClass} ${containerClassName} ${className}`}
      inputClassName={inputClassName}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
      helpTextClassName={helpTextClassName}
          onClick={onClick}
          readOnly={readOnly}
      rightElement={rightElement}
      leftElement={leftElement}
          {...rest}
        />
  )
}

export default BaseInput
