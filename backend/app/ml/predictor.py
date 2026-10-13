import os
import json
import logging
from typing import Dict, Any, Optional
import joblib
import numpy as np

from app.ml.features import FEATURE_NAMES, vector_from_feature_dict
from app.ml.trainer import train_random_forest_model

logger = logging.getLogger("scamshield.ml.predictor")

CLASS_MAPPING = {
    0: "LOW_RISK",
    1: "MEDIUM_RISK",
    2: "HIGH_RISK"
}

class FraudPredictor:
    _model = None
    _metadata = None

    @classmethod
    def get_paths(cls):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_file = os.path.join(base_dir, "saved_model.joblib")
        meta_file = os.path.join(base_dir, "saved_metadata.json")
        return model_file, meta_file

    @classmethod
    def load_model(cls):
        model_file, meta_file = cls.get_paths()
        if not os.path.exists(model_file) or not os.path.exists(meta_file):
            logger.info("ML model not found on disk. Initiating initial training run...")
            res = train_random_forest_model(save_to_disk=True)
            cls._model = res["model"]
            cls._metadata = res["metadata"]
            return cls._model, cls._metadata

        if cls._model is None:
            try:
                cls._model = joblib.load(model_file)
                with open(meta_file, "r", encoding="utf-8") as f:
                    cls._metadata = json.load(f)
                logger.info(f"Loaded ML model: {cls._metadata.get('model_version')}")
            except Exception as e:
                logger.error(f"Error loading ML model: {e}")
                res = train_random_forest_model(save_to_disk=True)
                cls._model = res["model"]
                cls._metadata = res["metadata"]

        return cls._model, cls._metadata

    @classmethod
    def get_status(cls) -> Dict[str, Any]:
        _, meta = cls.load_model()
        if meta:
            return {
                "is_trained": True,
                "model_version": meta.get("model_version", "RF-v1.0"),
                "trained_at": meta.get("trained_at"),
                "algorithm": meta.get("algorithm", "RandomForestClassifier"),
                "evaluation_summary": meta.get("evaluation_summary"),
                "dataset_description": meta.get("dataset_description"),
                "feature_importances": meta.get("feature_importances")
            }
        return {
            "is_trained": False,
            "model_version": "N/A",
            "trained_at": None,
            "algorithm": "RandomForestClassifier",
            "evaluation_summary": None,
            "dataset_description": None,
            "feature_importances": None
        }

    @classmethod
    def predict(cls, features_dict: Dict[str, float]) -> Dict[str, Any]:
        """
        Executes prediction with data sufficiency verification.
        If reports count is 0, returns INSUFFICIENT_DATA without making a premature ML guess.
        """
        approved_count = features_dict.get("approved_reports_count", 0.0)
        
        # Insufficient Data Check
        if approved_count <= 0:
            return {
                "status": "INSUFFICIENT_DATA",
                "model_version": cls._metadata.get("model_version", "RF-v1.0") if cls._metadata else "RF-v1.0",
                "risk_label": "INSUFFICIENT_DATA",
                "fraud_probability": None,
                "is_sufficient_data": False,
                "explanation": "No verified community reports exist for this identifier. Random Forest ML classification requires historical feature signals (velocity, loss amount, distinct sources) to infer fraud probability accurately.",
                "top_features": None
            }

        model, meta = cls.load_model()
        import pandas as pd
        X_df = pd.DataFrame([{name: features_dict.get(name, 0.0) for name in FEATURE_NAMES}])
        
        try:
            pred_class = int(model.predict(X_df)[0])
            probs = model.predict_proba(X_df)[0]
            # Fraud probability is probability of class 1 or 2 (medium/high risk)
            fraud_prob = float(probs[1] + probs[2]) if len(probs) > 2 else float(probs[-1])
            risk_label = CLASS_MAPPING.get(pred_class, "MEDIUM_RISK")
            
            # Construct human-readable academic explanation
            importances = meta.get("feature_importances", {}) if meta else {}
            explanation_parts = []
            if features_dict.get("approved_reports_count", 0) >= 3:
                explanation_parts.append(f"repeated verified reports ({int(features_dict['approved_reports_count'])})")
            if features_dict.get("total_loss_amount", 0) > 10000:
                explanation_parts.append(f"significant aggregate loss (₹{features_dict['total_loss_amount']:,.0f})")
            if features_dict.get("distinct_reporters", 0) > 1:
                explanation_parts.append(f"multiple independent victim sources ({int(features_dict['distinct_reporters'])})")
            
            if not explanation_parts:
                explanation_parts.append(f"single report with ₹{features_dict.get('total_loss_amount', 0):,.0f} loss")
                
            explanation = (
                f"Random Forest model classified as {risk_label.replace('_', ' ')} "
                f"with {round(fraud_prob * 100, 1)}% fraud probability based on "
                f"{', '.join(explanation_parts)}."
            )
            
            return {
                "status": "SUCCESS",
                "model_version": meta.get("model_version", "RF-v1.0") if meta else "RF-v1.0",
                "risk_label": risk_label,
                "fraud_probability": round(fraud_prob, 4),
                "is_sufficient_data": True,
                "explanation": explanation,
                "top_features": importances
            }
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {
                "status": "ERROR",
                "model_version": meta.get("model_version", "RF-v1.0") if meta else "RF-v1.0",
                "risk_label": "INSUFFICIENT_DATA",
                "fraud_probability": None,
                "is_sufficient_data": False,
                "explanation": f"Model inference error: {str(e)}",
                "top_features": None
            }
