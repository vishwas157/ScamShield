import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Tuple
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from app.ml.dataset import generate_synthetic_dataset
from app.ml.features import FEATURE_NAMES
from app.core.config import settings

logger = logging.getLogger("scamshield.ml.trainer")

def train_random_forest_model(
    n_estimators: int = 100,
    max_depth: int = 8,
    random_state: int = 42,
    save_to_disk: bool = True
) -> Dict[str, Any]:
    """
    Trains a genuine RandomForestClassifier on benchmark synthetic fraud pattern data.
    Computes rigorous evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
    """
    logger.info("Generating synthetic fraud benchmark dataset...")
    df = generate_synthetic_dataset(n_samples=700, random_state=random_state)
    
    X = df[FEATURE_NAMES]
    y = df["fraud_class"]
    
    # 80/20 train/test split with stratification to preserve class distributions
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_state, stratify=y
    )
    
    logger.info(f"Training RandomForestClassifier on {len(X_train)} samples, evaluating on {len(X_test)} samples...")
    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=random_state,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)
    
    # Evaluation
    y_pred = clf.predict(X_test)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    # Feature importances
    importances = {name: round(float(imp), 4) for name, imp in zip(FEATURE_NAMES, clf.feature_importances_)}
    # Sort by importance descending
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    
    model_version = f"RF-v1.0-{datetime.utcnow().strftime('%Y%m%d')}"
    
    metadata = {
        "model_version": model_version,
        "algorithm": "RandomForestClassifier",
        "parameters": {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "random_state": random_state
        },
        "trained_at": datetime.utcnow().isoformat(),
        "dataset_description": "Synthetic financial fraud benchmark simulating Indian mobile/UPI frequency, velocity, and financial loss metrics (Academic Demonstration).",
        "feature_names": FEATURE_NAMES,
        "feature_importances": sorted_importances,
        "evaluation_summary": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        }
    }
    
    if save_to_disk:
        model_dir = os.path.dirname(os.path.abspath(__file__))
        model_file = os.path.join(model_dir, "saved_model.joblib")
        meta_file = os.path.join(model_dir, "saved_metadata.json")
        
        joblib.dump(clf, model_file)
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
        logger.info(f"Model saved to {model_file}")
        logger.info(f"Metadata saved to {meta_file}")
        
    return {
        "model": clf,
        "metadata": metadata
    }

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = train_random_forest_model()
    print("Training finished successfully!")
    print(json.dumps(result["metadata"], indent=2))
