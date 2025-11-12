import fs from 'fs'
import path from 'path'
import db from '../database/SQLite.js'

async function uploadRoutes(fastify) {
  // upload profile picture
  fastify.post('/api/upload-profile', async (req, reply) => {
    const data = await req.file()
    const buffer = await data.toBuffer()

    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

    const filename = `${Date.now()}-${data.filename}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, buffer)

    const userId = 1 // later replaced with auth system
    const imagePath = `/uploads/${filename}`

    await db.run('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, userId])

    return { message: 'Profile updated', path: imagePath }
  })

  // get user
  fastify.get('/api/user/:id', async (req, reply) => {
    const { id } = req.params
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
    return user
  })
}

export default uploadRoutes
