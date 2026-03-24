from fastapi import APIRouter, UploadFile, File
from app.services.csv_service import analyze_csv_file, analyze_dataframe
import pandas as pd
import numpy as np
router = APIRouter(prefix="/api")

# @router.post("/analyze/")
# async def analyze_csv(file: UploadFile = File(...)):
#     # file.filename contains the uploaded CSV file's name
#     print("Uploaded CSV file name:", file.filename)
#     try:
#         file.file.seek(0)
#        # Read CSV
#         df = pd.read_csv(file.file, sep=",", encoding="utf-8")
#         print("CSV preview:\n", df.head())
        
#         # Missing values per column
#         missing_counts = df.isnull().sum()
#         print("Missing values per column:\n", missing_counts)
        
#         # Count duplicate rows
#         duplicate_count = df.duplicated().sum()
#         print("Number of duplicate rows:", duplicate_count)
        
#         # Statistics Summary
#         stats = df.describe().to_dict()

#         # row and column
#         rows,col = df.shape
#         # Return JSON-safe response
#         return {
#             "rows":rows,
#             "colums":col,
#             "file_name": f"{file.filename}",
#             "missing_values": missing_counts.to_dict(),
#             "duplicate_rows": int(duplicate_count), # convert to Python int
#             "statistics": stats
#         }
#     except Exception as e:
#         return {"error":e}




@router.post("/analyze/")
async def analyze_csv(file: UploadFile=File(...)):
    print("Uploaded CSV file name:", file.filename)
    try:
        file.file.seek(0)

        # Read CSV
        df = pd.read_csv(file.file, sep=",", encoding="utf-8")

        # Analyze data
        result = analyze_dataframe(df)

        return {
            "file_name": file.filename,
            **result
        }

    except Exception as e:
        return {"error": str(e)}  
    



# async def analyze_csv(file:UploadFile = File(...)):
#     result = analyze_csv_file(file)
#     return {"analysis":result}