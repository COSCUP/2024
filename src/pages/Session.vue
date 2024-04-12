<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="session" class="page-container">
    <ScheduleNavbar :currentTimeZone="currentTimeZone"/>
    <div class="time-zone-container">
      <label for="time-zone-select">時區：</label>
      <ModelSelect
        id="time-zone-select"
        :options="timeZoneOptions"
        v-model="currentTimeZone"
      />
      <button @click="resetTimeZone" :class="{ available: currentTimeZone !== deviceTimezone }">重設</button>
    </div>
    <SessionFilter/>
    <template v-for="(schedule, index) in daysSchedule">
      <ScheduleList
        v-if="xsOnly"
        v-show="currentDayIndex === index"
        :key="`list-${schedule.day.join('')}`"
        :list="schedule.list"
      />
      <ScheduleTable
        v-else
        v-show="currentDayIndex === index"
        :key="`table-${schedule.day.join('')}`"
        :table="schedule.table"
        :currentTimeZone="currentTimeZone"
      />
    </template>
  </main>
</template>

<script lang="ts">
// import io, { Socket } from 'socket.io-client'
// import axios from 'axios'
import { defineComponent, watch, ref } from 'vue'
import { useBreakpoints } from '@/modules/breakpoints'
import { useSession } from '@/modules/session'
import ScheduleNavbar from '@/components/Session/ScheduleNavbar.vue'
import ScheduleTable from '@/components/Session/ScheduleTable.vue'
import ScheduleList from '@/components/Session/ScheduleList.vue'
import SessionFilter from '@/components/Session/SessionFilter.vue'
import { ModelSelect } from 'vue-search-select'

import '@/assets/scss/pages/session.scss'
import 'vue-search-select/dist/VueSearchSelect.css'
import { usePopUp } from '@/modules/pop-up'
import { useRoute, useRouter } from 'vue-router'
import { generateSessionPopupData } from '@/modules/session/logic'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
import { isClient } from '@vueuse/shared'
import communityData from '@/assets/json/community.json'
import { Session } from '@/modules/session/types'
import { calculateTimezoneOffset } from '@/modules/session/timezone'

export default defineComponent({
  name: 'Session',
  components: {
    ScheduleNavbar,
    ScheduleTable,
    ScheduleList,
    SessionFilter,
    ModelSelect
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const {
      load,
      daysSchedule,
      currentDayIndex,
      getSessionById,
      isLoaded,
      TIMEZONE_OFFSET
    } = useSession()
    const {
      openPopUp,
      removeAll
    } = usePopUp()
    const { xsOnly } = useBreakpoints()
    const { locale } = useI18n()

    const timeZoneOptions = Intl.supportedValuesOf('timeZone').map((timeZone) => ({
      value: timeZone,
      text: timeZone
    }))
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const currentTimeZone = ref(deviceTimezone)

    const resetTimeZone = () => {
      currentTimeZone.value = deviceTimezone
    }

    watch(currentTimeZone, () => {
      TIMEZONE_OFFSET.value = calculateTimezoneOffset(currentTimeZone.value)
    })

    function getCommunityFromSession (session: Session) {
      return communityData.communities.find((c) => c.track === session.type['zh-TW'].name)
    }

    function tryToOpenSessionPopUp () {
      const [bool, sessionId] = [isLoaded.value, route.params.sessionId as string]
      if (!bool) return
      if (typeof sessionId !== 'string') {
        removeAll((popUpData) => !popUpData.popupId?.startsWith('session-'))
        return
      }

      const onClose = () => {
        if (window.history.state.back) {
          router.back()
        } else {
          router.push('/session')
        }
      }
      if (sessionId === 'template') {
        openPopUp({
          popupId: 'session-template',
          metaOptions: {
            title: '@{TEMPLATE_META_TITLE}',
            description: '@{TEMPLATE_META_DESCRIPTION}',
            ogUrl: '@{TEMPLATE_META_OG_URL}',
            ogImage: '@{TEMPLATE_META_OG_IMAGE}'
          },
          containerData: {
            type: 'default'
          },
          contentData: {
            type: 'html',
            html: '@{TEMPLATE_CONTENT_HTML}'
          },
          onClose
        })
      } else {
        openPopUp({
          ...generateSessionPopupData(
            getSessionById(sessionId),
            getCommunityFromSession(getSessionById(sessionId)),
            locale.value as Locale
          ),
          onClose
        })
      }
    }

    tryToOpenSessionPopUp()
    watch(() => [route.params.sessionId, isLoaded.value], () => {
      tryToOpenSessionPopUp()
    })

    isClient && watch(currentDayIndex, async () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })

    return {
      xsOnly,
      currentDayIndex,
      daysSchedule,
      load,
      tryToOpenSessionPopUp,
      route,
      timeZoneOptions,
      currentTimeZone,
      deviceTimezone,
      resetTimeZone,
      TIMEZONE_OFFSET
    }
  },
  async serverPrefetch () {
    await this.load()
    if (this.route.params.sessionId) {
      this.tryToOpenSessionPopUp()
    }
  }
})
</script>

<style scoped lang="scss">
.time-zone-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  width: 100vw;
  position: sticky;
  left: 0;

  z-index: 3; /* Makes dropdown menu above table headers */

  label {
    align-self: center;
  }

  .dropdown {
    width: 20rem;
  }

  button {
    visibility: hidden;
    opacity: 0;
    transform: translateX(-100%); /* Slide from the left */
    transition: opacity 0.5s, transform 0.5s;
    padding: 0.5rem 1rem;

  }

  .available {
    visibility: visible;
    opacity: 1;
    transform: translateX(0%);
  }
}
</style>
