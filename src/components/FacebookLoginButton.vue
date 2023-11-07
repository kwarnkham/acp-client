<template>
  <q-btn
    icon="facebook"
    @click="login"
    color="primary"
    v-if="appStore.getFbLoginStatus?.status != 'connected'"
  />
  <q-btn icon="logout" @click="logout" v-else />
</template>

<script setup>
import useFacebook from "src/composables/facebook";
import { useAppStore } from "src/stores/app";

const { login, logout } = useFacebook();
const appStore = useAppStore();
</script>
