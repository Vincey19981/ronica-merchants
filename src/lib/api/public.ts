import { apiRequest } from "./client";

export const publicApi = {
  submitEnquiry: (form: FormData) =>
    apiRequest<{ id: string }>("/api/public/enquiries", {
      method: "POST",
      body: form,
    }),
  submitQuoteRequest: (form: FormData) =>
    apiRequest<{ id: string }>("/api/public/quote-requests", {
      method: "POST",
      body: form,
    }),
};
