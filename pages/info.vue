<template>
  <div class="flex flex-col items-center justify-center w-full gap-2">
    <div class="flex flex-col w-full gap-4 m-auto">
      <div class="shadow-xl card bg-base-100">
        <div class="card-body">
          <form class="flex flex-row items-center w-full gap-2" @submit.prevent="submit">
            <div class="w-full form-control">
              <input v-model="state.search" type="text" required placeholder="Введите баркод товара..."
                class="w-full input input-bordered" />
            </div>
            <div class="justify-start card-actions">
              <button type="submit" class="btn btn-primary btn-md"><SearchIcon /></button>
            </div>
          </form>
          <div v-if="!state.error && state.item" class="grid grid-cols-3 grid-rows-3 stats">
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Баркод</div>
              <div class="stat-value">{{state.item.Barcode}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Наименование товара</div>
              <div class="stat-value">{{state.item.Naimenovanie}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Артикул</div>
              <div class="stat-value">{{state.item.Artikyl}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Марка товара</div>
              <div class="stat-value">{{state.item.Marka_Tovara}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Дата поступления</div>
              <div class="stat-value">{{format(new Date(state.item.Data_postuplenia_na_sklad), "dd MMMM yyyy", {locale: ru})}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Цена</div>
              <div class="stat-value">{{state.item.Price}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Поставщик</div>
              <div class="stat-value">{{state.item.Postavchik.INN}}</div>
              <div class="stat-desc">{{state.item.Postavchik.Naimenovanie}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Работник</div>
              <div class="stat-value">№{{state.item.Rabotnik.id_Rabotnika}}</div>
              <div class="stat-desc">{{state.item.Rabotnik.Familia}} {{state.item.Rabotnik.Name}} {{state.item.Rabotnik.Otchestvo}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="state.error"
        class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-error">
        <SearchIcon class="flex-shrink-0" />
        <span class="w-auto">Не удалось найти товар с данным баркодом</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SearchIcon } from "vue-tabler-icons";
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru/index.js'

definePageMeta({
  middleware: ['with-auth'],
  layout: 'panel'
})

const state = reactive({ search: null, item: null, error: false })

const submit = async () => {
  state.error = false;
  const { data, pending, error, refresh } = await useFetch(
    `/api/tovar/${state.search}`,
  )
  if(error.value || !data.value) return state.error = true;
  state.item = data.value
}
</script>
