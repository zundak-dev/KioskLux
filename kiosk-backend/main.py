from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List, Optional
from pydantic import BaseModel
import os
import shutil

app = FastAPI()

# Permitir acesso do frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

# Mock de modelo de foto
class Photo(BaseModel):
    id: int
    filename: str
    url: str
    thumb_url: str
    is_favorited: bool = False

cart: List[Photo] = []

from uuid import uuid4
from PIL import Image

# Remove mock de dados fixos

def list_photos():
    files = [f for f in os.listdir(STATIC_DIR) if not f.startswith("thumb_") and (f.lower().endswith(".jpg") or f.lower().endswith(".jpeg") or f.lower().endswith(".png") or f.lower().endswith(".webp"))]
    photos = []
    for idx, fname in enumerate(sorted(files)):
        thumb = f"thumb_{fname}"
        thumb_path = os.path.join(STATIC_DIR, thumb)
        if not os.path.exists(thumb_path):
            # Gera thumb (128x128) se possível
            try:
                im = Image.open(os.path.join(STATIC_DIR, fname))
                im.thumbnail((128,128))
                im.save(thumb_path)
            except Exception:
                thumb = fname
        photos.append(Photo(
            id=idx+1,
            filename=fname,
            url=f"/static/{fname}",
            thumb_url=f"/static/{thumb}",
        ))
    return photos

@app.get("/photos", response_model=List[Photo])
def get_photos(
    q: Optional[str] = Query(None, description="Filtro por nome de arquivo"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    photos = list_photos()
    if q:
        photos = [p for p in photos if q.lower() in p.filename.lower()]
    return photos[offset:offset+limit]

@app.post("/cart/{photo_id}", response_model=List[Photo])
def add_to_cart(photo_id: int):
    photos = list_photos()
    photo = next((p for p in photos if p.id == photo_id), None)
    if photo and photo not in cart:
        cart.append(photo)
    return cart

@app.delete("/cart/{photo_id}", response_model=List[Photo])
def remove_from_cart(photo_id: int):
    global cart
    cart = [p for p in cart if p.id != photo_id]
    return cart

@app.get("/cart", response_model=List[Photo])
def get_cart():
    return cart

@app.post("/upload", response_model=Photo)
def upload_photo(file: UploadFile = File(...), filename: str = Form(...)):
    # Salvar arquivo enviado com nome único se já existir
    fname = filename
    file_path = os.path.join(STATIC_DIR, fname)
    if os.path.exists(file_path):
        base, ext = os.path.splitext(fname)
        fname = f"{base}_{uuid4().hex[:6]}{ext}"
        file_path = os.path.join(STATIC_DIR, fname)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Gera thumb
    thumb = f"thumb_{fname}"
    thumb_path = os.path.join(STATIC_DIR, thumb)
    try:
        im = Image.open(file_path)
        im.thumbnail((128,128))
        im.save(thumb_path)
    except Exception:
        shutil.copyfile(file_path, thumb_path)
    # Retorna foto recém-enviada
    return Photo(
        id=0,
        filename=fname,
        url=f"/static/{fname}",
        thumb_url=f"/static/{thumb}",
    )

@app.get("/static/{file_path}")
def serve_static(file_path: str):
    return FileResponse(os.path.join(STATIC_DIR, file_path))

@app.get("/")
def root():
    return {"status": "Kiosk backend online"}
