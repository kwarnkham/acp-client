<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-pa-xs q-gutter-y-sm">
      <div class="text-center text-h6">{{ $t("login") }}</div>
      <q-input
        v-model="name"
        required
        :label="$t(usernameLogin ? 'name' : 'phoneNumber')"
        autofocus
        outlined
        autocomplete="username"
        :type="usernameLogin ? 'text' : 'tel'"
      >
        <template v-slot:append>
          <q-btn
            :icon="usernameLogin ? 'phone' : 'person'"
            @click="usernameLogin = !usernameLogin"
            class="text-green"
          />
        </template>
      </q-input>
      <q-input
        v-model="password"
        required
        :label="$t('password')"
        outlined
        :type="showPasword ? 'text' : 'password'"
        autocomplete="current-password"
      >
        <template v-slot:append>
          <q-btn
            color="primary"
            flat
            dense
            :icon="showPasword ? 'visibility' : 'visibility_off'"
            @click="showPasword = !showPasword"
          />
        </template>
      </q-input>
      <div class="text-right">
        <q-btn icon="login" color="primary" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useRoute, useRouter } from "vue-router";
import useApp from "src/composables/app";

const name = ref("");
const password = ref("");
const showPasword = ref(false);
const router = useRouter();
const route = useRoute();
const { preserveUser } = useApp();
const usernameLogin = ref(false);

const submit = () => {
  api({
    method: "POST",
    url: "login",
    data: {
      name: name.value,
      password: password.value,
    },
  }).then(({ data }) => {
    preserveUser(data);
    try {
      router.replace(JSON.parse(atob(route.query.redirect)));
    } catch (error) {
      router.replace({
        name: "index",
      });
    }
  });
};
</script>
