<template>
  <div class="flex flex-col items-center justify-center w-full h-screen gap-2">
    <div class="flex flex-col gap-4 m-auto min-w-[612px]">
      <h1 class="font-bold text-center text-white text-[4em] drop-shadow-xl shadow-zinc-800/80 mb-6">С возвращением!
      </h1>
      <div class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-info">
        <UsersIcon class="flex-shrink-0" />
        <span class="w-auto">Для входа в систему авторизуйтесь.</span>
      </div>
      <div class="shadow-xl card bg-base-100">
        <div class="card-body">
          <form @submit.prevent="submit">
            <div class="w-full form-control">
              <label class="label">
                <span class="font-bold label-text">Введите логин</span>
              </label>
              <input v-model="state.Login" type="text" required placeholder="alex"
                class="w-full input input-bordered" />
            </div>
            <div class="w-full form-control">
              <label class="label">
                <span class="font-bold label-text">Пароль</span>
              </label>
              <input v-model="state.Parol" type="password" required class="w-full input input-bordered" />
            </div>
            <div class="justify-start card-actions">
              <button type="submit" class="mt-4 rounded-full btn btn-md">Войти</button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="state.error"
        class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-error">
        <UsersIcon class="flex-shrink-0" />
        <span class="w-auto">{{ state.error }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UsersIcon } from "vue-tabler-icons";

definePageMeta({
  middleware: ['without-auth']
})

const cookie: any = useCookie('auth')
const router = useRouter();
const state = reactive({ Login: null, Parol: null, error: null })

const submit = async () => {
  state.error = null

  const res = await useFetch(`/api/user/login`, {
    method: 'post',
    body: {
      Login: state.Login,
      Parol: state.Parol
    }
  })

  console.log(res)
  if (res.error.value) return state.error = "Ошибка при выполнении запроса, попробуйте еще раз!"
  if (!res.data.value) return state.error = "Введен неверный пароль или логин! Проверьте введенные данные и попробуйте снова!"

  cookie.value = { Login: state.Login, Parol: state.Parol }
  router.push('/')
}
</script>
