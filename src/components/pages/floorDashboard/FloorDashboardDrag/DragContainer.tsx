import React from 'react'

interface IProps {
  imageSrc: string
  children: React.ReactNode
}

const DragContainer: React.FC<IProps> = ({ imageSrc, children }) => {
  return (
    <div className="overflow-x-auto">
      <div
        className="mx-auto floor_dashboard_container"
        style={{
          backgroundImage: 'url(' + imageSrc + ')',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '1000px',
            height: '400px',
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
export default DragContainer
