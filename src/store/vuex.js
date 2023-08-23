import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    form: {
      nonce: 0,
      price: '',
      qty: '',
      amount: ''
    }
  },
  mutations: {
    setForm(state, payload) {
      state.form = payload
    }
  },
  getters: {
    getForm: (state) => state.form
  }
})

export default {
  store,
  getForm: () => store.getters.getForm,
  setForm: (payload) => {
    store.commit('setForm', { ...payload })
    const event = new StorageEvent('storage')
    window.dispatchEvent(event)
  }
}
