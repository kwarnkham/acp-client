<template>
  <q-form @submit.prevent="submit">
    <q-input :label="$t('name')" v-model="name" required autofocus />

    <q-input :label="$t('number')" v-model="number" />

    <q-input :label="$t('accountName')" v-model="accountName" />
    <FileInput :multiple="false" v-model="picture" />
    <div class="text-right q-mt-sm">
      <q-btn
        :label="paymentMethod ? $t('update') : $t('create')"
        no-caps
        type="submit"
      /></div
  ></q-form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import FileInput from "./FileInput.vue";
import useUtil from "src/composables/util";

const props = defineProps({
  paymentMethod: {
    type: Object,
    default: () => null,
  },
});

const name = ref(props.paymentMethod ? props.paymentMethod.name : "");
const number = ref(props.paymentMethod ? props.paymentMethod.number : "");
const accountName = ref(
  props.paymentMethod ? props.paymentMethod.account_name : ""
);
const router = useRouter();
const picture = ref(null);
const { buildForm } = useUtil();

const submit = () => {
  api({
    asForm: true,
    method: "POST",
    url: props.paymentMethod
      ? `payment-methods/${props.paymentMethod.id}`
      : "payment-methods",
    data: buildForm({
      name: name.value,
      number: number.value,
      account_name: accountName.value,
      picture: picture.value,
      _method: props.paymentMethod ? "PUT" : "POST",
    }),
  }).then(() => {
    router.push({
      name: "payments",
    });
  });
};
</script>
