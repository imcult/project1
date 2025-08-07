import React, { useState, useEffect } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: React.ReactNode;
  showProgress?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt = '',
  style,
  className,
  placeholder,
  //showProgress = true,
  onLoad,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    setLoading(true);
    setError(false);
    //setProgress(0);
    setImageSrc(null);

    const img = new Image();
    
    // 模拟加载进度（实际项目中可以使用真实的进度事件）
    // const progressInterval = setInterval(() => {
    //   setProgress(prev => {
    //     if (prev >= 90) {
    //       clearInterval(progressInterval);
    //       return 90;
    //     }
    //     return prev + Math.random() * 20;
    //   });
    // }, 100);

    img.onload = () => {
      //clearInterval(progressInterval);
      //setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setImageSrc(src);
        onLoad?.();
      }, 200); // 短暂延迟以显示100%进度
    };

    img.onerror = () => {
      //clearInterval(progressInterval);
      setLoading(false);
      setError(true);
      onError?.();
    };

    img.src = src;

    return () => {
      //clearInterval(progressInterval);
    };
  }, [src, onLoad, onError]);

  const defaultPlaceholder = (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      ...style
    }}>
      {/* {showProgress && (
        <>
          <div style={{
            width: '60%',
            height: '4px',
            backgroundColor: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>
            {Math.round(progress)}%
          </div>
        </>
      )} */}
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e0e0e0',
        borderTop: '3px solid #4CAF50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  const errorPlaceholder = (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffebee',
      borderRadius: '8px',
      color: '#d32f2f',
      ...style
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
      <div style={{ fontSize: '14px' }}>图片加载失败</div>
    </div>
  );

  if (error) {
    return <div className={className}>{errorPlaceholder}</div>;
  }

  if (loading) {
    return (
      // <div className={className}>
      //   {placeholder || defaultPlaceholder}
      // </div>
      placeholder || defaultPlaceholder
    );
  }

  return (
    <img
      src={imageSrc!}
      alt={alt}
      style={style}
      className={className}
    />
  );
};

export default ImageWithLoader;