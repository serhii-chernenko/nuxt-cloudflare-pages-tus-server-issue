import * as tus from 'tus-js-client'

export const useTus = () => {
  const error = shallowRef<string | null>()
  const progress = shallowRef<number | null>()
  const pending = shallowRef<boolean>()
  const success = shallowRef<boolean>()

  const upload = (endpoint: string, file: File) => {
    const upload = new tus.Upload(file, {
      endpoint,
      retryDelays: [0],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: (exception) => {
        if (
          exception instanceof tus.DetailedError
          && exception.originalResponse?.getBody()
        ) {
          const msg = JSON.parse(exception.originalResponse.getBody())

          error.value = msg.message || exception.message
        } else {
          error.value = exception.message
        }

        success.value = false
        pending.value = false
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = (bytesUploaded / bytesTotal * 100).toFixed(0)

        pending.value = true
        error.value = null
        success.value = false
        progress.value = parseInt(percentage)
      },
      onSuccess: () => {
        progress.value = null
        pending.value = false
        success.value = true
      },
    })

    upload.start()
  }

  return {
    upload,
    error,
    progress,
    pending,
    success,
  }
}
