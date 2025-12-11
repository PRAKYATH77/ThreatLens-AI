(async () => {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'browser@test.com', password: 'loginpassword123' }),
    });
    console.log('Status:', res.status);
    const text = await res.text();
    try {
      console.log('Body:', JSON.parse(text));
    } catch (e) {
      console.log('Body (raw):', text);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
  }
})();
