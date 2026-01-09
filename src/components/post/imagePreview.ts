export async function resizeImageToDataUrl(file: File, maxSize: number) {
  return new Promise<string>((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("画像の読み込みに失敗しました"));
    };

    img.src = url;
  });
}

export async function createPreviewDataUrls(files: File[], maxSize = 300) {
  return Promise.all(files.map((f) => resizeImageToDataUrl(f, maxSize)));
}
