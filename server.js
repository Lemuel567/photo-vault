import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import photoRouter from './src/routes/photoRoute.js'
import authRouter from './src/routes/authRoute.js'
import authMiddleware from './src/middleware/authMiddleware.js'
const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/photos', authMiddleware, photoRouter)
app.use('/auth', authRouter)
const PORT = 5001

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`)
});