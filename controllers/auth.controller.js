const pool = require("../utils/dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: {
        status: false,
        message: "Enter a valid email",
      },
    });
  }

  if (username.length < 4 || password.length < 4 || password.includes(" ")) {
    return res.status(400).json({
      error: {
        status: false,
        message:
          "name and password (without space) must be at least 4 characters",
      },
    });
  }

  pool.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username],
    async (err, result) => {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }

      if (result.length > 0) {
        return res.status(409).json({
          status: false,
          message: "User already exist",
        });
      }
      const hashedPasword = await bcrypt.hash(password, 10);
      console.log(hashedPasword);
      pool.query(
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
        [email, username, hashedPasword],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "User registration failed",
            });
          }

          return res.status(201).json({
            status: true,
            message: "Registration succesful",
            user_id: result.insertId,
          });
        }
      );
    }
  );
}

async function login(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: {
        status: false,
        message: "All fileds are required",
      },
    });
  }

  if (username.length < 4 || password.length < 4 || password.includes(" ")) {
    return res.status(400).json({
      error: {
        status: false,
        message:
          "name and password(without space) must be at least 4 characters",
      },
    });
  }

  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.log(err.stack);
        next(err);
        return;
      }
      if (result.length < 1) {
        return res.status(404).json({
          status: false,
          message: "Inavlid username",
        });
      }

      const isPasswordMatched = await bcrypt.compare(
        password,
        result[0].password
      );

      if (!isPasswordMatched) {
        return res.status(404).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign({ username }, process.env.SECRET_KEY, {
        expiresIn: "24hr",
      });

      const user = {
        id: result[0].id,
        username: result[0].username,
        token: token,
      };
      return res.status(200).json({
        status: true,
        message: "Login succesful",
        user: user,
      });
    }
  );
}

module.exports = {
  register,
  login,
};
