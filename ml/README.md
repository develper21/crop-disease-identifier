ML service for Crop Disease Identifier

Structure:
- data/: training and validation image folders
- models/: saved checkpoints
- train/: training code and configs
- inference/: FastAPI inference server

Quickstart:
1) Place dataset:
   - data/train/<class_name>/*.jpg
   - data/val/<class_name>/*.jpg
2) Train: see train/train.py
3) Run API locally: uvicorn inference.app:app --reload --port 8000
4) Deploy: use inference/Dockerfile on Railway/Render


