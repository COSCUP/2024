// Copyright (c) 2021 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { computed, InjectionKey, Ref, ref, watch } from 'vue'
import { createModuleHook, useSetupCtx } from '../utils'
import {
  generateScheduleList,
  generateScheduleTable,
  getScheduleDays,
  transformRawData,
  generateFilterOption
} from './logic'
import { ScheduleElement, SessionsMap, RoomId, ScheduleTable, ScheduleList, Session, SessionId, RoomsMap, Room, RoomsStatusMap, RoomStatus, FilterOptions, FilterValue } from './types'
import { fixedTimeZoneDate } from './utils'
import { useProgress } from '../progress'
// import io from 'socket.io-client'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
import { calculateTimezoneOffset } from './timezone'

interface UseSession {
  isLoaded: Ref<boolean>;
  currentDayIndex: Ref<number>;
  daysSchedule: Ref<{
    day: [number, number, number];
    table: ScheduleTable;
    list: ScheduleList;
  }[]>;
  filterOptions: Ref<FilterOptions>;
  filterValue: Ref<FilterValue>;
  roomsStatusMap: Ref<RoomsStatusMap | null>;
  sessionsMap: Ref<SessionsMap | null>;
  favoriteSessions: Ref<SessionId[]>;
  getSessionById: (id: SessionId) => Session;
  getRoomById: (id: RoomId) => Room;
  getRoomStatusById: (id: RoomId) => RoomStatus;
  load: () => Promise<void>;
  TIMEZONE_OFFSET: Ref<number>;
}

const PROVIDE_KEY: InjectionKey<UseSession> = Symbol('session')

const _useSession = (): UseSession => {
  const { isClient } = useSetupCtx()
  const { start, done } = useProgress()
  const { locale: _locale } = useI18n()
  const locale = computed<Locale>(() => _locale.value as Locale)

  // let socket: ReturnType<typeof io> | null = null
  const scheduleElements = ref<ScheduleElement[] | null>(null)
  const _sessionsMap = ref<SessionsMap | null>(null)
  const sessionsMap = computed(() => {
    if (!_sessionsMap.value) return null
    return Object.keys(_sessionsMap.value).reduce((result, key) => {
      return {
        ...result,
        [key]: {
          ..._sessionsMap.value?.[key],
          favorite: favoriteSessions.value.includes(key)
        }
      }
    }, {}) as SessionsMap
  })
  const roomsMap = ref<RoomsMap | null>(null)
  const roomCapacities: Record<string, number> = {
    RB105: 404,
    RB101: 38,
    RB102: 84,
    TR209: 96,
    TR210: 48,
    TR211: 108,
    TR212: 108,
    TR213: 108,
    TR214: 108,
    TR313: 108,
    'TR409-2': 68,
    TR410: 68,
    TR411: 38,
    'TR412-3': 40,
    'TR412-2': 38,
    'TR413-1': 38,
    TR510: 38,
    TR511: 38,
    TR512: 38,
    TR513: 38,
    TR514: 38,
    TR609: 38,
    TR610: 38,
    TR611: 38,
    TR613: 38,
    TR614: 38,
    TR615: 38,
    TR616: 36
  }
  const isLoaded = ref<boolean>(false)
  const filterOptions = ref<FilterOptions>([])
  const favoriteSessions = (() => {
    const defaultValue = isClient ? JSON.parse(window.localStorage.getItem('FAVORITE_SESSIONS') ?? '[]') : []
    const _favoriteSessions = ref<SessionId[]>(defaultValue)
    return computed({
      get: () => _favoriteSessions.value,
      set: (value) => {
        window.localStorage.setItem('FAVORITE_SESSIONS', JSON.stringify(value))
        _favoriteSessions.value = value
      }
    })
  })()
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const TIMEZONE_OFFSET: Ref = ref(calculateTimezoneOffset(deviceTimezone))

  const load = async () => {
    if (isLoaded.value) return
    start()
    const { default: _rawData } = await import('@/assets/json/session.json')
    const { scheduleElements: _scheduleElements, sessionsMap: __sessionsMap, roomsMap: _roomsMap } =
      transformRawData(_rawData, TIMEZONE_OFFSET.value)

    scheduleElements.value = _scheduleElements
    _sessionsMap.value = __sessionsMap
    roomsMap.value = _roomsMap
    isClient && await prepareRoomStatus()
    isLoaded.value = true
    filterOptions.value = generateFilterOption(_rawData)
    done()
  }

  isClient && load()

  const route = useRoute()
  const router = useRouter()
  const filterValue = computed({
    get () {
      return {
        room: route.query.room as string[] ?? ['*'],
        tags: route.query.tags as string ?? '*',
        type: route.query.type as string ?? '*',
        collection: route.query.collection as string ?? '*',
        filter: ((route.query.filter as string)?.match(/.{1,6}/g) as string[]) ?? ['*'],
        search: route.query.search as string ?? ''
      }
    },
    set (value) {
      const getQueryValue = (data: string) => data !== '*' ? data : undefined
      const query = {
        ...route.query,
        room: value.room.includes('*') ? undefined : value.room,
        tags: getQueryValue(value.tags),
        type: getQueryValue(value.type),
        collection: getQueryValue(value.collection),
        filter: !value.filter.includes('*') ? value.filter.join('') : undefined,
        search: value.search ? value.search : undefined
      }
      const queryArray = Object.entries(query).filter(([, value]) => value !== undefined)
      router.push({ query: Object.fromEntries(queryArray) })
    }
  })

  const currentDayIndex = ref(0)
  const daysSchedule = computed(() => {
    if (scheduleElements.value === null) return []
    return getScheduleDays(scheduleElements.value)
      .map((scheduleDay) => {
        const day = scheduleDay.day
        const elements = scheduleDay.elements.filter(s => {
          const session = getSessionById(s.session)

          for (const _key of Object.keys(filterValue.value)) {
            const key = _key as keyof FilterValue
            const value = filterValue.value[key]
            if (value === '*') continue
            if (Array.isArray(value) && value.includes('*')) continue

            if (key === 'tags') {
              if (!session[key].find(x => x.id === value)) return false
              else continue
            }
            if (key === 'room') {
              if (!value.includes(session[key].id)) return false
              else continue
            }
            if (key === 'type') {
              if (session[key].id !== value) return false
              else continue
            }
            if (key === 'collection') {
              if (!session.favorite) return false
              else continue
            }
            if (key === 'filter') {
              if (!value.includes(session.id)) return false
              else continue
            }
            if (key === 'search') {
              const val = (value as string).toLowerCase()
              if (
                !session[locale.value].title.toLowerCase().includes(val) &&
                !session[locale.value].description.toLowerCase().includes(val) &&
                (
                  !session.speakers.every(s => s[locale.value].name.toLowerCase().includes(val) || s[locale.value].bio.toLowerCase().includes(val)) ||
                  session.speakers.length === 0
                )
              ) return false
            }
          }

          return true
        })
        const table = generateScheduleTable(elements)
        const list = generateScheduleList(elements)
        return { day, table, list }
      })
  })

  watch(daysSchedule, () => {
    if (daysSchedule.value[currentDayIndex.value].list.items.length > 0) return
    const newIndex = daysSchedule.value.findIndex((day) => day.list.items.length > 0)
    if (newIndex >= 0) {
      currentDayIndex.value = newIndex
    }
  })

  watch(TIMEZONE_OFFSET, (oldVal, newVal) => {
    if (oldVal === newVal) return
    isLoaded.value = false
    load()
  })

  const getSessionById = (id: SessionId): Session => {
    const session = sessionsMap.value?.[id] ?? null
    if (session === null) throw new Error(`Can not find session: ${id} in sessions map`)
    return session
  }

  const getRoomById = (id: RoomId): Room => {
    const room = roomsMap.value?.[id] ?? null
    if (room === null) throw new Error(`Can not find room: ${id} in rooms map`)
    return room
  }

  const currentSessions = ref<Session[]>([])
  const roomsIsFull = ref<Record<RoomId, boolean>>({})
  const roomsStatusMap = computed<RoomsStatusMap | null>(() => {
    if (roomsMap.value === null) return null
    return Object.fromEntries(
      Object.keys(roomsMap.value)
        .map(roomId => {
          const isFull = roomsIsFull.value[roomId] ?? false
          const currentSession = currentSessions.value.find(s => s.room.id === roomId)?.id ?? null
          return [roomId, { isFull, currentSession } as RoomStatus]
        })
    )
  })
  const getRoomStatusById = (id: RoomId): RoomStatus => {
    const status = roomsStatusMap.value?.[id]
    if (!status) throw new Error(`Can not find room: ${id} in rooms' status map`)
    return status
  }

  isClient && setInterval(() => {
    if (sessionsMap.value === null) {
      currentSessions.value = []
      return
    }
    const currentTime = fixedTimeZoneDate(new Date(), TIMEZONE_OFFSET.value).getTime()
    // const currentTime = fixedTimeZoneDate(new Date('2024-08-03 10:20'), TIMEZONE_OFFSET).getTime()
    currentSessions.value = Object.values(sessionsMap.value)
      .filter(s => s.start.getTime() <= currentTime && currentTime <= s.end.getTime())
  }, 3000)

  // async function prepareRoomStatus () {
  //   const apiEndPoint = import.meta.env.VITE_ROOM_STATUS_API
  //   if (!apiEndPoint || typeof apiEndPoint !== 'string') return
  //   if (!socket) {
  //     socket = io(apiEndPoint)
  //     socket.emit('data')
  //   }
  //   socket.on('data', (data: Record<RoomId, boolean>) => { roomsIsFull.value = data })
  //   socket.on('update', (diff: Record<RoomId, boolean>) => {
  //     Object.keys(diff).forEach((key) => {
  //       roomsIsFull.value[key] = diff[key]
  //     })
  //   })
  // }

  async function prepareRoomStatus () {
    const apiEndPoint = 'https://coscup.simbafs.cc/api/attendance?token=coscup2024'
    if (!apiEndPoint || typeof apiEndPoint !== 'string') return
    try {
      const response = await fetch(apiEndPoint)
      const apiData = await response.json()
      // const attendanceLength = Object.keys(data.attendance)
      const roomStatus: Record<RoomId, boolean> = {}
      // const currentTime = fixedTimeZoneDate(new Date('2024-08-03 10:20'), TIMEZONE_OFFSET).getTime()
      const currentTime = fixedTimeZoneDate(new Date(), TIMEZONE_OFFSET.value).getTime()
      if (sessionsMap.value) {
        currentSessions.value = Object.values(sessionsMap.value)
          .filter(s => s.start.getTime() <= currentTime && currentTime <= s.end.getTime())
      }

      if (scheduleElements.value) {
        for (const element of scheduleElements.value) {
          const startTime = new Date(element.start)
          const endTime = new Date(element.end)
          if (currentTime >= startTime.getTime() && currentTime <= endTime.getTime()) {
            const room = element.room
            const session = element.session
            const attendance = apiData.attendance[session] || 0
            const capacity = roomCapacities[room]
            if (attendance > capacity) {
              roomStatus[room] = true
            } else {
              roomStatus[room] = false
            }
          }
        }
      }
      roomsIsFull.value = roomStatus
    } catch (error) {
      console.error('Failed to fetch room status:', error)
    }
  }

  return {
    isLoaded,
    currentDayIndex,
    daysSchedule,
    roomsStatusMap,
    filterOptions,
    filterValue,
    sessionsMap,
    getSessionById,
    getRoomById,
    getRoomStatusById,
    load,
    favoriteSessions,
    TIMEZONE_OFFSET
  }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useSession)
export const useSession = createModuleHook(PROVIDE_KEY, _useSession)
