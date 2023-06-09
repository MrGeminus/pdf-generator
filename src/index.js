import 'dotenv/config';
import express from "express";
import router from "./routes/pdf.route.js"

const port = process.env.PORT || 8080

const app = express()

app.listen(port, () => {
    app.use(router)
})