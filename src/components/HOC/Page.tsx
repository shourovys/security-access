import { PropsWithChildren, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { logApi } from '../../api/urls'
import useAuth from '../../hooks/useAuth'
import useOemData from '../../hooks/useOemData'
import { ISingleServerResponse } from '../../types/pages/common'
import { IOemResult } from '../../types/pages/login'
import generateTitle from '../../utils/routerTitle'
import t from '../../utils/translator'

interface IPageProps {
  title?: string
  meta?: JSX.Element
}

function Page({ children, title = '', meta }: PropsWithChildren<IPageProps>) {
  const location = useLocation()
  const { license } = useAuth()
  const generatedTitle = generateTitle(location.pathname + location.search)

  // Fetch the system oems from the server
  const { data } = useSWR<ISingleServerResponse<IOemResult>>(license?.OemNo ? null : logApi.oems)
  const oemNo = data?.data.OemNo || license?.OemNo

  // Use custom hook to fetch oemData
  const oemData = useOemData({ oemNo })

  // Update the value of the CSS variable dynamically
  useEffect(() => {
    if (oemData?.color) {
      document.documentElement.style.setProperty('--theme-primary-text-color', oemData.color)
    }
  }, [oemData?.color])

  return (
    <>
      <Helmet>
        <title>{`${title ? title : t(generatedTitle)} | ${oemData ? t(oemData.name) : ''}`}</title>
        <link rel="icon" href={oemNo ? `/oem/${oemNo}/favicon.ico` : ''} />
        <meta name="description" content={oemData?.description ? oemData.description : ''} />

        {meta}
      </Helmet>

      <main>{children}</main>
    </>
  )
}

export default Page
