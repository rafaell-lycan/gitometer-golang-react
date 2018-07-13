class Storage {
  get(key) {
    const data = localStorage[key]
    return data ? JSON.parse(data) : data
  }

  set(key, data) {
    localStorage[key] = JSON.stringify(data)
  }
}

export default new Storage()
