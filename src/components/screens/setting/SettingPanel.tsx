import React from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { LuImport } from 'react-icons/lu'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'
import { ThemedButton } from '@/components/ui'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useSettingUrls } from '@/constants/settingListURLs'
import { useScreenManager } from '@/hooks'
import { SettingItemProps, screens } from '@/types'

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onClick }) => (
  <div className='w-full flex mt-3' onClick={onClick}>
    <div className='w-full h-[80%] bg-bg-tertiary rounded-md flex items-center justify-start border border-border-primary p-5'>
      <div className='flex items-center text-black'>
        {icon}
        <span className='ml-4 text-black'>{label}</span>
      </div>
    </div>
  </div>
)

const SettingPanel: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { CONTACT_US_DISCORD_URL, PRIVACY_POLICY_URL, SERVICE_TERMS_URL } = useSettingUrls()
  
  const handleHomeClick = () => {
    navigateTo(screens.HOME)
  }

  const handleBusinessSettingsClick = () => {
    navigateTo(screens.SETTINGS_PAGE)
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='flex flex-col items-center flex-grow px-3 bg-bg-primary mt-5'>
        <div className='w-full bg-white rounded-md border border-border-primary p-4 mb-4'>
          <label className='block text-center text-1sm text-black'>Settings</label>
          <SettingItem
            icon={<IoSettingsOutline size={24} />}
            label='Business Settings'
            onClick={handleBusinessSettingsClick}
          />
          <SettingItem
            icon={<AiOutlineQuestionCircle size={24} />}
            label='Contact us'
            onClick={() => window.open(CONTACT_US_DISCORD_URL, '_blank')}
          />
          <SettingItem
            icon={<MdOutlinePrivacyTip size={24} />}
            label='Privacy policy'
            onClick={() => window.open(PRIVACY_POLICY_URL, '_blank')}
          />
          <SettingItem
            icon={<LuImport size={24} />}
            label='Service terms'
            onClick={() => window.open(SERVICE_TERMS_URL, '_blank')}
          />
          <div className='w-full pt-5 flex justify-center'>
            <ThemedButton
              onClick={handleHomeClick}
              variant='primary'
              className='px-6 py-2 text-sm'
            >
              close
            </ThemedButton>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default SettingPanel
