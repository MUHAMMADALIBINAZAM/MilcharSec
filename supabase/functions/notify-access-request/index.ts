const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const payload = await request.json();
    const profile = payload.record;
    if (!profile || profile.approved !== false) {
      return new Response(JSON.stringify({ skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
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
    if (!response.ok) throw new Error(`Resend request failed: ${await response.text()}`);
    return new Response(JSON.stringify({ sent: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
