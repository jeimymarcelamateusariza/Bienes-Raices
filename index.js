import express from "express";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

//Crear la app
const app = express();

//Habilitar lectura de datos del formulario
app.use(express.urlencoded({ extended: true }));

//Conectar a la base de datos
try {
    await db.authenticate();
    db.sync(); // Si la base de datos no existe, la crea
    console.log("Conexión a la base de datos exitosa");
} catch (error) {
    console.error("Error al conectar a la base de datos:", error);
}

//Habilitar PUG
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta pública
app.use(express.static("public"));


//Routing
app.use("/auth", userRoutes);


//Definir puerto y arrancar el servidor
const port = 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});


