// localStorage
const storage = window.localStorage

export default {
  save(name: string, value: any) {
    storage.setItem(name, JSON.stringify(value))
  },

  get(name: string) {
    return storage.getItem(name) || undefined
  },

  remove(name: string) {
    storage.removeItem(name)
  }
}
