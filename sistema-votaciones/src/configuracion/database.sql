-- para utilizar la base de datos directamente en postgres y ver la estructura

CREATE TABLE voters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE
);

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    party VARCHAR(100),
    votes INTEGER DEFAULT 0
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    voter_id INTEGER UNIQUE REFERENCES voters(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);