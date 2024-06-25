
// esto se borrara
const auth = require("../seguridad/auth");
const express = require("express");
const router = express.Router();

//Para la interacciones de la base de datos
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");


// Obtener todos los artículos con su filtro 
router.get("/api/articulos", async function (req, res, next) {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'obtiene todos los Articulos'
  // consulta de artículos con filtros y paginacion

  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }
  if (req.query.Activo != undefined && req.query.Activo !== "") {
    // true o false en el modelo, en base de datos es 1 o 0
    // convertir el string a booleano
    where.Activo = req.query.Activo === "true";
  }
  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.articulos.findAndCountAll({
    attributes: [
      "IdArticulo",
      "Nombre",
      "Precio",
      "Stock",
      "FechaAlta",
      "Activo",
    ],
    order: [["Nombre", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });

  return res.json({ Items: rows, RegistrosTotal: count });
});


// Recupera un único artículo 
router.get("/api/articulos/:id", async function (req, res, next) {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'obtiene un Articulo'
  // #swagger.parameters['id'] = { description: 'identificador del Articulo...' }
  let items = await db.articulos.findOne({
    attributes: [
      "IdArticulo",
      "Nombre",
      "Precio",
      "CodigoDeBarra",
      "IdArticuloFamilia",
      "Stock",
      "FechaAlta",
      "Activo",
    ],
    where: { IdArticulo: req.params.id },
  });
  res.json(items); //Respuesta un JSON que contiene los detalles del artículo recuperado.
});


// Crea un nuevo artículo basado en los datos enviados en el cuerpo de la solicitud.
router.post("/api/articulos/", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'agrega un Articulo'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Artículo',
                schema: { $ref: '#/definitions/Articulos' }
    } */
  try {
    let data = await db.articulos.create({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      CodigoDeBarra: req.body.CodigoDeBarra,
      IdArticuloFamilia: req.body.IdArticuloFamilia,
      Stock: req.body.Stock,
      FechaAlta: req.body.FechaAlta,
      Activo: req.body.Activo,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});


// Actualiza un artículo existente en función del identificador proporcionado
// y los datos enviados en el cuerpo de la solicitud.
router.put("/api/articulos/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'actualiza un Artículo'
  // #swagger.parameters['id'] = { description: 'identificador del Artículo...' }
  /*    #swagger.parameters['Articulo'] = {
                in: 'body',
                description: 'Articulo a actualizar',
                schema: { $ref: '#/definitions/Articulos' }
    } */

  try {
    let item = await db.articulos.findOne({
      attributes: [
        "IdArticulo",
        "Nombre",
        "Precio",
        "CodigoDeBarra",
        "IdArticuloFamilia",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      where: { IdArticulo: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Artículo no encontrado" });
      return;
    }
    item.Nombre = req.body.Nombre;
    item.Precio = req.body.Precio;
    item.CodigoDeBarra = req.body.CodigoDeBarra;
    item.IdArticuloFamilia = req.body.IdArticuloFamilia;
    item.Stock = req.body.Stock;
    item.FechaAlta = req.body.FechaAlta;
    item.Activo = req.body.Activo;
    await item.save();

    // otra forma de hacerlo
    // let data = await db.articulos.update(
    //   {
    //     Nombre: req.body.Nombre,
    //     Precio: req.body.Precio,
    //     CodigoDeBarra: req.body.CodigoDeBarra,
    //     IdArticuloFamilia: req.body.IdArticuloFamilia,
    //     Stock: req.body.Stock,
    //     FechaAlta: req.body.FechaAlta,
    //     Activo: req.body.Activo,
    //   },
    //   { where: { IdArticulo: req.params.id } }
    // );
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

//  Eliminar un artículo
router.delete("/api/articulos/:id", async (req, res) => {
  // #swagger.tags = ['Articulos']
  // #swagger.summary = 'elimina un Articulo'
  // #swagger.parameters['id'] = { description: 'identificador del Articulo..' }

  let bajaFisica = false;

  if (bajaFisica) {

    //  Baja Fisica Elimina permanentemente el artículo de la base de datos.
    let filasBorradas = await db.articulos.destroy({
      where: { IdArticulo: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {

    // baja lógica, Actualiza la bandera del artículo para marcarlo como inactivo.
    try {
      let data = await db.sequelize.query(
        "UPDATE articulos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdArticulo = :IdArticulo",
        {
          replacements: { IdArticulo: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        
        res.status(400).json(messages); // ERROR 404 si no se encuentra el artículo.
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});


//--------------------------------------------------------------------------
//-- SEGURIDAD (ACCESO SEGURO CON AUTENTIFICACION JWT).----------------------
//---------------------------------------------------------------------------

// Obtener todos los artículos con JWT

// Requiere un token JWT válido en el encabezado de autorización para el acceso.
// Recupera todos los artículos, pero restringe el acceso a los usuarios con el rol "admin".
router.get(
  "/api/articulosJWT",
  auth.authenticateJWT,
  async function (req, res, next) {
    /* #swagger.security = [{
               "bearerAuth1": []
        }] */

    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'obtiene todos los Artículos, con seguridad JWT, solo para rol: admin (usuario:admin, clave:123)'
    const { rol } = res.locals.user;
    if (rol !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }

    let items = await db.articulos.findAll({
      attributes: [
        "IdArticulo",
        "Nombre",
        "Precio",
        "CodigoDeBarra",
        "IdArticuloFamilia",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      order: [["Nombre", "ASC"]],
    });
    res.json(items);
  }
);

// ---------------------------------------
// ---------------------------------------


// Hace que las rutas definidas sean accesibles para su uso en otras partes de la aplicación.
module.exports = router;


