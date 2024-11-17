import {
  faChessPawn,
  faCircleCheck,
  faCircleDot,
  faClock,
  faCompass,
  faCopy,
  faEdit,
  faEnvelope,
  faFaceSmile,
  faFloppyDisk,
  faFolderClosed,
  faHourglass,
  faIdCard,
  faImages,
  faMap,
  faPaperPlane,
  faRectangleXmark,
  faRegistered,
  faSquare,
  faSquareCheck,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons'
import {
  IconDefinition,
  faAdd,
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowDownLong,
  faArrowRightArrowLeft,
  faArrowRightToBracket,
  faArrowUpFromBracket,
  faArrowUpLong,
  faArrowUpRightFromSquare,
  faArrowsRotate,
  faArrowsSpin,
  faBackward,
  faBan,
  faBarsProgress,
  faBarsStaggered,
  faBell,
  faBookAtlas,
  faBookOpenReader,
  faBrain,
  faBriefcase,
  faBuildingUser,
  faBullseye,
  faBusinessTime,
  faCalendarCheck,
  faCalendarDay,
  faCalendarDays,
  faCalendarMinus,
  faCalendarWeek,
  faCamera,
  faChalkboard,
  faChartArea,
  faChartLine,
  faChartSimple,
  faChessBoard,
  faCircleInfo,
  faCircleNodes,
  faCircleUp,
  faCircleUser,
  faClockRotateLeft,
  faClone,
  faCloud,
  faCloudArrowDown,
  faCloudDownload,
  faCompactDisc,
  faCookie,
  faCookieBite,
  faCropSimple,
  faD,
  faDatabase,

  // faBorderTopLeft,
  // faOutdent,
  faDiagramSuccessor,
  faDiamond,
  faDiceD6,
  faDisease,
  faDna,
  faDoorClosed,
  faDoorOpen,
  faDownLeftAndUpRightToCenter,
  faDungeon,
  faElevator,
  faEllipsisVertical,
  faEraser,
  faExpand,
  faEye,
  faFile,
  faFileImport,
  faFileLines,
  faFilter,
  faFingerprint,
  faFolderOpen,
  faForwardFast,
  faGear,
  faGears,
  faGift,
  faH,
  faHandcuffs,
  faHardDrive,
  faHillRockslide,
  faHome,
  faHouseFloodWater,
  // faHouse,
  // faHouseFloodWater,
  faHouseLaptop,
  faHurricane,
  faIdCardClip,
  faIndent,
  faJar,
  faKey,
  faLaptopCode,
  faLaptopFile,
  faLayerGroup,
  faList,
  faListCheck,
  faLock,
  faLockOpen,
  faMicrochip,
  faMinus,
  faMobile,
  faMobileScreen,
  faO,
  faPen,
  faPenToSquare,
  faPersonArrowDownToLine,
  faPersonArrowUpFromLine,
  faPersonCircleCheck,
  faPowerOff,
  faPrint,
  faRecordVinyl,
  faRecycle,
  faRepeat,
  faRetweet,
  faRobot,
  faRotate,
  faRotateRight,
  faSatelliteDish,
  faSdCard,
  faServer,
  faShopLock,
  faShuttleSpace,
  faSignHanging,
  faSoap,
  faSquarePen,
  faStar,
  faStop,
  faStopwatch,
  faT,
  faTableCellsLarge,
  faTableColumns,
  faTextHeight,
  faToggleOff,
  faTowerBroadcast,
  faTowerCell,
  faTractor,
  faTruckRampBox,
  faTurnDown,
  faTv,
  faUnlockKeyhole,
  faUser,
  faUserGear,
  faUserLock,
  faUserTie,
  faUsers,
  faUsersBetweenLines,
  faVial,
  faVideo,
  faVideoSlash,
  faWarehouse,
  faWarning,
  faWifi,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// pages icons
export const addIcon = faAdd
export const selectIcon = faSquareCheck
export const importIcon = faArrowRightToBracket
export const exportIcon = faFileImport
export const bulkLoadIcon = faTruckRampBox
export const clearIcon = faEraser
export const refreshIcon = faArrowsRotate
export const statusIcon = faSatelliteDish
export const discoverIcon = faBookAtlas
export const groupEditIcon = faEdit
export const sendInvitationEmailIcon = faPaperPlane
export const deleteIcon = faTrashCan
export const csvIcon = faCloudArrowDown
export const warningIcon = faWarning
export const applyIcon = faCircleCheck
export const cancelIcon = faXmark
export const resetIcon = faArrowsRotate
export const passthruIcon = faCompass
export const normalIcon = faCircleCheck
export const probeIcon = faCircleDot
export const setTimerIcon = faClock
export const swSyncIcon = faHourglass
export const listIcon = faList
export const scanIcon = faExpand
export const accessDeviceIcon = faMobile
export const inactiveIcon = faPersonArrowDownToLine
export const activeIcon = faPersonArrowUpFromLine
export const autoIcon = faRobot
export const lockDownIcon = faRectangleXmark
export const lockDownWithRexIcon = faHillRockslide
export const lockIcon = faLock
export const unlockIcon = faLockOpen
export const mUnlockIcon = faRepeat //faAnchorLock
export const provIcon = faHandcuffs
export const dbUpdateIcon = faClockRotateLeft
export const dbInitializeIcon = faArrowsSpin
export const serveIcon = faBarsStaggered
export const highIcon = faTextHeight
export const elevatedIcon = faElevator
export const guardedIcon = faDisease
export const lowIcon = faTurnDown
export const disableIcon = faBan
export const dbSyncIcon = faDatabase
export const reloadIcon = faRotateRight
export const softwareIcon = faLaptopCode
// export const bookReader = faBookOpenReader
// export const shekelSign = faShekelSign
export const idCard = faIdCardClip
// export const houseLock = faHouseLock
export const cookie = faCookie
// export const dungeon = faDungeon
// export const allArrowSign = faUpDownLeftRight
export const notification = faBell
export const shuttleSpace = faShuttleSpace
// export const stopwatch = faStopwatch
// export const shareIcon = faShareNodes
// export const loadImage = faSpinner
export const editIcon = faPenToSquare
export const checkIcon = faCircleCheck
export const testIcon = faVial
export const toggleFloorIcon = faToggleOff
export const fourBoxIcon = faTableCellsLarge
export const twoBoxIcon = faTableColumns
export const oneBoxIcon = faSquare
export const imageLoadIcon = faImages
export const editLayoutIcon = faLayerGroup
export const recordOffIcon = faVideoSlash
export const recordOnIcon = faVideo
export const instantRecordIcon = faRecordVinyl
export const keyIcon = faKey
export const updateLicenseIcon = faIdCard
export const eventIcon = faCalendarDays
export const actionIcon = faCalendarDay
export const fwUpdateIcon = faCircleUp
export const stopIcon = faStop
export const certificateDownloadIcon = faCloudDownload
export const avatarIcon = faCircleUser
export const filterIcon = faFilter
export const streamIcon = faVideo

// only icon button (no title/name)
export const threeDotsIcon = faEllipsisVertical // for mobile dropdown menu
export const rightArrowIcon = faAngleRight // right angle for access form
export const leftArrowIcon = faAngleLeft // for mobile dropdown menu
// export const upAngleIcon = faAngleRight // right angle for access form
// export const downAngleIcon = faAngleLeft // for mobile dropdown menu
export const downArrowIcon = faArrowDownLong // for table header sort desc
export const upArrowIcon = faArrowUpLong // for table header sort asc

// route icons
// home// change floor dashboad and floor dashboard
// export const dashboardIcon =   faHouse ---rubel
// export const floorDashboardIcon = faHouseFloodWater --rubel
export const systemReportIcon = faIndent
export const floorDashboardIcon = faDiagramSuccessor
export const ackIcon = faChartLine
export const liveIcon = faTowerBroadcast
export const playbackIcon = faBackward
// report
export const logReportIcon = faCircleInfo
export const accessReportIcon = faLaptopFile
export const ackReportIcon = faHouseLaptop
export const smartReportIcon = faHouseFloodWater
export const copyLogFromDatabaseIcon = faCopy
export const getbackLogFromArchiveIcon = faDownLeftAndUpRightToCenter
export const saveIcon = faFloppyDisk
export const printIcon = faPrint
export const occupancyReportIcon = faChartArea
export const attendanceReportIcon = faUsersBetweenLines
export const guardReportIcon = faPersonCircleCheck

// user
export const partitionIcon = faClone
export const userIcon = faUser
export const userRoleIcon = faUserLock
// person
export const personIcon = faUserTie
export const definedFieldIcon = faSquarePen
export const credentialIcon = faKey
export const credentialAccessIcon = faFingerprint
export const formatIcon = faJar
export const accessIcon = faUnlockKeyhole
// device
export const nodeIcon = faCompactDisc
export const nodeScanIcon = faHurricane
export const doorIcon = faDoorOpen
export const doorOpenIcon = faDoorOpen
export const doorCloseIcon = faDoorClosed
export const antiPassbackRuleIcon = faForwardFast
export const antiTailgateRuleIcon = faT
export const occupancyRuleIcon = faO
export const deadmanRuleIcon = faD
export const regionStatusIcon = faRegistered
export const hazmatRuleIcon = faH
export const nvrIcon = faHardDrive
export const channelIcon = faDiceD6
export const gatewayIcon = faDiamond
export const LogIcon = faGears
export const doorRuleIcon = faDungeon
export const regionIcon = faMap
export const inputIcon = faArrowUpFromBracket
export const outputIcon = faArrowDown
export const elevatorIcon = faElevator
export const relayIcon = faBullseye
export const cameraIcon = faCamera
export const locksetIcon = faShopLock
export const facegateIcon = faFaceSmile
export const intercomIcon = faFaceSmile
export const serialIcon = faChartSimple
export const subnodeIcon = faCircleNodes
export const readerIcon = faBookOpenReader
export const contGateIcon = faCircleNodes
export const contLockIcon = faCircleNodes
export const triggerIcon = faList
export const threatIcon = faCookieBite
// work
export const taskIcon = faListCheck
export const eventActionIcon = faCalendarCheck
export const eventCodeIcon = faCalendarMinus
export const scheduleIcon = faCalendarDays
export const holidayIcon = faCalendarDay
export const groupIcon = faUsers
// service
export const emailIcon = faEnvelope
export const ftpIcon = faFile
export const restAPIIcon = faGear
export const logAPIIcon = faFileLines
export const geminiIcon = faDna
export const faceIcon = faFaceSmile
export const sipIcon = faServer
export const inviteIcon = faGift
// monitoring
export const floorIcon = faCropSimple
export const viewIcon = faEye
// maintenance
export const updateIcon = faPen
export const backupIcon = faDatabase
export const backupScheduleIcon = faCalendarWeek
export const restoreIcon = faRetweet
export const archiveIcon = faFolderClosed
export const archiveScheduleIcon = faFolderOpen
export const getBackIcon = faArrowRightArrowLeft
export const defaultIcon = faArrowsRotate
export const databaseIcon = faDatabase
export const rebootIcon = faPowerOff
export const miscellaneousIcon = faChessPawn
export const capacityIcon = faWarehouse
export const factoryDefaultIcon = faTractor
export const logResetIcon = faRecycle
export const loadDatabaseFromStorage = faDatabase
export const saveDatabaseToStorage = faFloppyDisk
export const saveDataAndRebootIcon = faFloppyDisk
export const rebootWithoutSavingDataIcon = faRotate
// system
export const licenseIcon = faIdCard
export const systemIcon = faGears
export const networkIcon = faTowerCell
export const timeIcon = faBusinessTime
// export const locationIcon = faLocation
// export const addressIcon = faLocationDot
export const sdCardIcon = faSdCard
export const usbIcon = faMicrochip
export const macIcon = faChalkboard
export const soapIcon = faSoap
export const boardIcon = faChessBoard
export const certificateIcon = faFileLines
export const masterIcon = faBrain
export const cloudIcon = faCloud
export const wifiIcon = faWifi

// menu header icons

export const homeIcon = faHome
export const monitorIcon = faTv
export const menuPersonIcon = faBuildingUser
export const settingIcon = faUserGear
export const menuUserIcon = faCircleUser
export const reportIcon = faBarsProgress
export const deviceIcon = faMobileScreen
export const externalIcon = faArrowUpRightFromSquare
export const workIcon = faBriefcase
export const serviceIcon = faSignHanging
export const maintenanceIcon = faChartSimple
export const favoriteIcon = faStar
// export const menuIcon = faBars
export const menuIcon = faStopwatch

export const dashIcon = faMinus

// icon component and type
const Icon = FontAwesomeIcon
export type TIcon = IconDefinition

export default Icon
