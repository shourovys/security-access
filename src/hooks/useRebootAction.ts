import useSWRMutation from 'swr/mutation'
import { sendPostRequest } from '../api/swrConfig'
import { nodeApi } from '../api/urls'
import t from '../utils/translator'
import useAlert from './useAlert'

const useReloadMasterNodeAction = (mutate: () => void) => {
  const { openAlertDialogWithPromise } = useAlert()

  const { trigger: rebootTrigger } = useSWRMutation(nodeApi.reload, sendPostRequest, {
    onSuccess: () => {
      mutate()
    },
  })

  const handleReload = () => {
    const handleReloadTrigger = () =>
      rebootTrigger({
        NodeNos: ['1'],
      })

    openAlertDialogWithPromise(
      handleReloadTrigger,
      { success: t`Success` },
      t('Do you want to Reload?')
    )
  }

  return { handleReload }
}

export default useReloadMasterNodeAction
