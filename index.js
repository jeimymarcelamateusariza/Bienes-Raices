import express from "express";
import userRoutes from "./routes/userRoutes.js";

//Crear la app
const app = express();

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


