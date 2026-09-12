const fs = require('fs');

const extra = `
NEXT_PUBLIC_SUPABASE_URL="https://ucvicxjvcsojpbwkydkf.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdmljeGp2Y3NvanBid2t5ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxODE4NTgsImV4cCI6MjEwNDc1Nzg1OH0.GN8IHp1FfyBSHiUoUKizHrclFcssqPey1DlRoKX7caQ"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_P3NANrdw-Loh_gttKkfVCA_BTWKkOr4"
`;

fs.appendFileSync('.env.local', extra);
console.log('Chaves canônicas gravadas em .env.local com sucesso!');
