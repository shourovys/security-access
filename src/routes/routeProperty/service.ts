import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  emailIcon,
  faceIcon,
  ftpIcon,
  geminiIcon,
  inviteIcon,
  logAPIIcon,
  restAPIIcon,
  sipIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const EditEmail = lazy(() => import('../../pages/email/edit'))
const EmailInfo = lazy(() => import('../../pages/email/info'))

const EditSip = lazy(() => import('../../pages/sip/edit'))
const SipInfo = lazy(() => import('../../pages/sip/info'))

const EditFace = lazy(() => import('../../pages/face/edit'))
const FaceInfo = lazy(() => import('../../pages/face/info'))

const EditFtp = lazy(() => import('../../pages/ftp/edit'))
const FtpInfo = lazy(() => import('../../pages/ftp/info'))
const EditGemini = lazy(() => import('../../pages/gemini/edit'))
const GeminiInfo = lazy(() => import('../../pages/gemini/info'))
const EditLogApi = lazy(() => import('../../pages/log-api/edit'))
const LogApiInfo = lazy(() => import('../../pages/log-api/info'))
const EditRestApi = lazy(() => import('../../pages/rest-api/edit'))
const RestApiInfo = lazy(() => import('../../pages/rest-api/info'))
const EditInvite = lazy(() => import('../../pages/invite/edit'))
const InviteInfo = lazy(() => import('../../pages/invite/info'))

const serviceRouteProperty: IRouteProperty = {
  // email
  emailEdit: {
    path: () => '/email/edit',
    routePath: '/email/edit',
    component: EditEmail,
    permissions: ['34'],
  },
  emailInfo: {
    id: '34',
    label: t`Email`,
    icon: emailIcon,
    path: () => '/email/info',
    routePath: '/email/info',
    component: EmailInfo,
    permissions: ['34'],
  },

  // ftp
  ftpEdit: {
    path: () => '/ftp/edit',
    routePath: '/ftp/edit',
    component: EditFtp,
    permissions: ['35'],
  },
  ftpInfo: {
    id: '35',
    label: t`FTP`,
    icon: ftpIcon,
    path: () => '/ftp/info',
    routePath: '/ftp/info',
    component: FtpInfo,
    permissions: ['35'],
  },

  // rest API
  restApiEdit: {
    path: () => '/rest-api/edit',
    routePath: '/rest-api/edit',
    component: EditRestApi,
    permissions: ['37'],
  },
  restApiInfo: {
    id: '37',
    label: t`REST API`,
    icon: restAPIIcon,
    path: () => '/rest-api/info',
    routePath: '/rest-api/info',
    component: RestApiInfo,
    permissions: ['37'],
  },

  // log Api
  logApiEdit: {
    path: () => '/log-api/edit',
    routePath: '/log-api/edit',
    component: EditLogApi,
    permissions: ['36'],
  },
  logApiInfo: {
    id: '36',
    label: t`Log API`,
    icon: logAPIIcon,
    path: () => '/log-api/info',
    routePath: '/log-api/info',
    component: LogApiInfo,
    permissions: ['36'],
  },

  // gemini
  geminiEdit: {
    path: () => '/gemini/edit',
    routePath: '/gemini/edit',
    component: EditGemini,
    permissions: ['61'],
  },
  geminiInfo: {
    id: '61',
    label: t`Gemini`,
    icon: geminiIcon,
    path: () => '/gemini/info',
    routePath: '/gemini/info',
    component: GeminiInfo,
    permissions: ['61'],
  },

  // face
  faceEdit: {
    path: () => '/face/edit',
    routePath: '/face/edit',
    component: EditFace,
    permissions: ['67'],
  },
  faceInfo: {
    id: '67',
    label: t`Face`,
    icon: faceIcon,
    path: () => '/face/info',
    routePath: '/face/info',
    component: FaceInfo,
    permissions: ['67'],
  },

  // sip
  sipEdit: {
    path: () => '/sip/edit',
    routePath: '/sip/edit',
    component: EditSip,
    permissions: ['68'],
  },
  sipInfo: {
    id: '68',
    label: t`SIP`,
    icon: sipIcon,
    path: () => '/sip/info',
    routePath: '/sip/info',
    component: SipInfo,
    permissions: ['68'],
  },

  inviteEdit: {
    path: () => '/invite/edit',
    routePath: '/invite/edit',
    component: EditInvite,
    permissions: ['73'],
  },
  inviteInfo: {
    id: '73',
    label: t`Invite`,
    icon: inviteIcon,
    path: () => '/invite/info',
    routePath: '/invite/info',
    component: InviteInfo,
    permissions: ['73'],
  },
}
export default serviceRouteProperty
