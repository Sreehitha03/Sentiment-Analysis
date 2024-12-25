from flask import Flask, request, jsonify
from transformers import BartForSequenceClassification, BartTokenizer
import torch


app = Flask(__name__)


model_path = "D:/fine_tuned_bart_model"  
tokenizer = BartTokenizer.from_pretrained(model_path)
model = BartForSequenceClassification.from_pretrained(model_path, ignore_mismatched_sizes=True)


sentiment_labels = ["Political", "Regional", "Sports"]  

@app.route('/api/sentiment', methods=['POST']) 
def sentiment_analysis():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=256)

        
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predicted_class_idx = torch.argmax(logits, dim=-1).item()

        sentiment = sentiment_labels[predicted_class_idx]

        return jsonify({"sentiment": sentiment, "message": text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  
