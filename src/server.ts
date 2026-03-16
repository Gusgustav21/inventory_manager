import express from "express"
import router from "./router"
import db from "./config/db"
import colors from "colors"
import morgan from "morgan"
import cors, { CorsOptions } from "cors"
import dotenv from "dotenv"

dotenv.config()

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log( colors.green.bold("Conexión exitosa a la base de datos") )
    } catch (error) {
        console.error( colors.red.bold("Error al conectar a la base de datos: "), error)
    }
}

connectDB()

const server = express()

const whiteList = [process.env.FRONTEND_URL]

const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Error de CORS"))
        }
    }
}


server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan("dev"))

server.use("/api/products", router)

server.get("/api", (req, res) => {
    res.json({msg: "Desde API"})
})

export default server