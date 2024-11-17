// import jwtDecode from 'jwt-decode'
import { LOCAL_STORAGE_KEY } from './config'
// ----------------------------------------------------------------------

// const isValidToken = (accessToken: string) => {
//   if (!accessToken) {
//     return false
//   }
//   // const decoded = jwtDecode(accessToken)
//   // const currentTime = Date.now() / 1000
//
//   // return decoded.exp > currentTime
// }

const setSession = (accessToken: string) => {
  if (accessToken) {
    sessionStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken)
  } else {
    sessionStorage.removeItem(LOCAL_STORAGE_KEY.accessToken)
  }
}

export { setSession }
