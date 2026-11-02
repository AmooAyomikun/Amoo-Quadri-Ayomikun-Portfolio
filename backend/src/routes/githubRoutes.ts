import { Router } from 'express'
import { getGithubContributions } from '../controllers/githubController.js'

const router = Router()

router.get('/', getGithubContributions)

export default router
