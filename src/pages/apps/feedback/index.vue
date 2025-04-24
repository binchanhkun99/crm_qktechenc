<template>
  <div>
    <VRow><ThongKeUser /></VRow>

    <div style="padding: 20px">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Tên khách hàng</th>
            <th>Nội dung</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in data.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.title?.vi || 'Chưa có tiêu đề' }}</td>
            <td>
              <div class="line-clamp">
                {{ data.describe?.vi || 'Chưa có mô tả' }}
              </div>
            </td>
            <td>{{ item.name || 'Chưa có tên' }}</td>
            <td>
              <div class="line-clamp">
                {{ item.content?.vi || 'Chưa có nội dung' }}
              </div>
            </td>
            <td class="text-center">
              <VBtn color="success" @click="openEditModal(item, index)">
                <VIcon icon="bxs-edit" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <tfoot v-show="!data.items?.length">
          <tr>
            <td colspan="6" class="text-center text-body-1">Không có dữ liệu</td>
          </tr>
        </tfoot>
      </VTable>

      <!-- Modal chỉnh sửa -->
      <a-modal
        v-model:open="isEditModalVisible"
        title="📝 Chỉnh sửa phản hồi"
        :ok-text="'💾 Lưu lại'"
        :cancel-text="'❌ Huỷ bỏ'"
        @ok="handleUpdateFeedback"
        @cancel="resetEditForm"
        width="60%"
      >
        <a-form layout="vertical">
          <!-- Tên khách hàng -->
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Tên khách hàng">
                <a-input v-model:value="editForm.items[currentIndex].name" />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Hàng 1: Tiếng Việt và Tiếng Anh -->
          <a-row :gutter="16">
            <!-- Tiếng Việt -->
            <a-col :span="12">
              <h3 class="text-lg font-semibold mb-2">Tiếng Việt</h3>
              <a-form-item label="Tiêu đề (Tiếng Việt)">
                <a-input v-model:value="editForm.title.vi" />
              </a-form-item>
              <a-form-item label="Mô tả (Tiếng Việt)">
                <a-textarea v-model:value="editForm.describe.vi" rows="2" />
              </a-form-item>
              <a-form-item label="Nội dung (Tiếng Việt)">
                <a-textarea v-model:value="editForm.items[currentIndex].content.vi" rows="4" />
              </a-form-item>
            </a-col>
            <!-- Tiếng Anh -->
            <a-col :span="12">
              <h3 class="text-lg font-semibold mb-2">Tiếng Anh</h3>
              <a-form-item label="Tiêu đề (Tiếng Anh)">
                <a-input v-model:value="editForm.title.en" />
              </a-form-item>
              <a-form-item label="Mô tả (Tiếng Anh)">
                <a-textarea v-model:value="editForm.describe.en" rows="2" />
              </a-form-item>
              <a-form-item label="Nội dung (Tiếng Anh)">
                <a-textarea v-model:value="editForm.items[currentIndex].content.en" rows="4" />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Hàng 2: Tiếng Trung và Tiếng Khmer -->
          <a-row :gutter="16">
            <!-- Tiếng Trung -->
            <a-col :span="12">
              <h3 class="text-lg font-semibold mb-2">Tiếng Trung</h3>
              <a-form-item label="Tiêu đề (Tiếng Trung)">
                <a-input v-model:value="editForm.title.zh" />
              </a-form-item>
              <a-form-item label="Mô tả (Tiếng Trung)">
                <a-textarea v-model:value="editForm.describe.zh" rows="2" />
              </a-form-item>
              <a-form-item label="Nội dung (Tiếng Trung)">
                <a-textarea v-model:value="editForm.items[currentIndex].content.zh" rows="4" />
              </a-form-item>
            </a-col>
            <!-- Tiếng Khmer -->
            <a-col :span="12">
              <h3 class="text-lg font-semibold mb-2">Tiếng Khmer</h3>
              <a-form-item label="Tiêu đề (Tiếng Khmer)">
                <a-input v-model:value="editForm.title.km" />
              </a-form-item>
              <a-form-item label="Mô tả (Tiếng Khmer)">
                <a-textarea v-model:value="editForm.describe.km" rows="2" />
              </a-form-item>
              <a-form-item label="Nội dung (Tiếng Khmer)">
                <a-textarea v-model:value="editForm.items[currentIndex].content.km" rows="4" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import ThongKeUser from '@/pages/components/thongke.vue'
import request from '@/utils/request'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'

// Data states
const data = ref({
  title: { en: '', vi: '', zh: '', km: '' },
  describe: { en: '', vi: '', zh: '', km: '' },
  items: [
    { name: '', content: { en: '', vi: '', zh: '', km: '' } },
    { name: '', content: { en: '', vi: '', zh: '', km: '' } },
    { name: '', content: { en: '', vi: '', zh: '', km: '' } }
  ]
})
const isEditModalVisible = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const currentIndex = ref(0)

// Form structure
const editForm = ref({
  title: { en: '', vi: '', zh: '', km: '' },
  describe: { en: '', vi: '', zh: '', km: '' },
  items: [
    { name: '', content: { en: '', vi: '', zh: '', km: '' } },
    { name: '', content: { en: '', vi: '', zh: '', km: '' } },
    { name: '', content: { en: '', vi: '', zh: '', km: '' } }
  ]
})

// Fetch feedback data
const fetchFeedback = async () => {
  try {
    isLoading.value = true
    const response = await request.get('/feedback/admin')
    console.log('API Response:', response.data) 
    if (response.data) {
      data.value = {
        title: response.data.title || { en: '', vi: '', zh: '', km: '' },
        describe: response.data.describe || { en: '', vi: '', zh: '', km: '' },
        items: response.data.items && response.data.items.length === 3
          ? response.data.items.map(item => ({
              name: item.name || '',
              content: item.content || { en: '', vi: '', zh: '', km: '' }
            }))
          : [
              { name: '', content: { en: '', vi: '', zh: '', km: '' } },
              { name: '', content: { en: '', vi: '', zh: '', km: '' } },
              { name: '', content: { en: '', vi: '', zh: '', km: '' } }
            ]
      }
    }
  } catch (error) {
    console.error('Error fetching feedback:', error)
    message.error('Lỗi khi tải phản hồi')
  } finally {
    isLoading.value = false
  }
}

// Open edit modal
const openEditModal = (item, index) => {
  console.log('Opening modal for item:', item, 'at index:', index) // Debug
  editForm.value = {
    title: { ...data.value.title },
    describe: { ...data.value.describe },
    items: data.value.items.map(feedback => ({
      name: feedback.name,
      content: { ...feedback.content }
    }))
  }
  currentIndex.value = index
  isEditModalVisible.value = true
}

// Reset form
const resetEditForm = () => {
  editForm.value = {
    title: { en: '', vi: '', zh: '', km: '' },
    describe: { en: '', vi: '', zh: '', km: '' },
    items: [
      { name: '', content: { en: '', vi: '', zh: '', km: '' } },
      { name: '', content: { en: '', vi: '', zh: '', km: '' } },
      { name: '', content: { en: '', vi: '', zh: '', km: '' } }
    ]
  }
  isEditModalVisible.value = false
}

// Sanitize payload
const sanitizePayload = (payload) => {
  return {
    title: {
      en: payload.title.en || '',
      vi: payload.title.vi || '',
      zh: payload.title.zh || '',
      km: payload.title.km || ''
    },
    describe: {
      en: payload.describe.en || '',
      vi: payload.describe.vi || '',
      zh: payload.describe.zh || '',
      km: payload.describe.km || ''
    },
    items: payload.items.map(item => ({
      name: item.name || '',
      content: {
        en: item.content.en || '',
        vi: item.content.vi || '',
        zh: item.content.zh || '',
        km: item.content.km || ''
      }
    }))
  }
}

// Handle feedback update
const handleUpdateFeedback = async () => {
  try {
    isSubmitting.value = true
    const payload = sanitizePayload(editForm.value)
    console.log('Payload sent to API:', payload) // Debug payload
    await request.put('/feedback', payload)
    data.value = { ...payload }
    message.success('Cập nhật phản hồi thành công')
    resetEditForm()
  } catch (error) {
    console.error('Error updating feedback:', error)
    message.error(error.response?.data?.message || 'Lỗi khi cập nhật phản hồi')
  } finally {
    isSubmitting.value = false
  }
}

// Initial data fetch
onMounted(() => {
  fetchFeedback()
})
</script>

<style lang="scss">
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}
</style>