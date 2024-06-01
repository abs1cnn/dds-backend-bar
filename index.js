const express = require("express");

// crear servidor
const app = express();

// controlar ruta
app.get("/", (req, res) => {
  res.send("Backend inicial dds-backend! ABS");
});

// levantar servidor
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});

const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
app.use(articulosfamiliasmockRouter);

app.use(express.json()); // para poder leer json en el body

require("./base-orm/sqlite-init");  // crear base si no existe

// talas articulos familia 
const articulosfamiliasRouter = require("./routes/articulosfamilias");
app.use(articulosfamiliasRouter);
const articulosRouter = require("./routes/articulos");
app.use(articulosRouter);


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

