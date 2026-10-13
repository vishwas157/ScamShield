import os
import numpy as np
import pandas as pd

def generate_synthetic_dataset(n_samples: int = 600, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a controlled, labeled synthetic benchmark dataset for training the
    Random Forest fraud classifier.
    
    Academic Note:
    In accordance with ethical academic AI practices, this dataset is explicitly synthetic 
    and engineered to simulate digital financial fraud patterns (velocity, distinct victim count, 
    loss volume, dispute rates) observed in Indian mobile/UPI ecosystems.
    It does not contain real personally identifiable information (PII).
    """
    np.random.seed(random_state)
    
    records = []
    
    # Class 0: Low Risk / Likely False Positive or Inactive Flag (35% of samples)
    n_class_0 = int(n_samples * 0.35)
    for _ in range(n_class_0):
        approved = np.random.choice([0, 1, 1], p=[0.4, 0.4, 0.2])
        distinct = 1 if approved > 0 else 0
        days_first = np.random.uniform(10, 300) if approved > 0 else 0
        days_last = np.random.uniform(days_first, 365) if approved > 0 else 0
        loss = float(np.random.choice([0, 0, 500, 1000], p=[0.6, 0.2, 0.1, 0.1]))
        severity = float(np.random.uniform(1.0, 3.0))
        disputes = int(np.random.choice([0, 1], p=[0.8, 0.2]))
        
        records.append({
            "approved_reports_count": approved,
            "distinct_reporters": distinct,
            "days_since_first_report": round(days_first, 1),
            "days_since_last_report": round(days_last, 1),
            "total_loss_amount": round(loss, 2),
            "category_severity_score": round(severity, 2),
            "dispute_count": disputes,
            "fraud_class": 0  # Low Risk
        })
        
    # Class 1: Medium Risk / Emerging Threat (35% of samples)
    n_class_1 = int(n_samples * 0.35)
    for _ in range(n_class_1):
        approved = np.random.randint(2, 4)
        distinct = np.random.randint(2, 4)
        days_first = np.random.uniform(5, 60)
        days_last = np.random.uniform(1, min(days_first, 20))
        loss = float(np.random.uniform(2000, 25000))
        severity = float(np.random.uniform(3.0, 4.2))
        disputes = int(np.random.choice([0, 1], p=[0.9, 0.1]))
        
        records.append({
            "approved_reports_count": approved,
            "distinct_reporters": distinct,
            "days_since_first_report": round(days_first, 1),
            "days_since_last_report": round(days_last, 1),
            "total_loss_amount": round(loss, 2),
            "category_severity_score": round(severity, 2),
            "dispute_count": disputes,
            "fraud_class": 1  # Medium Risk
        })
        
    # Class 2: High Risk / Confirmed Repeat Offender (30% of samples)
    n_class_2 = n_samples - n_class_0 - n_class_1
    for _ in range(n_class_2):
        approved = np.random.randint(4, 15)
        distinct = np.random.randint(3, 12)
        days_first = np.random.uniform(15, 180)
        days_last = np.random.uniform(0.5, 15)
        loss = float(np.random.uniform(25000, 300000))
        severity = float(np.random.uniform(4.0, 5.0))
        disputes = int(np.random.choice([0, 1, 2], p=[0.85, 0.1, 0.05]))
        
        records.append({
            "approved_reports_count": approved,
            "distinct_reporters": distinct,
            "days_since_first_report": round(days_first, 1),
            "days_since_last_report": round(days_last, 1),
            "total_loss_amount": round(loss, 2),
            "category_severity_score": round(severity, 2),
            "dispute_count": disputes,
            "fraud_class": 2  # High Risk
        })

    df = pd.DataFrame(records)
    # Shuffle
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    return df

def save_synthetic_dataset(output_path: str = None) -> str:
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "synthetic_dataset.csv")
    df = generate_synthetic_dataset()
    df.to_csv(output_path, index=False)
    return output_path
