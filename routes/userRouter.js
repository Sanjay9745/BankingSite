const express = require("express");

const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validateCredentials = require("../validate/validation");

const checkLogin = require("../middleware/checkLogin");
const e = require("express");


//Sign Up
router.post("/register", async (req, res) => {
  const { name, email, password} = req.body;
  const validation = validateCredentials(email, password);

  if (validation) {
    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      } else {
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Error hashing password" });
          }

          try {
            const newUser = new User({
              name,
              email,
              password: hashedPassword,
          
            });

            const savedUser = await newUser.save();

            const token = jwt.sign(
              {
                id: savedUser._id,
                name: savedUser.name,
              },
              process.env.JWT_USER_SECRET,
              { expiresIn: "1h" }
            );

            res.status(200).json({ auth: true, token: token });
          } catch (error) {
            console.error("Error saving user with cart items:", error);
            res.status(500).json({ message: "Error saving user" });
          }
        });
      }
    } catch (error) {
      console.error("Error finding existing user:", error);
      res.status(500).json({ message: "Error finding existing user" });
    }
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = validateCredentials(email, password);
  if (!validation) {
    res.status(400).json({ message: "Email or password invalid" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      bcrypt.compare(password, existingUser.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return;
        }

        if (result) {
          let token = jwt.sign(
            {
              id: existingUser._id,
              name: existingUser.name,
            },
            process.env.JWT_USER_SECRET,
            { expiresIn: "1h" }
          );
          res.status(200).json({ auth: true, token: token });
        } else {
          res.status(401).json({ message: "incorrect password" });
        }
      });
    } else {
      return res.status(409).json({ message: "User doesn't exist" });
    }
    // Send a response with the newly created user
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//validate User
router.get("/protected", checkLogin, (req, res) => {
  try {
        res.status(200).json({  userId: req.user.id });
  } catch (e) {
    res.status(401).json({ error: e, userId: req.user.id });
  }
});


router.get("/details", checkLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ amount: user?.amount, id: req.user.id });
  } catch (error) {
    res.status(401).json({ error: error, userId: req.user.id });
  }
});


router.post("/deposit", checkLogin, (req, res) => {
  const amount = parseInt(req.body.amount);
  User.findById(req.user.id).then((user) => {
    user.amount = parseInt(user.amount) + amount;
    user.actions.push({
      date: new Date().toLocaleString("en-US", {
        day: "2-digit",
        year: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      amount: amount,
      details: "deposited",
      balance:user.amount
    });
    user.amount = parseInt(user.amount) + amount;
    user.save().then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
  });
});
router.post("/withdraw", checkLogin, (req, res) => {
  const amount = req.body.amount;
  User.findById(req.user.id).then((user) => {
    user.amount = parseInt(user.amount) - amount;
    user.actions.push({
      date: new Date().toLocaleString("en-US", {
        day: "2-digit",
        year: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      amount: amount,
      details: "withdrawal",
      balance:user.amount
    });
    
    user.save().then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
  });
});
router.post("/transfer", checkLogin, (req, res) => {
  const amount = req.body.amount;
  const email = req.body.email;
  User.findById(req.user.id).then((user) => {
    user.amount = parseInt(user.amount) - amount;
    user.actions.push({
      date: new Date().toLocaleString("en-US", {
        day: "2-digit",
        year: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      amount: amount,
      details: `transferred to ${email}`,
      balance:user.amount
    });
    
    user.save().then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
  });
});

router.get("/statement", checkLogin, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      res.status(200).json({ actions: user.actions });
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});
module.exports = router;
