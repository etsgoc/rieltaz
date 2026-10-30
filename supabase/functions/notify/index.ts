// Sends email for new reservations, service orders and messages.
// Called by Supabase database webhooks (see supabase/emails.sql). Uses Resend.
import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM = Deno.env.get('FROM_EMAIL') ?? 'Reeltaz <onboarding@resend.dev>';
const ADMIN = Deno.env.get('ADMIN_EMAIL') ?? '';
const SECRET = Deno.env.get('WEBHOOK_SECRET') ?? '';
const SITE = (Deno.env.get('SITE_URL') ?? 'https://reeltaz.com').replace(/\/$/, '');

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

type Row = Record<string, any>;
interface Payload { type: 'INSERT' | 'UPDATE' | 'DELETE'; table: string; record: Row; old_record: Row | null }

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const label = (s: string) => { const t = s.replace(/_/g, ' '); return t[0].toUpperCase() + t.slice(1); };

function layout(title: string, lines: string[], cta?: { text: string; url: string }) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#17181a">
<h2 style="margin:0 0 16px">${esc(title)}</h2>
${lines.map(l => `<p style="margin:0 0 12px;line-height:1.5">${l}</p>`).join('')}
${cta ? `<p style="margin:24px 0"><a href="${esc(cta.url)}" style="background:#2c58d6;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">${esc(cta.text)}</a></p>` : ''}
<p style="margin:24px 0 0;color:#62666d;font-size:13px">Reeltaz</p></div>`;
}

async function send(to: string, subject: string, html: string) {
  if (!to || !RESEND_KEY) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) console.error('resend failed', res.status, await res.text());
}

async function person(userId: string) {
  const { data } = await db.from('profiles').select('email, full_name').eq('id', userId).single();
  return { email: (data?.email as string) ?? '', name: (data?.full_name as string) ?? '' };
}

async function reservation(p: Payload) {
  const r = p.record;
  const who = await person(r.user_id);
  if (p.type === 'INSERT') {
    await send(ADMIN, `New reservation request: ${r.unit_id}`, layout('New reservation request', [`${esc(who.name || who.email)} requested unit <b>${esc(r.unit_id)}</b> in ${esc(r.project_id)} (${esc(r.ownership)}).`], { text: 'Open the dashboard', url: SITE }));
    await send(who.email, 'We received your reservation request', layout('Reservation request received', [`Hi ${esc(who.name || 'there')}, we received your request for unit <b>${esc(r.unit_id)}</b>.`, 'Choose a time for a call with the developer in the app. After the call we handle the documents with you.'], { text: 'View your reservation', url: `${SITE}/account` }));
    return;
  }
  const old = p.old_record ?? {};
  if (r.meet_link && r.meet_link !== old.meet_link) {
    await send(who.email, 'Your call with the developer is confirmed', layout('Your call is confirmed', [`Your call for unit <b>${esc(r.unit_id)}</b> is set.`, r.meeting_at ? `Time: ${esc(new Date(r.meeting_at).toUTCString())}` : ''].filter(Boolean), { text: 'Join Google Meet', url: r.meet_link }));
  } else if (r.stage !== old.stage) {
    await send(who.email, `Reservation update: ${label(r.stage)}`, layout('Reservation update', [`Unit <b>${esc(r.unit_id)}</b> is now: <b>${esc(label(r.stage))}</b>.`], { text: 'View your reservation', url: `${SITE}/account` }));
  }
  if (r.meeting_at && r.meeting_at !== old.meeting_at) {
    await send(ADMIN, `Call requested for ${r.unit_id}`, layout('Call requested', [`${esc(who.name || who.email)} asked for a call about <b>${esc(r.unit_id)}</b> at ${esc(new Date(r.meeting_at).toUTCString())}. Add the Google Meet link in the dashboard.`]));
  }
}

async function order(p: Payload) {
  const o = p.record;
  const who = await person(o.user_id);
  if (p.type === 'INSERT') {
    await send(ADMIN, `New service request: ${o.service_title}`, layout('New service request', [`${esc(who.name || who.email)} requested <b>${esc(o.service_title)}</b>${o.option_label ? ` (${esc(o.option_label)})` : ''}.`, o.details?.notes ? `Notes: ${esc(o.details.notes)}` : ''].filter(Boolean), { text: 'Open the dashboard', url: SITE }));
    await send(who.email, 'We received your service request', layout('Service request received', [`Thanks, we received your request for <b>${esc(o.service_title)}</b>. We will confirm the details and your price soon.`], { text: 'View your requests', url: `${SITE}/account` }));
    return;
  }
  const old = p.old_record ?? {};
  if (o.status !== old.status) {
    const lines = [`Your request for <b>${esc(o.service_title)}</b> is now: <b>${esc(label(o.status))}</b>.`];
    if (o.final_amount != null) lines.push(`Amount: ${esc(o.final_amount)} ${esc(o.currency)}`);
    if (o.ticket_code) lines.push(`Your ticket code: <b style="letter-spacing:1px">${esc(o.ticket_code)}</b>`);
    await send(who.email, `${o.service_title}: ${label(o.status)}`, layout('Service update', lines, { text: 'View your ticket', url: `${SITE}/account` }));
  }
}

Deno.serve(async req => {
  if (!SECRET || req.headers.get('x-webhook-secret') !== SECRET) return new Response('unauthorized', { status: 401 });
  try {
    const p = (await req.json()) as Payload;
    if (p.table === 'reservations') await reservation(p);
    else if (p.table === 'service_orders') await order(p);
    else if (p.table === 'messages' && p.type === 'INSERT') {
      await send(ADMIN, `New message from ${p.record.name || p.record.email}`, layout('New message', [`<b>${esc(p.record.name)}</b> (${esc(p.record.email)})`, esc(p.record.body).replace(/\n/g, '<br>')]));
    }
    return new Response('ok');
  } catch (e) {
    console.error(e);
    return new Response('error', { status: 500 });
  }
});
