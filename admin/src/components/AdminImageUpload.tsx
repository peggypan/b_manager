import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, message, Space, Upload } from 'antd';
import { useState } from 'react';
import { uploadImageFile } from '../utils/uploadImage';

type SingleProps = {
  value?: string;
  onChange?: (url: string | undefined) => void;
  allowUrlInput?: boolean;
  urlPlaceholder?: string;
};

/** 单图：轮播 Banner 等 */
export function AdminImageUpload({
  value,
  onChange,
  allowUrlInput = true,
  urlPlaceholder = '或粘贴图片链接（https://…）',
}: SingleProps) {
  const [uploading, setUploading] = useState(false);
  const url = value ?? '';

  const uploadOne = async (file: File) => {
    setUploading(true);
    try {
      const next = await uploadImageFile(file);
      onChange?.(next);
      message.success('图片已上传');
    } catch (e) {
      message.error(e instanceof Error ? e.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Upload
        listType="picture-card"
        accept="image/*"
        showUploadList={false}
        disabled={uploading}
        beforeUpload={(file) => {
          void uploadOne(file);
          return false;
        }}
      >
        {url ? (
          <img src={url} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'cover' }} />
        ) : (
          <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传图片</div>
          </div>
        )}
      </Upload>
      {url ? <a onClick={() => onChange?.(undefined)}>移除当前图片</a> : null}
      {allowUrlInput ? (
        <Input
          placeholder={urlPlaceholder}
          value={url}
          onChange={(e) => onChange?.(e.target.value || undefined)}
        />
      ) : null}
    </Space>
  );
}

type MultiProps = {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxCount?: number;
};

/** 多图：企业资质等 */
export function AdminImagesUpload({ value, onChange, maxCount = 9 }: MultiProps) {
  const [uploading, setUploading] = useState(false);
  const urls = value ?? [];

  const uploadOne = async (file: File) => {
    if (urls.length >= maxCount) {
      message.warning(`最多上传 ${maxCount} 张`);
      return;
    }
    setUploading(true);
    try {
      const next = await uploadImageFile(file);
      onChange?.([...urls, next]);
      message.success('图片已上传');
    } catch (e) {
      message.error(e instanceof Error ? e.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Upload
        listType="picture-card"
        accept="image/*"
        showUploadList={false}
        disabled={uploading}
        beforeUpload={(file) => {
          void uploadOne(file);
          return false;
        }}
      >
        {urls.length >= maxCount ? null : (
          <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>
      {urls.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {urls.map((src) => (
            <div key={src} style={{ position: 'relative' }}>
              <img
                src={src}
                alt=""
                style={{ width: 104, height: 104, objectFit: 'cover', borderRadius: 8 }}
              />
              <a
                style={{ position: 'absolute', right: 4, top: 4, fontSize: 12, background: '#fff' }}
                onClick={() => onChange?.(urls.filter((u) => u !== src))}
              >
                删除
              </a>
            </div>
          ))}
        </div>
      )}
      <span style={{ color: '#94a3b8', fontSize: 12 }}>
        已 {urls.length}/{maxCount} 张，接入云存储后将返回 fileID / CDN 地址
      </span>
    </Space>
  );
}
