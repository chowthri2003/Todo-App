import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import store, { persistor } from './store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { ClerkProvider } from '@clerk/clerk-react'
import ClerkTokenProvider from './auth/ClerkTokenProvider'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) throw new Error(" Clerk Key Required")

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
      <ClerkTokenProvider>
        <ThemeProvider>
          <Toaster position="top-center" richColors />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </ThemeProvider> 
    </ClerkTokenProvider>
      </BrowserRouter>
  </ClerkProvider>
</StrictMode>
)
