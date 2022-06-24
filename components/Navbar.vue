<template>
  <nav class="flex flex-row items-center justify-center">
    <nuxt-link class="link" v-for="link of links" :to="link.path">{{ link.name }}</nuxt-link>
    <button class="link" @click.prevent="logout">Выйти</button>
  </nav>
</template>

<script setup>
const cookie = useCookie('auth');
const router = useRouter();

const links = [
  {
    name: 'Задания на день',
    path: '/'
  },
  {
    name: 'Поиск клиентов',
    path: '/lookup'
  },
  {
    name: 'Клиенты на примерке',
    path: '/dressing'
  },
  {
    name: 'Информация о товаре',
    path: '/info'
  },
  {
    name: 'Возврат товара',
    path: '/return'
  },
]

const logout = () => {
  cookie.value = null
  router.push('/login')
}
</script>

<style>
.link.router-link-active {
  @apply btn btn-outline;
}

.link {
  @apply btn btn-ghost;
}
</style>
