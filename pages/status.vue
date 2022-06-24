<template>
  <div class="flex flex-col items-center justify-center w-full gap-2">
    <div class="flex flex-col w-full gap-4 m-auto">
      <div class="shadow-xl card bg-base-100">
        <div class="card-body">
          <template v-if="state.skladList">
            <div
              v-for="(sklad, id) of state.skladList"
              class="flex flex-col gap-4 overflow-x-auto"
            >
              <h1 class="text-primary-500 text-2xl font-bold">Склад №{{ id }}</h1>
              <table v-if="sklad.length > 0" class="table w-full table-compact">
                <thead>
                  <tr>
                    <th>Ячейка</th>
                    <th>ФИО Клиента</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item of sklad">
                    <td>Ячейка №{{ item.id_Yacheiki }}</td>
                    <th>
                      {{ item.Pokupatel.Familia }}
                      {{ item.Pokupatel.Name }}
                      {{ item.Pokupatel.Otchestvo }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="state.error"
        class="flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-error"
      >
        <span class="w-auto">Не удалось получить информацию о складах</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["with-auth"],
  layout: "panel",
});

const state = reactive({ skladList: null, error: false });

state.error = false;
const { data, pending, error, refresh } = await useFetch(`/api/sklad`);

if (error.value || !data.value) state.error = true;
else state.skladList = data.value;
</script>
