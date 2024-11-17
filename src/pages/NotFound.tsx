import Page from '../components/HOC/Page'
import HelperPages from '../components/pages/helperPages'
import t from '../utils/translator'

function NotFoundPage() {
  return (
    <Page title={t`Not Found`}>
      <HelperPages />
    </Page>
  )
}

export default NotFoundPage
