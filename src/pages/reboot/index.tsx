import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../../api/swrConfig'
import { maintenanceActionApi } from '../../api/urls'
import Page from '../../components/HOC/Page'
import Button from '../../components/atomic/Button'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import useAlert from '../../hooks/useAlert'
import routeProperty from '../../routes/routeProperty'
import { ISingleServerResponse, ISystemSuccessResult } from '../../types/pages/common'
import Icon, { rebootWithoutSavingDataIcon, saveDataAndRebootIcon } from '../../utils/icons'
import t from '../../utils/translator'

function Reboot() {
  const { openAlertDialogWithPromise } = useAlert()

  const { trigger } = useSWRMutation(maintenanceActionApi.add, sendPostRequest, {
    onSuccess: (data: ISingleServerResponse<ISystemSuccessResult>) => {
      // addSuccessfulToast(`${data.data.message} Action Success`)
    },
  })

  return (
    <Page title={t`Reboot`}>
      <Breadcrumbs
        pageRoutes={[
          {
            href: routeProperty.reboot.path(),
            text: t`Reboot`,
          },
        ]}
      />
      <div className="pt-2" />
      <div className="flex items-center justify-center gap-4 py-4 md:py-6">
        <Button
          size="large"
          color="danger"
          onClick={() => {
            openAlertDialogWithPromise(
              () => trigger({ Action: 'reboot', Type: 'save_data_and_reboot' }),
              { success: t`Success` },
              t('Do you want to Save Data and Reboot?')
            )
          }}
        >
          <Icon icon={saveDataAndRebootIcon} />
          <span>{t`Save Data and Reboot`}</span>
        </Button>

        <Button
          size="large"
          color="danger"
          onClick={() => {
            openAlertDialogWithPromise(
              () => trigger({ Action: 'reboot', Type: 'reboot_without_saving_data' }),
              { success: t`Success` },
              t('Do you want to Reboot without Savaging Data?')
            )
          }}
        >
          <Icon icon={rebootWithoutSavingDataIcon} />
          <span>{t`Reboot without Savaging Data`}</span>
        </Button>
      </div>
    </Page>
  )
}

export default Reboot
