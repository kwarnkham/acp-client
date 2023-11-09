<template>
  <q-btn icon="facebook" @click="login" color="primary" v-if="!isLoggedIn()" />
  <q-btn icon="logout" @click="fbLogout" v-else />
</template>

<script setup>
import useFacebook from "src/composables/facebook";

const { login, fbLogout, isLoggedIn } = useFacebook();
</script>
