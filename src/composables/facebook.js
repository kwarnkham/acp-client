import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAppStore } from "src/stores/app";
import useApp from "./app";
import { useRouter } from "vue-router";

export default function useFacebook () {
  const appStore = useAppStore();
  const { preserveUser, logout } = useApp()
  const router = useRouter()
  const { loading } = useQuasar()

  const login = () => {
    loading.show()
    if (appStore.getFbLoginStatus.status != "connected") {
      FB.login(
        (response) => {
          appStore.setFbLoginStatus(response);
          FB.api(
            "me?fields=id,name,email&access_token=" +
            response.authResponse.accessToken,
            (data) => {
              api({
                method: "POST",
                url: "fb/login",
                data: {
                  fb_name: data.name,
                  fb_id: data.id,
                  fb_email: data.email
                }
              }).then(({ data }) => {
                preserveUser(data)
                router.replace({
                  name: "index",
                });
              }).finally(() => {
                loading.hide()
              })
            }
          );
        },
        { scope: "public_profile,email" }
      );
    } else {
      loading.hide()
    }
  };

  const fbLogout = () => {
    loading.show()
    FB.logout((response) => {
      appStore.setFbLoginStatus(response);
      logout({ force: true }).finally(() => {
        loading.hide()
      })
    });
  };

  const isLoggedIn = () => {
    return appStore.getFbLoginStatus?.authResponse !== null
  }

  return { login, fbLogout, isLoggedIn }
}
