const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

router.get("/api/empleados", async function (req, res, next) {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'obtiene todos los Empleados'
  // consulta de empleados con filtros y paginación

  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }
  if (req.query.Activo != undefined && req.query.Activo !== "") {
    where.Activo = req.query.Activo === "true";
  }
  const { count, rows } = await db.articulosEmpleados.findAndCountAll({
    attributes: [
      "IdEmpleado",
      "Nombre",
      "Apellido",
      "FechaAlta",
      "Activo",
    ],
    order: [["Nombre", "ASC"]],
    where,

  });

  return res.json(rows);
});

router.get("/api/empleados/:id", async function (req, res, next) {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'obtiene un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado...' }
  let items = await db.articulosEmpleados.findOne({
    attributes: [
      "IdEmpleado",
      "Nombre",
      "Apellido",
      "FechaAlta",
      "Activo",
    ],
    where: { IdEmpleado: req.params.id },
  });
  res.json(items);
});

router.post("/api/empleados/", async (req, res) => {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'agrega un Empleado'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Empleado',
                schema: { $ref: '#/definitions/Empleados' }
    } */
  try {
    let data = await db.articulosEmpleados.create({
      Nombre: req.body.Nombre,
      Apellido: req.body.Apellido,
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

router.put("/api/empleados/:id", async (req, res) => {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'actualiza un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado...' }
  /*    #swagger.parameters['Empleado'] = {
                in: 'body',
                description: 'Empleado a actualizar',
                schema: { $ref: '#/definitions/Empleados' }
    } */

  try {
    let item = await db.articulosEmpleados.findOne({
      attributes: [
        "IdEmpleado",
        "Nombre",
        "Apellido",
        "FechaAlta",
        "Activo",
      ],
      where: { IdEmpleado: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Empleado no encontrado" });
      return;
    }
    item.Nombre = req.body.Nombre;
    item.Apellido = req.body.Apellido;
    item.FechaAlta = req.body.FechaAlta;
    item.Activo = req.body.Activo;
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

router.delete("/api/empleados/:id", async (req, res) => {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'elimina un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado..' }

  let bajaFisica = false;

  if (bajaFisica) {
    // baja física
    let filasBorradas = await db.articulosEmpleados.destroy({
      where: { IdEmpleado: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE empleados SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdEmpleado = :IdEmpleado",
        {
          replacements: { IdEmpleado: +req.params.id },
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
