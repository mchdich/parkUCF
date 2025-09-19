import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder


data = []
with open("parking_data_AH.jsonl") as f:
    for line in f:
        data.append(json.loads(line))

df = pd.DataFrame(data)
df['timestamp'] = pd.to_datetime(df['timestamp'])
sns.lineplot(data=df, x='hour', y='occupancy_rate', hue='name')
plt.show()
avg_occupancy = df.groupby(['name','day_of_week','hour'])['occupancy_rate'].mean().reset_index()

# Encode garage name
encoder = OneHotEncoder(sparse=False)
garage_encoded = encoder.fit_transform(df[['name']])

X = pd.concat([
    pd.DataFrame(garage_encoded, columns=encoder.get_feature_names_out(['name'])),
    df[['day_of_week','hour','minute']]
], axis=1)

y = df['occupancy_rate']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)