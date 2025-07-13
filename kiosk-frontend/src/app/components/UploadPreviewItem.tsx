import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export default function UploadPreviewItem({ file, onRemove, disabled }: Props) {
  const [thumbUrl, setThumbUrl] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = e => setThumbUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="uploadPreviewItem">
      {thumbUrl && (
        <Image src={thumbUrl} alt={file.name} width={54} height={54} className="uploadThumb" />
      )}
      <div className="uploadPreviewInfo">
        <span className="uploadPreviewName">{file.name}</span>
        <button type="button" className="uploadRemoveBtn" onClick={onRemove} disabled={disabled}>Remover</button>
      </div>
    </div>
  );
}
