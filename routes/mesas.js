const express = require('express');
const router = express.Router();
// Insertar datos en la tabla "mesas" utilizando Sequelize

let arr_mesas = [

  {
    id: 1,
    sector: 'Salon Principal',
    ocupada: false,
    capacidad: 4,
    tipo: 'Mesa redonda',
  },
  {
    id: 2,
    sector: 'Salon Principal',
    ocupada: true,
    capacidad: 2,
    tipo: 'Mesa cuadrada',
  },
  {
    id: 3,
    sector: 'Patio',
    ocupada: false,
    capacidad: 6,
    tipo: 'Mesa rectangular',
  },
  {
    id: 4,
    sector: 'Patio',
    ocupada: true,
    capacidad: 4,
    tipo: 'Mesa redonda',
  },
  {
    id: 5,
    sector: 'Terraza',
    ocupada: false,
    capacidad: 8,
    tipo: 'Mesa rectangular',
  },
];         

router.get('/api/mesas', async function (req, res) {
  res.json(arr_mesas);
});

router.get('/api/mesas/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const itemMesa = arr_mesas.find(item => item.id === id);

  if (!itemMesa) {
    res.status(404).json({ message: 'Item no encontrado' });
    return;
  }

  res.json(itemMesa);
});

router.put('/api/mesas/:id', (req, res) => {
  let mesas = arr_mesas.find(
    (x) => x.NroMesa == req.params.id
  );

  if (mesas) {
    const { Nombre } = req.body;
    mesas.Nombre = Nombre;
    res.json({ message: 'mesa actualizado' });
  } else {
    res.status(404).json({ message: 'mesa no encontrado' })
  }
});

router.delete('/api/mesas/:nro', (req, res) => {
  let mesas = arr_mesas.find(
    (x) => x.NroMesa == req.params.id
  );

  if (mesas) {
    arr_mesas = arr_mesas.filter(
      (x) => x.NroMesa != req.params.id
    );
    res.json({ message: 'mesa eliminada' });
  } else {
    res.status(404).json({ message: 'mesa no encontrado' })
  }
});


module.exports = router;