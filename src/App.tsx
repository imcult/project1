import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Focus from './pages/Focus';
import Donate from './pages/Donate';
import { SceneUtils } from './utils/SceneUtils';
import { ViewData } from './client/ViewData';

// 场景初始化函数，在React组件渲染之前初始化场景
SceneUtils.loadScene(ViewData.Scenes.MatrixFlow);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/donate" element={<Donate />} />
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

