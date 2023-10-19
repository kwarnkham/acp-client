import { useQuasar } from "quasar";
import { useAppStore } from "src/stores/app";

export default function useFacebook () {
  const appStore = useAppStore();
  const { loading } = useQuasar();

  const login = () => {
    if (appStore.getFbLoginStatus.status != "connected") {
      FB.login(
        (response) => {
          appStore.setFbLoginStatus(response);
          FB.api(
            "me?fields=id,name,email&access_token=" +
            response.authResponse.accessToken,
            (_) => {
              console.log(_);
            }
          );
        },
        { scope: "public_profile,email" }
      );
    }
  };

  const logout = () => {
    loading.show();
    FB.logout((response) => {
      appStore.setFbLoginStatus(response);
      loading.hide();
    });
  };

  return { login, logout }
}
