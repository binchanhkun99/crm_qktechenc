<script setup>
import { onMounted, ref } from "vue";
const dataThongKeUser = ref();
const apiKey = ref();
const user_count_last_7_days = ref();
const user_growth_percentage = ref();
const revenue_last_7_days = ref()
const revenue_growth_percentage = ref()


onMounted(() => {
});
</script>
<template>
  <VCol cols="12" sm="6" lg="3">
    <VCard>
      <VCardText class="d-flex justify-space-between">
        <div>
          <span>Người dùng đăng ký mới</span>
          <div class="d-flex align-center gap-2">
            <h6 class="text-h6">
              100
            </h6>
            <span
              :class="
                '100' > 0 ? 'text-success' : 'text-error'
              "
              class="text-sm"
              >(100%)</span
            >
          </div>
          <span class="text-sm">7 ngày gần nhất</span>
        </div>

        <VAvatar rounded variant="tonal" color="primary" icon="bx-user" />
      </VCardText>
    </VCard>
  </VCol>
  <VCol cols="12" sm="6" lg="3">
    <VCard>
      <VCardText class="d-flex justify-space-between">
        <div>
          <span>Doanh thu</span>
          <div class="d-flex align-center gap-2">
            <h6 class="text-h6">
              100
            </h6>
            <span
              :class="
                '100' > 0 ? 'text-success' : 'text-error'
              "
              class="text-sm"
              >(100%)</span
            >
          </div>
          <span class="text-sm">7 ngày gần nhất</span>
        </div>

        <VAvatar rounded variant="tonal" color="primary" icon="bx-wallet" />
      </VCardText>
    </VCard>
  </VCol>
</template>
<style lang="scss"></style>
