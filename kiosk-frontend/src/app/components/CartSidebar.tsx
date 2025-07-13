"use client";
import { X } from "lucide-react";

interface Photo {
  id: number;
  filename: string;
  thumb_url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedPhotos: Photo[];
  onRemove: (id: number) => void;
  onCheckout: () => void;
  loading: boolean;
}

export default function CartSidebar({ isOpen, onClose, selectedPhotos, onRemove, onCheckout, loading }: Props) {
  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold">Seu Carrinho</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
          <X size={24} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto h-[calc(100%-160px)]">
        {selectedPhotos.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          <ul className="space-y-4">
            {selectedPhotos.map(photo => (
              <li key={photo.id} className="flex items-center gap-4">
                <img src={`http://localhost:8000${photo.thumb_url}`} alt={photo.filename} className="w-16 h-16 rounded-md object-cover" />
                <span className="flex-grow truncate">{photo.filename}</span>
                <button onClick={() => onRemove(photo.id)} className="text-red-500 hover:text-red-700">
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white">
        <button
          onClick={onCheckout}
          disabled={selectedPhotos.length === 0 || loading}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Processando..." : `Finalizar Compra (${selectedPhotos.length} ${selectedPhotos.length === 1 ? 'item' : 'itens'})`}
        </button>
      </div>
    </div>
  );
}
