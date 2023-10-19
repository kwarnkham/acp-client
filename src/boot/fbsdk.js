import { boot } from 'quasar/wrappers'
import { useAppStore } from 'src/stores/app';

export default boot(({ store }) => {
  const appStore = useAppStore(store)
  window.fbAsyncInit = function () {
    FB.init({
      appId: process.env.FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v15.0',
    });

    FB.AppEvents.logPageView();
    FB.getLoginStatus(function (response) {
      appStore.setFbLoginStatus(response)
    });
  };

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
})
