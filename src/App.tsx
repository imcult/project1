import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Focus from './pages/Focus';

// ref: https://reactrouter.com/start/declarative/routing

// 场景初始化函数
function loadScene() {
  // 读取URL参数中的scene
  const urlParams = new URLSearchParams(window.location.search);
  let scene = urlParams.get('scene');
  
  // 如果URL中没有scene参数，则从cookie中读取
  if (!scene) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'scene') {
        scene = value;
        break;
      }
    }
  }
  
  // 根据scene值调用相应的安装函数
  if (scene === '2rings') {
    (window as any).installScene_2Rings?.();
  } else {  // 默认调用matrix场景
    (window as any).installScene_Matrix?.();
  }
}

// 在React组件渲染之前初始化场景
loadScene();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="focus" element={<Focus />} />
        {/* 
        // /dashboard, /dashboard/settings
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

