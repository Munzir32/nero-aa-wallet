import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { WalletStatus } from '../ui/WalletStatus';
// import { useWallet } from '../../contexts/WalletContext';
import { useSignature } from '@/hooks';
import { Wallet } from '@/types/Pos';
import { cn } from '../../utils/cn';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
      isActive 
        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    )}
  >
    {label}
  </Link>
);

export const Header: React.FC = () => {
  const location = useLocation();
  // const { wallet, connectWallet, disconnectWallet } = useWallet();
  const { AAaddress } = useSignature()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/pos', label: 'Terminal' },
    { to: '/products', label: 'Products' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                Web3POS
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isActive={location.pathname === item.to}
                />
              ))}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <WalletStatus wallet={AAaddress as unknown as Wallet} />
            
            {AAaddress ? (
              <Button 
                variant="ghost" 
                size="sm" 
                // onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                // onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  location.pathname === item.to
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4">
            <WalletStatus wallet={AAaddress as unknown as Wallet} />
              
              {AAaddress ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  // onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm" 
                  // onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};