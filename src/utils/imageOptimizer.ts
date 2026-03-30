/**
 * Validate image file
 */
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return 'Only PNG, JPG, and WEBP images are supported';
  }

  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeMB}MB limit`;
  }

  return null;
}

/**
 * Optimize image to fit within max dimensions
 * Returns a blob URL for the optimized image
 */
export async function optimizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > maxWidth || img.height > maxHeight) {
          const widthRatio = maxWidth / img.width;
          const heightRatio = maxHeight / img.height;
          const ratio = Math.min(widthRatio, heightRatio);

          newWidth = Math.round(img.width * ratio);
          newHeight = Math.round(img.height * ratio);
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob from canvas'));
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          },
          'image/jpeg',
          0.9, // Quality setting
        );
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Create thumbnail from image file
 */
export async function createThumbnail(file: File, size: number = 100): Promise<{ blob: Blob; url: string }> {
  return optimizeImage(file, size, size);
}
