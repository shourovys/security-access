import { lazy } from 'react'
import Login from '../../pages/login'
import { IRouteProperty } from '../../types/routes'

const forgotPassword = lazy(() => import('../../pages/forgat-password'))
const ResetPassword = lazy(() => import('../../pages/reset-password'))
// const EditProfile = lazy(() => import('../../pages/profile'))

const authRouteProperty: IRouteProperty = {
  // login
  login: {
    path: () => '/login',
    permissions: '*',
    routePath: '/login',
    component: Login,
  },
  // forgat password
  forgotPassword: {
    path: () => '/forgat-password',
    permissions: '*',
    routePath: '/forgat-password',
    component: forgotPassword,
  },
  // reset password
  resetPassword: {
    path: () => '/reset-password',
    permissions: '*',
    routePath: '/reset-password',
    component: ResetPassword,
  },
  // profile: {
  //   path: () => '/profile',
  //   permissions: '*',
  //   routePath: '/profile',
  //   component: EditProfile, // replace Profile with your actual profile component
  // },
}

export default authRouteProperty
