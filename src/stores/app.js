import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    fbLoginStatus: null,
    user: null
  }),

  getters: {
    getFbLoginStatus (state) {
      return state.fbLoginStatus
    },
    getUser (state) {
      return state.user
    },
  },

  actions: {
    setFbLoginStatus (payload) {
      this.fbLoginStatus = payload
    },
    setUser (payload) {
      this.user = payload
    }
  }
})
