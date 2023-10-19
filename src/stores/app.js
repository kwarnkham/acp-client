import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    fbLoginStatus: null
  }),

  getters: {
    getFbLoginStatus (state) {
      return state.fbLoginStatus
    }
  },

  actions: {
    setFbLoginStatus (payload) {
      this.fbLoginStatus = payload
    }
  }
})
