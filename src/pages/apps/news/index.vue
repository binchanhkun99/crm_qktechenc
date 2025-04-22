<template>
  <div>
    <VRow><ThongKeUser /></VRow>

    <div style="padding: 20px">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Tháng</th>
            <th>Ảnh</th>
            <th>Trích đoạn</th>
            <th>Nội dung</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in data" :key="item.key">
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.month }}</td>
            <td><img :src="item.image" alt="ảnh" style="width: 100px" /></td>
            <td>{{ item.exceprt }}</td>
            <td>
  <div class="line-clamp">
    {{ item.content }}
  </div>
</td>
            <td class="text-center">
              <VBtn color="success" @click="openEditModal(item)">
                <VIcon icon="bxs-edit" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <tfoot v-show="!data.length">
          <tr>
            <td colspan="7" class="text-center text-body-1">Không có dữ liệu</td>
          </tr>
        </tfoot>
      </VTable>

      <!-- Modal chỉnh sửa -->
      <a-modal
        v-model:open="isEditModalVisible"
        title="📝 Chỉnh sửa bài viết"
        :ok-text="'💾 Lưu lại'"
        :cancel-text="'❌ Huỷ bỏ'"
        @ok="handleUpdateArticle"
        @cancel="resetEditForm"
        width="80%"
      >
        <a-form layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Tiêu đề (VN)">
                <a-input v-model:value="editForm.title" />
              </a-form-item>
              <a-form-item label="Trích đoạn (VN)">
                <a-input v-model:value="editForm.exceprt" />
              </a-form-item>
              <a-form-item label="Nội dung (VN)">
                <a-textarea v-model:value="editForm.content" rows="4" />
              </a-form-item>
              <a-form-item label="Tháng">
                <a-input v-model:value="editForm.month" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Tiêu đề (Tiếng Anh)">
                <a-input v-model:value="editForm.title_en" />
              </a-form-item>
              <a-form-item label="Trích đoạn (Tiếng Anh)">
                <a-input v-model:value="editForm.exceprt_en" />
              </a-form-item>
              <a-form-item label="Nội dung (Tiếng Anh)">
                <a-textarea v-model:value="editForm.content_en" rows="4" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Tiêu đề (Trung Quốc)">
                <a-input v-model:value="editForm.title_zh" />
              </a-form-item>
              <a-form-item label="Trích đoạn (Trung Quốc)">
                <a-input v-model:value="editForm.exceprt_zh" />
              </a-form-item>
              <a-form-item label="Nội dung (Trung Quốc)">
                <a-textarea v-model:value="editForm.content_zh" rows="4" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Tiêu đề (Cambodi)">
                <a-input v-model:value="editForm.title_km" />
              </a-form-item>
              <a-form-item label="Trích đoạn (Cambodi)">
                <a-input v-model:value="editForm.exceprt_km" />
              </a-form-item>
              <a-form-item label="Nội dung (Cambodi)">
                <a-textarea v-model:value="editForm.content_km" rows="4" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="Ảnh đại diện">
            <a-upload
              name="image"
              :customRequest="editUpload"
              :showUploadList="false"
              accept="image/*"
            >
              <a-button icon="<PlusOutlined />">Upload ảnh</a-button>
            </a-upload>
            <div v-if="editForm.image" style="margin-top: 10px">
              <img :src="editForm.image" alt="Preview" style="max-width: 200px" />
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import ThongKeUser from "@/pages/components/thongke.vue"
import request from '@/utils/request'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const data = ref([])
const isEditModalVisible = ref(false)

const editForm = ref({
  key: '',
  title: '',
  month: '',
  image: '',
  exceprt: '',
  content: '',
  title_en: '',
  exceprt_en: '',
  content_en: '',
  title_zh: '',
  exceprt_zh: '',
  content_zh: '',
  title_km: '',
  exceprt_km: '',
  content_km: ''
})

const editUpload = async (options) => {
  const file = options.file
  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { key: 'b9ef28752f76f8e84cdf098ba7a881f9' }
    })
    editForm.value.image = res.data.data.url
    options.onSuccess(res.data, file)
  } catch (error) {
    console.error(error)
    options.onError(error)
  }
}

const openEditModal = (record) => {
  editForm.value = { ...record }
  isEditModalVisible.value = true
}

const resetEditForm = () => {
  isEditModalVisible.value = false
  editForm.value = {
    key: '',
    title: '',
    month: '',
    image: '',
    exceprt: '',
    content: '',
    title_en: '',
    exceprt_en: '',
    content_en: '',
    title_zh: '',
    exceprt_zh: '',
    content_zh: '',
    title_km: '',
    exceprt_km: '',
    content_km: ''
  }
}

const handleUpdateArticle = () => {
  const index = data.value.findIndex(item => item.key === editForm.value.key)
  if (index !== -1) {
    data.value[index] = { ...editForm.value }
  }
  resetEditForm()
}

onMounted(async () => {
  try {
    const response = await request.get('/news?lang=vi')
    data.value = response.data.map((item, index) => ({
      key: item.id?.toString() || index.toString(),
      ...item
    }))
  } catch (error) {
    console.error('Lỗi khi load bài viết:', error)
  }
})
</script>

<style lang="scss">
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Giới hạn 2 dòng */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}

</style>

