export default defineNuxtRouteMiddleware(async (to, from) => {
    const cookie = useCookie<any>('auth');
    if (!cookie.value) return navigateTo('/login')

    const account = cookie.value;
    const res: any = await useFetch(`/api/user/login`, {
      method: 'post',
      body: {
        Login: account.Login,
        Parol: account.Parol
      }
    })

    if (!res.data.value || res.error.value) {
      cookie.value = null
      return navigateTo('/login')
    }

    if (account.Login != res.data.value.Login || account.Parol != res.data.value.Parol) {
      cookie.value = null
      return navigateTo('/login')
    }
})
