const jwt = require("jsonwebtoken");
const pool = require("../utils/dbconnection");
async function authmiddleWare(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized request",
    });
  }

  const token = authorization.split(" ")[1];
  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifiedToken.username) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized request",
      });
    }

    const [result] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [verifiedToken.username]
    );
    req.user = result[0];
    next();
  } catch {
    return res.status(401).json({
      status: false,
      message: "Unauthorized request",
    });
  }
}

module.exports = authmiddleWare;
