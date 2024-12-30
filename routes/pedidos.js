

// Define un conjunto de rutas para gestionar pedidos en una aplicación web, 
//con  información del empleado relacionado al pedido.
const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

const { articulosPedidos, articulosEmpleados } = db;

// Nueva función para obtener pedidos con información del empleado
async function getPedidosConEmpleados(where) {
  return await articulosPedidos.findAndCountAll({
    attributes: [
      "IdPedido",
      "FechaAlta",
      "Precio",
      "IdEmpleado",
    ],
    include: [
      {
        model: articulosEmpleados,
        attributes: ['Nombre', 'Apellido']
      }
    ],
    order: [["FechaAlta", "ASC"]],
    where,
  });
}


// Obtiene todos los pedidos con paginación y filtrado
router.get("/api/pedidos", async function (req, res, next) {
  let where = {};
  if (req.query.FechaAlta != undefined && req.query.FechaAlta !== "") {
    where.FechaAlta = {
      [Op.like]: "%" + req.query.FechaAlta + "%",
    };
  }
  if (req.query.IdEmpleado != undefined && req.query.IdEmpleado !== "") {
    where.IdEmpleado = req.query.IdEmpleado;
  }

  const { count, rows } = await getPedidosConEmpleados(where);

  return res.json(rows);
});

// Obtiene un pedido específico por su identificador (id).
router.get("/api/pedidos/:id", async function (req, res, next) {
  let item = await articulosPedidos.findOne({
    attributes: [
      "IdPedido",
      "FechaAlta",
      "Precio",
      "IdEmpleado",
    ],
    include: [
      {
        model: articulosEmpleados,
        attributes: ['Nombre', 'Apellido']
      }
    ],
    where: { IdPedido: req.params.id },
  });
  res.json(item);
});

// Agrega un nuevo pedido.
router.post("/api/pedidos/", async (req, res) => {
  try {
    let data = await articulosPedidos.create({
      FechaAlta: req.body.FechaAlta,
      Precio: req.body.Precio,
      IdEmpleado: req.body.IdEmpleado,
    });
    res.status(200).json(data.dataValues);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      throw err;
    }
  }
});

// Actualiza un pedido existente.
router.put("/api/pedidos/:id", async (req, res) => {
  try {
    let item = await articulosPedidos.findOne({
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
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      throw err;
    }
  }
});

// Elimina un pedido por su identificador (id).
router.delete("/api/pedidos/:id", async (req, res) => {

  // un tipos de eliminación:
  let bajaFisica = false;  //  Elimina el pedido permanentemente de la base de datos.

  if (bajaFisica) {
    let filasBorradas = await articulosPedidos.destroy({
      where: { IdPedido: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
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
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        throw err;
      }
    }
  }
});

module.exports = router;
