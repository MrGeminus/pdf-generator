import generatePDF from "../controllers/pdf.controller.js"
import express from "express"

const router = express.Router()

router.get('/api/v1/pdf', generatePDF)

export default router