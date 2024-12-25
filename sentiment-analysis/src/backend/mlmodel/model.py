from transformers import BartForSequenceClassification, BartTokenizer
import torch

model_path = "D:/fine_tuned_bart_model"  
model = BartForSequenceClassification.from_pretrained(model_path)
tokenizer = BartTokenizer.from_pretrained(model_path)

categories = ['Political', 'Regional', 'Sports']  


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def predict_category(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)
    with torch.no_grad():
        logits = model(**inputs).logits
    predicted_class_idx = torch.argmax(logits, dim=-1).item()
    return categories[predicted_class_idx]


