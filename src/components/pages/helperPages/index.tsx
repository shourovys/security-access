import Button from '../../../components/atomic/Button'
import { useNavigate } from 'react-router-dom'
import t from '../../../utils/translator'

interface IProps {
  statusCode?: string
  title?: string
  message?: string
  buttonText?: string
  buttonLink?: string
}

function HelperPages({
  statusCode = '404',
  title = t("Sorry, we couldn't find this page."),
  message = t("But don't worry, you can find plenty of other things on our dashboard."),
  buttonText = t('Go Back'),
  buttonLink,
}: IProps) {
  const navigate = useNavigate()

  return (
    <section className="flex items-center h-full p-16 bg-coolGray-900 text-coolGray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-coolGray-600">
            <span className="sr-only">{t`Error`}</span>
            {statusCode}
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">{title}</p>
          <p className="mt-4 mb-8 text-coolGray-400">{message}</p>
          {buttonLink ? (
            <Button link={buttonLink}>{buttonText}</Button>
          ) : (
            <Button onClick={() => navigate(-1)}>{buttonText}</Button>
          )}
        </div>
      </div>
    </section>
  )
}

export default HelperPages
