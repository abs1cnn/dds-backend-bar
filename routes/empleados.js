const express = require('express');
const router = express.Router();

let arr_Empleados = [
  {
    "IdEmpleado": 1,
    "Nombre": "Abi",
    "Apellido": "Can",
    "FechaAlta": "01/01/2001",
    "Activo": false,
  },
  {
    "IdEmpleado": 2,
    "Nombre": "Sara",
    "Apellido": "Canaan",
    "FechaAlta": "02/02/2002",
    "Activo": true,
  },
  {
    "IdEmpleado": 3,
    "Nombre": "Mati",
    "Apellido": "Gar",
    "FechaAlta": "03/03/2003",
    "Activo": false,
  },
  {
    "IdEmpleado": 4,
    "Nombre": "Matias",
    "Apellido": "Garro",
    "FechaAlta": "04/04/2004",
    "Activo": true,
  },
  {
    "IdEmpleado": 5,
    "Nombre": "Lan",
    "Apellido": "Pu",
    "FechaAlta": "05/05/2005",
    "Activo": false,
  },
  {
    "IdEmpleado": 6,
    "Nombre": "Lanfranco",
    "Apellido": "Puchetta",
    "FechaAlta": "06/06/2006",
    "Activo": true,
  },
  {
    "IdEmpleado": 7,
    "Nombre": "Lu",
    "Apellido": "Cana",
    "FechaAlta": "07/07/2007",
    "Activo": false,
  },
  {
    "IdEmpleado": 8,
    "Nombre": "Luciano",
    "Apellido": "Canani",
    "FechaAlta": "08/08/2008",
    "Activo": true,
  },
  {
    "IdEmpleado": 9,
    "Nombre": "Yaz",
    "Apellido": "Cane",
    "FechaAlta": "09/09/2009",
    "Activo": false,
  },
  {
    "IdEmpleado": 10,
    "Nombre": "Yazmin",
    "Apellido": "Canestra",
    "FechaAlta": "10/10/2010",
    "Activo": true,
  },
  
];

router.post('/api/empleados/', (req, res) => {
  const { Nombre } = req.body;
  let empleados = {
    Nombre,
    IdEmpleado: Math.floor(Math.random()*100000),
  };

  // aqui agregar a la coleccion
  arr_Empleados.push(empleados);

  res.status(201).json(empleados);
});


router.get('/api/empleados/:id', async function (req, res) {
  let empleados = arr_Empleados.find(
    (x) => x.IdEmpleado == req.params.id
  );
  if (empleados) res.json(empleados);
  else res.status(404).json({ message: 'empleados no encontrado' });
});

router.put('/api/empleados_mock/:id', (req, res) => {
  let empleados = arr_Empleados.find(
    (x) => x.IdEmpleado == req.params.id
  );

  if (empleados) {
    const { Nombre } = req.body;
    empleados.Nombre = Nombre;
    res.json({ message: 'empleados actualizado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});

router.delete('/api/empleados/:id', (req, res) => {
  let empleados = arr_Empleados.find(
    (x) => x.IdEmpleado == req.params.id
  );

  if (empleados) {
    arr_Empleados = arr_Empleados.filter(
      (x) => x.IdEmpleado != req.params.id
    );
    res.json({ message: 'empleados eliminado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});


router.get('/api/empleados', async function (req, res) {
  res.json(arr_Empleados);
});
module.exports = router;