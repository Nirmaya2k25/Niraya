import pandas as pd

# WHO/BIS permissible limits (mg/L) for common heavy metals
STANDARDS = {
    "Pb": 0.01,    # Lead
    "Cd": 0.003,   # Cadmium
    "Cr": 0.05,    # Chromium
    "As": 0.01,    # Arsenic
    "Hg": 0.001,   # Mercury
    "Ni": 0.02,    # Nickel
    "Fe": 0.3,     # Iron
    "Zn": 5.0,     # Zinc
    "Cu": 0.05,    # Copper
    "Mn": 0.1      # Manganese
}

# Read the input CSV
df = pd.read_csv('sample.csv')

# Ideal values (usually 0 for heavy metals)
IDEALS = {metal: 0 for metal in STANDARDS}

def calculate_HPI(measured: dict):
    """
    Calculate Heavy Metal Pollution Index (HPI).
    measured: dict of {metal: concentration in mg/L}
    Returns: HPI value (float)
    """
    # Filter only metals that exist in standards
    metals = {m: v for m, v in measured.items() if m in STANDARDS}
    if not metals:
        raise ValueError("No valid metals found in measured data!")
    # Step 1: Calculate K
    denominator = sum(1 / STANDARDS[m] for m in metals)
    K = 1 / denominator
    # Step 2: Calculate weights (Wi)
    weights = {m: K / STANDARDS[m] for m in metals}
    # Step 3: Calculate sub-index Qi
    sub_indices = {}
    for m, conc in metals.items():
        Mi = conc
        Si = STANDARDS[m]
        Ii = IDEALS[m]
        Qi = ((Mi - Ii) / (Si - Ii)) * 100
        sub_indices[m] = Qi
    # Step 4: Calculate HPI (Σ Qi*Wi)
    HPI = sum(sub_indices[m] * weights[m] for m in metals)
    return HPI

# Calculate HPI for each row and add as a new column
def row_to_metal_dict(row):
    return {metal: row[metal] for metal in STANDARDS if metal in row}

df['HPI'] = df.apply(lambda row: calculate_HPI(row_to_metal_dict(row)), axis=1)

# Write the updated DataFrame to output.csv
df.to_csv('output.csv', index=False)
    
