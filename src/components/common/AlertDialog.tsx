import classNames from 'classnames'
import Modal from '../../components/HOC/modal/Modal'
import useAlert from '../../hooks/useAlert'

export default function AlertDialog() {
  const { open, message, closeAlertDialog, onAgree, onDisagree } = useAlert()

  // const displayMessage = t(message);
  const displayMessage = message

  return (
    <Modal openModal={open} setOpenModal={closeAlertDialog}>
      <div className="flex items-end justify-center w-full min-h-full p-4 text-center sm:items-center sm:p-0 sm:max-w-md">
        <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-center">
              <div
                className={classNames(
                  'flex items-center justify-center shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-100'
                )}
              >
                <svg
                  className={classNames('w-6 h-6', 'text-yellow-600')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                  {displayMessage}
                </h3>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={onAgree}
              type="button"
              className="inline-flex justify-center w-full px-5 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Yes
            </button>
            <button
              onClick={onDisagree}
              type="button"
              className="inline-flex justify-center w-full px-5 py-1.5 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
