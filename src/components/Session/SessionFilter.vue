<template>
  <article :class="{['session-filter']: true, active: active}">
    <button v-show="isFilterCollection" class="fab CalendarMultipleCheck" :class="{ active }" @click="checkMySchedule" title="收藏議程時間衝突檢查">
      <icon-mdi-calendar-multiple-check />
    </button>
    <template v-if="!isFilterCollection">
      <button :class="{fab: true, bookmark: true, active: active}" @click="showFavorites">
        <icon-mdi-bookmark></icon-mdi-bookmark>
      </button>
      <button :class="{fab: true, switch: true, active: active}" @click="active = !active">
        <icon-mdi-filter-list />
      </button>
    </template>
    <template v-else>
      <button :class="{fab: true, bookmark: true, active: active}" @click="share">
        <icon-mdi-share-variant />
      </button>
      <button :class="{fab: true, close: true, active: active}" @click="close">
        <icon-mdi-close />
      </button>
    </template>
    <section>
      <input type="search" :placeholder="t('session.filter.search')" name="search" :value="filterValue.search" @input="changeFilterValue" />
    </section>
    <section v-for="filter in filterOptions" :key="filter.label">
      <template v-if="filter.label === 'room'">
        <label>{{ t(`session.filter.${filter.label}`) }}: </label>
        <select :name="filter.label" multiple :size="filter.options.length" v-model="roomValue">
          <option value="*">{{ t("session.filter.all") }}</option>
          <option v-for="option in filter.options" :key="option.id" :value="option.id">
            {{ option.name[locale] }}
          </option>
        </select>
      </template>
      <template v-else>
        <label>{{ t(`session.filter.${filter.label}`) }}: </label>
        <select :name="filter.label" :value="filterValue[filter.label]" @change="changeFilterValue">
          <option value="*">{{ t("session.filter.all") }}</option>
          <option v-for="option in filter.options" :key="option.id" :value="option.id">
            {{ option.name[locale] }}
          </option>
        </select>
      </template>
    </section>
    <template v-if="hasFilters">
      <button class="clear" @click="clearFilters">
        <icon-mdi-close />
        {{ t('session.filter.clear') }}
      </button>
    </template>
  </article>
</template>
<script lang="ts">
import { computed, defineComponent, ref, ComputedRef } from 'vue'
import { useSession } from '@/modules/session'
import { useI18n } from 'vue-i18n'
import { Locale } from '@/modules/i18n'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SessionFilter',
  setup () {
    const { filterOptions, filterValue, favoriteSessions, getSessionById } = useSession()
    const { t, locale } = useI18n()
    const router = useRouter()
    const route = useRoute()

    const active = ref(false)

    const roomValue = computed({
      get: () => filterValue.value.room,
      set: (value) => {
        const room = (() => {
          console.log(filterValue.value.room, value)
          if (filterValue.value.room.includes('*')) return value.filter((el) => el !== '*')
          if (!filterValue.value.room.includes('*') && value.includes('*')) return ['*']
          return value
        })()

        filterValue.value = {
          ...filterValue.value,
          room
        }
      }
    })

    const changeFilterValue = (e:Event) => {
      const { name, value } = e.target as HTMLSelectElement

      window.scrollTo(0, 0)
      filterValue.value = { ...filterValue.value, [name]: value }
    }

    const isFilterCollection = computed(() => filterValue.value.collection !== '*')
    const showFavorites = () => {
      active.value = false
      filterValue.value = {
        search: '',
        tags: '*',
        room: ['*'],
        type: '*',
        filter: ['*'],
        collection: 'mark'
      }
    }

    const close = () => {
      router.back()
    }

    const checkMySchedule = () => {
      const events = favoriteSessions.value.map((sessionId) => {
        const session = getSessionById(sessionId)
        return { startTime: new Date(session.start), endTime: new Date(session.end) }
      })

      const isConflicting = () => {
        for (let i = 0; i < events.length - 1; i++) {
          for (let j = i + 1; j < events.length; j++) {
            const eventA = events[i]
            const eventB = events[j]
            if (
              (eventA.endTime > eventB.startTime && eventA.startTime < eventB.endTime) ||
              (eventB.endTime > eventA.startTime && eventB.startTime < eventA.endTime)
            ) {
              return true
            }
          }
        }
        return false
      }

      if (isConflicting()) {
        window.alert(t('session.schedule_conflicts'))
      } else {
        window.alert(t('session.schedule_no_conflicts'))
      }
    }

    const share = async () => {
      if (favoriteSessions.value.length === 0) {
        window.alert(t('session.share_no_favorites'))
        return
      }

      const title = t('session.share_title', { year: import.meta.env.VITE_YEAR })
      const url = `${window.location.origin}${router.resolve({ query: { filter: favoriteSessions.value.join('') } }).href}`
      try {
        await window.navigator.share({ title, url })
      } catch {
        await window.navigator.clipboard.writeText(`${title}\n${url}`)
        window.alert(t('session.share_copied'))
      }
    }

    const hasFilters = computed(() => Object.keys(route.query).length > 0)
    const clearFilters = () => {
      router.push({ query: {} })
    }

    return {
      active,
      roomValue,
      filterOptions,
      filterValue,
      locale: locale as ComputedRef<Locale>,
      changeFilterValue,
      t,
      isFilterCollection,
      showFavorites,
      close,
      share,
      hasFilters,
      clearFilters,
      checkMySchedule
    }
  }
})

</script>
