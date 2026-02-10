import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
print("🔥 Flask starting with ML")

from flask import Flask, request, jsonify
from ml_model.predict import predict_side_effects

app = Flask(__name__)

@app.route("/predict")
def predict():
    drug = request.args.get("drug")
    if not drug:
        return jsonify({"error": "Drug name required"}), 400

    result = predict_side_effects(drug)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
