<template>
  <div id="app">
    <div v-if="!storeMode" class="store-mode">
      <label for="select">С каким стором работать?</label>
      <select v-model="storeMode" id="select" name="select">
        <option value="local">localStorage</option>
        <option value="vuex" selected>Vuex</option>
      </select>
    </div>
    <PurchaseForm v-if="storeMode" :storeMode="storeMode" />
  </div>
</template>

<script>
import PurchaseForm from "./components/PurchaseForm.vue"
export default {
  name: 'App',
  components: { PurchaseForm },
  data: () => ({
    storeMode: ''
  })
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  display: flex;
  justify-content: center;
}
</style>
