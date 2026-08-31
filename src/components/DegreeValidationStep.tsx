import React, { useRef, useState } from 'react';
import { Award, FileText, GraduationCap, Upload, X } from 'lucide-react';
import { DegreeDocumentFile, DegreeDocumentKind, DegreeDocumentScope } from '../types';

const MAX_FILES_PER_ZONE = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface DegreeValidationStepProps {
  diplomas: DegreeDocumentFile[];
  actas: DegreeDocumentFile[];
  onDiplomasChange: (files: DegreeDocumentFile[]) => void;
  onActasChange: (files: DegreeDocumentFile[]) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isPdfFile = (file: DegreeDocumentFile): boolean =>
  file.mimeType === 'application/pdf' || file.fileName.toLowerCase().endsWith('.pdf');

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

interface DegreeDropzoneProps {
  kind: DegreeDocumentKind;
  title: string;
  description: string;
  icon: React.ReactNode;
  files: DegreeDocumentFile[];
  onChange: (files: DegreeDocumentFile[]) => void;
}

const DegreeDropzone: React.FC<DegreeDropzoneProps> = ({
  kind,
  title,
  description,
  icon,
  files,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const atLimit = files.length >= MAX_FILES_PER_ZONE;

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const remainingSlots = MAX_FILES_PER_ZONE - files.length;
    const oversized = incoming.filter((file) => file.size > MAX_FILE_BYTES);
    const withinSize = incoming.filter((file) => file.size <= MAX_FILE_BYTES);
    const accepted = withinSize.slice(0, remainingSlots);
    const truncated = withinSize.length > remainingSlots;

    if (accepted.length === 0) {
      if (atLimit) {
        setError(`Máximo ${MAX_FILES_PER_ZONE} archivos en esta zona.`);
      } else if (oversized.length > 0) {
        setError('Cada archivo debe pesar 10 MB o menos.');
      }
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const newFiles: DegreeDocumentFile[] = await Promise.all(
      accepted.map(async (file, index) => ({
        id: `${kind}-${Date.now()}-${index}-${file.name}`,
        kind,
        scope: files.length + index === 0 ? 'medico' : 'especializacion',
        fileName: file.name,
        mimeType: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        previewUrl: await readFileAsDataUrl(file),
        sizeBytes: file.size,
      }))
    );

    if (oversized.length > 0 && truncated) {
      setError('Algunos archivos no se cargaron: máximo 6 por zona y 10 MB cada uno.');
    } else if (oversized.length > 0) {
      setError('Algunos archivos superan 10 MB y no se cargaron.');
    } else if (truncated) {
      setError(`Máximo ${MAX_FILES_PER_ZONE} archivos en esta zona. Se cargaron los que cabían.`);
    } else {
      setError(null);
    }

    onChange([...files, ...newFiles]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const setScope = (id: string, scope: DegreeDocumentScope) => {
    onChange(files.map((file) => (file.id === id ? { ...file, scope } : file)));
  };

  const removeFile = (id: string) => {
    onChange(files.filter((file) => file.id !== id));
    setError(null);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="relative group cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-violet-500 hover:bg-violet-50/20 transition-all text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
          Cargar uno o varios archivos
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">Soporta JPG, PNG o PDF (Máx 10MB)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,image/*"
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`Cargar ${title.toLowerCase()}`}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-start gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-2"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {isPdfFile(file) ? (
                  <FileText className="w-4 h-4 text-violet-600" />
                ) : (
                  <img src={file.previewUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate">{file.fileName}</p>
                  <p className="text-[11px] text-slate-400">{formatFileSize(file.sizeBytes)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setScope(file.id, 'medico')}
                    className={`min-h-[44px] px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                      file.scope === 'medico'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Médico
                  </button>
                  <button
                    type="button"
                    onClick={() => setScope(file.id, 'especializacion')}
                    className={`min-h-[44px] px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                      file.scope === 'especializacion'
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Especialización
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                aria-label={`Quitar ${file.fileName}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
};

export const DegreeValidationStep: React.FC<DegreeValidationStepProps> = ({
  diplomas,
  actas,
  onDiplomasChange,
  onActasChange,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Validación de grado</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Adjunta diplomas y actas. Este paso es opcional; puedes omitirlo y subirlos después.
        </p>
      </div>

      <DegreeDropzone
        kind="diploma"
        title="Diplomas"
        description="Título de médico y de especialización. Puedes adjuntar varios."
        icon={<Award className="w-5 h-5" />}
        files={diplomas}
        onChange={onDiplomasChange}
      />

      <DegreeDropzone
        kind="acta"
        title="Actas de grado"
        description="Actas de médico y de especialización. Puedes adjuntar varias."
        icon={<GraduationCap className="w-5 h-5" />}
        files={actas}
        onChange={onActasChange}
      />
    </div>
  );
};
