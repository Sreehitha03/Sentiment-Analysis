import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from datasets import Dataset
from transformers import BartForSequenceClassification, BartTokenizer, Trainer, TrainingArguments
import os

os.makedirs("D:/fine_tuned_bart_model", exist_ok=True)
os.makedirs("D:/logs", exist_ok=True)
os.makedirs("D:/transformers_cache", exist_ok=True)

# Hugging Face cache directory to D: drive
os.environ["TRANSFORMERS_CACHE"] = "D:/transformers_cache"

df = pd.read_csv("D:/downloads13.08.2024/trainingdataset.csv", encoding="ISO-8859-1")  

assert 'Text' in df.columns and 'Category' in df.columns, "Dataset must have 'Text' and 'Category' columns."
df.rename(columns={'Text': 'text', 'Category': 'category'}, inplace=True)

desired_categories = ["Political", "Regional", "Sports"]  
df = df[df['category'].isin(desired_categories)]

label_mapping = {category: idx for idx, category in enumerate(desired_categories)}
df['label'] = df['category'].map(label_mapping)


# Spliting into training and testing datasets
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df['text'], df['label'], test_size=0.2, random_state=42
)

# Data into Hugging Face Dataset Format
train_dataset = Dataset.from_dict({"text": train_texts.tolist(), "label": train_labels.tolist()})
val_dataset = Dataset.from_dict({"text": val_texts.tolist(), "label": val_labels.tolist()})

#Load Model and Tokenizer
model_name = "facebook/bart-base"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForSequenceClassification.from_pretrained(
    model_name,
    num_labels=len(desired_categories),  
    ignore_mismatched_sizes=True
)

print("Model loaded successfully.")


def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=256)

print("Tokenizing datasets...")
train_dataset = train_dataset.map(tokenize_function, batched=True)
val_dataset = val_dataset.map(tokenize_function, batched=True)
print("Tokenization complete.")


# format for PyTorch
train_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "label"])
val_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "label"])



training_args = TrainingArguments(
    output_dir="D:/fine_tuned_bart_model",  
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=8,  
    gradient_accumulation_steps=4,  
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="D:/logs",  
    logging_steps=5,
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
)


trainer.train()


model.save_pretrained("D:/fine_tuned_bart_model")
tokenizer.save_pretrained("D:/fine_tuned_bart_model")

print("Fine-tuned model saved at 'D:/fine_tuned_bart_model'")
