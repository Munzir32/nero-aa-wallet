import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { NavigationItemProps } from '@/types'

const NavigationItem: React.FC<NavigationItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className = '',
  variant = 'bottom',
  iconRotation = 0,
}) => {
  const { currentTheme } = useTheme();

  const getIconColor = () => {
    if (variant === 'balance') return isActive ? 'text-black' : 'text-white'
    return isActive ? 'text-white' : 'text-white'
  }

  const getIconSize = () => {
    if (variant === 'balance') return 'size-5'
    return 'size-7'
  }

  const getContainerClasses = () => {
    if (variant === 'balance') {
      return 'w-14 h-11 flex flex-col items-center justify-center relative'
    }
    return 'flex flex-col items-center justify-center'
  }

  const getIconStyles = () => {
    return {
      transform: iconRotation ? `rotate(${iconRotation}deg)` : 'none',
    }
  }

  const getIconContainerClasses = () => {
    if (variant === 'balance') {
      return `flex items-center justify-center w-14 h-8 rounded-full`
    }
    return `${isActive ? '' : ''} cursor-pointer`
  }

  const getIconContainerStyle = () => {
    if (variant === 'balance') {
      return {
        backgroundColor: isActive ? '#ffffff' : currentTheme.primaryColor,
      }
    }
    return {}
  }

  const getLabelStyle = () => {
    if (variant === 'balance') {
      return {
        color: currentTheme.primaryColor,
      }
    }
    return {
      color: '#ffffff',
    }
  }

  return (
    <div className={`${getContainerClasses()} ${className}`} onClick={onClick}>
      <div 
        className={getIconContainerClasses()}
        style={getIconContainerStyle()}
      >
        <Icon className={`${getIconSize()} ${getIconColor()}`} style={getIconStyles()} />
      </div>
      {label && (
        <div 
          className={`text-sm mt-0.5`}
          style={getLabelStyle()}
        >
          {label}
        </div>
      )}
    </div>
  )
}

export default NavigationItem
