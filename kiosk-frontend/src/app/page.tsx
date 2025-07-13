"use client";
import { useState, useEffect } from "react";
import Head from 'next/head';
import { Search, Upload, ShoppingCart, X } from 'lucide-react';
import UploadPhoto from "./UploadPhoto";
import PhotoGallery from "./components/PhotoGallery";
import CartSidebar from "./components/CartSidebar";
import QRCodeModal from "./components/QRCodeModal";

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const PAGE_SIZE = 12;

  const fetchPhotos = () => {
    setLoading(true);
    fetch(`http://localhost:8000/photos?q=${encodeURIComponent(q)}&offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`)
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
    fetch(`http://localhost:8000/cart`)
      .then((res) => res.json())
      .then((data) => {
        setSelected(data.map((p: any) => p.id));
      });
    // eslint-disable-next-line
  }, [q, page]);

  const toggleSelect = (id: number) => {
    const isSelected = selected.includes(id);
    const endpoint = `http://localhost:8000/cart/${id}`;
    const method = isSelected ? 'DELETE' : 'POST';

    fetch(endpoint, { method })
      .then(res => res.json())
      .then(data => {
        setSelected(data.map((p: any) => p.id));
      });
  };

  const handleCheckout = () => {
    fetch(`http://localhost:8000/pay`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.qr_code_base64) {
          setQrCode(data.qr_code_base64);
          pollPaymentStatus(data.payment_id);
        }
      });
  };

  const pollPaymentStatus = (paymentId: string) => {
    const interval = setInterval(() => {
      fetch(`http://localhost:8000/payment-status/${paymentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'approved') {
            clearInterval(interval);
            setQrCode("");
            setIsCartOpen(false);
            alert("Pagamento aprovado! Suas fotos serão enviadas em breve.");
          }
        });
    }, 2000);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Head>
        <title>Galeria de Fotos do Evento</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Galeria de Fotos</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={q}
              onChange={e => { setPage(0); setQ(e.target.value); }}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={loading}
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <Upload size={24} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ShoppingCart size={24} />
            {selected.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selected.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <UploadPhoto onUpload={() => { setPage(0); fetchPhotos(); }} />

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando fotos...</p>
          </div>
        ) : (
          <>
            <PhotoGallery photos={photos} selected={selected} toggleSelect={toggleSelect} />
            <div className="flex justify-center items-center gap-4 mt-8">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0 || loading} className="px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <span className="text-gray-700">Página {page + 1}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={!hasNext || loading} className="px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        selectedPhotos={photos.filter(p => selected.includes(p.id))}
        onRemove={toggleSelect}
        onCheckout={handleCheckout}
      />

      <QRCodeModal qrCode={qrCode} onClose={() => setQrCode("")} />
    </div>
  );
}
