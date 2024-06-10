const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

router.get("/api/cartas", async function (req, res, next) {
  // #swagger.tags = ['Cartas']
  // #swagger.summary = 'Obtiene todas las Cartas'
  // Consulta de cartas con filtros y paginación

  let where = {};
  console.log("ingresa");
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }

  const { count, rows } = await db.articulosComidas.findAndCountAll({
    attributes: [
      "IdCarta",
      "Nombre",
      "Descripcion",
      "Precio",
      "Categoria",
    ],
    order: [["Nombre", "ASC"]],
    where,
  });

  return res.json(rows);
});

router.get("/api/cartas/:id", async function (req, res, next) {
  // #swagger.tags = ['Cartas']
  // #swagger.summary = 'Obtiene una Carta'
  // #swagger.parameters['id'] = { description: 'Identificador de la Carta...' }
  let items = await db.articulosComidas.findOne({
    attributes: [
      "IdCarta",
      "Nombre",
      "Descripcion",
      "Precio",
      "Categoria",
    ],
    where: { IdCarta: req.params.id },
  });
  res.json(items);
});

router.post("/api/cartas/", async (req, res) => {
  // #swagger.tags = ['Cartas']
  // #swagger.summary = 'Agrega una Carta'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'Nueva Carta',
                schema: { $ref: '#/definitions/Cartas' }
    } */
  try {
    let data = await db.articulosComidas.create({
      Nombre: req.body.Nombre,
      Descripcion: req.body.Descripcion,
      Precio: req.body.Precio,
      Categoria: req.body.Categoria,
    });
    res.status(200).json(data.dataValues); // Devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // Si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // Si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.put("/api/cartas/:id", async (req, res) => {
  // #swagger.tags = ['Cartas']
  // #swagger.summary = 'Actualiza una Carta'
  // #swagger.parameters['id'] = { description: 'Identificador de la Carta...' }
  /*    #swagger.parameters['Carta'] = {
                in: 'body',
                description: 'Carta a actualizar',
                schema: { $ref: '#/definitions/Cartas' }
    } */

  try {
    let item = await db.articulosComidas.findOne({
      attributes: [
        "IdCarta",
        "Nombre",
        "Descripcion",
        "Precio",
        "Categoria",
      ],
      where: { IdCarta: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Carta no encontrada" });
      return;
    }
    item.Nombre = req.body.Nombre;
    item.Descripcion = req.body.Descripcion;
    item.Precio = req.body.Precio;
    item.Categoria = req.body.Categoria;
    await item.save();

    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // Si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // Si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/cartas/:id", async (req, res) => {
  // #swagger.tags = ['Cartas']
  // #swagger.summary = 'Elimina una Carta'
  // #swagger.parameters['id'] = { description: 'Identificador de la Carta..' }

  let bajaFisica = false;

  if (bajaFisica) {
    // Baja física
    let filasBorradas = await db.articulosComidas.destroy({
      where: { IdCarta: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // Baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE cartas SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdCarta = :IdCarta",
        {
          replacements: { IdCarta: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // Si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // Si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

module.exports = router;