"use client";

interface Props {
  qrCode: string;
  onClose: () => void;
}

export default function QRCodeModal({ qrCode, onClose }: Props) {
  if (!qrCode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Pague com PIX</h2>
        <p className="text-gray-600 mb-6">Escaneie o código QR com seu aplicativo de banco para finalizar a compra.</p>
        <img src={`data:image/jpeg;base64,${qrCode}`} alt="QR Code PIX" className="mx-auto" />
        <p className="mt-4 text-sm text-gray-500">Aguardando confirmação de pagamento...</p>
        <button onClick={onClose} className="mt-6 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}
