<template>
  <div class="flex flex-col items-center justify-center w-full gap-2">
    <div class="flex flex-col w-full gap-4 m-auto">
      <div class="shadow-xl card bg-base-100">
        <div class="card-body">
          <form class="flex flex-row items-center w-full gap-2" @submit.prevent="submit">
            <div class="w-full form-control">
              <input v-model="state.search" type="text" required placeholder="Введите код заказа или ФИО клиента"
                class="w-full input input-bordered" />
            </div>
            <div class="justify-start card-actions">
              <button type="submit" class="btn btn-primary btn-md"><SearchIcon /></button>
            </div>
          </form>
          <div class="overflow-x-auto">
            <table v-if="state.items && state.items.length > 0" class="table w-full table-compact">
              <thead>
                <tr>
                  <th>ФИО Клиента</th>
                  <th>Телефон</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of state.items">
                  <th>{{(item.Pokypatel) ? item.Pokypatel.Familia : item.Familia}} {{(item.Pokypatel) ? item.Pokypatel.Name : item.Name}} {{(item.Pokypatel) ? item.Pokypatel.Otchestvo : item.Otchestvo}}</th>
                  <td>{{(item.Pokypatel) ? item.Pokypatel.Telephone : item.Telephone}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="state.items && state.items.length == 0"
        class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-error">
        <SearchIcon class="flex-shrink-0" />
        <span class="w-auto">Не удалось найти клиентов, соответствующих запросу</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SearchIcon } from "vue-tabler-icons";

definePageMeta({
  middleware: ['with-auth'],
  layout: 'panel'
})

const state = reactive({ search: null, items: null })

const submit = async () => {
  const { data, pending, error, refresh } = await useFetch(
    `/api/lookup?search=${state.search}`,
  )
  state.items = data
}
</script>
