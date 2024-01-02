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
    from: '11degrees.commerce@gmail.com',
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
          res.json({ message: 'Password updated successfully! Redirecting you to Login...' });
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
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate a verification token
      const verificationToken = jwt.sign({ userId: user.user_id }, JWT_SECRET_KEY, { expiresIn: '1h' });

      // Create a transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '11degrees.commerce@gmail.com', // Replace with your Gmail email
          pass: 'tyme etib jaqk bswc', // Replace with your Gmail email password
        }
      });

      // Send email with defined transport object
      let info = await transporter.sendMail({
        from: '"11DEGREES-CLOTHING" <11degrees.commerce@gmail.com>',
        to: email,
        subject: "Please verify your email",
        html: `
          <p>You have successfully logged in. Please click the button below to verify your email address.</p>
          <a href="http://localhost:3000/verify-email?token=${verificationToken}" style="background-color: blue; color: white; padding: 10px 20px; text-decoration: none;">Verify Email</a>
        `
      });

      console.log(`Verification email sent to ${email}`);
      return res.status(401).json({ message: 'Email not verified. Verification email sent.' });

      
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

// Verify Email endpoint
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET_KEY);

    // Update user's email verification status in the database
    db.query('UPDATE users SET isEmailVerified = 1 WHERE user_id = ?', [userId], (err) => {
      if (err) {
        console.error('Error updating the database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.redirect('/home'); // Redirect to the home page upon successful verification
    });
  } catch (err) {
    console.error('Error verifying the token:', err);
    res.status(401).json({ message: 'Invalid or expired verification token' });
  }
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



// Fetching All Inventory endpoint
app.get('/api/inventory', (req, res) => {
  const selectInventoryQuery =
    'SELECT i.item_id, i.item_name, i.category_code, i.code, ' +
    's.size_name, item_s.quantity_to_restock, item_s.available_quantity, ' +
    'c.color_name, pt.product_type_name ' +
    'FROM inventory i ' +
    'LEFT JOIN item_sizes item_s ON i.item_id = item_s.item_id ' +
    'LEFT JOIN sizes s ON item_s.size_id = s.size_id ' +
    'LEFT JOIN colors c ON i.color = c.color_id ' +
    'LEFT JOIN product_types pt ON i.product_type = pt.product_type_id';

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
            product_type: row.product_type_name,
            color: row.color_name,
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
    sizes,
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

// Fetching colors endpoint
app.get('/api/colors', (req, res) => {
  const query = 'SELECT * FROM colors ORDER BY color_id ASC';

  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Fetching colors endpoint
app.get('/api/product-types', (req, res) => {
  const query = 'SELECT * FROM product_types ORDER BY product_type_id ASC';

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

//Fetching Products endpoint
app.get('/api/products', (req, res) => {
  const disableOnlyFullGroupBy = "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));";
  db.query(disableOnlyFullGroupBy, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const query = `
      SELECT 
  inventory.item_name AS product_name,
  GROUP_CONCAT(DISTINCT inventory.code) AS product_codes,
  inventory.category_code AS category_code,
  GROUP_CONCAT(DISTINCT product_types.product_type_name) AS product_types,
  GROUP_CONCAT(DISTINCT colors.color_name) AS colors,
  GROUP_CONCAT(DISTINCT sizes.size_name) AS sizes,
  products.product_id AS product_id,
  products.image_url_1 AS image_urls_1,
  products.image_url_2 AS image_urls_2,
  products.image_url_3 AS image_urls_3,
  products.image_url_4 AS image_urls_4,
  products.price AS price,
  products.description AS description,
  products.target_gender AS target_gender,
  products.is_archived AS is_archived,
  products.is_limited_edition AS is_limited_edition,
  products.is_on_sale AS is_on_sale,
  products.is_discounted AS is_discounted,
  products.is_displayed AS is_displayed,
  products.is_selected AS is_selected
FROM 
  inventory
INNER JOIN 
  products ON inventory.item_name = products.product_name
LEFT JOIN 
  product_types ON inventory.product_type = product_types.product_type_id
LEFT JOIN 
  colors ON inventory.color = colors.color_id
LEFT JOIN 
  item_sizes ON inventory.item_id = item_sizes.item_id
LEFT JOIN 
  sizes ON item_sizes.size_id = sizes.size_id
GROUP BY 
  inventory.category_code, inventory.item_name;
`;
      db.query(query, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      });
    }
  });
});


//Inserting and Updating Products endpoint
app.post('/api/update-products/:id', (req, res) => {
  const id = req.params.id;
  const {
    image_url_1,
    image_url_2,
    image_url_3,
    image_url_4,
    price,
    description,
    target_gender,
    is_archived,
    is_limited_edition,
    is_on_sale,
    is_discounted,
    is_displayed,
    original_price,
    discount_percentage,
  } = req.body;

  const query = `
    UPDATE products SET
      image_url_1 = ?,
      image_url_2 = ?,
      image_url_3 = ?,
      image_url_4 = ?,
      price = ?,
      description = ?,
      target_gender = ?,
      is_archived = ?,
      is_limited_edition = ?,
      is_on_sale = ?,
      is_discounted = ?,
      is_displayed = ?,
      original_price = ?,
      discount_percentage = ?,
      is_selected = 1
    WHERE product_id = ?
  `;

  const values = [
    image_url_1,
    image_url_2,
    image_url_3,
    image_url_4,
    price,
    description,
    target_gender,
    is_archived,
    is_limited_edition,
    is_on_sale,
    is_discounted,
    is_displayed,
    original_price,
    discount_percentage,
    id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    } else {
      res.status(200).json({ message: 'Data updated successfully.' });
    }
  });
});

// Archiving a product endpoint
app.put('/api/products/:id/archive', (req, res) => {
  const productId = req.params.id;
  const query = 'UPDATE products SET is_archived = 1 WHERE product_id = ?';
  db.query(query, productId, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: `Product ${productId} has been archived.` });
    }
  });
});

// Unarchiving a product endpoint
app.put('/api/products/:id/unarchive', (req, res) => {
  const productId = req.params.id;
  const query = 'UPDATE products SET is_archived = 0 WHERE product_id = ?';
  db.query(query, productId, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: `Product ${productId} has been unarchived.` });
    }
  });
});

// Delete a product endpoint
app.delete('/api/products/:id/delete', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE product_id = ?';
  db.query(query, productId, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: `Product ${productId} has been deleted.` });
    }
  });
});

//Fetching Products for Overview endpoint
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
  SELECT 
    inventory.item_name AS product_name,
    inventory.code AS product_code,
    inventory.category_code AS category_code,
    product_types.product_type_name AS product_type,
    colors.color_name AS color_name,
    colors.color_id AS color_id,
    sizes.size_name AS size_name,
    sizes.size_id AS size,
    products.product_id AS product_id,
    products.image_url_1 AS image_urls_1,
    products.image_url_2 AS image_urls_2,
    products.image_url_3 AS image_urls_3,
    products.image_url_4 AS image_urls_4,
    products.original_price AS original_price,
    products.discount_percentage AS discount_percentage,
    products.price AS price,
    products.description AS description,
    products.target_gender AS target_gender,
    products.is_archived AS is_archived,
    products.is_limited_edition AS is_limited_edition,
    products.is_on_sale AS is_on_sale,
    products.is_discounted AS is_discounted,
    products.is_displayed AS is_displayed,
    products.is_selected AS is_selected
  FROM 
    inventory
  INNER JOIN 
    products ON inventory.item_name = products.product_name
  LEFT JOIN 
    product_types ON inventory.product_type = product_types.product_type_id
  LEFT JOIN 
    colors ON inventory.color = colors.color_id
  LEFT JOIN 
    item_sizes ON inventory.item_id = item_sizes.item_id
  LEFT JOIN 
    sizes ON item_sizes.size_id = sizes.size_id
  WHERE 
    products.product_id = ?
`;

  db.query(sql, id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.length > 0) {
      const product = result[0];
      product.colors = {};
      result.forEach(row => {
        if (!product.colors[row.color_id]) {
          product.colors[row.color_id] = { color_name: row.color_name, sizes: [] };
        }
        product.colors[row.color_id].sizes.push({ size: row.size, size_name: row.size_name });
      });
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
});

//Update Product Overview endpoint
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { price, description, is_archived, is_limited_edition, is_on_sale, is_discounted, is_displayed, image_url_1, image_url_2, image_url_3, image_url_4 } = req.body;
  const sql = `
    UPDATE products
    SET 
      price = ?,
      description = ?,
      is_archived = ?,
      is_limited_edition = ?,
      is_on_sale = ?,
      is_discounted = ?,
      is_displayed = ?,
      image_url_1 = ?,
      image_url_2 = ?,
      image_url_3 = ?,
      image_url_4 = ?
    WHERE product_id = ?
  `;

  db.query(sql, [price, description, is_archived, is_limited_edition, is_on_sale, is_discounted, is_displayed, image_url_1, image_url_2, image_url_3, image_url_4, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.affectedRows > 0) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
});

//Inserting Values From Cart endpoint
app.post('/api/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [userId, productId, quantity], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.affectedRows > 0) {
      res.json({ message: 'Item added to cart successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });
});

// Inserting item into user's cart
app.post('/api/users/:userId/cart/items', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity, colorId, sizeId } = req.body;

  // Fetch the price and image_url_1 of the product from the products table
  const getProductInfoQuery = `
    SELECT price, image_url_1 AS image FROM products WHERE product_id = ?
  `;

  db.query(getProductInfoQuery, [productId], (productInfoErr, productInfoResult) => {
    if (productInfoErr) {
      console.error(productInfoErr);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    if (productInfoResult.length === 0) {
      // Product not found
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const { price, image } = productInfoResult[0];

    // Insert the item into the cart table
    const insertCartItemQuery = `
      INSERT INTO cart (user_id, product_id, quantity, color_id, size_id, price, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertCartItemQuery,
      [userId, productId, quantity, colorId, sizeId, price, image],
      (insertErr, insertResult) => {
        if (insertErr) {
          if (insertErr.code === 'ER_DUP_ENTRY') {
            // Duplicate entry, item already exists in the cart
            res.status(400).json({ message: 'Item already exists in the cart' });
          } else {
            console.error(insertErr);
            res.status(500).json({ message: 'Server error' });
          }
        } else if (insertResult.affectedRows > 0) {
          // Successful insertion
          res.json({ message: 'Item added to cart successfully' });
        } else {
          // No rows affected, product not found
          res.status(404).json({ message: 'Product not found' });
        }
      }
    );
  });
});


// Fetching Cart endpoint
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT 
      cart.cart_id,
      cart.user_id,
      cart.product_id,
      products.product_name,
      products.image_url_1 AS image,
      products.price,
      colors.color_id,
      colors.color_name AS product_color,
      sizes.size_id,
      sizes.size_name AS product_size,
      cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.product_id
    LEFT JOIN colors ON cart.color_id = colors.color_id
    LEFT JOIN sizes ON cart.size_id = sizes.size_id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'No items found in cart' });
    }
  });
});

// Update Cart Item Quantity endpoint
app.put('/api/cart/:cartId/update', (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  // Check if the quantity is a positive integer
  if (!Number.isInteger(quantity) || quantity <= 0) {
    res.status(400).json({ message: 'Invalid quantity' });
    return;
  }

  // Update the quantity in the cart table
  const updateQuantityQuery = `
    UPDATE cart
    SET quantity = ?
    WHERE cart_id = ?
  `;

  db.query(updateQuantityQuery, [quantity, cartId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.affectedRows > 0) {
      res.json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  });
});

// Remove item from cart endpoint
app.delete('/api/cart/:cartId/remove', (req, res) => {
  const { cartId } = req.params;

  // Delete the item from the cart table
  const deleteCartItemQuery = `
    DELETE FROM cart
    WHERE cart_id = ?
  `;

  db.query(deleteCartItemQuery, [cartId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else if (result.affectedRows > 0) {
      res.json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  });
});
