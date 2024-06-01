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

// busca todos los regisros
router.get('/api/pedidos', async function (req, res) {
  res.json(arr_Pedidos);
});

router.get('/api/pedidos/:id', async function (req, res) {
  let pedidos = arr_Pedidos.find(
    (x) => x.IdPedido == req.params.id
  );
  if (pedidos) res.json(pedidos);
  else res.status(404).json({ message: 'empleados no encontrado' });
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


// Ruta para manejar la solicitud POST y agregar un nuevo pedido
router.post('/api/pedidos', (req, res) => {
  const { Fecha, Monto, IdEmpleado } = req.body;

  console.log("Body de la solicitud:", req.body);

  // Validar que todos los campos requeridos están presentes
  if (!Fecha || !Monto || !IdEmpleado) {
    console.log("Campos requeridos no presentes");
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevoPedido = {
    IdPedido: Math.floor(Math.random() * 100000),
    Fecha,
    Monto,
    IdEmpleado
  };


  console.log("Nuevo empleado a agregar:", nuevoPedido);
  // Agregar el nuevo objeto al array arr_pedidos
  arr_Pedidos.push(nuevoPedido);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevoPedido);
});

// Actualizar un pedido por ID
router.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { Fecha, Monto, IdEmpleado } = req.body;

  // Encontrar el pedido correspondiente por su ID
  const pedido = arr_Pedidos.find(p => p.IdPedido == id);

  // Si el pedido no existe, responder con un mensaje de error
  if (!pedido) {
    return res.status(404).json({ message: 'Pedido no encontrado' });
  }

  // Actualizar los campos del pedido con los nuevos valores, si se proporcionan
  if (Fecha) pedido.Fecha = Fecha;
  if (Monto) pedido.Monto = Monto;
  if (IdEmpleado) pedido.IdEmpleado = IdEmpleado;

  // Responder con el pedido actualizado
  res.json(pedido);
});

module.exports = router;