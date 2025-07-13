"use client";
import { useState } from "react";

interface Props {
  onUpload?: () => void;
}

import UploadPreviewItem from "./components/UploadPreviewItem";

export default function UploadPhoto({ onUpload }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Drag and drop handlers
  const [dragActive, setDragActive] = useState(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setSuccess(false);
    setError("");
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...dropped]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError("");
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;
    setLoading(true);
    setSuccess(false);
    setError("");
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file, file.name);
    });
    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Erro ao enviar os arquivos`);
      setSuccess(true);
      setFiles([]);
      if (onUpload) onUpload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (idx: number) => {
    setFiles(files => files.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleUpload} className="uploadContainer">
      <h3 className="uploadTitle">Upload de Fotos</h3>
      <div
        className={`uploadDrop${dragActive ? ' uploadDropActive' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        Arraste e solte imagens ou pastas aqui<br />
        <span style={{ fontSize: 13, color: '#888' }}>(ou clique para selecionar)</span>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          webkitdirectory="true"
          directory="true"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>
      {files.length > 0 && (
        <div className="uploadPreviewList">
          {files.map((f, i) => (
            <UploadPreviewItem key={i} file={f} onRemove={() => handleRemove(i)} disabled={loading} />
          ))}
        </div>
      )}
      <button type="submit" className="uploadBtn" disabled={loading || !files.length}>
        {loading ? "Enviando..." : `Enviar ${files.length} arquivo(s)`}
      </button>
      {success && <div className="uploadSuccess">Upload realizado!</div>}
      {error && <div className="uploadError">{error}</div>}
    </form>
  );
}
