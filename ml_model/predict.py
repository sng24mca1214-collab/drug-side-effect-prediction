import pandas as pd
import os

# ---------------- PATH SETUP ----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

CONCEPT_FILE = os.path.join(DATASET_DIR, "concept.tsv")
STATS_FILE = os.path.join(DATASET_DIR, "standard_drug_outcome_statistics.tsv")


# ---------------- MAIN FUNCTION ----------------
def predict_side_effects(drug_name: str):
    # ---------- Load datasets ----------
    try:
        concepts = pd.read_csv(CONCEPT_FILE, sep="\t", low_memory=False)
        stats = pd.read_csv(STATS_FILE, sep="\t", low_memory=False)
    except Exception as e:
        return {"error": f"Dataset load failed: {str(e)}"}

    # ---------- Find drug concept ID ----------
    drug_row = None
    name_column = None

    for col in concepts.columns:
        if "name" in col.lower():
            name_column = col
            matched = concepts[
                concepts[col].astype(str).str.lower() == drug_name.lower()
            ]
            if not matched.empty:
                drug_row = matched
                break

    if drug_row is None or drug_row.empty:
        return {"error": "Drug not found in dataset"}

    # Drug concept ID (always first column in AEOLUS concept.tsv)
    drug_id = drug_row.iloc[0, 0]

    # ---------- Find matching rows in statistics ----------
    drug_id_col = stats.columns[0]  # AEOLUS uses first column for drug concept
    drug_stats = stats[stats[drug_id_col] == drug_id]

    if drug_stats.empty:
        return {
            "drug": drug_name,
            "risk": "Low",
            "side_effects": []
        }

    # ---------- Detect PRR column ----------
    prr_col = None
    for col in drug_stats.columns:
        if "prr" in col.lower():
            prr_col = col
            break

    if prr_col is None:
        return {"error": "PRR column not found in statistics file"}

    # ---------- Convert PRR to numeric ----------
    drug_stats[prr_col] = pd.to_numeric(
        drug_stats[prr_col],
        errors="coerce"
    )

    drug_stats = drug_stats.dropna(subset=[prr_col])

    if drug_stats.empty:
        return {
            "drug": drug_name,
            "risk": "Low",
            "side_effects": []
        }

    # ---------- Top side effects ----------
    top = drug_stats.sort_values(prr_col, ascending=False).head(5)

    avg_prr = top[prr_col].mean()

    # ---------- Risk classification ----------
    if avg_prr >= 3:
        risk = "High"
    elif avg_prr >= 1.5:
        risk = "Medium"
    else:
        risk = "Low"

    # ---------- Output ----------
    side_effects = [
        {
            "name": f"Side Effect {i + 1}",
            "prr": round(float(row[prr_col]), 2)
        }
        for i, (_, row) in enumerate(top.iterrows())
    ]

    return {
        "drug": drug_name,
        "risk": risk,
        "average_prr": round(float(avg_prr), 2),
        "side_effects": side_effects
    }
