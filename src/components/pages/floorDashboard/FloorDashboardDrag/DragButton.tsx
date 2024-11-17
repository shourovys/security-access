import React from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { THandleFilterInputChange } from '../../../../types/components/common'
import { IDragButton } from '../../../../types/pages/floorDashboard'
import DashboardButton from '../../../atomic/DashboardButton'

interface ButtonProps {
  button: IDragButton
  onPositionChange: (No_Type: string, newPosition: { x: number; y: number }) => void
  isEditMode: boolean
  selectedFloorItemNo: string
  handleInputChange: THandleFilterInputChange
}

const DragButton: React.FC<ButtonProps> = ({
  button,
  onPositionChange,
  isEditMode,
  selectedFloorItemNo,
  handleInputChange,
}) => {
  const handleDrag = (event: DraggableEvent, { x, y }: DraggableData) => {
    onPositionChange(button.No_Type, { x, y })
  }

  return (
    <Draggable
      bounds="parent"
      onDrag={isEditMode ? handleDrag : undefined}
      onStart={!isEditMode ? () => false : undefined}
      position={{
        x: button.Position.x,
        y: button.Position.y,
      }}
    >
      <DashboardButton
        title={button.Name}
        isEditMode={isEditMode}
        isSelected={selectedFloorItemNo === button.No_Type.toString()}
        onClick={() => {
          handleInputChange('DeviceType', { label: button.Type, value: button.Type })
          handleInputChange('Device', { label: button.Name, value: button.No_Type.toString() })
        }}
      >
        <img className="w-auto h-8 mx-auto" src={`/images/dashboardIcon/${button.Icon}`} alt="" />
        <span className="">{button.Name.slice(0, 7)}</span>
      </DashboardButton>
    </Draggable>
  )
}

export default DragButton
