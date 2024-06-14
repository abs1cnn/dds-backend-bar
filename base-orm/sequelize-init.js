const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite:" + "./.data/pymes.db");

// Definición del modelo articulosfamilias
const articulosfamilias = sequelize.define("articulosfamilias", {
  IdArticuloFamilia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
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
}, {
  hooks: {
    beforeValidate: function (articulofamilia) {
      if (typeof articulofamilia.Nombre === "string") {
        articulofamilia.Nombre = articulofamilia.Nombre.toUpperCase().trim();
      }
    },
  },
  timestamps: false,
});

// Definición del modelo articulos
const articulos = sequelize.define("articulos", {
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
      msg: "Este Nombre ya existe en la tabla!",
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
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Fecha Alta es requerido",
      }
    }
  },
}, {
  hooks: {
    beforeValidate: function (articulo) {
      if (typeof articulo.Nombre === "string") {
        articulo.Nombre = articulo.Nombre.toUpperCase().trim();
      }
    },
  },
  timestamps: false,
});

// Definición del modelo articulosEmpleados
const articulosEmpleados = sequelize.define("articulosEmpleados", {
  IdEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Nombre es requerido",
      },
      len: {
        args: [3, 30],
        msg: "Nombre debe ser tipo caracteres, entre 3 y 30 de longitud",
      },
    },
  },
  Apellido: {
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
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Fecha Alta es requerido",
      }
    }
  },
}, {
  hooks: {
    beforeValidate: function (empleado) {
      if (typeof empleado.Nombre === "string") {
        empleado.Nombre = empleado.Nombre.toUpperCase().trim();
      }
      if (typeof empleado.Apellido === "string") {
        empleado.Apellido = empleado.Apellido.toUpperCase().trim();
      }
    },
  },
  tableName: "empleados",
  freezeTableName: true,
  timestamps: false,
});

// Definición del modelo articulosComidas
const articulosComidas = sequelize.define("articulosComidas", {
  IdCarta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Nombre es requerido",
      },
      len: {
        args: [3, 30],
        msg: "Nombre debe ser tipo caracteres, entre 3 y 30 de longitud",
      },
    },
  },
  Descripcion: {
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
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Categoria es requerido",
      },
    },
  },
}, {
  hooks: {
    beforeValidate: function (comida) {
      if (typeof comida.Nombre === "string") {
        comida.Nombre = comida.Nombre.toUpperCase().trim();
      }
    },
  },
  tableName: "cartas",
  freezeTableName: true,
  timestamps: false,
});

// Definición del modelo articulosMesas
const articulosMesas = sequelize.define("articulosMesas", {
  IdMesa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Sector: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Sector es requerido",
      },
      len: {
        args: [3, 30],
        msg: "Sector debe ser tipo caracteres, entre 3 y 30 de longitud",
      },
    },
  },
  Capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: "Capacidad es requerido",
      }
    }
  },
  Tipo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "Tipo es requerido",
      },
    },
  },
  IdEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: articulosEmpleados,
      key: 'IdEmpleado'
    },
    validate: {
      notEmpty: {
        args: true,
        msg: "Id Empleado es requerido",
      },
    },
  },
}, {
  hooks: {
    beforeValidate: function (mesa) {
      if (typeof mesa.Sector === "string") {
        mesa.Sector = mesa.Sector.toUpperCase().trim();
      }
    },
  },
  tableName: "mesas",
  freezeTableName: true,
  timestamps: false,
});

// Definición del modelo articulosPedidos
const articulosPedidos = sequelize.define("articulosPedidos", {
  IdPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FechaAlta: {
    type: DataTypes.DATE,
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
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: articulosEmpleados,
      key: 'IdEmpleado'
    },
    validate: {
      notEmpty: {
        args: true,
        msg: "Id Empleado es requerido",
      },
    },
  },
}, {
  tableName: "pedidos",
  freezeTableName: true,
  timestamps: false,
});

// Relaciones
articulosPedidos.belongsTo(articulosEmpleados, { foreignKey: 'IdEmpleado' });



module.exports = {
  sequelize,
  articulosfamilias,
  articulos,
  articulosEmpleados,
  articulosComidas,
  articulosMesas,
  articulosPedidos
};