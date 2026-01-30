# ml/inference/app.py

import torch
import torch.nn.functional as F
import requests
from io import BytesIO
from pathlib import Path
from PIL import Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torchvision.transforms as T
from torchvision import models
import sys
import os

# Add utils directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from coloredLogger import colored_logger

# FastAPI app initialize karna
app = FastAPI(title="Crop Disease Detection API")

# --- Model Path Configuration ---
# Yahan bhi 'models' folder ka path dynamically set kiya gaya hai
MODELS_DIR = Path(__file__).resolve().parents[1] / "models"
CKPT_PATH = MODELS_DIR / "model_best.pt"

# --- Pydantic Models for API ---
# Input me kya aayega (image_url)
class PredictIn(BaseModel):
    image_url: str

# --- Model Loading ---
# Yeh function API start hote hi model ko memory me load kar leta hai
def load_model():
    try:
        if not CKPT_PATH.exists():
            colored_logger.log_model_loading(str(CKPT_PATH), False, {"error": "Model file not found"})
            raise FileNotFoundError(f"Model checkpoint not found at {CKPT_PATH}")
        
        # Checkpoint se model aur classes ka naam load karna
        ckpt = torch.load(str(CKPT_PATH), map_location="cpu")
        classes = ckpt["classes"]
        num_classes = len(classes)
        
        # Model ka structure banana
        model = models.efficientnet_b0(weights=None)
        model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
        
        # Trained weights load karna
        model.load_state_dict(ckpt["state_dict"])
        model.eval() # Model ko evaluation mode me set karna
        
        colored_logger.log_model_loading(str(CKPT_PATH), True, {
            "classes": len(classes),
            "model_type": "efficientnet_b0",
            "device": "cpu"
        })
        
        return model, classes
    except Exception as e:
        colored_logger.log_model_loading(str(CKPT_PATH), False, {"error": str(e)})
        raise

# API start hone par model load ho jayega
try:
    model, classes = load_model()
    colored_logger.success('MODEL', 'INITIALIZATION', 'Model initialized successfully')
except Exception as e:
    colored_logger.failed('MODEL', 'INITIALIZATION', f'Model initialization failed: {str(e)}')
    model, classes = None, []

# Image ko model ke input ke liye taiyar karne wale transformations
tf = T.Compose([
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# --- API Endpoint ---
@app.get("/")
def read_root():
    colored_logger.info('API', 'GET /', 'Root endpoint accessed')
    return {"message": "Welcome to the Crop Disease Detection API. Use the /predict endpoint to get predictions."}

@app.post("/predict")
def predict(inp: PredictIn):
    operation_id = f"PREDICT_{hash(inp.image_url) % 10000:04d}"
    
    # Step 1: Image URL se image download karna
    try:
        colored_logger.info('API', 'POST /predict', f'Starting prediction for {operation_id}', {"image_url": inp.image_url})
        
        r = requests.get(inp.image_url, timeout=10)
        r.raise_for_status() # Agar download me error ho to exception raise karega
        
        colored_logger.log_image_processing('DOWNLOAD', True, {
            "operation_id": operation_id,
            "image_size": len(r.content),
            "content_type": r.headers.get('content-type', 'unknown')
        })
    except Exception as e:
        colored_logger.log_image_processing('DOWNLOAD', False, {
            "operation_id": operation_id,
            "error": str(e)
        })
        colored_logger.log_prediction(inp.image_url, False, {"error": "Image fetch failed", "operation_id": operation_id})
        raise HTTPException(status_code=400, detail=f"Image fetch failed: {e}")

    # Step 2: Image ko process karna
    try:
        img = Image.open(BytesIO(r.content)).convert("RGB")
        x = tf(img).unsqueeze(0) # Transformations apply karna aur batch dimension add karna
        
        colored_logger.log_image_processing('TRANSFORM', True, {
            "operation_id": operation_id,
            "image_shape": img.size,
            "tensor_shape": x.shape
        })
    except Exception as e:
        colored_logger.log_image_processing('TRANSFORM', False, {
            "operation_id": operation_id,
            "error": str(e)
        })
        colored_logger.log_prediction(inp.image_url, False, {"error": "Image processing failed", "operation_id": operation_id})
        raise HTTPException(status_code=400, detail=f"Image processing failed: {e}")

    # Step 3: Model se prediction lena
    try:
        with torch.no_grad():
            logits = model(x)
            probs = F.softmax(logits, dim=1)[0].tolist()

        colored_logger.log_prediction(inp.image_url, True, {
            "operation_id": operation_id,
            "confidence_scores": probs,
            "max_confidence": max(probs)
        })
    except Exception as e:
        colored_logger.log_prediction(inp.image_url, False, {
            "error": str(e),
            "operation_id": operation_id
        })
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    # Step 4: Result ko format karna (confidence ke hisab se sort karke)
    try:
        ranked = sorted(
            [{"disease_id": None, "name": classes[i], "confidence": p} for i, p in enumerate(probs)],
            key=lambda d: d["confidence"],
            reverse=True
        )
        
        colored_logger.success('API', 'POST /predict', f'Prediction completed for {operation_id}', {
            "top_prediction": ranked[0] if ranked else None,
            "total_predictions": len(ranked)
        })
        
        return {"predictions": ranked}
    except Exception as e:
        colored_logger.failed('API', 'POST /predict', f'Result formatting failed for {operation_id}', {"error": str(e)})
        raise HTTPException(status_code=500, detail=f"Result formatting failed: {e}")

@app.get("/health")
def health_check():
    colored_logger.info('API', 'GET /health', 'Health check endpoint accessed')
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_count": len(classes) if classes else 0
    }