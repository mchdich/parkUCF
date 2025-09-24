import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import os

DATA_DIR = "data"  # constants are UPPERCASE
os.makedirs(DATA_DIR, exist_ok=True)  # make data dir if not already existent
filename = os.path.join(DATA_DIR, "parking_data.json")

# Load JSON data
with open(filename, "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)

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


# Average occupancy grouped by garage, day, and hour
avg_occupancy = df.groupby(['name', 'day_of_week', 'hour'])['occupancy_rate'].mean().reset_index()

# Encode garage name
encoder = OneHotEncoder(sparse=False)
garage_encoded = encoder.fit_transform(df[['name']])

X = pd.concat([
    pd.DataFrame(garage_encoded, columns=encoder.get_feature_names_out(['name'])),
    df[['day_of_week', 'hour', 'minute']]
], axis=1)

y = df['occupancy_rate']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

# Fit model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)