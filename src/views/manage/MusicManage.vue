<template>
  <div class="manage-wrapper">
    <div class="upload-wrapper">
      <svg-icon class="upload-btn" name="annex" size="2rem" onclick="document.getElementById('fileUpload').click()"/>
      <input class="upload" style="display: none" type="file" id="fileUpload"/>
    </div>

<!--    <div class="file-upload-wrapper">-->
<!--      <button class="file-upload-btn" onclick="document.getElementById('fileUpload').click()">选择文件</button>-->
<!--      <input type="file" id="fileUpload" class="file-upload-input" onchange="updateFileName(this)">-->
<!--      <p id="file-upload-filename" class="file-upload-text">未选择任何文件</p>-->
<!--    </div>-->

    <div class="music-info">
      <InputText :placeholder="111" :text="data.a" @change="change"/>
      <InputText/>
      <InputText/>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { reactive } from 'vue';

const data = reactive({a:'777777777'});

const change = () => {
  console.log(data.a);
}
</script>

<style scoped lang="scss">
.manage-wrapper {
  max-width: 30rem;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: .3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);

  .music-info {
    * {
      margin: .75rem 0;
      width: 100%;
      height: 3rem;
    }
  }

  .upload-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .upload-btn {
      cursor: pointer;
    }

    .upload {
      display: none;
    }
  }
}
</style>
