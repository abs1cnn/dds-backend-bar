const jwt = require("jsonwebtoken");

const accessTokenSecret = "youraccesstokensecret";
const refreshTokenSecret = "yourrefreshtokensecrethere";

//  implementa una función de middleware para la autenticación
// mediante JSON Web Tokens (JWT) en un nodo.Aplicación JS, 
// Verifica la validez de los tokens de acceso incluidos 
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        //return res.sendStatus(400);
        return res.status(403).json({ message: "token no es valido" });
      }
      
      res.locals.user = user;
      next();
    });
  } else {
    //res.sendStatus(401);
    res.status(401).json({ message: "Acceso denegado" });
  }
};
module.exports = { authenticateJWT, accessTokenSecret, refreshTokenSecret };
