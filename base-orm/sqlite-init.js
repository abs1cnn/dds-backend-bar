const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  try {
    // Abrir base, si no existe el archivo/base lo crea
    await db.open("./.data/pymes.db");

    let existe = false;
    let res = null;

    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'usuarios'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(
        "CREATE table usuarios( IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE, Clave text NOT NULL, Rol text NOT NULL);"
      );
      console.log("tabla usuarios creada!");
      await db.run(
        "insert into usuarios (IdUsuario, Nombre, Clave, Rol) values (1, 'admin', '123', 'admin'), (2, 'juan', '123', 'member');"
      );
    }

    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'articulosfamilias'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(
        "CREATE table articulosfamilias( IdArticuloFamilia INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE);"
      );
      console.log("tabla articulosfamilias creada!");
      await db.run(
        "insert into articulosfamilias (IdArticuloFamilia, Nombre) values (1, 'ACCESORIOS'), (2, 'AUDIO'), (3, 'CELULARES'), (4, 'CUIDADO PERSONAL'), (5, 'DVD'), (6, 'FOTOGRAFIA'), (7, 'FRIO-CALOR'), (8, 'GPS'), (9, 'INFORMATICA'), (10, 'LED - LCD');"
      );
    }

    let existeArticulos = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'articulos'",
      []
    );
    if (res.contar > 0) existeArticulos = true;
    if (!existeArticulos) {
      await db.run(
        `CREATE table articulos( 
          IdArticulo INTEGER PRIMARY KEY AUTOINCREMENT,
          Nombre text NOT NULL UNIQUE,
          Precio real,
          CodigoDeBarra text,
          IdArticuloFamilia integer,
          Stock integer,
          FechaAlta text,
          Activo boolean,
          FOREIGN KEY (IdArticuloFamilia) REFERENCES articulosfamilias(IdArticuloFamilia)
        );`
      );
      console.log("tabla articulos creada!");

      await db.run(
        `insert into articulos (IdArticulo, Nombre, Precio, CodigoDeBarra, IdArticuloFamilia, Stock, FechaAlta, Activo) values
        (1, 'KIT DIRECT TV PREPA 0.60MT', 299.00, '0779815559001', 10, 329, '2017-01-19', 1),
        (2, 'KIT DIRECT TV PREPA 0.90MT', 349.00, '0779815559002', 10, 468, '2017-01-31', 1),
        (3, 'LED 22" LG FHD 22MN42APM', 2669.00, '0779808338808', 10, 536, '2017-01-12', 1),
        (4, 'LED 24" ILO HD DIGITAL MOD LDH24ILO02', 2999.00, '0779696260024', 10, 169, '2017-01-30', 1),
        (5, 'LED 24" LG HD 24MN42A-PM', 3129.00, '0779808338809', 10, 296, '2016-12-28', 1),
        (7, 'LED 32" BGH HD BLE3214D', 4830.00, '0779688540133', 10, 998, '2017-01-01', 1),
        (8, 'LED 32" BGH SMART TV BLE3213RT', 5405.00, '0779688540117', 10, 650, '2017-01-18', 1),
        (9, 'LED 32" HISENSE IPTV HLE3213RT', 5290.00, '0779688540119', 10, 51, '2017-02-03', 1),
        (10, 'LED 322" HITACHI HD CDHLE32FD10', 4837.00, '0779694109973', 10, 838, '2016-12-25', 1);`
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
    // Definición comidas table
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
          IdEmpleado INTEGER NOT NULL CHECK(trim(IdEmpleado) == IdEmpleado)
        );`
      );
      console.log("tabla pedidos creada!");
      await db.run(
        `INSERT INTO pedidos (FechaAlta, Precio, IdEmpleado) VALUES
        ('02/01/2020', 21000.00, 2),
        ('02/02/2020', 22000.00, 4),
        ('02/03/2020', 23000.00, 6),
        ('02/04/2020', 31000.00, 8),
        ('02/05/2020', 32000.00, 10),
        ('02/06/2020', 33000.00, 1),
        ('02/07/2020', 77000.00, 2),
        ('02/08/2020', 88000.00, 3),
        ('02/10/2020', 10000.00, 2);`
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
          Ocupada BOOLEAN
        );`
      );
      console.log("tabla mesas creada!");
      await db.run(
        `INSERT INTO mesas (Sector, Capacidad, Tipo, Ocupada) VALUES
        ('Salon Principal', 4, 'Mesa redonda', 0),
        ('Salon Principal', 2, 'Mesa cuadrada', 1),
        ('Patio', 6, 'Mesa rectangular', 0),
        ('Patio', 4, 'Mesa redonda', 1),
        ('Terraza', 8, 'Mesa rectangular', 0),
        ('Ventanal', 6, 'Mesa rectangular', 0),
        ('Ventanal', 10, 'Mesa ejecutiva', 0),
        ('Salon secundario', 20, 'Mesa ejecutiva', 1),
        ('Salon secundario', 30, 'Mesa ejecutiva', 0);`
      );
    }
    
    // --------------------------------------------------
    // --------------------------------------------------
    // Cerrar la base
    await db.close();
    console.log("Base de datos cerrada exitosamente");
  } catch (error) {
    console.error("Error durante la creación de la base de datos:", error.message);
  }
  
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;
