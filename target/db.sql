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
  ('admin', 'supersicher'),
  ('tom', 'supersicher');

INSERT INTO post(user_name, title, description) VALUES
  ('admin', 'Why this website is so secure', 'Since we use modern web technologies like HTML, CSS and JavaScript, we can rely on the security expertise of thousands of experienced developers. Our security team has conducted several extensive penetration tests in the past months and could not find any vulnerabilities. In particular, this website is especially secure against SQL injection attacks, as we carefully escape every single character. '),
  ('tom', 'How to build a bulletproof website', 'We receive many requests every day from users who ask how they can also create such a secure website. In this post I will give an answer to that. Basically it is super simple. Security is always super simple when you understand the math behind it. Knowing that websites with the MD5 hash value 0cc175b9c0f1b6a831c399e269772661 are invisible to hackers, you can easily customize your content to have exactly this hash value by placing the characters kzu8&wsl as a comment in the source code.');
