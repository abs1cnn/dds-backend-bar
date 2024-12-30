
// Importaciones:
const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");
//Conexion con la base de datos
const { articulosMesas, articulosEmpleados } = db;



// Obtiene todas las mesas con paginación y filtrado por sector y estado de ocupación.
router.get("/api/mesas", async function (req, res, next) {
  // #swagger.tags = ['Mesas']
  // #swagger.summary = 'obtiene todas las Mesas'
  // consulta de mesas con filtros y paginación

  let where = {};
  if (req.query.Sector != undefined && req.query.Sector !== "") {
    where.Sector = {
      [Op.like]: "%" + req.query.Sector + "%",
    };
  }
  if (req.query.Ocupada != undefined && req.query.Ocupada !== "") {
    // true o false en el modelo, en base de datos es 1 o 0
    // convertir el string a booleano
    where.Ocupada = req.query.Ocupada === "true";
  }
  const { count, rows } = await db.articulosMesas.findAndCountAll({
    attributes: [
      "IdMesa",
      "Sector",
      "Capacidad",
      "Tipo",
      "Ocupada",
      "IdEmpleado",
    ],
    include: [
      {
        model: articulosEmpleados,
        attributes: ['Nombre', 'Apellido']
      }
    ],
    order: [["Sector", "ASC"]],
    where,
  });

  return res.json(rows);
});


// Obtiene una mesa específica por su identificador
router.get("/api/mesas/:id", async function (req, res, next) {
  // #swagger.tags = ['Mesas']
  // #swagger.summary = 'obtiene una Mesa'
  // #swagger.parameters['id'] = { description: 'identificador de la Mesa...' }
  let items = await db.articulosMesas.findOne({
    attributes: [
      "IdMesa",
      "Sector",
      "Capacidad",
      "Tipo",
      "Ocupada",
      "IdEmpleado",
    ],
    include: [
      {
        model: articulosEmpleados,
        attributes: ['Nombre', 'Apellido']
      }
    ],
    where: { IdMesa: req.params.id },
  });
  res.json(items);
});


// Agrega una nueva mesa.
router.post("/api/mesas/", async (req, res) => {
  // #swagger.tags = ['Mesas']
  // #swagger.summary = 'agrega una Mesa'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nueva Mesa',
                schema: { $ref: '#/definitions/Mesas' }
    } */
  try {
    let data = await db.articulosMesas.create({
      Sector: req.body.Sector,
      Capacidad: req.body.Capacidad,
      Tipo: req.body.Tipo,
      Ocupada: req.body.Ocupada,
      IdEmpleado: req.body.IdEmpleado,
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


// Actualiza una mesa existente.
router.put("/api/mesas/:id", async (req, res) => {
  // #swagger.tags = ['Mesas']
  // #swagger.summary = 'actualiza una Mesa'
  // #swagger.parameters['id'] = { description: 'identificador de la Mesa...' }
  /*    #swagger.parameters['Mesa'] = {
                in: 'body',
                description: 'Mesa a actualizar',
                schema: { $ref: '#/definitions/Mesas' }
    } */

  try {
    let item = await db.articulosMesas.findOne({
      attributes: [
        "IdMesa",
        "Sector",
        "Capacidad",
        "Tipo",
        "Ocupada",
        "IdEmpleado",
      ],
      where: { IdMesa: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Mesa no encontrada" });
      return;
    }
    item.Sector = req.body.Sector;
    item.Capacidad = req.body.Capacidad;
    item.Tipo = req.body.Tipo;
    item.Ocupada = req.body.Ocupada;
    await item.save();

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

// Elimina una mesa por su identificador (id).

router.delete("/api/mesas/:id", async (req, res) => {
  // #swagger.tags = ['Mesas']
  // #swagger.summary = 'elimina una Mesa'
  // #swagger.parameters['id'] = { description: 'identificador de la Mesa..' }

  //dos tipos de eliminación:
  let bajaFisica = false;
  
  if (bajaFisica) {
    // baja fisica ,  Elimina la mesa permanentemente de la base de datos.
    let filasBorradas = await db.articulosMesas.destroy({
      where: { IdMesa: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica, Cambia el estado de la mesa a "libre" en la base de datos.
    try {
      let data = await db.sequelize.query(
        "UPDATE mesas SET Ocupada = case when Ocupada = 1 then 0 else 1 end WHERE IdMesa = :IdMesa",
        {
          replacements: { IdMesa: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

module.exports = router;
