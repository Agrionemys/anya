<template>
  <div class="grid items-center grid-cols-2 gap-4 my-24 text-primary">
    <nuxt-link :to="button.path" v-for="button of buttons" class="flex flex-row col-span-1 gap-2 text-2xl normal-case btn btn-outline btn-lg"><component :is="button.icon" />{{button.name}}</nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { CalendarStatsIcon, CheckIcon, BarcodeIcon, TruckIcon, LogoutIcon, LoginIcon, UsersIcon } from "vue-tabler-icons";

const buttons = [
  {
    name: 'Отметится о приходе',
    icon: LoginIcon,
    path: '/'
  },
  {
    name: 'Отметится об уходе',
    icon: LogoutIcon,
    path: '/'
  },
  {
    name: 'Принять поставку',
    icon: TruckIcon,
    path: '/'
  },
  {
    name: 'Принять товар на склад',
    icon: BarcodeIcon,
    path: '/scan'
  },
  {
    name: 'Состояние склада',
    icon: CheckIcon,
    path: '/status'
  },
  {
    name: 'Курьерские доставки',
    icon: CalendarStatsIcon,
    path: '/'
  },
]

definePageMeta({
  middleware: ['with-auth'],
  layout: 'panel'
})
</script>
