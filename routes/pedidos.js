const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

router.get("/api/pedidos", async function (req, res, next) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'obtiene todos los Pedidos'
  // consulta de pedidos con filtros y paginación

  let where = {};
  if (req.query.FechaAlta != undefined && req.query.FechaAlta !== "") {
    where.FechaAlta = {
      [Op.like]: "%" + req.query.FechaAlta + "%",
    };
  }
  if (req.query.IdEmpleado != undefined && req.query.IdEmpleado !== "") {
    where.IdEmpleado = req.query.IdEmpleado;
  }

  const { count, rows } = await db.articulosPedidos.findAndCountAll({
    attributes: [
      "IdPedido",
      "FechaAlta",
      "Precio",
      "IdEmpleado",
    ],
    order: [["FechaAlta", "ASC"]],
    where,
  });

  return res.json(rows);
});

router.get("/api/pedidos/:id", async function (req, res, next) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'obtiene un Pedido'
  // #swagger.parameters['id'] = { description: 'identificador del Pedido...' }
  let items = await db.articulosPedidos.findOne({
    attributes: [
      "IdPedido",
      "FechaAlta",
      "Precio",
      "IdEmpleado",
    ],
    where: { IdPedido: req.params.id },
  });
  res.json(items);
});

router.post("/api/pedidos/", async (req, res) => {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'agrega un Pedido'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Pedido',
                schema: { $ref: '#/definitions/Pedidos' }
    } */
  try {
    let data = await db.articulosPedidos.create({
      FechaAlta: req.body.FechaAlta,
      Precio: req.body.Precio,
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

router.put("/api/pedidos/:id", async (req, res) => {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'actualiza un Pedido'
  // #swagger.parameters['id'] = { description: 'identificador del Pedido...' }
  /*    #swagger.parameters['Pedido'] = {
                in: 'body',
                description: 'Pedido a actualizar',
                schema: { $ref: '#/definitions/Pedidos' }
    } */

  try {
    let item = await db.articulosPedidos.findOne({
      attributes: [
        "IdPedido",
        "FechaAlta",
        "Precio",
        "IdEmpleado",
      ],
      where: { IdPedido: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Pedido no encontrado" });
      return;
    }
    item.FechaAlta = req.body.FechaAlta;
    item.Precio = req.body.Precio;
    item.IdEmpleado = req.body.IdEmpleado;
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

router.delete("/api/pedidos/:id", async (req, res) => {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'elimina un Pedido'
  // #swagger.parameters['id'] = { description: 'identificador del Pedido..' }

  let bajaFisica = false;

  if (bajaFisica) {
    // baja física
    let filasBorradas = await db.articulosPedidos.destroy({
      where: { IdPedido: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE pedidos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdPedido = :IdPedido",
        {
          replacements: { IdPedido: +req.params.id },
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
