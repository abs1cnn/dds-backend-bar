const express = require('express');
const router = express.Router();
// Insertar datos en la tabla "mesas" utilizando Sequelize

let arr_mesas = [

  {
    "IdMesa": 1,
    "Sector": "Salon Principal",
    "Ocupada": false,
    "Capacidad": 4,
    "Tipo": "Mesa redonda",
  },
  {
    "IdMesa": 2,
    "Sector": "Salon Principal",
    "Ocupada": true,
    "Capacidad": 2,
    "Tipo": "Mesa cuadrada",
  },
  {
    "IdMesa": 3,
    "Sector": "Patio",
    "Ocupada": false,
    "Capacidad": 6,
    "Tipo": "Mesa rectangular",
  },
  {
    "IdMesa": 4,
    "Sector": "Patio",
    "Ocupada": true,
    "Capacidad": 4,
    "Tipo": "Mesa redonda",
  },
  {
    "IdMesa": 5,
    "Sector": "Terraza",
    "Ocupada": false,
    "Capacidad": 8,
    "Tipo": "Mesa rectangular",
  },
  {
    "IdMesa": 6,
    "Sector": "Ventanal",
    "Ocupada": true,
    "Capacidad": 4,
    "Tipo": "Mesa rectangular",
  },
  {
    "IdMesa": 7,
    "Sector": "Ventanal",
    "Ocupada": false,
    "Capacidad": 6,
    "Tipo": "Mesa rectangular",
  },
  {
    "IdMesa": 8,
    "Sector": "Ventanal",
    "Ocupada": false,
    "Capacidad": 10,
    "Tipo": "Mesa ejecutiva",
  },
  {
    "IdMesa": 9,
    "Sector": "Salon secundario",
    "Ocupada": true,
    "Capacidad": 20,
    "Tipo": "Mesa ejecutiva",
  },
  {
    "IdMesa": 10,
    "Sector": "Salon secundario",
    "Ocupada": false,
    "Capacidad": 30,
    "Tipo": "Mesa ejecutiva",
  },
];    

// busca todos los regisros
router.get('/api/mesas', async function (req, res) {
  res.json(arr_mesas);
});

// busca por id
router.get('/api/mesas/:id', async function (req, res) {
  let mesas = arr_mesas.find(
    (x) => x.IdMesa== req.params.id
  );
  if (mesas) res.json(mesas);
  else res.status(404).json({ message: 'empleados no encontrado' });
});

// borra por id
router.delete('/api/mesas/:id', (req, res) => {
  let mesas = arr_mesas.find(
    (x) => x.IdMesa == req.params.id
  );

  if (mesas) {
    arr_mesas = arr_mesas.filter(
      (x) => x.IdMesa != req.params.id
    );
    res.json({ message: 'empleados eliminado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});


// Ruta para manejar la solicitud POST y agregar una nueva mesa
router.post('/api/mesas/', (req, res) => {
  const { Sector, Ocupada, Capacidad, Tipo } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!Sector || Ocupada === undefined || !Capacidad || !Tipo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevaMesa = {
    IdMesa: Math.floor(Math.random() * 100000),
    Sector,
    Ocupada,
    Capacidad,
    Tipo
  };

  // Agregar el nuevo objeto al array arr_mesas
  arr_mesas.push(nuevaMesa);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevaMesa);
});

// Actualizar una mesa por ID
router.put('/api/mesas/:id', (req, res) => {
  const { id } = req.params;
  const { Sector, Ocupada, Capacidad, Tipo } = req.body;

  // Encontrar la mesa correspondiente por su ID
  const mesa = arr_mesas.find(m => m.IdMesa == id);

  // Si la mesa no existe, responder con un mensaje de error
  if (!mesa) {
    return res.status(404).json({ message: 'Mesa no encontrada' });
  }

  // Actualizar los campos de la mesa con los nuevos valores, si se proporcionan
  if (Sector) mesa.Sector = Sector;
  if (Ocupada !== undefined) mesa.Ocupada = Ocupada;
  if (Capacidad) mesa.Capacidad = Capacidad;
  if (Tipo) mesa.Tipo = Tipo;

  // Responder con la mesa actualizada
  res.json(mesa);
});

module.exports = router;