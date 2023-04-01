import express from "express";
import router from "./routes/pdf.route.js"
import fileupload from "express-fileupload";

const app = express()

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))

app.listen(8080, () => {
    app.use(router)
})