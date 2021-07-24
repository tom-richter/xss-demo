DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS users;

CREATE TABLE users ( 
  name TEXT PRIMARY KEY,
  password TEXT
);

CREATE TABLE post ( 
  id SERIAL PRIMARY KEY,
  user_name TEXT,
  title TEXT,
  description TEXT,
  FOREIGN KEY(user_name) REFERENCES users(name)
);

INSERT INTO users(name, password) VALUES
  ('admin', 'admin1234'),
  ('tom', 'tom1234'),
  ('hacker', 'hacker1234');

INSERT INTO post(user_name, title, description) VALUES
  ('admin', 'This is great', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'),
  ('tom', 'This is perfect', 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');
