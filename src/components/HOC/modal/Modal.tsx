import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useRef } from 'react'

interface IProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  children: ReactNode
}

export default function Modal({ openModal, children }: IProps) {
  const cancelButtonRef = useRef(null)

  // const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation()
  //   setOpenModal(false)
  // }

  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-auto"
        initialFocus={cancelButtonRef}
        // onClose={setOpenModal}
        onClose={() => { }}
      >
        <div className="flex items-end justify-center h-screen max-h-screen overflow-hidden text-center sm:block">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75 " />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block w-full h-screen max-h-screen my-auto overflow-y-auto text-left align-bottom transition-all transform md:px-4 md:py-4 sm:align-middle sm:max-w-xl md:max-w-4xl md:no-scrollbar"
            // onClick={closeModal}
            >
              <div className="grid w-full h-full overflow-y-auto">
                <div className="flex items-center justify-center max-h-min">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
