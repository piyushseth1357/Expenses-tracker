async function testMultiUser() {
  const API_URL = 'http://localhost:5000/api';

  console.log('--- Testing Multi-User Data Isolation ---');

  // 1. Register User A
  console.log('1. Registering User A (userA@gmail.com)...');
  const userA_res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User Alpha', email: 'userA@gmail.com', password: 'password123' })
  }).then(r => r.json());
  console.log('User A registered. Message:', userA_res.message);

  // 2. Add Expense for User A
  await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userA_res.token}` },
    body: JSON.stringify({ title: 'User A Laptop Purchase', amount: 65000, category: 'Shopping', date: '2026-09-15', payment_method: 'Credit Card', notes: 'Work laptop' })
  });

  // 3. Register User B
  console.log('2. Registering User B (userB@gmail.com)...');
  const userB_res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User Beta', email: 'userB@gmail.com', password: 'password456' })
  }).then(r => r.json());
  console.log('User B registered. Message:', userB_res.message);

  // 4. Add Expense for User B
  await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userB_res.token}` },
    body: JSON.stringify({ title: 'User B Coffee', amount: 250, category: 'Food & Dining', date: '2026-09-15', payment_method: 'UPI / GPay / PhonePe', notes: 'Coffee break' })
  });

  // 5. Verify User A data
  const expA = await fetch(`${API_URL}/expenses`, { headers: { Authorization: `Bearer ${userA_res.token}` } }).then(r => r.json());
  console.log('User A Expense Count:', expA.expenses.length);
  console.log('User A Expense Item:', expA.expenses[0].title);

  // 6. Verify User B data
  const expB = await fetch(`${API_URL}/expenses`, { headers: { Authorization: `Bearer ${userB_res.token}` } }).then(r => r.json());
  console.log('User B Expense Count:', expB.expenses.length);
  console.log('User B Expense Item:', expB.expenses[0].title);

  if (
    expA.expenses.length === 1 && expA.expenses[0].title.includes('User A') &&
    expB.expenses.length === 1 && expB.expenses[0].title.includes('User B')
  ) {
    console.log('=====================================================');
    console.log('🎉 SUCCESS: MULTI-USER DATA ISOLATION VERIFIED 100%!');
    console.log('=====================================================');
  } else {
    console.error('❌ Data isolation verification failed!');
  }
}

testMultiUser().catch(err => console.error(err));
