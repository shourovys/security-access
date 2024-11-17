import { lazy } from 'react'
import { IRouteProperty } from '../../types/routes'
import {
  eventActionIcon,
  eventCodeIcon,
  groupIcon,
  holidayIcon,
  scheduleIcon,
  taskIcon,
} from '../../utils/icons'
import t from '../../utils/translator'

const CreateScheduleItem = lazy(() => import('../../pages/schedule/[scheduleId]/item/add'))
const EditScheduleItem = lazy(() => import('../../pages/schedule/[scheduleId]/item/edit/[id]'))
const ScheduleItemInfo = lazy(() => import('../../pages/schedule/[scheduleId]/item/info/[id]'))
const Schedule = lazy(() => import('../../pages/schedule'))
const CreateSchedule = lazy(() => import('../../pages/schedule/add'))
const EditSchedule = lazy(() => import('../../pages/schedule/edit/[id]'))
const ScheduleInfo = lazy(() => import('../../pages/schedule/info/[id]'))

const EventAction = lazy(() => import('../../pages/event-action'))
const CreateEventAction = lazy(() => import('../../pages/event-action/add'))
const EditEventAction = lazy(() => import('../../pages/event-action/edit/[id]'))
const EventActionInfo = lazy(() => import('../../pages/event-action/info/[id]'))

const CreateEvent = lazy(() => import('../../pages/event-action/[eventActionId]/event/add'))
const EditEvent = lazy(() => import('../../pages/event-action/[eventActionId]/event/edit/[id]'))
const EventInfo = lazy(() => import('../../pages/event-action/[eventActionId]/event/info/[id]'))

const CreateAction = lazy(() => import('../../pages/event-action/[eventActionId]/action/add'))
const EditAction = lazy(() => import('../../pages/event-action/[eventActionId]/action/edit/[id]'))
const ActionInfo = lazy(() => import('../../pages/event-action/[eventActionId]/action/info/[id]'))

const EventCode = lazy(() => import('../../pages/event-code'))
const Group = lazy(() => import('../../pages/group'))
const CreateGroup = lazy(() => import('../../pages/group/add'))
const EditGroup = lazy(() => import('../../pages/group/edit/[id]'))
const GroupInfo = lazy(() => import('../../pages/group/info/[id]'))
const Holiday = lazy(() => import('../../pages/holiday'))
const CreateHoliday = lazy(() => import('../../pages/holiday/add'))
const EditHoliday = lazy(() => import('../../pages/holiday/edit/[id]'))
const HolidayInfo = lazy(() => import('../../pages/holiday/info/[id]'))
const CreateHolidayItem = lazy(() => import('../../pages/holiday/[holidayId]/item/add'))
const EditHolidayItem = lazy(() => import('../../pages/holiday/[holidayId]/item/edit/[id]'))
const HolidayItemInfo = lazy(() => import('../../pages/holiday/[holidayId]/item/info/[id]'))

const Task = lazy(() => import('../../pages/task'))
const CreateTask = lazy(() => import('../../pages/task/add'))
const EditTask = lazy(() => import('../../pages/task/edit/[id]'))
const TaskInfo = lazy(() => import('../../pages/task/info/[id]'))

const scheduleRouteProperty: IRouteProperty = {
  // Schedule
  schedule: {
    id: '31',
    label: t`Schedule`,
    path: () => '/schedule',
    routePath: '/schedule',
    icon: scheduleIcon,
    component: Schedule,
    permissions: ['31'],
  },
  scheduleCreate: {
    path: () => '/schedule/add',
    routePath: '/schedule/add',
    component: CreateSchedule,
    permissions: ['31'],
  },
  scheduleEdit: {
    path: (id?: number | string) => `/schedule/edit/${id}`,
    routePath: '/schedule/edit/:id',
    component: EditSchedule,
    permissions: ['31'],
  },
  scheduleInfo: {
    path: (id?: number | string) => `/schedule/info/${id}`,
    routePath: '/schedule/info/:id',
    component: ScheduleInfo,
    permissions: ['31'],
  },
  // schedule item
  scheduleItemCreate: {
    path: (scheduleId?: number | string) => `/schedule/${scheduleId}/item/add/`,
    routePath: '/schedule/:scheduleId/item/add/',
    component: CreateScheduleItem,
    permissions: ['31'],
  },
  scheduleItemEdit: {
    path: (scheduleId?: number | string, scheduleItemId?: number | string) =>
      `/schedule/${scheduleId}/item/edit/${scheduleItemId}`,
    routePath: '/schedule/:scheduleId/item/edit/:id',
    component: EditScheduleItem,
    permissions: ['31'],
  },
  scheduleItemInfo: {
    path: (scheduleId?: number | string, scheduleItemId?: number | string) =>
      `/schedule/${scheduleId}/item/info/${scheduleItemId}`,
    routePath: '/schedule/:scheduleId/item/info/:id',
    component: ScheduleItemInfo,
    permissions: ['31'],
  },

  // Task
  task: {
    id: '29',
    label: t`Task`,
    path: () => '/task',
    routePath: '/task',
    icon: taskIcon,
    component: Task,
    permissions: ['29'],
  },
  taskCreate: {
    path: () => '/task/add',
    routePath: '/task/add',
    component: CreateTask,
    permissions: ['29'],
  },
  taskEdit: {
    path: (id?: number | string) => `/task/edit/${id}`,
    routePath: '/task/edit/:id',
    component: EditTask,
    permissions: ['29'],
  },
  taskInfo: {
    path: (id?: number | string) => `/task/info/${id}`,
    routePath: '/task/info/:id',
    component: TaskInfo,
    permissions: ['29'],
  },

  // Event Action
  eventAction: {
    id: '30',
    label: t`Event Action`,
    path: () => '/event-action',
    routePath: '/event-action',
    icon: eventActionIcon,
    component: EventAction,
    permissions: ['30'],
  },
  eventActionCreate: {
    path: () => '/event-action/add',
    routePath: '/event-action/add',
    component: CreateEventAction,
    permissions: ['30'],
  },
  eventActionEdit: {
    path: (id?: number | string) => `/event-action/edit/${id}`,
    routePath: '/event-action/edit/:id',
    component: EditEventAction,
    permissions: ['30'],
  },
  eventActionInfo: {
    path: (id?: number | string) => `/event-action/info/${id}`,
    routePath: '/event-action/info/:id',
    component: EventActionInfo,
    permissions: ['30'],
  },
  // Event Action => Event
  eventCreate: {
    path: (eventActionId?: number | string) => `/event-action/${eventActionId}/event/add/`,
    routePath: '/event-action/:eventActionId/event/add/',
    component: CreateEvent,
    permissions: ['30'],
  },
  eventEdit: {
    path: (eventActionId?: number | string, eventId?: number | string) =>
      `/event-action/${eventActionId}/event/edit/${eventId}`,
    routePath: '/event-action/:eventActionId/event/edit/:id',
    component: EditEvent,
    permissions: ['30'],
  },
  eventInfo: {
    path: (eventActionId?: number | string, eventId?: number | string) =>
      `/event-action/${eventActionId}/event/info/${eventId}`,
    routePath: '/event-action/:eventActionId/event/info/:id',
    component: EventInfo,
    permissions: ['30'],
  },
  // Event Action => Action
  actionCreate: {
    path: (eventActionId?: number | string) => `/event-action/${eventActionId}/action/add/`,
    routePath: '/event-action/:eventActionId/action/add/',
    component: CreateAction,
    permissions: ['30'],
  },
  actionEdit: {
    path: (eventActionId?: number | string, eventId?: number | string) =>
      `/event-action/${eventActionId}/action/edit/${eventId}`,
    routePath: '/event-action/:eventActionId/action/edit/:id',
    component: EditAction,
    permissions: ['30'],
  },
  actionInfo: {
    path: (eventActionId?: number | string, eventId?: number | string) =>
      `/event-action/${eventActionId}/action/info/${eventId}`,
    routePath: '/event-action/:eventActionId/action/info/:id',
    component: ActionInfo,
    permissions: ['30'],
  },

  // Event Code
  eventCode: {
    id: '54',
    label: t`Event Code`,
    path: () => '/event-code',
    routePath: '/event-code',
    icon: eventCodeIcon,
    component: EventCode,
    permissions: ['54'],
  },
  // eventCodeCreate: {
  //     path: () => "/event-code/add",
  //     routePath: "/event-code/add",
  //     component: CreateEventCode,
  //     permissions: ['54'],
  // },
  // eventCodeEdit: {
  //     path: (id?: number | string) => `/event-code/edit/${id}`,
  //     routePath: "/event-code/edit/:id",
  //     component: EditEventCode,
  //     permissions: ['54'],
  // },
  // eventCodeInfo: {
  //     path: (id?: number | string) => `/event-code/info/${id}`,
  //     routePath: "/event-code/info/:id",
  //     component: EventCodeInfo,
  //     permissions: ['54'],
  // },

  // Holiday
  holiday: {
    id: '32',
    label: t`Holiday`,
    path: () => '/holiday',
    routePath: '/holiday',
    icon: holidayIcon,
    component: Holiday,
    permissions: ['32'],
  },
  holidayCreate: {
    path: () => '/holiday/add',
    routePath: '/holiday/add',
    component: CreateHoliday,
    permissions: ['32'],
  },
  holidayEdit: {
    path: (id?: number | string) => `/holiday/edit/${id}`,
    routePath: '/holiday/edit/:id',
    component: EditHoliday,
    permissions: ['32'],
  },
  holidayInfo: {
    path: (id?: number | string) => `/holiday/info/${id}`,
    routePath: '/holiday/info/:id',
    component: HolidayInfo,
    permissions: ['32'],
  },
  // holiday items
  holidayItemCreate: {
    path: (holidayId?: number | string) => `/holiday/${holidayId}/item/add/`,
    routePath: '/holiday/:holidayId/item/add/',
    component: CreateHolidayItem,
    permissions: ['32'],
  },
  holidayItemEdit: {
    path: (holidayId?: number | string, holidayItemId?: number | string) =>
      `/holiday/${holidayId}/item/edit/${holidayItemId}`,
    routePath: '/holiday/:holidayId/item/edit/:id',
    component: EditHolidayItem,
    permissions: ['32'],
  },
  holidayItemInfo: {
    path: (holidayId?: number | string, holidayItemId?: number | string) =>
      `/holiday/${holidayId}/item/info/${holidayItemId}`,
    routePath: '/holiday/:holidayId/item/info/:id',
    component: HolidayItemInfo,
    permissions: ['32'],
  },

  // Group
  group: {
    id: '33',
    label: t`Group`,
    path: () => '/group',
    routePath: '/group',
    icon: groupIcon,
    component: Group,
    permissions: ['33'],
  },
  groupCreate: {
    path: () => '/group/add',
    routePath: '/group/add',
    component: CreateGroup,
    permissions: ['33'],
  },
  groupEdit: {
    path: (id?: number | string) => `/group/edit/${id}`,
    routePath: '/group/edit/:id',
    component: EditGroup,
    permissions: ['33'],
  },
  groupInfo: {
    path: (id?: number | string) => `/group/info/${id}`,
    routePath: '/group/info/:id',
    component: GroupInfo,
    permissions: ['33'],
  },
}

export default scheduleRouteProperty
