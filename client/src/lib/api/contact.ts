// Public enquiry submission to the Lovable Cloud enquiries table.
// The publishable key is safe in the browser; database rules allow inserts only (no public reads).
const URL_BASE = "https://gktkmdtznmwijqwfedxh.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdGttZHR6bm13aWpxd2ZlZHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzAyOTAsImV4cCI6MjA5MjM0NjI5MH0.daQDVe3wrTod7l-XECy0vaNLA3zDodBPOiHoJy7trqA";

export type ContactPayload = { name: string; organization: string; email: string; phone: string; service: string; subject: string; message: string };

export const submitContactEnquiry = async (p: ContactPayload) => {
  const res = await fetch(`${URL_BASE}/rest/v1/enquiries`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      name: p.name, organization: p.organization, email: p.email, phone: p.phone,
      enquiry_type: "Other", products_needed: `Service: ${p.service}\nSubject: ${p.subject}\n\n${p.message}`, source: "website-contact",
    }),
  });
  if (!res.ok) throw new Error("We could not send your enquiry. Please try again or call us.");
};
