import { faGear, faList } from '@fortawesome/free-solid-svg-icons'
import FormCardWithHeader from '../../components/HOC/FormCardWithHeader'
import Page from '../../components/HOC/Page'
import FormContainer from '../../components/HOC/style/form/FormContainer'
import Input from '../../components/atomic/Input'
import { TSelectValue } from '../../components/atomic/Selector'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { useState } from 'react'
import { IActionsButton } from '../../types/components/actionButtons'
import t from '../../utils/translator'

interface ITableData {
  node: string
  description: string
  mac: string
  powerFaultType: string
  tamperType: string
}

function CreateNodeScan() {
  const [tableData, setTableData] = useState<ITableData>({
    node: 'Node 1',
    description: '',
    mac: '02:01:DB:4C:EE:EF',
    powerFaultType: 'NO',
    tamperType: 'NC',
  })

  const breadcrumbsActionsButtons: IActionsButton[] = [
    {
      color: 'danger',
      icon: faList,
      text: t`List`,
      link: '/node-scan',
    },
  ]

  const handleInputChange = (
    name: string,
    value: string | TSelectValue | null | boolean | File
  ): void => {
    setTableData((state) => ({ ...state, [name]: value }))
  }

  // const [image, setImage] = useState<File | string | null | undefined>();
  return (
    <Page>
      <Breadcrumbs breadcrumbsActionsButtons={breadcrumbsActionsButtons} />
      <div className="pt-2" />
      <FormContainer twoPart={false}>
        <FormCardWithHeader icon={faGear} header={t`Defined Field`}>
          <Input
            name="node"
            // placeholder={t`Node Name`}
            value={tableData.node}
            onChange={handleInputChange}
          />
          <Input
            name="description"
            // placeholder={t`Description`}
            value={tableData.description}
            onChange={handleInputChange}
          />
          <Input
            name="mac"
            // placeholder={t`MAC Address`}
            value={tableData.mac}
            onChange={handleInputChange}
          />
          <Input
            name="powerFaultType"
            // placeholder={t`Power Fault Type`}
            value={tableData.powerFaultType}
            onChange={handleInputChange}
          />
          <Input
            name="tamperType"
            // placeholder={t`Tamper Type`}
            value={tableData.tamperType}
            onChange={handleInputChange}
          />
        </FormCardWithHeader>
      </FormContainer>
      {/* <FormActionButtonsContainer>
        <Button size="large">
          <FontAwesomeIcon icon={faCircleCheck} />
          <span>{t`Apply`}</span>
        </Button>
        <Button size="large" color="cancel">
          <FontAwesomeIcon icon={faXmark} />
          <span>{t`Cancel`}</span>
        </Button>
      </FormActionButtonsContainer> */}
    </Page>
  )
}

export default CreateNodeScan
