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
  let mesas = arr_mesas.find(
    (x) => x.id== req.params.id
  );
  if (mesas) res.json(mesas);
  else res.status(404).json({ message: 'empleados no encontrado' });
});


router.delete('/api/mesas/:id', (req, res) => {
  let mesas = arr_mesas.find(
    (x) => x.id == req.params.id
  );

  if (mesas) {
    arr_mesas = arr_mesas.filter(
      (x) => x.id != req.params.id
    );
    res.json({ message: 'empleados eliminado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});


module.exports = router;