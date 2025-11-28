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

df = df[df['name'].str[7].isin(['A', 'B', 'C', 'D', 'H'])]


# Convert timestamp column and add time features
df['timestamp'] = pd.to_datetime(df['timestamp'], format="mixed", errors="coerce")
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['minute'] = df['timestamp'].dt.minute

# Plot occupancy rate over time by garage
# Plot occupancy rate over full timeline by garage
plt.figure(figsize=(12, 6))
sns.lineplot(data=df.sort_values("timestamp"), x='timestamp', y='occupancy_rate', hue='name')
plt.title("Occupancy Rate Over Time (All Days)")
plt.xlabel("Time")
plt.ylabel("Occupancy Rate")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()