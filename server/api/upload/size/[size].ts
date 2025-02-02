import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    size: z.string().nonempty().max(255),
  }).safeParse)

  if (params.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL parameters',
      data: params.error,
    })
  }

  const method = event.node.req.method
  const fileSize = getRouterParam(event, 'size')

  setResponseHeader(event, 'Tus-Resumable', '1.0.0')

  if (method === 'OPTIONS') {
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, HEAD, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Tus-Resumable, Upload-Length, Upload-Offset, Upload-Metadata',
      'Access-Control-Expose-Headers': 'Location, Upload-Offset',
    })

    return null
  }

  if (method === 'POST') {
    setHeaders(event, {
      Location: `/api/upload/size/${fileSize}`,
    })

    return null
  }

  if (method === 'HEAD') {
    setHeaders(event, {
      'Upload-Length': fileSize,
      'Upload-Offset': '0',
    })

    return null
  }

  if (method === 'PATCH') {
    setHeaders(event, {
      'Upload-Offset': fileSize,
    })

    return null
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
