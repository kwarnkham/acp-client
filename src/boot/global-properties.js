import { boot } from 'quasar/wrappers'
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { api } from './axios';

const laravelEcho = new Echo({
  broadcaster: "pusher",
  key: process.env.PUSHER_APP_KEY,
  wsHost: process.env.PUSHER_HOST,
  wsPort: process.env.PUSHER_PORT,
  wssPort: process.env.PUSHER_PORT,
  forceTLS: process.env.PROD,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  cluster: "mt1",
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        api({
          method: "POST",
          url: "/broadcasting/auth",
          data: {
            socket_id: socketId,
            channel_name: channel.name
          }
        }).then(response => {
          callback(null, response.data);
        })
          .catch(error => {
            callback(error);
          });
      }
    };
  },
});

export default boot(async ({ app }) => {
  window.Pusher = Pusher;
  app.config.globalProperties.$ASSETS_URL = process.env.ASSETS_URL
  app.config.globalProperties.$laravelEcho = laravelEcho
})

export { laravelEcho }
