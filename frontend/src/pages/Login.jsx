import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% -20%, rgba(108, 92, 231, 0.15) 0%, var(--bg-primary) 60%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative blurred blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px',
        background: 'rgba(108, 92, 231, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: '300px', height: '300px',
        background: 'rgba(0, 206, 201, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0
      }}></div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(21, 26, 34, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(108, 92, 231, 0.1) inset'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', background: 'var(--gradient-primary)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            margin: '0 auto 24px', boxShadow: 'var(--shadow-glow)'
          }}>
            <i className="fa-solid fa-cube" style={{ color: 'white' }}></i>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue your learning journey.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <i className="fa-regular fa-envelope" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                style={{
                  width: '100%', padding: '14px 14px 14px 44px', background: 'var(--bg-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.15)';
                  e.target.previousSibling.style.color = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                  e.target.previousSibling.style.color = 'var(--text-muted)';
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '14px 14px 14px 44px', background: 'var(--bg-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.15)';
                  e.target.previousSibling.style.color = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                  e.target.previousSibling.style.color = 'var(--text-muted)';
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: '16px', width: '100%', padding: '14px', borderRadius: '12px',
              background: 'var(--gradient-primary)', color: 'white', fontSize: '1rem',
              fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? (
              <div style={{
                width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <>Sign In <i className="fa-solid fa-arrow-right"></i></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account? <a href="#" style={{ color: 'var(--accent-secondary)', fontWeight: '600', textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
