import express from "express";
import router from "./routes/pdf.route.js"

const app = express()

app.listen(8080, () => {
    app.use(router)
})