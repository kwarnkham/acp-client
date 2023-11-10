<template>
  <q-page>
    <q-list bordered>
      <q-item clickable v-ripple @click.stop="doLogout">
        <q-item-section>{{ $t("logout") }}</q-item-section>
        <q-item-section avatar>
          <FacebookAuthButton v-if="isLoggedIn()" ref="fbBtn" flat />
          <q-btn icon="logout" flat v-else />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";
import FacebookAuthButton from "src/components/FacebookAuthButton.vue";
import useFacebook from "src/composables/facebook";
import { ref } from "vue";

const { logout } = useApp();
const { isLoggedIn } = useFacebook();
const fbBtn = ref(null);
const doLogout = () => {
  if (isLoggedIn()) fbBtn.value.facebookBtnAction();
  else logout();
};
</script>
