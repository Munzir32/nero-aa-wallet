import React from 'react'
import { ThemedButton } from '@/components/ui'
import { ImportButtonProps } from '@/types'

const ImportButton: React.FC<ImportButtonProps> = ({
  onClick,
  isReady,
  isImporting,
  label = 'Import',
  importingLabel = 'Importing...',
  className = '',
}) => {
  return (
    <ThemedButton
      onClick={onClick}
      disabled={!isReady || isImporting}
      variant='primary'
      className={`w-full font-bold py-2 px-4 rounded mb-4 ${className}`}
    >
      {isImporting ? importingLabel : label}
    </ThemedButton>
  )
}

export default ImportButton
