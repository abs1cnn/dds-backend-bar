// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + process.env.base );
const sequelize = new Sequelize("sqlite:" + "./.data/pymes.db");

// definicion del modelo de datos
const articulosfamilias = sequelize.define(
  "articulosfamilias",
  {
    IdArticuloFamilia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulofamilia, options) {
        if (typeof articulofamilia.Nombre === "string") {
          articulofamilia.Nombre = articulofamilia.Nombre.toUpperCase().trim();
        }
      },
    },

    timestamps: false,
  }
);

const articulos = sequelize.define(
  "articulos",
  {
    IdArticulo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Precio es requerido",
        }
      }
    },
    CodigoDeBarra: {
      type: DataTypes.STRING(13),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Codigo De Barra es requerido",
        },
        is: {
          args: ["^[0-9]{13}$", "i"],
          msg: "Codigo de Barra debe ser numérico de 13 digitos",
        },
      },
    },
    IdArticuloFamilia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdArticuloFamilia es requerido",
        }
      }
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Stock es requerido",
        }
      }
    },
    FechaAlta: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha Alta es requerido",
        }
      }
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulo, options) {
        if (typeof articulo.Nombre === "string") {
          articulo.Nombre = articulo.Nombre.toUpperCase().trim();
        }
      },
    },

    timestamps: false,
  }
);

// -------------------------------------------------------
// -------------------------------------------------------
// definicion del modelo de datos Empleados
const articulosEmpleados = sequelize.define(
  "articulosEmpleados",
  {
    IdEmpleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [3, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Apellido: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Apellido es requerido",
        },
      },
    },
    FechaAlta: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha Alta es requerido",
        }
      }
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulosEmpleados, options) {
        if (typeof articulosEmpleados.Nombre === "string") {
          articulosEmpleados.Nombre = articulosEmpleados.Nombre.toUpperCase().trim();
        }
      },
      beforeValidate: function (articulosEmpleados, options) {
        if (typeof articulosEmpleados.Apellido === "string") {
          articulosEmpleados.Apellido = articulosEmpleados.Apellido.toUpperCase().trim();
        }
      },
    },

    timestamps: false,
  }
);

// -------------------------------------------------------
// -------------------------------------------------------
// definicion del modelo de datos Comidas
const articulosComidas = sequelize.define(
  "articulosComidas",
  {
    IdCarta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [3, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Descripcion: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Descripcion es requerido",
        },
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Precio es requerido",
        }
      }
    },
    Categoria: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Categoria es requerido",
        },
      },
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulosComidas, options) {
        if (typeof articulosComidas.Nombre === "string") {
          articulosComidas.Nombre = articulosComidas.Nombre.toUpperCase().trim();
        }
      },
    },
    tableName: "cartas",
    freezeTableName:true,
    timestamps: false,
  }
);

// -------------------------------------------------------
// -------------------------------------------------------
// definicion del modelo de datos Mesas
const articulosMesas = sequelize.define(
  "articulosMesas",
  {
    IdMesa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Sector: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Sector es requerido",
        },
        len: {
          args: [3, 30],
          msg: "Sector debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Capacidad: {
      type: DataTypes.INTEGER(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Capacidad es requerido",
        }
      }
    },
    Tipo: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Tipo es requerido",
        },
      },
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulosMesas, options) {
        if (typeof articulosMesas.Nombre === "string") {
          articulosMesas.Nombre = articulosMesas.Nombre.toUpperCase().trim();
        }
      },
    },
    tableName: "mesas",
    freezeTableName:true,
    timestamps: false,
  }
);

// -------------------------------------------------------
// -------------------------------------------------------
// definicion del modelo de datos Pedidos
const articulosPedidos = sequelize.define(
  "articulosPedidos",
  {
    IdPedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FechaAlta: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha Alta es requerido",
        }
      }
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Precio es requerido",
        }
      }
    },
    IdEmpleado: {
      // todo evitar que string autocomplete con espacios en blanco, debería ser varchar sin espacios
      type: DataTypes.INTEGER(),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Id Empleado es requerido",
        },
      },
    },
  },
  {
    // pasar a mayusculas
    hooks: {
      beforeValidate: function (articulosPedidos, options) {
        if (typeof articulosPedidos.Nombre === "string") {
          articulosPedidos.Nombre = articulosPedidos.Nombre.toUpperCase().trim();
        }
      },
    },
    tableName: "pedidos",
    freezeTableName:true,
    timestamps: false,
  }
);

// --------------------------------------------------------
// --------------------------------------------------------


module.exports = {
  sequelize,
  articulosfamilias,
  articulos,
  articulosEmpleados,
  articulosComidas,
  articulosMesas,
  articulosPedidos
};
