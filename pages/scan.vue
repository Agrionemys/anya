<template>
  <div class="flex flex-col items-center justify-center w-full gap-2">
    <div class="flex flex-col w-full gap-4 m-auto">
      <div class="shadow-xl card bg-base-100">
        <div class="card-body">
          <form class="flex flex-row items-center w-full gap-2" @submit.prevent="submit">
            <div class="w-full form-control">
              <input v-model="state.barcode" type="text" required placeholder="Введите баркод товара..."
                class="w-full input input-bordered" />
            </div>
            <div class="justify-start card-actions">
              <button type="submit" class="btn btn-primary btn-md"><SearchIcon /></button>
            </div>
          </form>
          <template v-if="!state.error && state.result" class="">
            <div v-if="state.result.wasCreated"
              class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-success">
              <SearchIcon class="flex-shrink-0" />
              <span class="w-auto">Товар с баркодом №{{state.result.tovar.Barcode}} принят в ячейку!</span>
            </div>
            <div v-else
              class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-info">
              <SearchIcon class="flex-shrink-0" />
              <span class="w-auto">Товар с баркодом №{{state.result.tovar.Barcode}} уже был принят в ячейку!</span>
            </div>
          </template>
          <div v-if="!state.error && state.result" class="stats">
            <div class="stat">
              <div class="stat-title">№ ячейки</div>
              <div class="stat-value">{{state.result.yacheika.id_Yacheiki}}</div>
            </div>
            <div class="stat">
              <div class="stat-title">№ склада</div>
              <div class="stat-value">{{state.result.yacheika.id_Sklada}}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Покупатель</div>
              <div class="stat-value">{{state.result.yacheika.Pokupatel.Familia}} {{state.result.yacheika.Pokupatel.Name}} {{state.result.yacheika.Pokupatel.Otchestvo}}</div>
            </div>
          </div>
          <div v-if="!state.error && state.result" class="grid grid-cols-3 grid-rows-3 stats">
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Баркод</div>
              <div class="stat-value">{{state.result.tovar.Barcode}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Наименование товара</div>
              <div class="stat-value">{{state.result.tovar.Naimenovanie}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Артикул</div>
              <div class="stat-value">{{state.result.tovar.Artikyl}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Марка товара</div>
              <div class="stat-value">{{state.result.tovar.Marka_Tovara}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Дата поступления</div>
              <div class="stat-value">{{format(new Date(state.result.tovar.Data_postuplenia_na_sklad), "dd MMMM yyyy", {locale: ru})}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Цена</div>
              <div class="stat-value">{{state.result.tovar.Price}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Поставщик</div>
              <div class="stat-value">{{state.result.tovar.Postavchik.INN}}</div>
              <div class="stat-desc">{{state.result.tovar.Postavchik.Naimenovanie}}</div>
            </div>
            <div class="col-span-1 border-none stat">
              <div class="stat-title">Работник</div>
              <div class="stat-value">№{{state.result.tovar.Rabotnik.id_Rabotnika}}</div>
              <div class="stat-desc">{{state.result.tovar.Rabotnik.Familia}} {{state.result.tovar.Rabotnik.Name}} {{state.result.tovar.Rabotnik.Otchestvo}}</div>
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

const state = reactive({ barcode: null, result: null, error: false })

const submit = async () => {
  state.error = false;
  const { data, pending, error, refresh } = await useFetch(
    `/api/tovar/scan`, { method: 'post', body: {
      Barcode: state.barcode
    }}
  )
  if(error.value || !data.value) return state.error = true;
  state.result = data.value
}
</script>
