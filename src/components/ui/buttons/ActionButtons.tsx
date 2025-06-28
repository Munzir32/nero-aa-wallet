import React from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { ThemedButton } from '@/components/ui'
import { ActionButtonsProps } from '@/types'

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Next',
  isNextDisabled = false,
  nextVariant = 'primary',
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmDisabled = false,
}) => {
  if (onBack && onNext) {
    return (
      <div className='flex justify-between mt-4'>
        <ThemedButton
          onClick={onBack}
          variant='ghost'
          icon={<AiFillCaretLeft />}
          iconPosition='left'
          className='flex items-center text-sm px-2 mt-2'
        >
          Back
        </ThemedButton>
        <ThemedButton
          onClick={onNext}
          disabled={isNextDisabled}
          variant={nextVariant}
          className={`px-6 py-2`}
        >
          {nextLabel}
        </ThemedButton>
      </div>
    )
  }

  if (onCancel && onConfirm) {
    return (
      <div className='flex justify-between mt-4'>
        <ThemedButton onClick={onCancel} variant='outline' className='px-6 py-2'>
          {cancelText}
        </ThemedButton>
        <ThemedButton
          onClick={onConfirm}
          disabled={confirmDisabled}
          variant='primary'
          className='px-6 py-2'
        >
          {confirmText}
        </ThemedButton>
      </div>
    )
  }

  return (
    <div className='flex justify-end mt-4'>
      <ThemedButton
        onClick={onNext}
        disabled={isNextDisabled}
        variant={nextVariant}
        className='px-6 py-2'
      >
        {nextLabel}
      </ThemedButton>
    </div>
  )
}

export default ActionButtons
