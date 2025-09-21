from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all domains
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB upload limit

@app.route('/process-csv', methods=['POST'])
def process_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    try:
        df = pd.read_csv(file)
        # --- Default permissible limits (BIS/WHO, mg/L) ---
        STANDARDS = {
            "Pb": 0.01,
            "Cd": 0.003,
            "Cr": 0.05,
            "As": 0.01,
            "Hg": 0.001,
            "Ni": 0.02,
            "Fe": 0.3,
            "Zn": 5.0,
            "Cu": 0.05,
            "Mn": 0.1
        }
        IDEALS = {metal: 0 for metal in STANDARDS}
        def calculate_indices(row):
            metals = {m: row[m] for m in STANDARDS if m in row}
            if not metals:
                return {}
            K = 1 / sum(1 / STANDARDS[m] for m in metals)
            weights = {m: K / STANDARDS[m] for m in metals}
            sub_indices = {m: ((metals[m] - IDEALS[m]) / (STANDARDS[m] - IDEALS[m])) * 100 for m in metals}
            HPI = sum(sub_indices[m] * weights[m] for m in metals)
            HEI = sum(metals[m] / STANDARDS[m] for m in metals)
            MPI = float(np.prod(list(metals.values())) ** (1.0 / len(metals)))
            CF = {m: metals[m] / STANDARDS[m] for m in metals}
            Cd = sum(CF.values())
            PLI = float(np.prod(list(CF.values())) ** (1.0 / len(CF)))
            return {
                "HPI": HPI,
                "HEI": HEI,
                "MPI": MPI,
                "Cd": Cd,
                "PLI": PLI
            }
        results = []
        for _, row in df.iterrows():
            result_row = {col: row[col] for col in df.columns if col in ["Sample_ID", "Latitude", "Longitude"]}
            indices = calculate_indices(row)
            result_row.update(indices)
            results.append(result_row)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
