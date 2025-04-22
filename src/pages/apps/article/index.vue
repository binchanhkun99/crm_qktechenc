<template>
  <div style="padding: 20px">
    <!-- FORM THÊM BÀI VIẾT -->
    <a-form :model="formState" layout="vertical" @submit.prevent="handleSubmit">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="Tiêu đề">
            <a-input v-model:value="formState.title" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Ngày">
            <a-input v-model:value="formState.day" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Tháng">
            <a-input v-model:value="formState.month" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="Tác giả">
            <a-input v-model:value="formState.author" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
        <a-form-item label="Ảnh bài viết">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :custom-request="customUpload"
          >
            <img v-if="formState.image" :src="formState.image" alt="ImgArticle" style="width: 100%" />
            <div v-else>
              <PlusOutlined />
              <div style="margin-top: 8px">Tải ảnh</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-col>
        <a-col :span="12">
          <a-form-item label="Trích đoạn">
            <a-input v-model:value="formState.exceprt" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Nội dung">
            <a-textarea v-model:value="formState.content" rows="4" />
          </a-form-item>
        </a-col>
      </a-row>
      <VBtn color="primary" type="primary" html-type="submit">
        Thêm bài viết
      </VBtn>
    </a-form>

    <br /><br />

    <!-- BẢNG BÀI VIẾT -->
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1500, y: 300 }"
      row-key="key"
    />

    <!-- MODAL CHỈNH SỬA -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="📝 Chỉnh sửa bài viết"
      :ok-text="'💾 Lưu lại'"
      :cancel-text="'❌ Huỷ bỏ'"
      @ok="handleUpdateArticle"
      @cancel="resetEditForm"
      width="80%"
    >
      <a-row :gutter="24">
        <!-- MONTH và IMAGE dùng chung -->
        <a-col :span="24">
          <a-form layout="vertical">
            <a-row :gutter="12">
              <a-col :span="6">
                <a-form-item label="Ngày">
                  <a-input v-model:value="editForm.day" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Tháng">
                  <a-input v-model:value="editForm.month" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Tác giả">
                  <a-input v-model:value="editForm.author" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Ảnh tin tức">
                  <a-upload
                    list-type="picture-card"
                    :show-upload-list="false"
                    :custom-request="editUpload"
                  >
                    <img v-if="editForm.image" :src="editForm.image" alt="avatar" style="width: 100%" />
                    <div v-else>
                      <PlusOutlined />
                      <div style="margin-top: 8px">Tải ảnh</div>
                    </div>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>

        <!-- Các ngôn ngữ -->
        <a-col :span="12">
          <h3>🇻🇳 Bản Tiếng Việt</h3>
          <a-form layout="vertical">
            <a-form-item label="Tiêu đề tiếng Việt">
              <a-input v-model:value="editForm.title" />
            </a-form-item>
            <a-form-item label="Trích đoạn tiếng Việt">
              <a-input v-model:value="editForm.exceprt" />
            </a-form-item>
            <a-form-item label="Nội dung tiếng Việt">
              <a-textarea rows="5" v-model:value="editForm.content" />
            </a-form-item>
          </a-form>
        </a-col>

        <a-col :span="12">
          <h3>🇺🇸 English Version</h3>
          <a-form layout="vertical">
            <a-form-item label="Tiêu đề tiếng Anh">
              <a-input v-model:value="editForm.title_en" />
            </a-form-item>
            <a-form-item label="Trích đoạn tiếng Anh">
              <a-input v-model:value="editForm.exceprt_en" />
            </a-form-item>
            <a-form-item label="Nội dung tiếng Anh">
              <a-textarea rows="5" v-model:value="editForm.content_en" />
            </a-form-item>
          </a-form>
        </a-col>

        <a-col :span="12">
          <h3>zh 中文版本</h3>
          <a-form layout="vertical">
            <a-form-item label="Tiêu đề tiếng Trung">
              <a-input v-model:value="editForm.title_zh" />
            </a-form-item>
            <a-form-item label="Trích đoạn tiếng Trung">
              <a-input v-model:value="editForm.exceprt_zh" />
            </a-form-item>
            <a-form-item label="Nội dung tiếng Trung">
              <a-textarea rows="5" v-model:value="editForm.content_zh" />
            </a-form-item>
          </a-form>
        </a-col>

        <a-col :span="12">
          <h3>km ខ្មែរ</h3>
          <a-form layout="vertical">
            <a-form-item label="Tiêu đề tiếng Campuchia">
              <a-input v-model:value="editForm.title_km" />
            </a-form-item>
            <a-form-item label="Trích đoạn tiếng Campuchia">
              <a-input v-model:value="editForm.exceprt_km" />
            </a-form-item>
            <a-form-item label="Nội dung tiếng Campuchia">
              <a-textarea rows="5" v-model:value="editForm.content_km" />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import axios from 'axios'
import { h, onMounted, ref } from 'vue'
import { VBtn } from 'vuetify/components'

interface DataItem {
  key: string
  title: string
  day: string
  month: string
  author: string
  image: string
  exceprt: string
  content: string
  title_en?: string
  exceprt_en?: string
  content_en?: string
  title_zh?: string
  exceprt_zh?: string
  content_zh?: string
  title_km?: string
  exceprt_km?: string
  content_km?: string
}

const data = ref<DataItem[]>([])
const isEditModalVisible = ref(false)

const formState = ref<Omit<DataItem, 'key'>>({
  title: '',
  day: '',
  month: '',
  author:'',
  image: '',
  exceprt: '',
  content: ''
})

const editForm = ref<DataItem>({
  key: '',
  title: '',
  day: '',
  month: '',
  author:'',
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

const columns: TableColumnsType = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 150 },
  { title: 'Ngày', dataIndex: 'day', key: 'day', width: 150 },
  { title: 'Tháng', dataIndex: 'month', key: 'month', width: 150 },
  { title: 'Tác giả', dataIndex: 'author', key: 'author', width: 150 },
  { title: 'Ảnh', dataIndex: 'image', key: 'image', width: 150 },
  { title: 'Trích đoạn', dataIndex: 'exceprt', key: 'exceprt', width: 150 },
  { title: 'Nội dung', dataIndex: 'content', key: 'content', width: 200 },
  {
    title: 'Hành động',
    key: 'action',
    customRender: ({ record }: any) => ({
      children: [
        h(
          VBtn,
          {
            color: 'success',
            onClick: () => openEditModal(record),
            class: 'mr-2'
          },
          { default: () => '✏️ Chỉnh sửa' }
        ),
        h(
          VBtn,
          {
            color: 'error',
            onClick: () => deleteArticle(record.key)
          },
          { default: () => '🗑️ Xoá' }
        )
      ]
    })
  }
]

const customUpload = async (options: any) => {
  const file = options.file
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { key: 'b9ef28752f76f8e84cdf098ba7a881f9' }
    })
    formState.value.image = response.data.data.url
    options.onSuccess(response.data, file)
  } catch (error) {
    console.error('Upload error:', error)
    options.onError(error)
  }
}

const editUpload = async (options: any) => {
  const file = options.file
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { key: 'b9ef28752f76f8e84cdf098ba7a881f9' }
    })
    editForm.value.image = response.data.data.url
    options.onSuccess(response.data, file)
  } catch (error) {
    console.error('Upload error:', error)
    options.onError(error)
  }
}

const handleSubmit = () => {
  data.value.push({
    key: Date.now().toString(),
    ...formState.value
  })
  formState.value = {
    title: '',
    day: '',
    month: '',
    author:'',
    image: '',
    exceprt: '',
    content: ''
  }
}

const openEditModal = (record: DataItem) => {
  editForm.value = { ...record }
  isEditModalVisible.value = true
}

const resetEditForm = () => {
  isEditModalVisible.value = false
  editForm.value = {
    key: '',
    title: '',
    day: '',
    month: '',
    author:'',
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

const deleteArticle = (key: string) => {
  data.value = data.value.filter(item => item.key !== key)
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/posts')
    data.value = response.data.map((item: any, index: number) => ({
      key: item.id?.toString() || index.toString(),
      ...item
    }))
  } catch (error) {
    console.error('Lỗi khi load danh sách:', error)
  }
})
</script>
