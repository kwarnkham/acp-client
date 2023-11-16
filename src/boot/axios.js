import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Loading, LocalStorage, Notify } from 'quasar';
import { useAppStore } from 'src/stores/app';

const instance = axios.create({ baseURL: process.env.API_URL + '/api/' })
instance.defaults.headers.common['Accept'] = 'application/json';
const api = ({ method, url, data, showLoading = false, asForm = false }) => {
  if (showLoading) Loading.show()
  return new Promise((resolve, reject) => {
    const options = {
      url,
      data,
      method
    }
    if (asForm) options.headers = {
      "Content-Type": "multipart/form-data",
    }
    if (options.method.toUpperCase() == 'GET')
      options.params = options.data

    instance(options).then(response => {
      resolve(response)
    }).catch(e => {
      Notify.create({
        message: e.response?.data?.message || e.message,
        type: "negative"
      })
      reject(e)
    }).finally(() => {
      if (showLoading) Loading.hide()
    })
  })
}

export default boot(async ({ app, router, store }) => {
  const appStore = useAppStore(store)
  const token = LocalStorage.getItem("token");
  if (token) {
    instance.defaults.headers.common['Authorization'] = "Bearer " + token;

    try {
      const response = await instance({
        method: "GET",
        url: "user",
      })
      appStore.setUser(response.data.user)
    } catch (error) {
      LocalStorage.remove('token')
      instance.defaults.headers.common['Authorization'] = undefined;
      router.replace({
        name: "login"
      })
    }

  }

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = instance
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, instance }
