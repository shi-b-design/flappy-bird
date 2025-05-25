CREATE DATABASE flappybird;
\c flappybird; 

CREATE TABLE scores (
  score_id SERIAL PRIMARY KEY,
  score INT NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  data_achieved TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
