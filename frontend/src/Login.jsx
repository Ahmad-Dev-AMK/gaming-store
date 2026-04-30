import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        localStorage.setItem('is_staff', res.data.is_staff);
        navigate('/');
      } else {
        await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
        setIsLogin(true);
        setError('تم التسجيل بنجاح! يرجى تسجيل الدخول.');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ. تأكد من البيانات المدخلة.');
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="product-details-view" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }}>{isLogin ? 'تسجيل الدخول' : 'حساب جديد'}</h2>
        {error && <p style={{ color: 'var(--neon-magenta)', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input className="search-bar" style={{ width: '100%' }} type="text" placeholder="اسم المستخدم" required
                 value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          {!isLogin && (
            <input className="search-bar" style={{ width: '100%' }} type="email" placeholder="البريد الإلكتروني" required
                   value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          )}
          <input className="search-bar" style={{ width: '100%' }} type="password" placeholder="كلمة المرور" required
                 value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" className="checkout-btn" style={{ marginTop: '10px' }}>
            {isLogin ? 'دخول' : 'تسجيل'}
          </button>
        </form>
        <p style={{ marginTop: '20px', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
        </p>
      </div>
    </div>
  );
}
