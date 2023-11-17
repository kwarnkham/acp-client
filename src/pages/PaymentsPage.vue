<template>
  <q-page padding v-if="appStore.getUser.is_admin">
    <q-list bordered>
      <q-item
        clickable
        v-ripple
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        :class="{ 'text-red': paymentMethod.status == 2 }"
      >
        <q-item-section>
          <q-item-label>{{ paymentMethod.name }}</q-item-label>
          <q-item-label>{{ paymentMethod.number }}</q-item-label>
          <q-item-label overline>{{ paymentMethod.account_name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            icon="block"
            @click.stop="toggle(paymentMethod.id)"
            v-if="paymentMethod.status == 1"
            color="negative"
          />
          <q-btn
            icon="check"
            @click.stop="toggle(paymentMethod.id)"
            v-if="paymentMethod.status == 2"
            color="positive"
          />
          <q-btn
            icon="more"
            class="q-mt-xs"
            @click.stop="
              $router.push({
                name: 'edit-payment',
                params: {
                  id: paymentMethod.id,
                },
              })
            "
            color="info"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="
          $router.push({
            name: 'create-payment',
          })
        "
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAppStore } from "src/stores/app";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const appStore = useAppStore();
const paymentMethods = ref([]);
const { dialog } = useQuasar();
const { t } = useI18n();

const toggle = (id) => {
  dialog({
    title: t("areYouSure"),
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `payment-methods/${id}/toggle`,
    }).then(({ data }) => {
      const index = paymentMethods.value.findIndex(
        (e) => e.id == data.payment_method.id
      );
      paymentMethods.value[index] = data.payment_method;
    });
  });
};

onMounted(() => {
  api({
    method: "get",
    url: "payment-methods",
  }).then(({ data }) => {
    paymentMethods.value = data.payment_methods;
  });
});
</script>
