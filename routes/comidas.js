const express = require('express');
const router = express.Router();
// crear servidor
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

// Ruta para obtener toda la carta del bar
router.get('/api/carta', async function (req, res) {
  res.json(arr_cartas);
});

// Ruta para obtener un ítem de la carta por ID
router.get('/api/carta/:id', async function (req, res) {
  const id = parseInt(req.params.id);
  const itemCarta = arr_cartas.find(item => item.id === id);

  if (!itemCarta) {
    res.status(404).json({ message: 'Item no encontrado' });
    return;
  }

  res.json(itemCarta);
});

// Ruta para agregar un nuevo ítem a la carta (no implementada)
router.post('/api/carta', async function (req, res) {
  // Implementar la lógica para agregar un nuevo ítem
  res.json({ message: 'Ruta no implementada' });
});

// Ruta para modificar un ítem de la carta (no implementada)
router.put('/api/carta/:id', async function (req, res) {
  // Implementar la lógica para modificar un ítem
  res.json({ message: 'Ruta no implementada' });
});

// Ruta para eliminar un ítem de la carta (no implementada)
router.delete('/api/carta/:id', async function (req, res) {
  // Implementar la lógica para eliminar un ítem
  res.json({ message: 'Ruta no implementada' });
});



router.get('/api/carta/:id/codigo-barras', async function (req, res) {
  // ... (código existente para generar el código de barras)

  // Búsqueda por código de barras (opcional)
  const codigoBarras = req.params.id; // Suponiendo que el código de barras se pasa en el parámetro 'id'
  const itemCarta = arr_cartas.find(item => item.codigoBarras === codigoBarras); // Buscar por código de barras

  if (!itemCarta) {
    // Si no se encuentra el ítem por código de barras, se busca por ID
    const id = parseInt(req.params.id);
    itemCarta = arr_cartas.find(item => item.id === id);
  }

  if (!itemCarta) {
    res.status(404).json({ message: 'Item no encontrado' });
    return;
  }

  // ... (resto del código para generar y devolver el código de barras)
});


router.post('/api/carta/', async function (req, res) {
  const { nombre, descripcion, precio, categoria } = req.body; // Obtenemos los datos del cuerpo de la solicitud

  // Validamos los datos recibidos
  if (!nombre || !descripcion || !precio || !categoria) {
    res.status(400).json({ message: 'Faltan datos obligatorios' });
    return;
  }

  // Creamos el nuevo ítem con un ID aleatorio
  const nuevoItem = {
    id: Math.floor(Math.random() * 100000), // Ejemplo de ID aleatorio
    nombre,
    descripcion,
    precio,
    categoria,
    //codigoBarras: generarCodigoBarras(), // Opcional: Generar código de barras único
  };

  // Agregamos el nuevo ítem a la carta del bar
  arr_cartas.push(nuevoItem);

  res.status(201).json(nuevoItem); // Devolvemos el ítem creado
});


module.exports = router;
