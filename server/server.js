import cors from 'cors';
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const app = express();
const port = 3001;
const JWT_SECRET_KEY = 'w}C#PmE2Ajsz3hDWLG9RfUt^m$Yn@k8R';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'admin123', // Replace with your MySQL password
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

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '11degrees.commerce@gmail.com',
    pass: 'tyme etib jaqk bswc', // Use the app password generated in your Google Account
  },
});

// Generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Store generated OTPs (you might want to use a more persistent storage in a real application)
const otpStore = new Map();

// Endpoint to send OTP to the user's email
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in your user database (not implemented here)
  // If the email is valid, send an OTP to the user's email
  const otp = generateOTP();
  otpStore.set(email, otp);

  const mailOptions = {
    from: 'jsonds.18@gmail.com',
    to: email,
    subject: 'Forgot Password OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to verify the entered OTP and change the password
app.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Check if the entered OTP matches the stored OTP
  if (otpStore.has(email) && otpStore.get(email) == otp) {
    // OTP is valid
    otpStore.delete(email); // Remove the used OTP from the store

    try {
      // Hash the new password before storing it
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in your database (replace with your actual database update logic)
      // Example assuming you have a 'users' table with 'email' as a unique identifier
      // Replace this with your actual database update logic
      const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
      db.query(updateQuery, [hashedPassword, email], (err, result) => {
        if (err) {
          console.error('Error updating password in the database:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Password updated successfully');
          res.json({ message: 'Password updated successfully' });
        }
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
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
  const { name, firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    // Validate the confirmPassword field
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with the hashed password
    const query = 'INSERT INTO users (name, firstName, lastName, email, password, confirm_password) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, firstName, lastName, email, hashedPassword, confirmPassword], (err, result) => {
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
  const { name, firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    // Validate the confirmPassword field
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user into the database with the hashed password
    const query = 'INSERT INTO users (name, firstName, lastName, email, password, confirm_password, admin) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, firstName, lastName, email, hashedPassword, confirmPassword, 1], (err, result) => {
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
const archiveProduct = (productId) => {
  const query = 'UPDATE product SET archived = 1 WHERE product_id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [productId], (error, results) => {
      if (error) reject(new Error('Internal Server Error'));
      else if (results.affectedRows === 0) reject(new Error('Product not found'));
      else resolve();
    });
  });
};

const archiveGroupedProducts = (productName) => {
  const query = 'UPDATE product SET archived = 1 WHERE product_name LIKE ? AND archived = 0';
  return new Promise((resolve, reject) => {
    db.query(query, [`%${productName}%`], (error, results) => {
      if (error) reject(new Error('Internal Server Error'));
      else resolve();
    });
  });
};

app.put('/api/product/archive/:productId', async (req, res) => {
  const { productId } = req.params;
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    await archiveProduct(productId);
    await archiveGroupedProducts(productName);
    res.json({ message: 'Product and Grouped Product archived successfully' });
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Unarchive Product endpoint
const unarchiveProduct = (productId) => {
  const query = 'UPDATE product SET archived = 0 WHERE product_id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [productId], (error, results) => {
      if (error) reject(new Error('Internal Server Error'));
      else if (results.affectedRows === 0) reject(new Error('Product not found'));
      else resolve();
    });
  });
};

const unarchiveGroupedProducts = (productName) => {
  const query = 'UPDATE product SET archived = 0 WHERE product_name LIKE ? AND archived = 1';
  return new Promise((resolve, reject) => {
    db.query(query, [`%${productName}%`], (error, results) => {
      if (error) reject(new Error('Internal Server Error'));
      else resolve();
    });
  });
};

app.put('/api/product/unarchive/:productId', async (req, res) => {
  const { productId } = req.params;
  const { productName } = req.body;

  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    await unarchiveProduct(productId);
    await unarchiveGroupedProducts(productName);
    res.json({ message: 'Product and Grouped Product unarchived successfully' });
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
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

// Fetching All Inventory endpoint
app.get('/api/inventory', (req, res) => {
  const selectInventoryQuery =
    'SELECT i.item_id, i.item_name, i.product_type, i.color, i.category_code, i.code, ' +
    's.size_name, item_s.quantity_to_restock, item_s.available_quantity ' +
    'FROM inventory i ' +
    'LEFT JOIN item_sizes item_s ON i.item_id = item_s.item_id ' +
    'LEFT JOIN sizes s ON item_s.size_id = s.size_id';

  db.query(selectInventoryQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const inventoryItems = {};

      results.forEach((row) => {
        const itemId = row.item_id;

        if (!inventoryItems[itemId]) {
          inventoryItems[itemId] = {
            item_id: row.item_id,
            item_name: row.item_name,
            product_type: row.product_type,
            color: row.color,
            category_code: row.category_code,
            code: row.code,
            sizes: [],
          };
        }

        if (row.size_name) {
          inventoryItems[itemId].sizes.push({
            size_name: row.size_name,
            quantity_to_restock: row.quantity_to_restock,
            available_quantity: row.available_quantity,
          });
        }
      });

      const resultArray = Object.values(inventoryItems);

      res.json(resultArray);
    }
  });
});

// Inserting Inventory endpoint
app.post('/api/inventory', (req, res) => {
  const {
    item_name,
    product_type,
    color,
    category_code,
    code,
    sizes
  } = req.body;

  const query = 'INSERT INTO inventory (item_name, product_type, color, category_code, code) VALUES (?, ?, ?, ?, ?)';

  db.query(
    query,
    [item_name, product_type, color, category_code, code],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const itemId = result.insertId;
        sizes.forEach(size => {
          const { size_id, quantity_to_restock, available_quantity } = size;
          const query = 'INSERT INTO item_sizes (item_id, size_id, quantity_to_restock, available_quantity) VALUES (?, ?, ?, ?)';
          db.query(
            query,
            [itemId, size_id, quantity_to_restock, available_quantity],
            (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
              }
            }
          );
        });
        console.log('Item and sizes added to inventory');
        res.json({ message: 'Item and sizes added to inventory' });
      }
    }
  );
});

// Deleting Inventory endpoint
app.delete('/api/inventory/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  const queryInventory = 'DELETE FROM inventory WHERE item_id = ?';
  const queryItemSizes = 'DELETE FROM item_sizes WHERE item_id = ?';

  db.query(queryItemSizes, itemId, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      db.query(queryInventory, itemId, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log(`Item with id ${itemId} and its sizes deleted from inventory`);
          res.json({ message: `Item with id ${itemId} and its sizes deleted from inventory` });
        }
      });
    }
  });
});

// Updating Inventory endpoint
app.put('/api/inventory/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const {
    item_name,
    product_type,
    color,
    category_code,
    code,
    sizes,
  } = req.body;

  const updateInventoryQuery = `
    UPDATE inventory
    SET item_name = ?, product_type = ?, color = ?, category_code = ?, code = ?
    WHERE item_id = ?`;

  db.query(
    updateInventoryQuery,
    [item_name, product_type, color, category_code, code, itemId],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Delete existing sizes for the item
        const deleteSizesQuery = 'DELETE FROM item_sizes WHERE item_id = ?';
        db.query(deleteSizesQuery, [itemId], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(deleteError);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Insert updated sizes for the item
            sizes.forEach(size => {
              const { size_id, quantity_to_restock, available_quantity } = size;
              const insertSizesQuery = `
                INSERT INTO item_sizes (item_id, size_id, quantity_to_restock, available_quantity)
                VALUES (?, ?, ?, ?)`;
              db.query(
                insertSizesQuery,
                [itemId, size_id, quantity_to_restock, available_quantity],
                (insertError, insertResult) => {
                  if (insertError) {
                    console.error(insertError);
                    res.status(500).json({ error: 'Internal Server Error' });
                  }
                }
              );
            });
            console.log('Item and sizes updated in inventory');
            res.json({ message: 'Item and sizes updated in inventory' });
          }
        });
      }
    }
  );
});

// Fetching sizes endpoint
app.get('/api/sizes', (req, res) => {
  const query = 'SELECT * FROM sizes ORDER BY size_id ASC';

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Deleting Inventory endpoint
app.delete('/api/inventory/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  const query = 'DELETE FROM inventory WHERE item_id = ?';

  db.query(query, [itemId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      console.log('Item removed from inventory');
      res.json({ message: 'Item removed from inventory' });
    }
  });
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