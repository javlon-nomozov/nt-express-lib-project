const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// connecting to DB
const db = new sqlite3.Database(
  path.join(__dirname, `main.db`),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);
// creating Tables
function createUsersTable() {
  const sql = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    age INTEGER
  );`;
  db.run(sql, (err) => {
    if (err) return console.error(err.message);
  });
}

function createBooksTable() {
  const sql = `
  CREATE TABLE books (
      id INTEGER PRIMARY KEY,
      name TEXT,
      count INTEGER,
      duration INTEGER
  );
  `;
  db.run(sql, (err) => {
    if (err) return console.error(err.message);
  });
}

function createUserBooksTable() {
  const sql = `CREATE TABLE user_book (
    id INTEGER PRIMARY KEY,
    user_id INTEGER not NULL,
    book_id INTEGER not NULL,
  	start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP not NULL,
  	end_date TIMESTAMP not NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
    );
    `;
  db.run(sql, (err) => {
    if (err) return console.error(err.message);
  });
}

function createLogger() {
  const sql = `
  CREATE TABLE logger (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    book_id INTEGER,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
  );
  `;
  db.run(sql, (err) => {
    if (err) return console.error(err.message);
  });
}

// inserting datas
function insertUser(fullName, username, age) {
  const sql = `INSERT INTO users (full_name, username, age) VALUES (?, ?, ?);`;
  db.run(sql, [fullName, username, age], (err) => {
    if (err) throw err.message;
  });
}

function insertBook(name, count, duration) {
  const sql = `INSERT INTO books (name, count, duration) VALUES (?, ?, ?);`;
  db.run(sql, [name, count, duration], (err) => {
    if (err) throw err.message;
  });
}

function insertUserBook(userId, bookId, startDate, endDate) {
  const sql = `
    INSERT INTO user_book (user_id, book_id, start_date, end_date)
    VALUES (?, ?, ?, ?);
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [userId, bookId, startDate, endDate], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          message: "User Book entry created successfully",
          id: this.lastID,
        });
      }
    });
  });
}

function insertLog(userId, bookId, status) {
  const sql = `INSERT INTO logger (user_id, book_id, status) VALUES (?, ?, ?);`;
  db.run(sql, [userId, bookId, status], (err) => {
    if (err) throw err.message;
  });
}

// Reading informatoions
async function readAllUsers() {
  const sql = `SELECT * FROM users WHERE True`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readUserById(userId) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readUserByUsername(username) {
  const sql = `SELECT * FROM users WHERE username = ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [username], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readAllBooks() {
  const sql = `SELECT * FROM books WHERE True`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readBookById(userId) {
  const sql = `SELECT * FROM books WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readBookByName(name) {
  const sql = `SELECT * FROM books WHERE name = ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [name], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readAllUserBooks() {
  const sql = `SELECT * FROM user_book;`;

  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readUserBookById(userBookId) {
  const sql = `SELECT * FROM user_book WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [userBookId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readUserBookByUserId(userId) {
  const sql = `SELECT * FROM user_book WHERE user_id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readUserBookByBookId(bookId) {
  const sql = `SELECT * FROM user_book WHERE book_id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [bookId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readUserBookByUserIdBookId(userId, bookId) {
  const sql = `SELECT * FROM user_book WHERE user_id = ? AND book_id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [userId, bookId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readUserBookById(userBookId) {
  const sql = `SELECT * FROM user_book WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [userBookId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readAllLoggers() {
  const sql = `SELECT * FROM logger;`;

  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readLoggerById(loggerId) {
  const sql = `SELECT * FROM logger WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.get(sql, [loggerId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Update user data
function updateUser(userId, name, count, duration) {
  const sql = `
    UPDATE users
    SET full_name = ?,
        username = ?,
        age = ?
    WHERE id = ?;
  `;
  return new Promise((resolve, reject) => {
    db.run(sql, [name, count, duration, userId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the update
        if (this.changes > 0) {
          resolve({ message: "User updated successfully" });
        } else {
          reject({ error: "User not found or no changes made" });
        }
      }
    });
  });
}

function updateBook(bookId, name, count, duration) {
  const sql = `
    UPDATE books
    SET name = ?,
        count = ?,
        duration = ?
    WHERE id = ?;
  `;
  return new Promise((resolve, reject) => {
    db.run(sql, [name, count, duration, bookId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the update
        if (this.changes > 0) {
          resolve({ message: "User updated successfully" });
        } else {
          reject({ error: "Book not found or no changes made" });
        }
      }
    });
  });
}

function updateUserBook(userBookId, userId, bookId, startDate, endDate) {
  const sql = `
    UPDATE user_book
    SET user_id = ?,
        book_id = ?,
        start_date = ?,
        end_date = ?
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [userId, bookId, startDate, endDate, userBookId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // Check if any rows were affected by the update
          if (this.changes > 0) {
            resolve({ message: "User Book entry updated successfully" });
          } else {
            reject({ error: "User Book entry not found or no changes made" });
          }
        }
      }
    );
  });
}

function updateLogger(loggerId, userId, bookId, status) {
  const sql = `
    UPDATE logger
    SET user_id = ?,
        book_id = ?,
        status = ?
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [userId, bookId, status, loggerId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the update
        if (this.changes > 0) {
          resolve({ message: "Logger entry updated successfully" });
        } else {
          reject({ error: "Logger entry not found or no changes made" });
        }
      }
    });
  });
}

// deleteing informations
function deleteUser(userId) {
  const sql = `DELETE FROM users WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sql, [userId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the delete
        if (this.changes > 0) {
          resolve({ message: "User deleted successfully" });
        } else {
          reject({ error: "User not found or no changes made" });
        }
      }
    });
  });
}

function deleteBook(bookId) {
  const sql = `DELETE FROM books WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sql, [bookId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the delete
        if (this.changes > 0) {
          resolve({ message: "Book deleted successfully" });
        } else {
          reject({ error: "Book not found or no changes made" });
        }
      }
    });
  });
}

function deleteUserBook(userBookId) {
  const sql = `DELETE FROM user_book WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sql, [userBookId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the delete
        if (this.changes > 0) {
          resolve({ message: "User Book entry deleted successfully" });
        } else {
          reject({ error: "User Book entry not found or no changes made" });
        }
      }
    });
  });
}

function deleteLogger(loggerId) {
  const sql = `DELETE FROM logger WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sql, [loggerId], function (err) {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the delete
        if (this.changes > 0) {
          resolve({ message: "Logger entry deleted successfully" });
        } else {
          reject({ error: "Logger entry not found or no changes made" });
        }
      }
    });
  });
}

module.exports.create = {
  book: createBooksTable,
  user: createUsersTable,
  userBook: createUserBooksTable,
  logger: createLogger,
};

module.exports.insert = {
  book: insertBook,
  user: insertUser,
  userBook: insertUserBook,
  logger: insertLog,
};

module.exports.read = {
  users: readAllUsers,
  userById: readUserById,
  userByUsername: readUserByUsername,
  books: readAllBooks,
  bookById: readBookById,
  bookByName: readBookByName,
  userBooks: readAllUserBooks,
  userBookById: readUserBookById,
  userBookByUserId: readUserBookByUserId,
  userBookByBookId: readUserBookByBookId,
  userBookByUserIdBookId: readUserBookByUserIdBookId,
  logs: readAllLoggers,
  log: readLoggerById
};

module.exports.update = {
  user: updateUser,
  book: updateBook,
  userBook: updateUserBook,
  log: updateLogger
};

module.exports.delete = {
  user: deleteUser,
  book: deleteBook,
  userBook: deleteUserBook,
  log: deleteLogger,
};
