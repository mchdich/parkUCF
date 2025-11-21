# Model
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# Data manipulation
import datetime
import numpy as np
import pandas as pd
import pandas.api.types as ptypes
from skimpy import skim, clean_columns

# Visualizations
import matplotlib.pyplot as plt
import seaborn as sns

# Pandas settings
pd.options.display.max_columns = None
pd.options.display.max_colwidth = 60
pd.options.display.float_format = '{:,.3f}'.format

# Visualization settings
from matplotlib import rcParams
plt.style.use('fivethirtyeight')
rcParams['figure.figsize'] = (16, 5)   
rcParams['axes.spines.right'] = False
rcParams['axes.spines.top'] = False
rcParams['font.size'] = 12
# rcParams['figure.dpi'] = 300
rcParams['savefig.dpi'] = 300
plt.rc('xtick', labelsize=11)
plt.rc('ytick', labelsize=11)
custom_palette = ['#003f5c', '#444e86', '#955196', '#dd5182', '#ff6e54', '#ffa600']
custom_hue = ['#004c6d', '#346888', '#5886a5', '#7aa6c2', '#9dc6e0', '#c1e7ff']
custom_divergent = ['#00876c', '#6aaa96', '#aecdc2', '#f1f1f1', '#f0b8b8', '#e67f83', '#d43d51']
sns.set_palette(custom_palette)

df = pd.read_json('data/raw/parking_data.json')
df['timestamp'] = pd.to_datetime(df['timestamp'], format='mixed')

df = df[(df['timestamp'] >= '2025-09-22') & 
        (df['timestamp'] <= '2025-10-20')]

condition = (
    (df['name'] == 'Garage D') &
    (df['timestamp'] >= '2025-10-04') &
    (df['timestamp'] <= '2025-10-20 23:59:59') &
    (df['occupancy_rate'] == 0)
)
df = df[~condition]

# -- CONFIG --
SEASONAL_PERIOD_DAILY = 720   # 2-min samples -> 720 per day
FORECAST_DAYS = 120 #~4 months
FORECAST_STEPS = FORECAST_DAYS * 24 * 30  # 2-min -> 30 samples/hour
# ------------

# Forecast for each garage
garages = df['name'].unique()
all_forecasts = {}

for g in garages:
    if g == "Garage D":
        print("Skipping Garage D (insufficient data)...")
        continue
    print(f"Processing {g}...")

    df_g = df[df['name'] == g].copy()
    df_g = df_g.set_index('timestamp')
    ts = df_g['occupancy_rate']
    
    # Reindex to a complete 2-minute interval grid
    full_idx = pd.date_range(start=ts.index.min(), end=ts.index.max(), freq='2min')
    ts = ts.reindex(full_idx)

    # Fill missing values (forward fill, backward fill, or interpolation)
    ts = ts.fillna(method='ffill')  # or ts.interpolate(method='time')

    model = ExponentialSmoothing(
        ts,
        trend="add",
        seasonal="add",
        seasonal_periods=SEASONAL_PERIOD_DAILY
    ).fit()

    fc = model.forecast(FORECAST_STEPS)
    all_forecasts[g] = fc
print("Done!")