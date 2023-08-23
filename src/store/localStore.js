const localStore = {
  getForm: () => JSON.parse(window.localStorage.getItem('form')),
  setForm: (dto) => {
    window.localStorage.setItem('form', JSON.stringify(dto))
    const event = new StorageEvent('storage')
    window.dispatchEvent(event)
  }
}

export default localStore
