import Button from '../../../components/atomic/Button'
import t from '../../../utils/translator'

interface IProps {
  // filterState: IPlaybackFilters
  // handleInputChange: THandleFilterInputChange
  handleShowSelectTimeModal: () => void
  // handleShowGoToTimeModal: () => void
  // handleReloadData: () => void
}

function PlaybackTableToolbar({
  // filterState,
  // handleInputChange,
  handleShowSelectTimeModal, // handleShowGoToTimeModal, // handleReloadData,
}: IProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button onClick={handleShowSelectTimeModal}>
        <span>{t`Record Select`}</span>
      </Button>
      {/* <Button onClick={handleReloadData} className="flex mt-2">
        <Icon icon={reloadIcon} />
        <span>Reload</span>
      </Button> */}
    </div>
  )
}

export default PlaybackTableToolbar
