import pandas as pd
import numpy as np

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

def calculate_indices(measured: dict):
    """
    Calculate HPI, HEI, MPI, CF, Cd, and PLI for a single sample.
    
    measured: dict of {metal: concentration in mg/L}
    """
    metals = {m: v for m, v in measured.items() if m in STANDARDS}
    if not metals:
        raise ValueError("No valid metals found in measured data!")

    # ---- 1. HPI ----
    K = 1 / sum(1 / STANDARDS[m] for m in metals)          # constant for weights
    weights = {m: K / STANDARDS[m] for m in metals}        # Wi
    sub_indices = {m: ((metals[m] - IDEALS[m]) / (STANDARDS[m] - IDEALS[m])) * 100 for m in metals}
    HPI = sum(sub_indices[m] * weights[m] for m in metals)

    # ---- 2. HEI (Heavy Metal Evaluation Index) ----
    HEI = sum(metals[m] / STANDARDS[m] for m in metals)

    # ---- 3. MPI (Metal Pollution Index - geometric mean of concentrations) ----
    MPI = float(np.prod(list(metals.values())) ** (1.0 / len(metals)))

    # ---- 4. CF (Contamination Factor) and Cd (Degree of Contamination) ----
    CF = {m: metals[m] / STANDARDS[m] for m in metals}
    Cd = sum(CF.values())

    # ---- 5. PLI (Pollution Load Index) ----
    PLI = float(np.prod(list(CF.values())) ** (1.0 / len(CF)))

    return {
        "HPI": HPI,
        "HEI": HEI,
        "MPI": MPI,
        "CF": CF,
        "Cd": Cd,
        "PLI": PLI,
        "SubIndices": sub_indices,
        "Weights": weights
    }

# Read the input CSV
df = pd.read_csv('sample.csv')

# Calculate indices for each row and add as new columns
results = df.apply(lambda row: calculate_indices({metal: row[metal] for metal in STANDARDS if metal in row}), axis=1)
df['HPI'] = results.apply(lambda x: x['HPI'])
df['HEI'] = results.apply(lambda x: x['HEI'])
df['MPI'] = results.apply(lambda x: x['MPI'])
df['Cd'] = results.apply(lambda x: x['Cd'])
df['PLI'] = results.apply(lambda x: x['PLI'])

# Write the updated DataFrame to output.csv
output_columns = ['Sample_ID', 'Latitude', 'Longitude', 'HPI', 'HEI', 'MPI', 'Cd', 'PLI']
df[output_columns].to_csv('output.csv', index=False)

