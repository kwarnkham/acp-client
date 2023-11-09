<template>
  <q-page>
    <FacebookAuthButton v-if="isLoggedIn()" />
    <q-btn icon="logout" flat @click="logout" v-else />
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";
import FacebookAuthButton from "src/components/FacebookAuthButton.vue";
import useFacebook from "src/composables/facebook";

const { logout } = useApp();
const { isLoggedIn } = useFacebook();
</script>
