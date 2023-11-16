import { useQuasar } from "quasar"
import { api, instance } from "src/boot/axios";
import { useAppStore } from "src/stores/app";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default function useApp () {
  const { localStorage, notify, dialog } = useQuasar()
  const { t } = useI18n()
  const router = useRouter()
  const appStore = useAppStore()
  const preserveUser = ({ user, token }) => {
    localStorage.set("token", token);
    appStore.setUser(user)
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
          appStore.setUser(null)
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
  const orderStatusToText = (status) => {
    switch (status) {
      case 1:
        return "pending";
      case 2:
        return "paid";
      case 3:
        return "confirmedPaid";
      case 4:
        return "expired";
      case 5:
        return "canceled";
      default:
        return ""
    }
  };
  return { preserveUser, logout, orderStatusToText }
}
