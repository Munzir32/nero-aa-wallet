import ReactDOM from 'react-dom/client'
import Sample from './Sample'
import neroConfig from '../nerowallet.config'
import { SocialWallet } from './index'
import '@rainbow-me/rainbowkit/styles.css'
import '@/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { POSPage } from './pages/POSPage'
import { ProductsPage } from './pages/ProductsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { CheckoutPage } from './pages/CheckoutPage'
// import { WalletProvider } from './contexts/WalletContext'
// import AddMerchantModal from '@/components/admin/AddMerchant';
import AddMerchatPage from './pages/AddMerchatPage'
import { PaymentPage } from './pages/PaymentPage'
import { ThemeDemoPage } from './pages/ThemeDemoPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultBusinessType="market">
  <CartProvider>
    <SocialWallet config={neroConfig} mode='sidebar'>
      <Router>
        <Routes>

          <Route path="/" element={<DashboardPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/theme" element={<ThemeDemoPage />} />
          <Route path="/admin/add-merchant" element={<AddMerchatPage />} />
          <Route path="/payment/:total/:id" element={<PaymentPage />} />

          <Route path="/sample" element={<Sample />} />
        </Routes>
      </Router>
    </SocialWallet>
  </CartProvider>
  </ThemeProvider>
)
