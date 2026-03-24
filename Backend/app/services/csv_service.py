import pandas as pd

def analyze_csv_file(file):
    """
    Read CSV and return basic summary statistics.
    """
    try:
        df = pd.read_csv(file.file)
        summary = df.describe(include='all').to_dict()
        return summary
    except Exception as e:
        return {"error": str(e)}
    

def analyze_dataframe(df):

    # Missing values
    missing_counts = df.isnull().sum()

    # Duplicate rows
    duplicate_count = df.duplicated().sum()

    # Statistics
    stats = df.describe().to_dict()

    # Shape
    rows, col = df.shape

    # Detect Outliers
    numeric_cols = df.select_dtypes(include=['number']).columns
    outliers = {}

    for column in numeric_cols:
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1

        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        outlier_count = df[(df[column] < lower) | (df[column] > upper)].shape[0]

        outliers[column] = int(outlier_count)
        correlation = df.corr(numeric_only=True).to_dict()
    return {
        "rows": rows,
        "columns": col,
        "missing_values": missing_counts.to_dict(),
        "duplicate_rows": int(duplicate_count),
        "statistics": stats,
        "outliers": outliers,
        "correlation": correlation
    }