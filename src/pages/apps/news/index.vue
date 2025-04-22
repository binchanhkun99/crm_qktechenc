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
            <td><img :src="item.imageLink" alt="ảnh" style="width: 100px" /></td>
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
    width="60%"
  >
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Tháng">
            <a-input v-model:value="editForm.month" />
          </a-form-item>
          
          <a-form-item label="Ảnh bài viết">
        <a-upload
          :customRequest="handleUpload"
          :showUploadList="false"
          accept="image/*"
        >
          <a-button :loading="uploadLoading">
            <template #icon><upload-outlined /></template>
            Upload ảnh
          </a-button>
        </a-upload>
        <div v-if="editForm.imageLink" class="mt-3">
          <img :src="editForm.imageLink" alt="Preview" style="max-width: 200px; max-height: 200px;" class="block" />
          <div class="mt-1 text-sm text-gray-500">
            {{ editForm.imageLink }}
          </div>
        </div>
      </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Tiêu đề (Tiếng Việt)">
            <a-input v-model:value="editForm.title.vi" />
          </a-form-item>
          <a-form-item label="Trích đoạn (Tiếng Việt)">
            <a-input v-model:value="editForm.excerpt.vi" />
          </a-form-item>
          <a-form-item label="Nội dung (Tiếng Việt)">
            <a-textarea v-model:value="editForm.content.vi" rows="4" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Tiêu đề (Tiếng Anh)">
            <a-input v-model:value="editForm.title.en" />
          </a-form-item>
          <a-form-item label="Trích đoạn (Tiếng Anh)">
            <a-input v-model:value="editForm.excerpt.en" />
          </a-form-item>
          <a-form-item label="Nội dung (Tiếng Anh)">
            <a-textarea v-model:value="editForm.content.en" rows="4" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Tiêu đề (Tiếng Trung)">
            <a-input v-model:value="editForm.title.zh" />
          </a-form-item>
          <a-form-item label="Trích đoạn (Tiếng Trung)">
            <a-input v-model:value="editForm.excerpt.zh" />
          </a-form-item>
          <a-form-item label="Nội dung (Tiếng Trung)">
            <a-textarea v-model:value="editForm.content.zh" rows="4" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Tiêu đề (Tiếng Khmer)">
            <a-input v-model:value="editForm.title.km" />
          </a-form-item>
          <a-form-item label="Trích đoạn (Tiếng Khmer)">
            <a-input v-model:value="editForm.excerpt.km" />
          </a-form-item>
          <a-form-item label="Nội dung (Tiếng Khmer)">
            <a-textarea v-model:value="editForm.content.km" rows="4" />
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
const data = ref([])
const isEditModalVisible = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const uploadLoading = ref(false)

// Form structure
const editForm = ref({
  _id: '',
  month: '',
  imageLink: '',
  title: {
    en: '',
    vi: '',
    zh: '',
    km: ''
  },
  excerpt: {
    en: '',
    vi: '',
    zh: '',
    km: ''
  },
  content: {
    en: '',
    vi: '',
    zh: '',
    km: ''
  }
})

// Custom upload function
const handleUpload = async (options) => {
  const { file, onSuccess, onError } = options
  uploadLoading.value = true

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await fetch('https://api.imgbb.com/1/upload?key=b9ef28752f76f8e84cdf098ba7a881f9', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (result.success) {
      editForm.value.imageLink = result.data.url
      onSuccess(result, file)
      message.success('Upload ảnh thành công')
    } else {
      throw new Error(result.error?.message || 'Upload failed')
    }
  } catch (error) {
    console.error('Upload error:', error)
    onError(error)
    message.error('Upload ảnh thất bại')
  } finally {
    uploadLoading.value = false
  }
}

// Sanitize payload before sending
const sanitizePayload = (payload) => {
  const sanitized = {
    month: payload.month,
    imageLink: payload.imageLink,
    title: {
      en: payload.title.en,
      vi: payload.title.vi,
      zh: payload.title.zh,
      km: payload.title.km
    },
    excerpt: {
      en: payload.excerpt.en,
      vi: payload.excerpt.vi,
      zh: payload.excerpt.zh,
      km: payload.excerpt.km
    },
    content: {
      en: payload.content.en,
      vi: payload.content.vi,
      zh: payload.content.zh,
      km: payload.content.km
    }
  }
  return sanitized
}

// Fetch all articles for admin
const fetchArticles = async () => {
  try {
    isLoading.value = true
    const response = await request.get('/news/admin/all')
    data.value = response.data.map(item => ({
      _id: item._id,
      month: item.month,
      title: item.title.vi,
      excerpt: item.excerpt.vi,
      content: item.content.vi,
      imageLink: item.imageLink
    }))
  } catch (error) {
    console.error('Error fetching articles:', error)
    message.error('Lỗi khi tải bài viết')
  } finally {
    isLoading.value = false
  }
}

// Open edit modal with full article data
const openEditModal = async (item) => {
  try {
    isLoading.value = true
    const response = await request.get(`/news/admin/all`)
    const fullArticle = response.data.find(article => article._id === item._id)
    
    if (fullArticle) {
      editForm.value = {
        _id: fullArticle._id,
        month: fullArticle.month,
        imageLink: fullArticle.imageLink,
        title: {
          en: fullArticle.title.en || '',
          vi: fullArticle.title.vi || '',
          zh: fullArticle.title.zh || '',
          km: fullArticle.title.km || ''
        },
        excerpt: {
          en: fullArticle.excerpt.en || '',
          vi: fullArticle.excerpt.vi || '',
          zh: fullArticle.excerpt.zh || '',
          km: fullArticle.excerpt.km || ''
        },
        content: {
          en: fullArticle.content.en || '',
          vi: fullArticle.content.vi || '',
          zh: fullArticle.content.zh || '',
          km: fullArticle.content.km || ''
        }
      }
      isEditModalVisible.value = true
    } else {
      message.error('Không tìm thấy bài viết')
    }
  } catch (error) {
    console.error('Error fetching article details:', error)
    message.error('Lỗi khi tải chi tiết bài viết')
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetEditForm = () => {
  editForm.value = {
    _id: '',
    month: '',
    imageLink: '',
    title: { en: '', vi: '', zh: '', km: '' },
    excerpt: { en: '', vi: '', zh: '', km: '' },
    content: { en: '', vi: '', zh: '', km: '' }
  }
  isEditModalVisible.value = false
}

// Handle article update
const handleUpdateArticle = async () => {
  try {
    isSubmitting.value = true
    
    if (!editForm.value.imageLink) {
      message.warning('Vui lòng upload ảnh đại diện')
      return
    }

    const payload = sanitizePayload(editForm.value)
    await request.put(`/news/${editForm.value._id}`, payload)
    
    // Update local data
    const index = data.value.findIndex(item => item._id === editForm.value._id)
    if (index !== -1) {
      data.value[index] = { 
        ...data.value[index],
        month: payload.month,
        title: payload.title.vi,
        excerpt: payload.excerpt.vi,
        content: payload.content.vi,
        imageLink: payload.imageLink
      }
    }
    
    message.success('Cập nhật bài viết thành công')
    resetEditForm()
  } catch (error) {
    console.error('Error updating article:', error)
    message.error(error.response?.data?.message || 'Lỗi khi cập nhật bài viết')
  } finally {
    isSubmitting.value = false
  }
}

// Handle article deletion
const handleDeleteArticle = async (id) => {
  try {
    await request.delete(`/news/${id}`)
    data.value = data.value.filter(item => item._id !== id)
    message.success('Xóa bài viết thành công')
  } catch (error) {
    console.error('Error deleting article:', error)
    message.error('Lỗi khi xóa bài viết')
  }
}

// Initial data fetch
onMounted(() => {
  fetchArticles()
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

