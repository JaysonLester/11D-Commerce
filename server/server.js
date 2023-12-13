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

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Received token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    next(); // Proceed to the next middleware or route
  });
};

// Fetching Users endpoint
app.get('/api/users', (req, res) => {
  // Query the database to retrieve inventory data
  const query = 'SELECT * FROM users';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Deleting User endpoint
app.delete('/api/users/:user_id', (req, res) => {
  // Query the database to delete a user
  const query = 'DELETE FROM users WHERE user_id = ?';
  db.query(query, [req.params.user_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.affectedRows > 0) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
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
    // Validate the confirmPassword field
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user into the database with the hashed password
    const query = 'INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, 1], (err, result) => {
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
      return res.status(401).json({ message: 'Invalid email or password' }); // Changed error message here
    }

    const token = jwt.sign({
      id: user.user_id,
      name: user.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.admin,
      confirm_password: user.confirm_password,
      country: user.country,
      date_of_birth: user.date_of_birth,
      phone_number: user.phone_number,
      house_number: user.house_number,
      street: user.street,
      city: user.city,
      province: user.province,
      zip_code: user.zip_code
    }, JWT_SECRET_KEY, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.admin,
        confirm_password: user.confirm_password,
        country: user.country,
        date_of_birth: user.date_of_birth,
        phone_number: user.phone_number,
        house_number: user.house_number,
        street: user.street,
        city: user.city,
        province: user.province,
        zip_code: user.zip_code
      },
    });
  });
});


// Fetch User Profile Endpoint
app.get('/api/user-profile', verifyToken, async (req, res) => {
  const userId = req.user.id; 

  try {
    // Query the database to retrieve user profile data
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const userProfile = results[0];
        res.json(userProfile);
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Update Profile Endpoint
app.post('/api/update-profile', verifyToken, async (req, res) => {
  console.log('Received update profile request:', req.body);

  const userId = req.user.id; // Extract user ID from the decoded token
  const {
    name,
    email,
    newPassword,
    confirmPassword,
    dateOfBirth,
    phoneNumber,
    houseNumber,
    street,
    city,
    province,
    zipCode,
    country,
    firstName,
    lastName,
  } = req.body;

  try {
    if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : null;

    const updateQuery =
      'UPDATE users SET name = ?, email = ?, ' +
      (newPassword ? 'password = ?, ' : '') +
      'date_of_birth = ?, phone_number = ?, ' +
      'house_number = ?, street = ?, city = ?, province = ?, zip_code = ?, country = ?, ' +
      'firstName = ?, lastName = ? WHERE user_id = ?';

    const updateValues = [
      name,
      email,
      ...(newPassword ? [hashedPassword] : []),
      dateOfBirth,
      phoneNumber,
      houseNumber,
      street,
      city,
      province,
      zipCode,
      country,
      firstName,
      lastName,
      userId,
    ];

    // Execute the update query
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        // Fetch updated user profile after the update
        const fetchQuery = 'SELECT * FROM users WHERE user_id = ?';
        db.query(fetchQuery, [userId], (fetchError, fetchResults) => {
          if (fetchError) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const userProfile = fetchResults[0];
            res.json(userProfile);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Password Endpoint
app.post('/api/update-password', verifyToken, async (req, res) => {
  console.log('Received update password request for user:', req.user.id);

  const userId = req.user.id; 
  const { newPassword, confirmPassword } = req.body;

  try {
    if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : null;

    const updateQuery =
      'UPDATE users SET ' +
      (newPassword ? 'password = ? ' : '') +
      'WHERE user_id = ?';

    const updateValues = [
      ...(newPassword ? [hashedPassword] : []),
      userId,
    ];

    // Execute the update query
    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json({ message: 'Password updated successfully' });
      }
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Archive Product endpoint
app.put('/api/product/archive/:productId', (req, res) => {
  const productId = req.params.productId;

  // Update the 'archived' column for the individual product
  const updateQuery = 'UPDATE product SET archived = 1 WHERE product_id = ?';
  db.query(updateQuery, [productId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Identify the common identifier in the product name to find the grouped product
      const productName = req.body.productName; // Assuming you pass the product name in the request body

      // Update the 'archived' column for the grouped product based on the common identifier
      const updateGroupedQuery = 'UPDATE product SET archived = 1 WHERE product_name LIKE ? AND archived = 0';
      db.query(updateGroupedQuery, [`%${productName}%`], (groupedError, groupedResults) => {
        if (groupedError) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (groupedResults.affectedRows === 0) {
          res.status(404).json({ error: 'Grouped Product not found' });
        } else {
          res.json({ message: 'Product and Grouped Product archived successfully' });
        }
      });
    }
  });
});


// Fetching Product endpoint
app.get('/api/product', (req, res) => {
  // Query the database to retrieve inventory data
  const query = 'SELECT * FROM product';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Group products by product_name and product_type to handle variations
      const groupedProducts = results.reduce((acc, product) => {
        const key = `${product.product_name}-${product.product_type}`;
        if (!acc[key]) {
          acc[key] = { ...product, variations: [] };
        }
        // Add the current product as a variation
        acc[key].variations.push(product);
        return acc;
      }, {});

      // Convert the grouped object back to an array
      const productsWithVariations = Object.values(groupedProducts);

      res.json(productsWithVariations);
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

// Delete Inventory endpoint
app.delete('/api/inventory/:item_id', (req, res) => {
  const { item_id } = req.params; // Extract the item_id from the path parameters

  // Construct the SQL query for deleting from the inventory
  let query = 'DELETE FROM inventory WHERE item_id = ?';

  // Execute the query with the appropriate parameters
  db.query(query, [item_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Inventory deleted successfully' });
    }
  });
});

// Updating Inventory endpoint
app.put('/api/inventory/:item_id', (req, res) => {
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

  const query = 'UPDATE inventory SET item_name = ?, product_type = ?, color = ?, size = ?, category_code = ?, code = ?, stock_available = ?, available_quantity = ? WHERE id = ?';

  db.query(
    query,
    [item_name, product_type, color, size, category_code, code, stock_available, available_quantity, req.params.item_id],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Item updated in inventory');
        res.json({ message: 'Item updated in inventory' });
      }
    }
  );
});

// Inserting Product endpoint
app.post('/api/product', (req, res) => {
  const {
    category_code,
    product_name,
    gender,
    product_type,
    color,
    size,
    description,
    imageUrl1,
    imageUrl2,
    imageUrl3,
    imageUrl4,
    price,
  } = req.body;

  const query = 'INSERT INTO product (category_code, product_name, gender, product_type, color, size, description, imageUrl1, imageUrl2, imageUrl3, imageUrl4, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    query,
    [category_code, product_name, gender, product_type, color, size, description, imageUrl1, imageUrl2, imageUrl3, imageUrl4, price],
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