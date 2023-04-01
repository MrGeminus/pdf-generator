import 'dotenv/config';
import express from "express";
import router from "./routes/pdf.route.js"
import fileupload from "express-fileupload";

const app = express()
const port = process.env.PORT || 8080

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))

app.listen(port, () => {
    app.use(router)
})