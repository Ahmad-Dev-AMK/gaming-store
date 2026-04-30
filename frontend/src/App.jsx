import { Routes, Route } from 'react-router-dom';
import Store from './Store';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <footer style={{
        textAlign: 'center', padding: '20px', background: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid var(--neon-cyan)', color: 'var(--text-muted)'
      }}>
        <p>جميع الحقوق محفوظة لـ ahmad (AMK) 2026 &copy;</p>
        <p>للتواصل مع المطور تيلجرام: <a href="https://t.me/AMK114" style={{ color: 'var(--neon-magenta)', textDecoration: 'none' }}>@AMK114</a></p>
      </footer>
    </div>
  );
}

export default App;
