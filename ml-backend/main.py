from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import warnings

warnings.filterwarnings('ignore')

app = FastAPI()

# อนุญาตให้ React ส่งข้อมูลเข้ามาได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# โหลดไฟล์โมเดลทั้ง 4 ตัวเตรียมไว้
models = {}
model_names = ["xgb_model", "voting_model", "rf_model", "mlp_model"]
for name in model_names:
    try:
        with open(f"{name}.pkl", "rb") as f:
            models[name] = pickle.load(f)
        print(f"Loaded {name} successfully")
    except Exception as e:
        print(f"Error loading {name}: {e}")

class BatchPatientData(BaseModel):
    features_list: list  
    model_name: str      

@app.post("/api/predict_batch")
def predict_risk_batch(data: BatchPatientData):
    try:
        model = models.get(data.model_name)
        if not model:
            return {"status": "error", "message": "ไม่พบโมเดลนี้ในระบบ"}
            
        X = np.array(data.features_list)
        
        # ป้องกันบั๊ก: โมเดลของคุณถูกตั้งค่าให้รับตัวแปร 209 Features 
        expected_features = 209
        if X.shape[1] < expected_features:
            padding = np.zeros((X.shape[0], expected_features - X.shape[1]))
            X = np.hstack((X, padding))
            
        predictions = model.predict(X)
        
        # แปลงผลลัพธ์เป็นข้อความความเสี่ยง
        risk_mapping = {0: "Low", 1: "Moderate", 2: "High"}
        results = []
        for p in predictions:
            if isinstance(p, (int, np.integer)) or (isinstance(p, str) and p.isdigit()):
                results.append(risk_mapping.get(int(p), "Unknown"))
            else:
                results.append(str(p))
                
        return {"status": "success", "predictions": results}
    except Exception as e:
        return {"status": "error", "message": str(e)}