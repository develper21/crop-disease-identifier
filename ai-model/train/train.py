# ml/train/train.py

import torch
import torchvision as tv
from torchvision import transforms, models
from torch.utils.data import DataLoader
from torch import nn
from pathlib import Path

# --- Configuration ---
# Yeh script apne parent folder se ek level upar jakar 'data' aur 'models' folder dhoondhegi.
# Isse structure clean rehta hai: ml/data, ml/models
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
MODELS_DIR = Path(__file__).resolve().parents[1] / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True) # Agar 'models' folder nahi hai to bana dega.

# Model ke parameters
BATCH_SIZE = 32
LEARNING_RATE = 3e-4
EPOCHS = 15 # Aap ise 10-20 ke beech rakh sakte hain

def main():
    # --- Data Augmentation and Loading ---
    # Training data ke liye transformations (images ko randomly flip, crop, color change karna)
    # Isse model naye images par behtar perform karta hai.
    train_tf = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(0.2, 0.2, 0.2, 0.1),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]), # Standard values for ImageNet models
    ])
    
    # Validation data ke liye transformations (sirf resize aur crop)
    val_tf = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

    # Datasets ko 'data/train' aur 'data/val' folder se load karna
    train_ds = tv.datasets.ImageFolder(str(DATA_DIR / "train"), transform=train_tf)
    val_ds = tv.datasets.ImageFolder(str(DATA_DIR / "val"), transform=val_tf)
    
    # DataLoaders: Data ko batches me divide karte hain
    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE*2, shuffle=False, num_workers=4)

    print(f"Training on {len(train_ds)} images, validating on {len(val_ds)} images.")
    print(f"Found classes: {train_ds.classes}")

    # --- Model Definition ---
    num_classes = len(train_ds.classes)
    # Pehle se train kiya hua EfficientNet-B0 model load karna (Transfer Learning)
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
    # Aakhri layer ko hamare project ke hisab se badalna (jitni classes, utne outputs)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)

    # Device select karna: Agar GPU (CUDA) hai to use kare, warna CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    print(f"Using device: {device}")

    # --- Training Loop ---
    criterion = nn.CrossEntropyLoss() # Loss function
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE) # Optimizer
    best_acc, best_path = 0.0, MODELS_DIR / "model_best.pt"

    for epoch in range(EPOCHS):
        # Training phase
        model.train()
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            logits = model(imgs)
            loss = criterion(logits, labels)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        # Validation phase
        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                logits = model(imgs)
                preds = logits.argmax(1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
        
        acc = correct / total
        print(f"Epoch {epoch+1}/{EPOCHS}: Validation Accuracy = {acc:.4f}")

        # Sabse best model ko save karna
        if acc > best_acc:
            best_acc = acc
            torch.save({
                "state_dict": model.state_dict(),
                "classes": train_ds.classes,
            }, str(best_path))
            print(f"-> New best model saved to {best_path} with accuracy: {best_acc:.4f}")

    print(f"\nTraining complete. Best validation accuracy: {best_acc:.4f}")

if __name__ == "__main__":
    main()