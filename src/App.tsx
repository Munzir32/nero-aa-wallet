import { useContext, useEffect } from 'react'
import { CustomConnectButton } from '@/components/features/connect'
import { SendUserOpContext } from '@/contexts'
import { useScreenManager } from '@/hooks'
import ScreenRenderer from '@/routes/ScreenRenderer'
import { useTheme } from '@/contexts/ThemeContext'
import { useSignature } from '@/hooks'
import { useReadContract } from 'wagmi'
import { fetchIPFSData } from '@/utils/IpfsDataFetch'
import POSAbi from "@/contract/abi.json"
import { contractAddress } from '@/contract'

interface AppProps {
  mode?: 'sidebar' | 'button'
}

function AppContent({ mode }: AppProps) {
  const { isWalletPanel } = useContext(SendUserOpContext)!
  const { currentScreen } = useScreenManager()
  const { AAaddress } = useSignature()
  const { setBusinessType } = useTheme()

  // Load business theme from settings
  const { data: BusinessDetails } = useReadContract({
    address: contractAddress,
    abi: POSAbi,
    functionName: "businessProfile",
    args: [AAaddress],
  });

  useEffect(() => {
    const loadBusinessTheme = async () => {
      if (!BusinessDetails || !Array.isArray(BusinessDetails) || !BusinessDetails[1]) {
        return;
      }

      try {
        const data = await fetchIPFSData(BusinessDetails[1]);
        if (data.businessTheme) {
          setBusinessType(data.businessTheme);
        }
      } catch (error) {
        console.error('Error loading business theme:', error);
      }
    };

    loadBusinessTheme();
  }, [BusinessDetails, setBusinessType]);

  return (
    <div>
      {mode === 'sidebar' ? (
        <div
          className={`fixed transition-transform duration-300 ease-in-out transform ${
            isWalletPanel ? 'translate-x-0' : 'translate-x-[350px]'
          }`}
          style={{ right: 0, top: '50px' }}
        >
          <div className='absolute -left-12'>
            <CustomConnectButton mode={mode} />
          </div>

          <div className='bg-bg-primary rounded-md' style={{ width: '350px' }}>
            <div>{isWalletPanel && <ScreenRenderer currentScreen={currentScreen} />}</div>
          </div>
        </div>
      ) : (
        <div>
          <div className='flex justify-end'>
            <CustomConnectButton mode={mode} />
          </div>
          {isWalletPanel && (
            <div
              className='fixed'
              style={{
                right: 0,
                top: '100px',
                width: '350px',
              }}
            >
              <div className='bg-bg-primary rounded-md'>
                <ScreenRenderer currentScreen={currentScreen} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function App({ mode }: AppProps) {
  return <AppContent mode={mode} />
}

export default App
