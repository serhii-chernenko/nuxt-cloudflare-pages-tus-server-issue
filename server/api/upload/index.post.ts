import path from 'node:path'
import tus from '@tus/server'
import { FileStore } from '@tus/file-store'

export default defineEventHandler(async (event) => {
  const { Server } = tus
  const fullPath = path.join(process.cwd(), 'uploads')

  const tusServer = new Server({
    path: '/api/upload',
    datastore: new FileStore({
      directory: fullPath,
    }),
  })

  return tusServer.handle(event.node.req, event.node.res)
})
