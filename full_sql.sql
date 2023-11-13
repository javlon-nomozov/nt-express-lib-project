CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    age INTEGER
);

CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    name TEXT,
    count INTEGER,
    duration INTEGER
);

CREATE TABLE user_book (
    id INTEGER PRIMARY KEY,
    user_id INTEGER not NULL,
    book_id INTEGER not NULL,
  	start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP not NULL,
  	end_date TIMESTAMP not NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE TABLE logger (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    book_id INTEGER,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id)
);

INSERT INTO users (full_name, username, age) VALUES ('John Doe', 'johndoe', 25);
INSERT INTO books (name, count, duration) VALUES ('Sample Book', 10, 300);
INSERT INTO user_book (user_id, book_id, start_date, end_date) VALUES (1, 1, 'NULL','NULL');
INSERT INTO logger (user_id, book_id, status) VALUES (1, 1, 'Book Checked Out');
