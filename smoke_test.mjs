const BASE = 'http://localhost:3000';
let pass = 0, fail = 0;

function check(label, condition, extra = '') {
  if (condition) { console.log(`  ✓ ${label}${extra ? ' — ' + extra : ''}`); pass++; }
  else           { console.log(`  ✗ ${label}${extra ? ' — ' + extra : ''}`); fail++; }
}

async function run() {
  console.log('\n=== Finance API Smoke Test ===\n');

  // 1. Register Admin
  const reg1 = await fetch(`${BASE}/api/auth/register`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:'Test Admin',email:'smk_admin@t.com',password:'pass1234',role:'ADMIN'})
  }).then(r=>r.json());
  check('Register ADMIN', reg1.status === 'success' || reg1.message?.includes('already'), reg1.data?.email || reg1.message);

  // 2. Register Viewer
  const reg2 = await fetch(`${BASE}/api/auth/register`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:'Test Viewer',email:'smk_viewer@t.com',password:'pass1234',role:'VIEWER'})
  }).then(r=>r.json());
  check('Register VIEWER', reg2.status === 'success' || reg2.message?.includes('already'), reg2.data?.email || reg2.message);

  // 3. Register Analyst
  const reg3 = await fetch(`${BASE}/api/auth/register`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name:'Test Analyst',email:'smk_analyst@t.com',password:'pass1234',role:'ANALYST'})
  }).then(r=>r.json());
  check('Register ANALYST', reg3.status === 'success' || reg3.message?.includes('already'), reg3.data?.email || reg3.message);

  // 4. Login Admin
  const login1 = await fetch(`${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email:'smk_admin@t.com',password:'pass1234'})
  }).then(r=>r.json());
  const adminToken = login1.data?.token;
  check('Login ADMIN', !!adminToken, adminToken ? 'got JWT' : login1.message);

  // 5. Login Viewer
  const login2 = await fetch(`${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email:'smk_viewer@t.com',password:'pass1234'})
  }).then(r=>r.json());
  const viewerToken = login2.data?.token;
  check('Login VIEWER', !!viewerToken, viewerToken ? 'got JWT' : login2.message);

  // 6. Login Analyst
  const login3 = await fetch(`${BASE}/api/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email:'smk_analyst@t.com',password:'pass1234'})
  }).then(r=>r.json());
  const analystToken = login3.data?.token;
  check('Login ANALYST', !!analystToken, analystToken ? 'got JWT' : login3.message);

  console.log('');

  // 7. Admin creates records
  const cr1 = await fetch(`${BASE}/api/records`, {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${adminToken}`},
    body: JSON.stringify({amount:5000,type:'INCOME',category:'Salary',date:'2024-01-15',notes:'Test salary'})
  });
  const cr1j = await cr1.json();
  check('ADMIN create record (INCOME)', cr1.status === 201, `id=${cr1j.data?.id?.slice(0,8)}`);

  const cr2 = await fetch(`${BASE}/api/records`, {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${adminToken}`},
    body: JSON.stringify({amount:1500,type:'EXPENSE',category:'Rent',date:'2024-01-20'})
  });
  check('ADMIN create record (EXPENSE)', cr2.status === 201);

  // 8. Viewer tries to create (403)
  const cr3 = await fetch(`${BASE}/api/records`, {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${viewerToken}`},
    body: JSON.stringify({amount:100,type:'INCOME',category:'Gift',date:'2024-01-01'})
  });
  check('VIEWER blocked from create (expect 403)', cr3.status === 403);

  // 9. All roles can view records
  const rec1 = await fetch(`${BASE}/api/records`,{headers:{'Authorization':`Bearer ${viewerToken}`}}).then(r=>r.json());
  check('VIEWER can read records', rec1.status === 'success', `total=${rec1.data?.total}`);

  // 10. Filter records
  const rec2 = await fetch(`${BASE}/api/records?type=INCOME&page=1&limit=5`,{headers:{'Authorization':`Bearer ${adminToken}`}}).then(r=>r.json());
  check('Filter records by type=INCOME', rec2.status === 'success', `${rec2.data?.records?.length} result(s)`);

  console.log('');

  // 11. Analytics - ADMIN ✓
  const ana1 = await fetch(`${BASE}/api/analytics/summary`,{headers:{'Authorization':`Bearer ${adminToken}`}}).then(r=>r.json());
  check('ADMIN get analytics summary', ana1.status === 'success');
  if (ana1.status === 'success') {
    console.log(`    Income: $${ana1.data.totalIncome}  Expenses: $${ana1.data.totalExpenses}  Net: $${ana1.data.netBalance}`);
    console.log(`    Categories: ${JSON.stringify(ana1.data.categoryTotals)}`);
  }

  // 12. Analytics - Analyst ✓
  const ana2 = await fetch(`${BASE}/api/analytics/summary`,{headers:{'Authorization':`Bearer ${analystToken}`}}).then(r=>r.json());
  check('ANALYST get analytics summary', ana2.status === 'success');

  // 13. Analytics - Viewer ✗ (403)
  const ana3 = await fetch(`${BASE}/api/analytics/summary`,{headers:{'Authorization':`Bearer ${viewerToken}`}});
  check('VIEWER blocked from analytics (expect 403)', ana3.status === 403);

  console.log('');

  // 14. Zod validation
  const val1 = await fetch(`${BASE}/api/records`,{
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${adminToken}`},
    body: JSON.stringify({amount:-999,type:'WRONG',date:'not-a-date',category:''})
  });
  const val1j = await val1.json();
  check('Bad input returns 400', val1.status === 400, `${val1j.errors?.length || 0} validation error(s)`);

  // 15. Admin manage users
  const users = await fetch(`${BASE}/api/users`,{headers:{'Authorization':`Bearer ${adminToken}`}}).then(r=>r.json());
  check('ADMIN list users', users.status === 'success', `${users.data?.length} users`);

  // 16. Viewer cannot list users (403)
  const users2 = await fetch(`${BASE}/api/users`,{headers:{'Authorization':`Bearer ${viewerToken}`}});
  check('VIEWER blocked from user list (expect 403)', users2.status === 403);

  // 17. No token = 401
  const noauth = await fetch(`${BASE}/api/records`);
  check('No token returns 401', noauth.status === 401);

  console.log(`\n=== Results: ${pass} passed, ${fail} failed ===\n`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
