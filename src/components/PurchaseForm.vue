<template>
  <div class="purchase-form">
    <form action="#">
      <div class="form-row">
        <div class="form-row__item">
          <input type="number" id="price" ref="price" @input="onPriceInput" placeholder="Цена">
          <label for="price">Цена: {{ form.price }}</label>
        </div>
        <div class="form-row__item">
          <input type="number" id="qty" ref="qty" @input="onQtyInput" placeholder="Кол-во">
          <label for="qty">Количество: {{ form.qty }}</label>
        </div>
        <div class="form-row__item">
          <input type="number" id="amount" ref="amount" @input="onAmountInput" placeholder="Сумма">
          <label for="amount">Сумма: {{ form.amount }}</label>
        </div>
        <div class="form-row__item">
          <button id="submitBtn" ref="submitBtn" @click="onSubmit" :disabled="loading || !isFormValid">Отправить</button>
          <pre class="logs">{{ storageForm }}</pre>
        </div>
      </div>

    </form>

    <!-- DIV-9  -->
    <div>
      <pre class="logs">{{ reversedLogs }}</pre>
    </div>
  </div>
</template>

<script>
import api from "../api"
import store from "../store"
const timeouts = {
  qty: 0,
  amount: 0,
  price: 0
}
export default {
  name: 'PurchaseForm',
  props: ['storeMode'],
  data() {
    return {
      loading: false,
      form: {
        nonce: 0,
        price: '',
        qty: '',
        amount: ''
      },
      logs: [],
      calculator: {
        qty: () => {
          if (+this.form.price === 0) {
            alert('Прайс не может быть 0')
            return
          }
          const val = (this.form.amount / this.form.price).toFixed(2)
          this.form.qty = val
          this.$refs.qty.value = val
        },
        price: () => {
          if (+this.form.qty === 0) {
            alert('Кол-во не может быть 0')
            return
          }
          const val = (this.form.amount / this.form.qty).toFixed(2)
          this.form.price = val
          this.$refs.price.value = val
        },
        amount: () => {
          const val = (this.form.qty * this.form.price).toFixed(2)
          this.form.amount = (this.form.qty * this.form.price).toFixed(2)
          this.$refs.amount.value = val
        }
      },
      storageForm: {
        nonce: 0,
        price: '',
        qty: '',
        amount: ''
      },
      formTypes: ['qty', 'amount', 'price']
    }
  },
  computed: {
    // Проверка что все поля заполнены 
    isFormValid() {
      return this.form.price && this.form.qty && this.form.amount
    },
    reversedLogs() {
      // Можно использовать toReversed, но я переживаю о совместимости браузера
      return [...this.logs].reverse()
    }
  },
  created() {
    this.loadStorage()
    // Слушаем событие localstorage изменений
    window.addEventListener('storage', this.loadStorage)
  },
  beforeDestroy() {
    // Убираем слушатель перед уничтожением компонента
    window.removeEventListener('storage', this.loadStorage)
  },

  methods: {
    doAfterDelay: (type, cb) => {
      clearTimeout(timeouts[type])
      timeouts[type] = setTimeout(cb, 300)
    },
    loadStorage() {
      this.storageForm = store[this.storeMode].getForm()
    },
    async onSubmit() {
      try {
        this.loading = true
        this.form.nonce++
        this.addLog('localStore get before request', store[this.storeMode].getForm())
        this.addLog('submit clicked', this.form)
        const response = await api.create(this.form)
        store[this.storeMode].setForm(this.form)
        this.addLog('localStore get after request', store[this.storeMode].getForm())
        this.addLog('response received', response)
        alert('Успешно сохранено')
      } catch (error) {
        this.addLog('error received', JSON.parse(error.message))
        alert('Ошибка сервера')
      } finally {
        this.loading = false
      }
    },
    addLog(type, data) {
      this.logs.push({
        type, data: typeof data === 'string' ? data : { ...data }
      })
    },
    updateFirstField(editingType) {
      if (!this.isFormValid) return
      const firstFindedLogs = this.logs.find(log => this.formTypes.includes(log.type) && log.type !== editingType)
      this.calculator[firstFindedLogs.type]()
    },
    onAmountInput(e) {
      this.doAfterDelay('amount', () => {
        this.form.amount = e.target.value
        this.onAmountChange()
      })
    },
    onPriceInput(e) {
      this.doAfterDelay('price', () => {
        this.form.price = e.target.value
        this.onPriceChange()
      })
    },
    onQtyInput(e) {
      this.doAfterDelay('qty', () => {
        this.form.qty = e.target.value
        this.onQtyChange()
      })
    },
    onPriceChange() {
      this.addLog('price', this.form.price)
      this.updateFirstField('price')
    },
    onQtyChange() {
      this.addLog('qty', this.form.qty)
      this.updateFirstField('qty')
    },
    onAmountChange() {
      this.addLog('amount', this.form.amount)
      this.updateFirstField('amount')
    }
  }
}
</script>

<!-- Ограничение css скопа на этот файл -->
<style scoped>
.store-mode {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row__item label {
  display: block;
  text-align: left;
}

.form-row__item input {
  margin-bottom: 5px;
}

.logs {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  white-space: pre-wrap;
  text-align: left;
  max-height: 500px;
  overflow: auto;
}
</style>
