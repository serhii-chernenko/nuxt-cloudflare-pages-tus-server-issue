import path from 'node:path'
import tus from '@tus/server'
import { FileStore } from '@tus/file-store'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().nonempty().max(255),
  }).safeParse)

  if (params.error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL parameters',
      data: params.error,
    })
  }

  const { Server } = tus
  const fullPath = path.join(process.cwd(), 'uploads')

  const tusServer = new Server({
    path: '/api/upload',
    datastore: new FileStore({
      directory: fullPath,
    }),
  })

  tusServer.on(tus.EVENTS.POST_FINISH, (_req, _res, upload) => {
    // eslint-disable-next-line no-console
    console.log('Upload finished PATCH', upload)
  })

  return tusServer.handle(event.node.req, event.node.res)
})
