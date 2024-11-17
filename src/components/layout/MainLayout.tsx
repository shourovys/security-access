// eslint-disable-next-line import/no-extraneous-dependencies
import useAuth from '../../hooks/useAuth'
import MasterLayout from './MasterLayout'
import WorkerLayout from './WorkerLayout'

interface IMainLayoutProps {
  children: JSX.Element | JSX.Element[]
}

function MainLayout({ children }: IMainLayoutProps): JSX.Element {
  const { isAuthenticated, layout } = useAuth()
  if (isAuthenticated && layout === 'Master') {
    return <MasterLayout>{children}</MasterLayout>
  } else if (isAuthenticated && layout !== 'Master') {
    return <WorkerLayout>{children}</WorkerLayout>
  }
  return <>{children}</>
}

export default MainLayout
