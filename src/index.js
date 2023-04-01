import 'dotenv/config';
import express from "express";
import router from "./routes/pdf.route.js"

const app = express()
const port = process.env.PORT || 8080

app.listen(port, () => {
    app.use(router)
})