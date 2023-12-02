import cors from 'cors';
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3001;
const JWT_SECRET_KEY = 'w}C#PmE2Ajsz3hDWLG9RfUt^m$Yn@k8R';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'admin', // Replace with your MySQL password
  database: '11dcommercedb'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Validate the confirmPassword field
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with the hashed password
    const query = 'INSERT INTO users (name, email, password, confirm_password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, confirmPassword], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('User registered');
        res.send('User registered');
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Register endpoint for admin users
app.post('/register/admin', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user into the database with the hashed password
    const query = 'INSERT INTO users (name, email, password, confirm_password, admin) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, confirmPassword, 1], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Admin user registered');
        res.send('Admin user registered');
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.admin }, JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.admin },
    });
  });
});


// Fetching Inventory endpoint
app.get('/api/inventory', (req, res) => {
  // Query the database to retrieve inventory data
  const query = 'SELECT * FROM inventory';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Inserting Inventory endpoint
app.post('/api/inventory', (req, res) => {
  const {
    item_name,
    product_type,
    color,
    size,
    category_code,
    code,
    stock_available,
    available_quantity,
  } = req.body;

  const query = 'INSERT INTO inventory (item_name, product_type, color, size, category_code, code, stock_available, available_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [item_name, product_type, color, size, category_code, code, stock_available, available_quantity],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Item added to inventory');
        res.json({ message: 'Item added to inventory' });
      }
    }
  );
});

// Fetching Product endpoint
app.get('/api/product', (req, res) => {
  // Query the database to retrieve inventory data
  const query = 'SELECT * FROM product';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Fetching Category Code endpoint
app.get('/api/categoryCode', (req, res) => {
  // Query the database to retrieve unique category codes from the inventory table
  const query = 'SELECT DISTINCT category_code FROM inventory';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const categoryCodes = results.map(result => result.category_code);
      res.json(categoryCodes);
    }
  });
});

// Fetching Inventory endpoint with Category Code filtering
app.get('/api/inventory', (req, res) => {
  const { category_code } = req.query; // Extract the category_code from the query parameters

  // Construct the SQL query with conditional filtering
  let query = 'SELECT * FROM inventory';
  if (category_code) {
    query += ' WHERE category_code = ?';
  }

  // Execute the query with the appropriate parameters
  db.query(query, category_code ? [category_code] : [], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/inventory', (req, res) => {
  const { category_code } = req.query;
  console.log('Received request with category code:', category_code);
});

// Inserting Product endpoint
app.post('/api/product', (req, res) => {
  const {
    category_code,
    product_name,
    product_type,
    color,
    size,
    description,
    imageUrl,
  } = req.body;

  const query = 'INSERT INTO product (category_code, product_name, product_type, color, size, description, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [category_code, product_name, product_type, color, size, description, imageUrl],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Product added to the product table');
        res.json({ message: 'Product added to the product table' });
      }
    }
  );
});