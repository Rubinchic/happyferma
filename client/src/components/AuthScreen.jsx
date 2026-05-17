import React, { useState } from 'react'
import useStore from '../store/gameStore.js'

export default function AuthScreen() {
  const { login, register, knownUsers } = useStore()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    if (!name.trim() || !pass.trim()) return setError('Введіть ім\'я та пароль!')
    setLoading(true); setError('')
    const err = await login(name.trim(), pass.trim())
    setLoading(false)
    if (err) setError(err)
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!name.trim() || !pass.trim() || !pass2.trim()) return setError('Заповніть усі поля!')
    if (name.trim().length < 2) return setError('Ім\'я занадто коротке!')
    if (pass.length < 4) return setError('Пароль занадто короткий!')
    if (pass !== pass2) return setError('Паролі не співпадають!')
    setLoading(true); setError('')
    const err = await register(name.trim(), pass.trim())
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div id="authScreen">
      <div className="auth-box">
        <div className="auth-title">Весела Ферма</div>
        <div className="auth-tabs">
          <button className={'auth-tab-btn' + (mode === 'login' ? ' active' : '')} onClick={() => { setMode('login'); setError('') }}>Вхід</button>
          <button className={'auth-tab-btn' + (mode === 'register' ? ' active' : '')} onClick={() => { setMode('register'); setError('') }}>Реєстрація</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <input className="auth-input" placeholder="Ім'я фермера" value={name} onChange={e => setName(e.target.value)} autoComplete="username" />
            <input className="auth-input" type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" />
            {error && <div className="auth-error">{error}</div>}
            {knownUsers.length > 0 && (
              <div className="auth-known">
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>Раніше заходили:</p>
                {knownUsers.map(u => {
                  const n = u.displayName || u.name || u
                  return <span key={n} className="account-chip" onClick={() => setName(u.name || u)}>{n}</span>
                })}
              </div>
            )}
            <button className="auth-btn" disabled={loading}>{loading ? '⏳ Вхід...' : '🌻 Увійти'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input className="auth-input" placeholder="Ім'я фермера" value={name} onChange={e => setName(e.target.value)} autoComplete="username" />
            <input className="auth-input" type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} autoComplete="new-password" />
            <input className="auth-input" type="password" placeholder="Підтвердіть пароль" value={pass2} onChange={e => setPass2(e.target.value)} autoComplete="new-password" />
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-btn" disabled={loading}>{loading ? '⏳ Реєстрація...' : '🌱 Зареєструватись'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
