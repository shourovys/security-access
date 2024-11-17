import { AxiosError } from 'axios'
import { useEffect } from 'react'
import useSWR from 'swr'
import { logApi } from '../../api/urls'
import useAuth from '../../hooks/useAuth'
import {
  IServerCommandErrorResponse,
  IServerErrorResponse,
  ISingleServerResponse,
} from '../../types/pages/common'
import { IOemResult } from '../../types/pages/login'
import isOemNoPresent from '../../utils/isOemNoPresent'
import { warningToast } from '../../utils/toast'

interface IProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: IProps) => {
  const { refresh: refreshAuthData } = useAuth()

  // Fetch the system oems from the server
  const { isLoading: isOemLoading, data } = useSWR<ISingleServerResponse<IOemResult>>(logApi.oems, {
    onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
      refreshAuthData()
      if (error.code === 'ERR_NETWORK') {
        return warningToast(`Server is not responding. Please restart your device`)
      }
      if (error.status !== 403 && error.status !== 404) {
        return warningToast(error.message)
      }
      // if (error.response && 'data' in error.response.data) {
      //   if (error.response.data.data) {
      //     warningToast(error.response.data.data)
      //   } else {
      //     warningToast(error.response.data.message)
      //   }
      // }
    },
  })

  const oemNo = data?.data.OemNo

  useEffect(() => {
    if (oemNo) {
      document.documentElement.setAttribute('data-oem-id', oemNo.toString())
    }
  }, [oemNo])

  // Use custom hook to fetch oemData
  // const oemData = useOemData({ oemNo })

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-primary bg-no-repeat bg-cover md:justify-end "
      // style={{
      //   ...(!isOemLoading &&
      //     isOemNoPresent(oemNo) && {
      //       backgroundImage: `url('/oem/${oemNo}/images/LoginBg.png')`,
      //     }),
      // }}
    >
      <div className="flex justify-center w-full m-4 sm:m-10 ">
        <div className="w-full max-w-xs sm:max-w-[24rem] lg:max-w-sm min-w-max bg-white rounded-md px-8 py-6 sm:py-10 sm:px-12 md:px-16 shadow-lg">
          <div className="max-w-xs mx-auto sm:w-full">
            {!isOemLoading && isOemNoPresent(oemNo) && (
              <img
                className="max-w-[175px] max-h-20 mx-auto object-contain"
                src={`/oem/${oemNo}/images/mainLogo.png`}
                alt="Workflow"
              />
            )}
            <div className="mt-2 sm:mt-4 space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
