export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookie = useCookie<any>('auth');
  const account = cookie.value;

  const request = {
    login: 'anya',
    password: 'anya123'
  }

  if (account) return navigateTo('/')
})
