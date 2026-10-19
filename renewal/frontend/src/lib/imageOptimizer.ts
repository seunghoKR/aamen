/**
 * AAMEN Smart Image Optimizer & Auto Resizer
 * 브라우저 Canvas를 활용한 초고속 클라이언트 사이드 이미지 리사이징 & 압축 유틸리티
 */

export interface OptimizedResult {
  file: File
  originalSize: number
  compressedSize: number
  width: number
  height: number
  previewUrl: string
  name: string
}

export interface OptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'image/webp' | 'image/jpeg'
}

/**
 * 바이트 단위를 읽기 쉬운 문자열로 변환 (예: 1.45 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * 단일 이미지 리사이징 및 압축
 * 스마트폰/카메라 고해상도(4K/8K, 10~20MB) 사진을 웹 최적화(1600px, 200~500KB)로 자동 경량화
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizedResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.85,
    format = 'image/webp',
  } = options

  // 이미지가 아닌 경우 그대로 반환
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      width: 0,
      height: 0,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }
  }

  // GIF나 SVG는 리사이징 건너뛰고 원본 유지 (애니메이션/벡터 보존)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      width: 0,
      height: 0,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('이미지 파일을 읽을 수 없습니다.'))

    img.onload = () => {
      let { width, height } = img

      // 종횡비 유지 리사이징 비율 계산
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        // Canvas 미지원시 원본 반환
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          width: img.width,
          height: img.height,
          previewUrl: URL.createObjectURL(file),
          name: file.name,
        })
        return
      }

      // 고품질 보간 설정
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // WebP 또는 JPEG Blob 변환
      const outputFormat = format
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file,
              originalSize: file.size,
              compressedSize: file.size,
              width,
              height,
              previewUrl: URL.createObjectURL(file),
              name: file.name,
            })
            return
          }

          // 압축된 결과가 원본보다 크다면 원본 유지 (작은 파일의 경우)
          const finalBlob = blob.size < file.size ? blob : file
          const isWebP = outputFormat === 'image/webp' && blob.size < file.size
          const extension = isWebP ? '.webp' : '.jpg'
          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
          const newFileName = `${baseName}${extension}`

          const optimizedFile = new File([finalBlob], newFileName, {
            type: finalBlob.type || (isWebP ? 'image/webp' : 'image/jpeg'),
            lastModified: Date.now(),
          })

          const previewUrl = URL.createObjectURL(optimizedFile)

          resolve({
            file: optimizedFile,
            originalSize: file.size,
            compressedSize: optimizedFile.size,
            width,
            height,
            previewUrl,
            name: newFileName,
          })
        },
        outputFormat,
        quality
      )
    }

    img.onerror = () => reject(new Error('이미지 파싱 중 오류가 발생했습니다.'))
    reader.readAsDataURL(file)
  })
}

/**
 * 다중 이미지 일괄 자동 리사이징 & 압축
 */
export async function optimizeMultipleImages(
  files: FileList | File[],
  options: OptimizeOptions & {
    onProgress?: (current: number, total: number) => void
  } = {}
): Promise<OptimizedResult[]> {
  const fileArray = Array.from(files)
  const results: OptimizedResult[] = []

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i]
    try {
      const optimized = await optimizeImage(file, options)
      results.push(optimized)
    } catch (e) {
      console.warn(`이미지 [${file.name}] 압축 실패, 원본 유지`, e)
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        width: 0,
        height: 0,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      })
    }
    options.onProgress?.(i + 1, fileArray.length)
  }

  return results
}
