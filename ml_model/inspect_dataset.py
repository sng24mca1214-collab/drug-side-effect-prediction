import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

CONCEPT_FILE = os.path.join(DATASET_DIR, "concept.tsv")
STATS_FILE = os.path.join(DATASET_DIR, "standard_drug_outcome_statistics.tsv")


def predict_side_effects(drug_name: str):
    # Load concept file (NO headers)
    concepts = pd.read_csv(
        CONCEPT_FILE,
        sep="\t",
        header=None,
        low_memory=False
    )

    # Rename essential columns manually (OMOP standard order)
    concepts = concepts.rename(columns={
        0: "concept_id",
        1: "concept_name",
        2: "domain_id",
        3: "vocabulary_id"
    })

    # Load statistics file normally
    stats = pd.read_csv(
        STATS_FILE,
        sep="\t",
        low_memory=False
    )

    # 🔍 Find drug concept
    drug_row = concepts[
        (concepts["concept_name"].astype(str).str.lower() == drug_name.lower()) &
        (concepts["domain_id"] == "Drug")
    ]

    if drug_row.empty:
        return {"error": "Drug not found in AEOLUS dataset"}

    drug_id = drug_row.iloc[0]["concept_id"]

    # 📊 Filter statistics by drug
    drug_stats = stats[stats["drug_concept_id"] == drug_id]

    if drug_stats.empty:
        return {
            "drug": drug_name,
            "risk": "Low",
            "side_effects": []
        }

    # 🔝 Top 5 outcomes by PRR
    top = drug_stats.sort_values("prr", ascending=False).head(5)

    avg_prr = top["prr"].mean()

    if avg_prr >= 3:
        risk = "High"
    elif avg_prr >= 1.5:
        risk = "Medium"
    else:
        risk = "Low"

    # 🧾 Map outcome IDs to names
    outcome_ids = top["outcome_concept_id"].tolist()

    outcome_rows = concepts[
        concepts["concept_id"].isin(outcome_ids)
    ]

    outcome_map = dict(
        zip(outcome_rows["concept_id"], outcome_rows["concept_name"])
    )

    side_effects = []
    for _, row in top.iterrows():
        side_effects.append({
            "name": outcome_map.get(row["outcome_concept_id"], "Unknown"),
            "prr": round(row["prr"], 2)
        })

    return {
        "drug": drug_name,
        "risk": risk,
        "side_effects": side_effects
    }
