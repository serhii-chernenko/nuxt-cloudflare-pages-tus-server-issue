<template>
  <NuxtRouteAnnouncer />
  <div class="grid place-content-center h-svh p-8">
    <form class="grid gap-8 max-w-2xl">
      <div
        v-if="error || success"
        role="alert"
        class="alert"
        :class="{
          'alert-error': error,
          'alert-success': success,
        }"
      >
        <span v-if="error">{{ error }}</span>
        <span v-if="success">Video has been uploaded</span>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Real upload endpoint
          </legend>
          <label class="input pl-0">
            <input
              ref="fileInput"
              type="file"
              :accept="allowedVideoFormats.join(',')"
              :disabled="pending"
              class="file-input"
              @change="uploadFile"
            >
            <span class="label !text-xs">.mp4, .mov</span>
          </label>
          <p class="fieldset-label">
            Does't work with Cloudflare pages in production mode
          </p>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Fake upload endpoint
          </legend>
          <label class="input pl-0">
            <input
              ref="fileInputFake"
              type="file"
              :accept="allowedVideoFormats.join(',')"
              :disabled="pending"
              class="file-input"
              @change="event => uploadFile(event, 'fake')"
            >
            <span class="label !text-xs">.mp4, .mov</span>
          </label>
          <p class="fieldset-label">
            Just confirms the issue is not in tus-js-client, but in @tus/server
          </p>
        </fieldset>
      </div>
      <div class="grid place-content-center gap-8 ">
        <progress
          v-if="pending && progress"
          class="progress w-56"
          :value="progress"
          max="100"
        />
        <button
          type="reset"
          :disabled="pending"
          class="btn"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const {
  upload,
  error,
  progress,
  pending,
  success,
} = useTus()

const { allowedVideoFormats } = useRuntimeConfig().public
const fileInput = ref<HTMLInputElement | null>(null)
const fileInputFake = ref<HTMLInputElement | null>(null)

const reset = () => {
  fileInput.value && (fileInput.value.value = '')
  fileInputFake.value && (fileInputFake.value.value = '')
  error.value = null
  success.value = false
  progress.value = null
}

const uploadFile = async (event: Event, type?: 'fake') => {
  const files = (event.target as HTMLInputElement).files

  if (!files || !files.length) {
    error.value = 'Video file is required'

    return
  } else if (files.length > 1) {
    error.value = 'Only one video file is allowed'

    return
  }

  const file = files[0] as File

  // eslint-disable-next-line no-console
  console.log('file', file)

  if (!allowedVideoFormats.includes(file.type)) {
    fileInput.value && (fileInput.value.value = '')
    fileInputFake.value && (fileInputFake.value.value = '')

    error.value = 'Only .mp4 and .mov files allowed'

    return
  }

  const endpoint = type === 'fake'
    ? `/api/upload/size/${file.size}`
    : '/api/upload'

  upload(endpoint, file)
}
</script>
