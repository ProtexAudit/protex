// ============================================================
// PROTEX — ScreenshotScanner Component
// Drag & drop image → OCR → AI threat analysis
// ============================================================

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scanImage } from '@/api/vision'
import { ResultCard } from './ResultCard'
import { LoadingSpinner } from './LoadingSpinner'
import { useProtexStore } from '@/services/store'
import type { ScanResult } from '@/types'
import { toast } from 'react-hot-toast'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE  = 5 * 1024 * 1024 // 5MB

export function ScreenshotScanner() {
  const [isDragging, setIsDragging]         = useState(false)
  const [preview, setPreview]               = useState<string | null>(null)
  const [fileName, setFileName]             = useState<string | null>(null)
  const [isScanning, setIsScanning]         = useState(false)
  const [result, setResult]                 = useState<ScanResult | null>(null)
  const [extractedText, setExtractedText]   = useState<string>('')
  const [error, setError]                   = useState<string | null>(null)
  const fileRef  = useRef<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { stats } = useProtexStore()
  const updateStats = useProtexStore(s => s.setResult)

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Format tidak didukung. Gunakan JPG, PNG, atau WebP.')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Ukuran file maksimal 5MB.')
      return
    }
    fileRef.current = file
    setFileName(file.name)
    setResult(null)
    setExtractedText('')
    setError(null)

    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const runScan = async () => {
    if (!fileRef.current) return
    setIsScanning(true)
    setError(null)

    try {
      const res = await scanImage(fileRef.current)
      setResult(res)
      setExtractedText(res.extractedText)
      // Update global stats
      useProtexStore.getState().setResult('scam', res)

      toast(`🔍 Scan selesai: ${res.riskLevel} RISK`, {
        duration: 3000,
        style: { background: '#0E0E0E', color: '#F0EAD6', border: '1px solid rgba(201,168,76,0.3)' },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      toast.error(`Scan gagal: ${msg}`)
    } finally {
      setIsScanning(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setFileName(null)
    setResult(null)
    setExtractedText('')
    setError(null)
    fileRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="screenshot-scanner">
      <p className="sec-label">Upload screenshot untuk dianalisis</p>

      {/* Drop Zone */}
      {!preview && (
        <motion.div
          className={`drop-zone ${isDragging ? 'drop-zone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          whileHover={{ borderColor: 'rgba(201,168,76,0.5)' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          <div className="drop-zone__icon">📸</div>
          <div className="drop-zone__title">Drag & Drop Screenshot</div>
          <div className="drop-zone__sub">atau klik untuk pilih file</div>
          <div className="drop-zone__hint">JPG, PNG, WebP · Maks 5MB</div>
        </motion.div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="screenshot-preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="screenshot-preview__header">
              <span className="screenshot-preview__name">📎 {fileName}</span>
              <button className="screenshot-preview__remove" onClick={reset}>✕ Hapus</button>
            </div>
            <img src={preview} alt="preview" className="screenshot-preview__img" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Text Preview */}
      <AnimatePresence>
        {extractedText && (
          <motion.div
            className="extracted-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="extracted-text__label">TEKS YANG DIEKSTRAK</div>
            <div className="extracted-text__content">{extractedText}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      {preview && (
        <div className="btn-row" style={{ marginTop: 12 }}>
          <span className="char-count">
            {fileName} · {fileRef.current ? Math.round(fileRef.current.size / 1024) : 0} KB
          </span>
          <button
            className="scan-btn"
            onClick={runScan}
            disabled={isScanning}
          >
            {isScanning ? <LoadingSpinner size={16} /> : null}
            {isScanning ? 'MENGANALISIS...' : '📸 SCAN SCREENSHOT'}
          </button>
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 16 }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
