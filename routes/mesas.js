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

// busca todos los regisros
router.get('/api/mesas', async function (req, res) {
  res.json(arr_mesas);
});

// busca por id
router.get('/api/mesas/:id', async function (req, res) {
  let mesas = arr_mesas.find(
    (x) => x.id== req.params.id
  );
  if (mesas) res.json(mesas);
  else res.status(404).json({ message: 'empleados no encontrado' });
});

// borra por id
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


// Ruta para manejar la solicitud POST y agregar una nueva mesa
router.post('/api/mesas/', (req, res) => {
  const { sector, ocupada, capacidad, tipo } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!sector || ocupada === undefined || !capacidad || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevaMesa = {
    id: Math.floor(Math.random() * 100000),
    sector,
    ocupada,
    capacidad,
    tipo
  };

  // Agregar el nuevo objeto al array arr_mesas
  arr_mesas.push(nuevaMesa);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevaMesa);
});

module.exports = router;