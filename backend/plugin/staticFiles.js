import staticPlugin from '@fastify/static'
import path from 'path'

async function staticFiles(fastify) {
  fastify.register(staticPlugin, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  })
}

export default staticFiles
