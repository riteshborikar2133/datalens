from fastapi import FastAPI
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CSV Analysis API")

origin = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origin,
    allow_credentials = True,
    allow_methods= ['*'],
    allow_headers = ['*']
)

app.include_router(routes.router)
@app.get("/")   
async def root():
    return {"message":"Welcome to CSV analysis"}