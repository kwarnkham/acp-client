<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-pa-xs q-gutter-y-sm">
      <div class="text-center text-h6">{{ $t("login") }}</div>
      <q-input
        v-model="name"
        required
        :label="$t('name')"
        autofocus
        outlined
        autocomplete="username"
      />
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
      <q-separator spaced />
      <div class="text-center">
        <FacebookLoginButton style="width: 300px" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import FacebookLoginButton from "src/components/FacebookLoginButton.vue";

const name = ref("");
const password = ref("");
const showPasword = ref(false);

const submit = () => {
  console.log(name.value, password.value);
};
</script>
