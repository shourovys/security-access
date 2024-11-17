import { partitionApi } from '../../../../api/urls'
import FormCardWithHeader from '../../../../components/HOC/FormCardWithHeader'
import IconButton from '../../../../components/atomic/IconButton'
import Input from '../../../../components/atomic/Input'
import Selector from '../../../../components/atomic/Selector'
import { useNavigate, useParams } from 'react-router-dom'
import routeProperty from '../../../../routes/routeProperty'
import useSWR from 'swr'
import { THandleInputChange } from '../../../../types/components/common'
import { IListServerResponse, INewFormErrors } from '../../../../types/pages/common'
import { IFloorInfoFormData } from '../../../../types/pages/floor'
import { IPartitionResult } from '../../../../types/pages/partition'
import { SERVER_QUERY } from '../../../../utils/config'
import { doorIcon, editIcon } from '../../../../utils/icons'
import t from '../../../../utils/translator'
import useAuth from '../../../../hooks/useAuth'

interface IProps {
  formData?: IFloorInfoFormData
  handleInputChange?: THandleInputChange
  formErrors?: INewFormErrors<IFloorInfoFormData>
  disabled?: boolean
  isLoading?: boolean
}

function FloorInfoForm({ formData, handleInputChange, formErrors, disabled, isLoading }: IProps) {
  const { has_license } = useAuth()
  const navigate = useNavigate()
  // Get the floor ID from the router query
  const params = useParams()
  const queryId = params.id as string

  const { isLoading: partitionIsLoading, data: partitionData } = useSWR<
    IListServerResponse<IPartitionResult[]>
  >(
    disabled || typeof handleInputChange === 'undefined'
      ? null
      : partitionApi.list(SERVER_QUERY.selectorDataQuery)
  )

  const handleFloorInfoEdit = (type: string) =>
    navigate(routeProperty.floorInfoEdit.path(`${queryId}?type=${type}`))

  return (
    <FormCardWithHeader icon={doorIcon} header={t`Floor Device`}>
      {/* <Selector
        name="Partition"
        label={t`Partition`}
        value={formData?.Partition}
        options={partitionData?.data.map((result) => ({
          value: result.PartitionNo.toString(),
          label: result.PartitionName,
        }))}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.Partition}
        isLoading={isLoading || partitionIsLoading}
      />
      <Input
        name="FloorName"
        label={t`Floor Name`}
        value={formData?.FloorName}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FloorName}
        isLoading={isLoading}
      />
      <Input
        name="FloorDesc"
        label={t`Description`}
        value={formData?.FloorDesc}
        onChange={handleInputChange}
        disabled={disabled || typeof handleInputChange === 'undefined'}
        error={formErrors?.FloorDesc}
        isLoading={isLoading}
      /> */}
      <div className="flex items-end gap-2">
        <Input
          name="Node"
          label={t`Node`}
          value={formData?.Node.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Node}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Node')}
        />
      </div>
      <div className="flex items-end gap-2">
        <Input
          name="Door"
          label={t`Door`}
          value={formData?.Door.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Door}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Door')}
        />
      </div>
      {/* <div className="flex items-end gap-2">
        <Input
          name="Region"
          label={t`Region`}
          value={formData?.Region.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Region}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Region')}
        />
      </div> */}
      <div className="flex items-end gap-2">
        <Input
          name="Input"
          label={t`Input`}
          value={formData?.Input.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Input}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Input')}
        />
      </div>
      <div className="flex items-end gap-2">
        <Input
          name="Output"
          label={t`Output`}
          value={formData?.Output.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Output}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Output')}
        />
      </div>
      <div className="flex items-end gap-2">
        <Input
          name="Elevator"
          label={t`Elevator`}
          value={formData?.Elevator.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Elevator}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Elevator')}
        />
      </div>
      <div className="flex items-end gap-2">
        <Input
          name="Relay"
          label={t`Relay`}
          value={formData?.Relay.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Relay}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Relay')}
        />
      </div>
      {has_license('Camera') && (
        <div className="flex items-end gap-2">
          <Input
            name="Camera"
            label={t`Camera`}
            value={formData?.Camera.map((item) => item.Name).join(', ')}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Camera}
            isLoading={isLoading}
          />
          <IconButton
            icon={editIcon}
            tooltip="Edit"
            iconClass="mb-.5"
            onClick={() => handleFloorInfoEdit('Camera')}
          />
        </div>
      )}
      {has_license('Channel') && (
        <>
          {/* <div className="flex items-end gap-2">
            <Input
              name="Nvr"
              label={t`NVR`}
              value={formData?.Nvr.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Nvr}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Nvr')}
            />
          </div> */}
          <div className="flex items-end gap-2">
            <Input
              name="Channel"
              label={t`Channel`}
              value={formData?.Channel.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Channel}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Channel')}
            />
          </div>
        </>
      )}
      {has_license('Lockset') && (
        <>
          {/* <div className="flex items-end gap-2">
            <Input
              name="Gateway"
              label={t`Gateway`}
              value={formData?.Gateway.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Gateway}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Gateway')}
            />
          </div> */}
          <div className="flex items-end gap-2">
            <Input
              name="Lockset"
              label={t`Lockset`}
              value={formData?.Lockset.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Lockset}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Lockset')}
            />
          </div>
        </>
      )}

      {has_license('Facegate') && (
        <div className="flex items-end gap-2">
          <Input
            name="Facegate"
            label={t`Facegate`}
            value={formData?.Facegate.map((item) => item.Name).join(', ')}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Facegate}
            isLoading={isLoading}
          />
          <IconButton
            icon={editIcon}
            tooltip="Edit"
            iconClass="mb-.5"
            onClick={() => handleFloorInfoEdit('Facegate')}
          />
        </div>
      )}

      {/* {has_license('Subnode') && (
        <>
          <div className="flex items-end gap-2">
            <Input
              name="Subnode"
              label={t`Subnode`}
              value={formData?.Subnode.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Subnode}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Subnode')}
            />
          </div>

          <div className="flex items-end gap-2">
            <Input
              name="Reader"
              label={t`Reader`}
              value={formData?.Reader.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.Reader}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('Reader')}
            />
          </div>
        </>
      )} */}
      {has_license('ContLock') && (
        <>
          {/* <div className="flex items-end gap-2">
            <Input
              name="ContGate"
              label={t`ContGate`}
              value={formData?.ContGate.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.ContGate}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('ContGate')}
            />
          </div> */}

          <div className="flex items-end gap-2">
            <Input
              name="ContLock"
              label={t`ContLock`}
              value={formData?.ContLock.map((item) => item.Name).join(', ')}
              onChange={handleInputChange}
              disabled={disabled || typeof handleInputChange === 'undefined'}
              error={formErrors?.ContLock}
              isLoading={isLoading}
            />
            <IconButton
              icon={editIcon}
              tooltip="Edit"
              iconClass="mb-.5"
              onClick={() => handleFloorInfoEdit('ContLock')}
            />
          </div>
        </>
      )}
      {has_license('Intercom') && (
        <div className="flex items-end gap-2">
          <Input
            name="Intercom"
            label={t`Intercom`}
            value={formData?.Intercom.map((item) => item.Name).join(', ')}
            onChange={handleInputChange}
            disabled={disabled || typeof handleInputChange === 'undefined'}
            error={formErrors?.Intercom}
            isLoading={isLoading}
          />
          <IconButton
            icon={editIcon}
            tooltip="Edit"
            iconClass="mb-.5"
            onClick={() => handleFloorInfoEdit('Intercom')}
          />
        </div>
      )}
      <div className="flex items-end gap-2">
        <Input
          name="Trigger"
          label={t`Trigger`}
          value={formData?.Trigger.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Trigger}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Trigger')}
        />
      </div>
      <div className="flex items-end gap-2">
        <Input
          name="Threat"
          label={t`Threat`}
          value={formData?.Threat.map((item) => item.Name).join(', ')}
          onChange={handleInputChange}
          disabled={disabled || typeof handleInputChange === 'undefined'}
          error={formErrors?.Threat}
          isLoading={isLoading}
        />
        <IconButton
          icon={editIcon}
          tooltip="Edit"
          iconClass="mb-.5"
          onClick={() => handleFloorInfoEdit('Threat')}
        />
      </div>
    </FormCardWithHeader>
  )
}

export default FloorInfoForm
