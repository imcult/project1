import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Focus from './pages/Focus';
import { Utility } from './utils/Utility';



// 场景初始化函数
function loadScene() {
  const scene = Utility.getParamByKey('scene');
  // 根据scene值调用相应的安装函数
  if (scene === '2rings') {
    (window as any).installScene_2Rings?.();
  } else if (scene === 'yinyang') {  // 默认调用matrix场景
    (window as any).installScene_Yinyang?.();
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

