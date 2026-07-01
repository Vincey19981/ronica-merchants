import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/portal/ProtectedRoute";
import { PortalLayout } from "@/components/portal/PortalLayout";

const Index = lazy(() => import("./pages/Index.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const TenderServices = lazy(() => import("./pages/TenderServices.tsx"));
const ActiveTenders = lazy(() => import("./pages/ActiveTenders.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const RequestQuote = lazy(() => import("./pages/RequestQuote.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Signup = lazy(() => import("./pages/auth/Signup.tsx"));
const MfaEnroll = lazy(() => import("./pages/auth/MfaEnroll.tsx"));
const MfaVerify = lazy(() => import("./pages/auth/MfaVerify.tsx"));
const PortalDashboard = lazy(() => import("./pages/portal/Dashboard.tsx"));
const PortalProfile = lazy(() => import("./pages/portal/Profile.tsx"));
const PortalCatalog = lazy(() => import("./pages/portal/Catalog.tsx"));
const PortalCart = lazy(() => import("./pages/portal/Cart.tsx"));
const PortalTenders = lazy(() => import("./pages/portal/Tenders.tsx"));
const TenderNew = lazy(() => import("./pages/portal/TenderNew.tsx"));
const TenderDetail = lazy(() => import("./pages/portal/TenderDetail.tsx"));
const PortalOrders = lazy(() => import("./pages/portal/Orders.tsx"));
const OrderDetail = lazy(() => import("./pages/portal/OrderDetail.tsx"));
const PortalInvoices = lazy(() => import("./pages/portal/Invoices.tsx"));
const InvoiceDetail = lazy(() => import("./pages/portal/InvoiceDetail.tsx"));
const PortalTickets = lazy(() => import("./pages/portal/Tickets.tsx"));
const TicketNew = lazy(() => import("./pages/portal/TicketNew.tsx"));
const TicketDetail = lazy(() => import("./pages/portal/TicketDetail.tsx"));
const PortalAssets = lazy(() => import("./pages/portal/Assets.tsx"));
const PortalDocuments = lazy(() => import("./pages/portal/Documents.tsx"));
const AdminOrganizations = lazy(() => import("./pages/admin/Organizations.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/Users.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/Orders.tsx"));
const AdminInvoices = lazy(() => import("./pages/admin/Invoices.tsx"));
const AdminTickets = lazy(() => import("./pages/admin/Tickets.tsx"));
const AdminAssets = lazy(() => import("./pages/admin/Assets.tsx"));
const AdminAudit = lazy(() => import("./pages/admin/Audit.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/tender-services" element={<TenderServices />} />
              <Route path="/active-tenders" element={<ActiveTenders />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-quote" element={<RequestQuote />} />

              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route
                path="/auth/mfa-enroll"
                element={
                  <ProtectedRoute>
                    <MfaEnroll />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth/mfa-verify" element={<MfaVerify />} />

              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <PortalDashboard />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/profile"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <PortalProfile />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/catalog"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <PortalCatalog />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/cart"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <PortalCart />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/tenders"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <PortalTenders />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/tenders/new"
                element={
                  <ProtectedRoute roles={["procurement_officer", "admin"]}>
                    <PortalLayout>
                      <TenderNew />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/tenders/:id"
                element={
                  <ProtectedRoute>
                    <PortalLayout>
                      <TenderDetail />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="/portal/orders" element={<ProtectedRoute><PortalLayout><PortalOrders /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/orders/:id" element={<ProtectedRoute><PortalLayout><OrderDetail /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/invoices" element={<ProtectedRoute><PortalLayout><PortalInvoices /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/invoices/:id" element={<ProtectedRoute><PortalLayout><InvoiceDetail /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/tickets" element={<ProtectedRoute><PortalLayout><PortalTickets /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/tickets/new" element={<ProtectedRoute><PortalLayout><TicketNew /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/tickets/:id" element={<ProtectedRoute><PortalLayout><TicketDetail /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/assets" element={<ProtectedRoute><PortalLayout><PortalAssets /></PortalLayout></ProtectedRoute>} />
              <Route path="/portal/documents" element={<ProtectedRoute><PortalLayout><PortalDocuments /></PortalLayout></ProtectedRoute>} />

              <Route path="/admin" element={<Admin />} />
              <Route
                path="/admin/organizations"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <PortalLayout>
                      <AdminOrganizations />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <PortalLayout>
                      <AdminUsers />
                    </PortalLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><PortalLayout><AdminOrders /></PortalLayout></ProtectedRoute>} />
              <Route path="/admin/invoices" element={<ProtectedRoute roles={["admin"]}><PortalLayout><AdminInvoices /></PortalLayout></ProtectedRoute>} />
              <Route path="/admin/tickets" element={<ProtectedRoute roles={["admin"]}><PortalLayout><AdminTickets /></PortalLayout></ProtectedRoute>} />
              <Route path="/admin/assets" element={<ProtectedRoute roles={["admin"]}><PortalLayout><AdminAssets /></PortalLayout></ProtectedRoute>} />
              <Route path="/admin/audit" element={<ProtectedRoute roles={["admin"]}><PortalLayout><AdminAudit /></PortalLayout></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
