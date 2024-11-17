import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { SWRConfig } from 'swr'
import ErrorBoundary from './ErrorBoundary'

import { swrConfig } from './api/swrConfig'
import AlertDialog from './components/common/AlertDialog'
import { RenderRoutes } from './components/common/RenderRoutes'
import MainLayout from './components/layout/MainLayout'
import LicenseEulaModal from './components/pages/license/LicenseEulaModal'
import AlertDialogProvider from './context/AlertDialogContext/AlertDialogProvider'
import AuthProvider from './context/AuthContext/AuthContextProvider'
import AuthGuard from './guards/AuthGuard'
import { ReactRoutes } from './routes/routeProperty'

import '@fortawesome/fontawesome-svg-core/styles.css'
import './styles/globals.scss'

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SWRConfig value={swrConfig}>
          <Toaster position="bottom-center" />
          <AuthProvider>
            <AuthGuard>
              <AlertDialogProvider>
                <MainLayout>
                  <AlertDialog />
                  <LicenseEulaModal />
                  <RenderRoutes routes={ReactRoutes} />
                </MainLayout>
              </AlertDialogProvider>
            </AuthGuard>
          </AuthProvider>
        </SWRConfig>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
