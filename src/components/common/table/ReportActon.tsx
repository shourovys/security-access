import { IActionsButton } from '../../../types/components/actionButtons'
import ActionButtons from './../ActionButtons'

interface IProps {
  breadcrumbsActions?: IActionsButton[]
}
function ReportAction({ breadcrumbsActions }: IProps) {
  return (
    <div className="flex justify-end pr-0.5 pb-2 lg:pb-0  w-full ">
      <div className=" lg:-mt-10 ">
        {breadcrumbsActions ? (
          <ActionButtons actionButtons={breadcrumbsActions} allowsShow />
        ) : null}
      </div>
    </div>
  )
}

export default ReportAction
