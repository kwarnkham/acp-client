import { useQuasar } from "quasar"
import { api, instance } from "src/boot/axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default function useApp () {
  const { localStorage, notify, dialog } = useQuasar()
  const { t } = useI18n()
  const router = useRouter()
  const preserveUser = ({ user, token }) => {
    localStorage.set("token", token);
    localStorage.set("user", user);
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;

  }

  const logout = ({ force = false } = {}) => {
    return new Promise((resolve, reject) => {
      const apiLogout = () => {
        api({
          method: "POST",
          url: "logout",
        }).finally(() => {
          localStorage.remove("token");
          localStorage.remove("user");
          instance.defaults.headers.common["Authorization"] = undefined;
          notify({
            message: t("loggedOut"),
            type: "info",
          });
          router.replace({
            name: "login",
          });
          resolve()
        });
      }

      if (force) apiLogout()
      else
        dialog({
          title: t("confirm"),
          message: t("doYouWantToLogOut"),
          noBackdropDismiss: true,
          cancel: true,
        }).onOk(() => {
          apiLogout()
        });
    })
  };
  return { preserveUser, logout }
}
