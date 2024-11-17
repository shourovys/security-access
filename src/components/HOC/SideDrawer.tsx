import { Dialog, Transition } from '@headlessui/react'
import ClassNames from 'classnames'
import { Fragment, useState } from 'react'
import t from '../../utils/translator'

interface IProps {
  children: JSX.Element | JSX.Element[] | string
  drawer: ({ close }: { close: () => void }) => JSX.Element
  className?: string
  drawerClass?: string
}

function SideDrawer({ children, drawer: DrawerComponent, className, drawerClass }: IProps) {
  const [open, setOpen] = useState(false)

  const handleDrawerClose = () => setOpen(false)

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={() => setOpen(true)}
        className="relative flex items-center justify-between text-gray-primary"
        title={t`Open Drawer Button`}
      >
        {children}
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setOpen(false)}
              />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 z-50 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full" // Slide in from the right side
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full" // Slide out to the right side
              >
                <nav
                  className={ClassNames(
                    'fixed top-0 bottom-0 right-0 flex flex-col w-5/6 max-w-sm px-6 py-6 overflow-y-auto border-r',
                    drawerClass ? drawerClass : 'bg-white'
                  )}
                >
                  <div className="flex items-center justify-end">
                    <button onClick={() => setOpen(false)}>
                      <svg
                        className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* menu links */}
                  <div className="min-w-full">
                    <DrawerComponent close={handleDrawerClose} />
                  </div>
                </nav>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default SideDrawer
