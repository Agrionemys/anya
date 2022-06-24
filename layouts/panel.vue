<template>
  <div class="flex flex-col w-full min-h-screen gap-4" id="panel">
    <h1 class="w-full font-bold text-[3em] my-6 text-center">DostaVista</h1>
    <Navbar />
    <div class="flex flex-col w-full max-w-screen-xl mx-auto">
      <slot />
    </div>
  </div>
</template>
