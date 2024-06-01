const express = require('express');
const router = express.Router();

let arr_Pedidos = [
  {
    "IdPedido": 1,
    "Fecha": "02/01/2020",
    "Monto": 21000,
    "IdEmpleado": 2
  },
  {
    "IdPedido": 2,
    "Fecha": "2/02/2020",
    "Monto": 22000,
    "IdEmpleado": 4
  },
  {
    "IdPedido": 3,
    "Fecha": "02/03/2020",
    "Monto": 23000,
    "IdEmpleado": 6
  },
  {
    "IdPedido": 4,
    "Fecha": "02/04/2020",
    "Monto": 31000,
    "IdEmpleado": 8
  },
  {
    "IdPedido": 5,
    "Fecha": "2/05/2020",
    "Monto": 32000,
    "IdEmpleado": 10
  },
  {
    "IdPedido": 6,
    "Fecha": "02/06/2020",
    "Monto": 33000,
    "IdEmpleado": 1
  },
  {
    "IdPedido": 7,
    "Fecha": "02/07/2020",
    "Monto": 77000,
    "IdEmpleado": 2
  },
  {
    "IdPedido": 8,
    "Fecha": "2/08/2020",
    "Monto": 88000,
    "IdEmpleado": 3
  },
  {
    "IdPedido": 9,
    "Fecha": "02/09/2020",
    "Monto": 99000,
    "IdEmpleado": 1
  },
  {
    "IdPedido": 10,
    "Fecha": "02/10/2020",
    "Monto": 10000,
    "IdEmpleado": 2
  },
];

router.post('/api/pedidos/', (req, res) => {
  const { Nombre } = req.body;
  let pedidos = {
    Nombre,
    IdEmpleado: Math.floor(Math.random()*100000),
  };

  // aqui agregar a la coleccion
  arr_Pedidos.push(pedidos);

  res.status(201).json(pedidos);
});

// busca todos los regisros
router.get('/api/pedidos/:id', async function (req, res) {
  let pedidos = arr_Pedidos.find(
    (x) => x.IdPedido == req.params.id
  );
  if (pedidos) res.json(pedidos);
  else res.status(404).json({ message: 'empleados no encontrado' });
});

// busca por id
router.put('/api/pedidos/:id', (req, res) => {
  let pedidos = arr_Pedidos.find(
    (x) => x.IdPedido == req.params.id
  );

  if (pedidos) {
    const { Nombre } = req.body;
    pedidos.Nombre = Nombre;
    res.json({ message: 'empleados actualizado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});

// borra por id
router.delete('/api/pedidos/:id', (req, res) => {
  let pedidos = arr_Pedidos.find(
    (x) => x.IdPedido == req.params.id
  );

  if (pedidos) {
    arr_Pedidos = arr_Pedidos.filter(
      (x) => x.IdPedido != req.params.id
    );
    res.json({ message: 'pedido eliminado' });
  } else {
    res.status(404).json({ message: 'pedido no encontrado' })
  }
});


router.get('/api/pedidos', async function (req, res) {
  res.json(arr_Pedidos);


// Ruta para manejar la solicitud POST y agregar un nuevo pedido
router.post('/api/pedidos/', (req, res) => {
  const { Fecha, Monto, IdEmpleado } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!Fecha || !Monto || !IdEmpleado) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevoPedido = {
    IdPedido: Math.floor(Math.random() * 100000),
    Fecha,
    Monto,
    IdEmpleado
  };

  // Agregar el nuevo objeto al array arr_pedidos
  arr_pedidos.push(nuevoPedido);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevoPedido);
});


});
module.exports = router;