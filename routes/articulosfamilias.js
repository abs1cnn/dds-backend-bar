const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");


// Nueva ruta para obtener un articulofamilia por ID
router.get('/api/articulosfamilias/:id', async function (req, res) {
  try {
    const id = req.params.id;
    const articuloFamilia = await db.articulosfamilias.findOne({
      where: { IdArticuloFamilia: id },
      attributes: ["IdArticuloFamilia", "Nombre"],
    });
    
    if (articuloFamilia) {
      res.json(articuloFamilia);
    } else {
      res.status(404).json({ message: 'articulofamilia no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener articulofamilia', error });
  }
});

router.get("/api/articulosfamilias", async function (req, res, next) {
  try {
    let data = await db.articulosfamilias.findAll({
      attributes: ["IdArticuloFamilia", "Nombre"],
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;