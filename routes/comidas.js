const express = require('express');
const router = express.Router();
// Simulamos la base de datos de la carta del bar
let arr_cartas = [
  {
    "IdCarta": 1,
    "Nombre": "Papas Fritas",
    "Descripcion": "Papas fritas crocantes, perfectas para compartir.",
    "Precio": 500,
    "Categoria": "Entradas"
  },
  {
    "IdCarta": 2,
    "Nombre": "Empanadas de Carne",
    "Descripcion": "Empanadas caseras de carne cortada a cuchillo.",
    "Precio": 600,
    "Categoria": "Entradas"
  },
  {
    "IdCarta": 3,
    "Nombre": "Hamburguesa Clásica",
    "Descripcion": "Hamburguesa de carne con cheddar, tomate, lechuga y cebolla.",
    "Precio": 800,
    "Categoria": "Platos Principales"
  },
  {
    "IdCarta": 4,
    "Nombre": "Milanesa Napolitana",
    "Descripcion": "Milanesa de carne con salsa napolitana, queso mozzarella y papas fritas.",
    "Precio": 900,
    "Categoria": "Platos Principales"
  },
  {
    "IdCarta": 5,
    "Nombre": "Pizza Muzzarella",
    "Descripcion": "Pizza clásica con mozzarella.",
    "Precio": 750,
    "Categoria": "Pizzas"
  },
  {
    "IdCarta": 6,
    "Nombre": "Pizza Cuatro Quesos",
    "Descripcion": "Pizza con mozzarella, provolone, cheddar y roquefort.",
    "Precio": 850,
    "Categoria": "Pizzas"
  },
  {
    "IdCarta": 7,
    "Nombre": "Fernet con Coca",
    "Descripcion": "Fernet Branca con Coca-Cola.",
    "Precio": 450,
    "Categoria": "Bebidas"
  },
  {
    "IdCarta": 8,
    "Nombre": "Gin Tonic",
    "Descripcion": "Gin con tónica y limón.",
    "Precio": 500,
    "Categoria": "Bebidas"
  },
  {
    "IdCarta": 9,
    "Nombre": "Malibu",
    "Descripcion": "Malibu y refresco.",
    "Precio": 550,
    "Categoria": "Bebidas"
  },
  {
    "IdCarta": 10,
    "Nombre": "Pizza Peras Azules",
    "Descripcion": "Pizza con mozzarella, roquefort y peras.",
    "Precio": 1050,
    "Categoria": "Pizzas"
  }
];

router.get('/api/carta', async function (req, res) {
  res.json(arr_cartas);
});


router.get('/api/carta/:id', async function (req, res) {
  let carta = arr_cartas.find(
    (x) => x.IdCarta == req.params.id
  );
  if (carta) res.json(carta);
  else res.status(404).json({ message: 'empleados no encontrado' });
});


router.delete('/api/carta/:id', (req, res) => {
  let carta = arr_cartas.find(
    (x) => x.IdCarta == req.params.id
  );

  if (carta) {
    arr_cartas = arr_cartas.filter(
      (x) => x.IdCarta != req.params.id
    );
    res.json({ message: 'empleados eliminado' });
  } else {
    res.status(404).json({ message: 'empleados no encontrado' })
  }
});

router.post('/api/carta/', (req, res) => {
  const { Nombre, Descripcion, Precio, Categoria } = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!Nombre || !Descripcion || !Precio || !Categoria) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Crear un nuevo objeto con un ID generado aleatoriamente
  let nuevoElemento = {
    IdCarta: Math.floor(Math.random() * 100000),
    Nombre,
    Descripcion,
    Precio,
    Categoria
  };

  // Agregar el nuevo objeto al array arr_carta
  arr_cartas.push(nuevoElemento);

  // Responder con el nuevo objeto creado y un estado 201 (creado)
  res.status(201).json(nuevoElemento);
});

// Actualizar un elemento de la carta por ID
router.put('/api/carta/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, Precio, Categoria } = req.body;

  // Encontrar el elemento correspondiente por su ID
  const elemento = arr_cartas.find(item => item.IdCarta == id);

  // Si el elemento no existe, responder con un mensaje de error
  if (!elemento) {
    return res.status(404).json({ message: 'Elemento de la carta no encontrado' });
  }

  // Actualizar los campos del elemento con los nuevos valores, si se proporcionan
  if (Nombre) elemento.Nombre = Nombre;
  if (Descripcion) elemento.Descripcion = Descripcion;
  if (Precio) elemento.Precio = Precio;
  if (Categoria) elemento.Categoria = Categoria;

  // Responder con el elemento actualizado
  res.json(elemento);
});

module.exports = router;