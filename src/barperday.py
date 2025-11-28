import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
import os

filename = os.path.join("data", "raw", "parking_data.json")

# Load JSON data
with open(filename, "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Convert timestamp and apply timezone correction
df['timestamp'] = pd.to_datetime(df['timestamp'], errors="coerce")
df['timestamp'] = df['timestamp'] - pd.Timedelta(hours=4, minutes=5)

# Filter for Garage C, 2025-09-22, hours 6-23
df = df[(df['name'] == "Garage H")]
df['hour'] = df['timestamp'].dt.hour
df['date'] = df['timestamp'].dt.date
mask = (df['date'] == pd.to_datetime('2025-09-22').date()) & (df['hour'] >= 6) & (df['hour'] <= 24)
df_filtered = df[mask].copy()

# Round/floor timestamps to nearest 30-minute interval
df_filtered['interval'] = df_filtered['timestamp'].dt.floor('H')

# Group by 30-minute intervals and compute average occupancy
interval_summary = df_filtered.groupby('interval')['occupancy_rate'].mean().reset_index()

# Plot
plt.figure(figsize=(12,6))
sns.barplot(
    data=interval_summary,
    x='interval',
    y='occupancy_rate',
    color='steelblue'
)
plt.title("Garage C Occupancy on 2025-09-22 (06:00–23:00, 30-min intervals)")
plt.xlabel("Time")
plt.ylabel("Average Occupancy Rate")
plt.xticks(rotation=45)

# Optional: reduce x-ticks for clarity
plt.gca().set_xticks(plt.gca().get_xticks()[::2])

plt.tight_layout()
plt.show()
