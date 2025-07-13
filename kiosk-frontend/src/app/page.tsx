"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

import { useEffect } from "react";
import UploadPhoto from "./UploadPhoto";

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]); // apenas uma definição
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const PAGE_SIZE = 8;

  const fetchPhotos = () => {
    setLoading(true);
    fetch(`http://localhost:8000/photos?q=${encodeURIComponent(q)}&offset=${page*PAGE_SIZE}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setHasNext(data.length === PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line
  }, [q, page]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Galeria de Fotos do Evento</h1>
        <UploadPhoto onUpload={() => { setPage(0); fetchPhotos(); }} />
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={q}
            onChange={e => { setPage(0); setQ(e.target.value); }}
            className={styles.searchInput}
            disabled={loading}
          />
        </div>
        {loading ? (
          <div>Carregando fotos...</div>
        ) : (
          <>
            <div className={styles.gallery + ' ' + styles.fadeIn} key={page+q+photos.length}>
              {photos.length === 0 ? (
                <div style={{color:'#888'}}>Nenhuma foto encontrada.</div>
              ) : (
                photos.map((photo: { id: number; filename: string; url: string; thumb_url: string }) => (
                  <div
                    key={photo.id}
                    className={
                      styles.photoCard + (selected.includes(photo.id) ? ' ' + styles.selected : '')
                    }
                    onClick={() => toggleSelect(photo.id)}
                  >
                    <Image
                      src={photo.thumb_url}
                      alt={photo.filename}
                      width={170}
                      height={128}
                      className={styles.photoThumb}
                    />
                    <div className={styles.photoName}>{photo.filename}</div>
                    <button
                      className={styles.selectBtn}
                    >
                      {selected.includes(photo.id) ? "Selecionada" : "Selecionar"}
                    </button>
                  </div>
                ))
              )}
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: 16, margin: '24px 0'}}>
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0 || loading}>Anterior</button>
              <span>Página {page+1}</span>
              <button onClick={() => setPage(p => p+1)} disabled={!hasNext || loading}>Próxima</button>
            </div>
          </>
        )}

        <h1>Galeria de Fotos do Evento</h1>
        <div className={styles.cartSection}>
          <h2>Carrinho</h2>
          {selected.length === 0 ? (
            <div style={{ color: "#888" }}>Nenhuma foto selecionada.</div>
          ) : (
            <ul className={styles.cartList}>
              {photos.filter((p) => selected.includes(p.id)).map((photo) => (
                <li key={photo.id}>
                  {photo.filename}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
