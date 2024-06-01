const express = require('express');
const router = express.Router();
// Simulamos la base de datos de la carta del bar
let arr_cartas = [
  {
    id: 1,
    nombre: "Papas Fritas",
    descripcion: "Papas fritas crocantes, perfectas para compartir.",
    precio: 500,
    categoria: "Entradas",
  },
  {
    id: 2,
    nombre: "Empanadas de Carne",
    descripcion: "Empanadas caseras de carne cortada a cuchillo.",
    precio: 600,
    categoria: "Entradas",
  },
  {
    id: 3,
    nombre: "Hamburguesa Clásica",
    descripcion: "Hamburguesa de carne con cheddar, tomate, lechuga y cebolla.",
    precio: 800,
    categoria: "Platos Principales",
  },
  {
    id: 4,
    nombre: "Milanesa Napolitana",
    descripcion: "Milanesa de carne con salsa napolitana, queso mozzarella y papas fritas.",
    precio: 900,
    categoria: "Platos Principales",
  },
  {
    id: 5,
    nombre: "Pizza Muzzarella",
    descripcion: "Pizza clásica con mozzarella.",
    precio: 750,
    categoria: "Pizzas",
  },
  {
    id: 6,
    nombre: "Pizza Cuatro Quesos",
    descripcion: "Pizza con mozzarella, provolone, cheddar y roquefort.",
    precio: 850,
    categoria: "Pizzas",
  },
  {
    id: 7,
    nombre: "Fernet con Coca",
    descripcion: "Fernet Branca con Coca-Cola.",
    precio: 450,
    categoria: "Bebidas",
  },
  {
    id: 8,
    nombre: "Gin Tonic",
    descripcion: "Gin con tónica y limón.",
    precio: 500,
    categoria: "Bebidas",
  },
];

router.get('/api/carta', async function (req, res) {
  res.json(arr_cartas);
});


router.get('/api/carta/:id', async function (req, res) {
  let carta = arr_cartas.find(
    (x) => x.id == req.params.id
  );
  if (carta) res.json(carta);
  else res.status(404).json({ message: 'empleados no encontrado' });
});


router.delete('/api/carta/:id', (req, res) => {
  let carta = arr_cartas.find(
    (x) => x.id == req.params.id
  );

  if (carta) {
    arr_cartas = arr_cartas.filter(
      (x) => x.id != req.params.id
    );
    res.json({ message: 'empleados eliminado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});

router.post('/api/carta/', (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!nombre || !descripcion || !precio || !categoria) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevoElemento = {
    id: Math.floor(Math.random() * 100000),
    nombre,
    descripcion,
    precio,
    categoria
  };

  // Agregar el nuevo objeto al array arr_carta
  arr_cartas.push(nuevoElemento);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevoElemento);
});

module.exports = router;