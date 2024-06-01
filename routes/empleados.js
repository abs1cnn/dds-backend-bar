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

// busca todos los regisros
router.get('/api/empleados', async function (req, res) {
  res.json(arr_Empleados);
});

// busca por id
router.get('/api/empleados/:id', async function (req, res) {
  let empleados = arr_Empleados.find(
    (x) => x.IdEmpleado == req.params.id
  );
  if (empleados) res.json(empleados);
  else res.status(404).json({ message: 'empleados no encontrado' });
});

// borra por id
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


router.post('/api/empleados', (req, res) => {
  const { Nombre, Apellido, FechaAlta, Activo } = req.body;

  console.log("Body de la solicitud:", req.body);

  // Validar que todos los campos requeridos están presentes
  if (!Nombre || !Apellido || !FechaAlta || Activo === undefined) {
    console.log("Campos requeridos no presentes");
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevoEmpleado = {
    IdEmpleado: Math.floor(Math.random() * 100000),
    Nombre,
    Apellido,
    FechaAlta,
    Activo
  };

  console.log("Nuevo empleado a agregar:", nuevoEmpleado);

  // Agregar el nuevo objeto al array arr_Empleados
  arr_Empleados.push(nuevoEmpleado);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevoEmpleado);
});

// Actualizar un empleado por ID
router.put('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, FechaAlta, Activo } = req.body;

  // Encontrar el empleado correspondiente por su ID
  const empleado = arr_Empleados.find(emp => emp.IdEmpleado == id);

  // Si el empleado no existe, responder con un mensaje de error
  if (!empleado) {
    return res.status(404).json({ message: 'Empleado no encontrado' });
  }

  // Actualizar los campos del empleado con los nuevos valores, si se proporcionan
  if (Nombre) empleado.Nombre = Nombre;
  if (Apellido) empleado.Apellido = Apellido;
  if (FechaAlta) empleado.FechaAlta = FechaAlta;
  if (Activo !== undefined) empleado.Activo = Activo;

  // Responder con el empleado actualizado
  res.json(empleado);
});

module.exports = router;