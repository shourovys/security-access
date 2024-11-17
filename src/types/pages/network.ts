import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'

export interface INetworkResult {
  No: number
  Dhcp: number
  Address: string
  Netmask: string
  Gateway: string
  Dns1: string
  Dns2: string
  SelfSigned: number
  Country: string
  Organization: string
  Address2: string
  Address3: string
  MasterAddr: string
  MasterPort: number
  Cloud: number
  CloudAddr: string
  CloudPort: number
  SiteNo: number
  SiteKey: string
  Wifi: number
  Ssid: string
  SecuKey: string
}

export interface INetworkFormData {
  Dhcp: ISelectOption | null // 0: No (Static), 1: Yes (DHCP)
  Address: string
  Netmask: string
  Gateway: string
  Dns1: string
  Dns2: string
  SelfSigned: ISelectOption | null // 0: No, 1: Yes
  Country: ISelectOption | null // Select from Dropdown List
  Organization: string
  Address2: string
  Address3: string
  MasterAddr: string
  MasterPort: string // Hide if NodeType=1 or Cloud=1, Default 9999
  Cloud: ISelectOption | null // 0: No, 1: Yes
  CloudAddr: string // Hide if Cloud=0, Default Jupiter.sicunet.com
  CloudPort: string // Hide if Cloud=0, Default 9500
  SiteNo: string // Hide if Cloud=0
  SiteKey: string // Hide if Cloud=0
  Wifi: ISelectOption | null // 0: No, 1: Yes
  Ssid: string // Hide if Wi-Fi=0
  SecuKey: string // Hide if Wi-Fi=0
}

export const networkCountryOptions = [
  {
    label: t`KR`,
    value: 'KR',
  },
  {
    label: t`US`,
    value: 'US',
  },
  {
    label: t`CN`,
    value: 'CN',
  },
]

export interface INetworkCaCertificateFormData {
  Certificate: string
  CertificateKey: string
}
