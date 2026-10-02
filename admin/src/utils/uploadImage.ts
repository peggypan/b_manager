import { callCloud, CloudFunctions, isMockMode } from '../api/client';

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File) {
  if (!ACCEPT.includes(file.type)) {
    throw new Error('仅支持 JPG、PNG、WebP、GIF');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('单张图片不超过 2MB');
  }
}

/** 上传图片，Mock 返回 dataUrl；接入云开发后由云函数写入云存储并返回 HTTPS/fileID */
export async function uploadImageFile(file: File): Promise<string> {
  validateImageFile(file);
  const dataUrl = await readFileAsDataUrl(file);

  if (isMockMode()) {
    const { url } = await callCloud<{ url: string }>(CloudFunctions.uploadImage, {
      dataUrl,
      name: file.name,
      mime: file.type,
    });
    return url;
  }

  const { url } = await callCloud<{ url: string }>(CloudFunctions.uploadImage, {
    dataUrl,
    name: file.name,
    mime: file.type,
  });
  return url;
}
