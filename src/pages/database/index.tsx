import { sendPostRequest } from '../../api/swrConfig'
import { maintenanceActionApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Button from '../../components/atomic/Button'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import routeProperty from '../../routes/routeProperty'
import useSWRMutation from 'swr/mutation'
import { ISingleServerResponse, ISystemSuccessResult } from '../../types/pages/common'
import Icon, { loadDatabaseFromStorage, saveDatabaseToStorage } from '../../utils/icons'
import { addSuccessfulToast } from '../../utils/toast'
import t from '../../utils/translator'

function Database() {
  const { trigger } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: (data: ISingleServerResponse<ISystemSuccessResult>) => {
      addSuccessfulToast(`Success`)
    },
  })

  return (
    <Page title={t`Database`}>
      <Breadcrumbs
        pageRoutes={[
          {
            href: routeProperty.database.path(),
            text: t`Database`,
          },
        ]}
      />
      <div className="pt-2" />
      <div className="flex items-center justify-center gap-4 py-4 md:py-6">
        <Button
          size="large"
          color="danger"
          onClick={() => trigger({ Action: 'dbcopy', Type: 'load_database_from_storage' })}
        >
          <Icon icon={loadDatabaseFromStorage} />
          <span>{t`Load Database from storage`}</span>
        </Button>
        <Button
          size="large"
          color="danger"
          onClick={() => trigger({ Action: 'dbcopy', Type: 'save_database_to_storage' })}
        >
          <Icon icon={saveDatabaseToStorage} />
          <span>{t`Save Database to storage`}</span>
        </Button>
      </div>
    </Page>
  )
}

export default Database
