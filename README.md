# Sentiment Analysis

This is a sentiment analysis web application that utilizes a fine-tuned model to classify statements into three categories: **Political**, **Regional**, and **Sports**. The application is built using React for the frontend and Python/Node.js/Express.js for the backend.

---

## Features
- Classifies statements into Political, Regional, or Sports categories.
- Utilizes a fine-tuned model for accurate sentiment analysis.
- Supports database integration with tables for `results` and `users`.

---

## Techstack
Ensure the following are installed on your system:
- **Node.js** (v14 or later)
- **Python** (v3.8 or later)
- **Express.js**
- **React.js**
- **MySQL** (for database setup)

---

## Getting Started

### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd sentiment-analysis
```

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

### Step 5: Start the Backend Servers
Run the following commands in separate terminals:

1. Start the Python backend:
   ```bash
   python app.py
   ```
2. Start the Node.js server:
   ```bash
   node --experimental-modules server.mjs
   ```

### Step 6: Start the Frontend
Launch the React application:
```bash
npm start
```

---

## Training Dataset
The training dataset contains labeled examples for the categories: **Political**, **Regional**, and **Sports**.

---

## Usage
1. Access the application in your browser at `http://localhost:3000`.
2. Enter a statement to analyze its sentiment.
3. The application will display the predicted category.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
