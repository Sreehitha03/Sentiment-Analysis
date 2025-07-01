# Sentiment Analysis

This is a sentiment analysis web application that utilizes a fine-tuned model to classify statements into three categories: **Political**, **Regional**, and **Sports**. The application is built using React for the frontend and Python/Node.js/Express.js for the backend. This application also detects postive and negative statements used to detect social media sentiment detection.

---

## Features
- Classifies statements into Political, Regional, or Sports categories.
- Utilizes a fine-tuned model for accurate sentiment analysis.
- Supports database integration with tables for `results` and `users`.

---

## Getting Started

### Step 1: Clone the Repository

### Step 2: Install Dependencies
```bash
npm install
pip install -r requirements.txt
```

### Step 3: Train the Model
Run the training script with the provided dataset:
```bash
python train_model.py
```

### Step 4: Set Up the Database
1. Create a database in MySQL.
2. Execute the SQL commands below to create the required tables:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100),
    password_hash VARCHAR(255)
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    input_text TEXT,
    category VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Step 5: Run the frontend and backend commands

1. Frontend
```bash
npm start
```
2. Start the Python backend:
   ```bash
   python app.py
   ```
3. Start the Node.js server:
   ```bash
   node --experimental-modules server.mjs
   ```

