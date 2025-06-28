import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { ThemedInput } from '@/components/ui'
import { TokenSearchInputProps } from '@/types'

const TokenSearchInput: React.FC<TokenSearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Search Tokens...',
  className = 'relative flex-1 max-w-xs',
  inputClassName = '',
}) => {
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className={className}>
      <ThemedInput
        type='text'
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className='mb-0'
        inputClassName={inputClassName}
        icon={<FiSearch />}
        iconPosition='left'
        rightElement={
          searchQuery ? (
            <FiX
              className='cursor-pointer hover:text-gray-600'
              onClick={clearSearch}
            />
          ) : undefined
        }
      />
    </div>
  )
}

export default TokenSearchInput
