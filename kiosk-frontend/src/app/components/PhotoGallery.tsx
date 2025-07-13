"use client";
import { useState } from "react";
import Image from "next/image";

interface Photo {
  id: number;
  filename: string;
  url: string;
  thumb_url: string;
}

interface Props {
  photos: Photo[];
  selected: number[];
  toggleSelect: (id: number) => void;
}

export default function PhotoGallery({ photos, selected, toggleSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-16">
          <p>Nenhuma foto encontrada.</p>
        </div>
      ) : (
        photos.map((photo) => (
          <div
            key={photo.id}
            className={`relative group rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${selected.includes(photo.id) ? 'ring-4 ring-blue-500' : ''}`}
            onClick={() => toggleSelect(photo.id)}
          >
            <Image
              src={`http://localhost:8000${photo.thumb_url}`}
              alt={photo.filename}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white font-semibold truncate">{photo.filename}</p>
            </div>
            <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${selected.includes(photo.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <span className="text-white font-bold text-lg">
                {selected.includes(photo.id) ? "Selecionada" : "Selecionar"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
