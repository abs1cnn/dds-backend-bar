const express = require('express');
const cors = require('cors');
const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());

// controlar ruta
app.get("/", (req, res) => {
  res.send("Backend inicial dds-backend! ABS");
});

// levantar servidor
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});


app.use(express.json()); // para poder leer json en el body

require("./base-orm/sqlite-init");  // crear base si no existe


// tabla empleados
const empleadosRouter = require("./routes/empleados");
app.use(empleadosRouter);

// tabla pedidos
const pedidosRouter = require("./routes/pedidos");
app.use(pedidosRouter);

//  tabla mesas
// Import and use routers for mesas and comidas
const mesasRouter = require("./routes/mesas");
app.use(mesasRouter);

// tabla comidas
const comidasRouter = require("./routes/comidas");
app.use(comidasRouter);

