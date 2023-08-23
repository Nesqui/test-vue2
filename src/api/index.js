const api = {
  create(dto) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dto.amount % 2 === 0 ? resolve({ success: true }) : reject(new Error(JSON.stringify({ success: false })))
      }, 1000)
    })
  }
}

export default api
