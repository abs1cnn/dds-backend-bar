const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  try {
    // Abrir base, si no existe el archivo/base lo crea
    await db.open("./.data/pymes.db");

    let existe = false;
    let res = null;


    // --------------------------------------------------------
    // Definición cartas table
    // --------------------------------------------------------

    let existeComidas = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'cartas'",
      []
    );
    if (res.contar > 0) existeComidas = true;
    if (!existeComidas) {
      await db.run(
        `CREATE TABLE cartas (
          IdCarta INTEGER PRIMARY KEY AUTOINCREMENT,
          Nombre TEXT NOT NULL CHECK(length(Nombre) >= 3 AND length(Nombre) <= 30 AND trim(Nombre) == Nombre),
          Descripcion TEXT NOT NULL CHECK(trim(Descripcion) == Descripcion),
          Precio DECIMAL(10, 2) NOT NULL,
          Categoria TEXT NOT NULL CHECK(trim(Categoria) == Categoria)
        );`
      );
      console.log("tabla cartas creada!");
      await db.run(
        `INSERT INTO cartas (Nombre, Descripcion, Precio, Categoria) VALUES
        ('Papas Fritas', 'Papas fritas crocantes, perfectas para compartir.', 500, 'Entradas'),
        ('Empanadas de Carne', 'Empanadas caseras de carne cortada a cuchillo.', 600, 'Entradas'),
        ('Hamburguesa Clásica', 'Hamburguesa de carne con cheddar, tomate, lechuga y cebolla.', 800, 'Platos Principales'),
        ('Milanesa Napolitana', 'Milanesa de carne con salsa napolitana, queso mozzarella y papas fritas.', 900, 'Platos Principales'),
        ('Pizza Muzzarella', 'Pizza clásica con mozzarella.', 750, 'Pizzas'),
        ('Pizza Cuatro Quesos', 'Pizza con mozzarella, provolone, cheddar y roquefort.', 850, 'Pizzas'),
        ('Fernet con Coca', 'Fernet Branca con Coca-Cola.', 450, 'Bebidas'),
        ('Malibu', 'Malibu y refresco.', 550, 'Bebidas'),
        ('Pizza Peras Azules', 'Pizza con mozzarella, roquefort y peras.', 1050, 'Pizzas');`
      );
    }

    // --------------------------------------------------------
    // Definición empleados table
    // --------------------------------------------------------

    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'empleados'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(
        `CREATE table empleados( 
          IdEmpleado INTEGER PRIMARY KEY AUTOINCREMENT,
          Nombre text NOT NULL CHECK(length(Nombre) >= 3 AND length(Nombre) <= 30),
          Apellido text NOT NULL CHECK(length(Apellido) >= 3 AND length(Apellido) <= 30),
          FechaAlta text NOT NULL,
          Activo boolean
        );`
      );
      console.log("tabla empleados creada!");
      await db.run(
        `insert into empleados (Nombre, Apellido, FechaAlta, Activo) values
        ('Abi', 'Canal', '2001-01-01', 0),
        ('Sara', 'Canaan', '2002-02-02', 1),
        ('Mati', 'Gar', '2003-03-03', 0),
        ('Matias', 'Garro', '2004-04-04', 1),
        ('Lan', 'Puchee', '2005-05-05', 0),
        ('Lanfranco', 'Puchetta', '2006-06-06', 1),
        ('Yazmin', 'Canestra', '2010-10-10', 1);`
      );
    }

    // --------------------------------------------------------
    // Definición pedidos table
    // --------------------------------------------------------

    let existePedidos = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'pedidos'",
      []
    );
    if (res.contar > 0) existePedidos = true;
    if (!existePedidos) {
      await db.run(
        `CREATE TABLE pedidos (
          IdPedido INTEGER PRIMARY KEY AUTOINCREMENT,
          FechaAlta TEXT NOT NULL CHECK(trim(FechaAlta) == FechaAlta),
          Precio DECIMAL(10, 2) NOT NULL,
          IdEmpleado INTEGER NOT NULL,
          FOREIGN KEY (IdEmpleado) REFERENCES empleados(IdEmpleado)
        );`
      );
      console.log("tabla pedidos creada!");
      await db.run(
        `INSERT INTO pedidos (FechaAlta, Precio, IdEmpleado) VALUES
        ('02/01/2020', 21000.00, 2),
        ('02/02/2020', 22000.00, 4),
        ('02/03/2020', 23000.00, 6),
        ('02/04/2020', 31000.00, 1),
        ('02/05/2020', 32000.00, 5),
        ('02/06/2020', 33000.00, 3),
        ('02/07/2020', 77000.00, 2),
        ('02/08/2020', 88000.00, 4),
        ('02/10/2020', 10000.00, 6);`
      );
    }

    // --------------------------------------------------------
    // Definición mesas table
    // --------------------------------------------------------

    let existeMesas = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'mesas'",
      []
    );
    if (res.contar > 0) existeMesas = true;
    if (!existeMesas) {
      await db.run(
        `CREATE TABLE mesas (
          IdMesa INTEGER PRIMARY KEY AUTOINCREMENT,
          Sector TEXT NOT NULL CHECK(length(Sector) >= 3 AND length(Sector) <= 30 AND trim(Sector) == Sector),
          Capacidad INTEGER NOT NULL,
          Tipo TEXT NOT NULL CHECK(length(Tipo) >= 3 AND length(Tipo) <= 30 AND trim(Tipo) == Tipo),
          Ocupada BOOLEAN,
          IdEmpleado INTEGER NOT NULL,
          FOREIGN KEY (IdEmpleado) REFERENCES empleados(IdEmpleado)
        );`
      );
      console.log("tabla mesas creada!");
      await db.run(
        `INSERT INTO mesas (Sector, Capacidad, Tipo, Ocupada, IdEmpleado) VALUES
        ('Salon Principal', 4, 'Mesa redonda', 0, 5),
        ('Salon Principal', 2, 'Mesa cuadrada', 1, 4),
        ('Patio', 6, 'Mesa rectangular', 0, 3),
        ('Patio', 4, 'Mesa redonda', 1, 3),
        ('Terraza', 8, 'Mesa rectangular', 0, 3),
        ('Ventanal', 6, 'Mesa rectangular', 0, 3),
        ('Ventanal', 10, 'Mesa ejecutiva', 0, 3),
        ('Salon secundario', 20, 'Mesa ejecutiva', 1, 4),
        ('Salon secundario', 30, 'Mesa ejecutiva', 0, 5);`
      );
    }
    
    // Cerrar la base
    await db.close();
    console.log("Base de datos cerrada exitosamente");
  } catch (error) {
    console.error("Error durante la creación de la base de datos:", error.message);
  }
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
