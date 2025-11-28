import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
import os

DATA_DIR = "data"
filename = os.path.join(DATA_DIR, "parking_data.json")

# Load JSON data
with open(filename, "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Convert timestamp column and apply timezone correction if needed
df['timestamp'] = pd.to_datetime(df['timestamp'], errors="coerce")
df['timestamp'] = df['timestamp'] - pd.Timedelta(hours=4, minutes=5)  # optional

df = df[(df['name'] == "Garage H")]
df['hour'] = df['timestamp'].dt.hour
df['date'] = df['timestamp'].dt.date
mask = (df['date'] == pd.to_datetime('2025-09-22').date()) & (df['hour'] >= 6) & (df['hour'] <= 24)
df_filtered = df[mask].copy()

# Sort by timestamp for smooth lines
df_filtered = df_filtered.sort_values("timestamp")

# Plot continuous line plot by garage
plt.figure(figsize=(12, 6))
sns.lineplot(
    data=df_filtered,   # use filtered data here
    x='timestamp',
    y='occupancy_rate',
    hue='name',
    linewidth=2  # thicker lines for visibility
)
plt.title("Occupancy Rate Over Time (Garage H, 2025-09-22, 06:00–23:00)")
plt.xlabel("Time")
plt.ylabel("Occupancy Rate")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

