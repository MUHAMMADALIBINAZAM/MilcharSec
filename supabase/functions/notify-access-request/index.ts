const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (request) => {
  console.info('[notify-access-request] webhook request received', { method: request.method });
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const payload = await request.json();
    const profile = payload.record;
    console.info('[notify-access-request] payload parsed', {
      event: payload.type,
      table: payload.table,
      userId: profile?.user_id,
      email: profile?.email,
      approved: profile?.approved
    });
    if (!profile || profile.approved !== false) {
      console.info('[notify-access-request] event skipped; it is not a pending profile insert');
      return new Response(JSON.stringify({ skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) { console.error('[notify-access-request] RESEND_API_KEY is missing'); throw new Error('RESEND_API_KEY is not configured'); }
    console.info('[notify-access-request] RESEND_API_KEY found; sending notification', { recipient: 'azzedits09@gmail.com' });
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'MilcharSec <onboarding@resend.dev>',
        to: ['azzedits09@gmail.com'],
        subject: `MilcharSec access request: ${profile.username}`,
        text: `A new MilcharSec access request was submitted.\n\nUsername: ${profile.username}\nEmail: ${profile.email}\n\nApprove this user by editing the "approved" field in the Supabase profiles table editor directly.`
      })
    });
    if (!response.ok) { const body = await response.text(); console.error('[notify-access-request] Resend returned an error', { status: response.status, body }); throw new Error(`Resend request failed: ${body}`); }
    console.info('[notify-access-request] notification sent', { status: response.status });
    return new Response(JSON.stringify({ sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[notify-access-request] webhook failed', { message: error?.message || String(error) });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
