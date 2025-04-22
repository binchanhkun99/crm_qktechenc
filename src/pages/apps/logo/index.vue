<template>
  <VAlert v-if="showError" type="error">
    {{ errorMessage }}
  </VAlert>
  <VAlert v-if="showSuccess" type="success">
    {{ successMessage }}
  </VAlert>
    <div>
        <a-image
          :width="200"
          :src="logoUrl"
          alt="Logo"
        />
      <a-upload
        v-model:file-list="fileList"
        :before-upload="handleUpload"
        :max-count="1"
        list-type="picture"
        class="upload-list-inline"
        :show-upload-list="{ showRemoveIcon: true }"
      >
        <a-button>
          <upload-outlined />
          Chọn Logo
        </a-button>
      </a-upload>
  
      <VBtn color="success" type="primary" class="mt-4" @click="saveLogo">
        Lưu Logo
      </VBtn>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
const showError = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const successMessage = ref('')
const logoUrl = ref('');

  
  const fileList = ref<UploadProps['fileList']>([]);
  const imgbbApiKey = 'b9ef28752f76f8e84cdf098ba7a881f9';
  const uploadedImageUrl = ref<string>('');
  
  const fetchLogoFromAPI = async () => {
  try {
    const response = await fetch('https://api.qktechenc.com/company/logo');
    const data = await response.json();

    logoUrl.value = data.logo;
  } catch (error) {
    console.error('Lỗi khi lấy logo gốc:', error);
  }
};
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('key', imgbbApiKey);
    formData.append('image', file); 
  
    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        uploadedImageUrl.value = data.data.url;
  
        fileList.value = [
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: uploadedImageUrl.value,
          },
        ];
      } else {
        console.error('Upload thất bại:', data);
      }
    } catch (err) {
      console.error('Lỗi khi upload:', err);
    }
  
    return false; 
  };
  
  const saveLogo = async () => {
    try {
      const response = await fetch('https://api.qktechenc.com/company/logo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logo: uploadedImageUrl.value,
        }),
      });
  
      const result = await response.json();
      if (result) {
        successMessage.value="Logo lưu thành công";
        showSuccess.value=true;
        setTimeout(() => {
          showSuccess.value = false
        }, 3000)
        logoUrl.value = uploadedImageUrl.value;
        fileList.value = [];
        await fetchLogoFromAPI();
      } else {
        errorMessage.value="Logo lưu không thành công!!!";
        showError.value = true;
        setTimeout(() => {
          showError.value = false
        }, 3000)
      }
    } catch (err) {
      console.error('Lỗi khi lưu logo:', err);
    }
  };
  
  onMounted(() => {
    fetchLogoFromAPI();
  });
  </script>
  
  <style scoped>
  .upload-list-inline :deep(.ant-upload-list-item) {
    float: left;
    width: 200px;
    margin-right: 8px;
  }
  .upload-list-inline [class*='-upload-list-rtl'] :deep(.ant-upload-list-item) {
    float: right;
  }
  .mt-4 {
    margin-top: 16px;
  }
  </style>
  