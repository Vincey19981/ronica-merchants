import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/portal/ProtectedRoute";
import { PortalLayout } from "@/components/portal/PortalLayout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Products from "./pages/Products.tsx";
import TenderServices from "./pages/TenderServices.tsx";
import ActiveTenders from "./pages/ActiveTenders.tsx";
import Contact from "./pages/Contact.tsx";
import Admin from "./pages/Admin.tsx";
import RequestQuote from "./pages/RequestQuote.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/auth/Signup.tsx";
import MfaEnroll from "./pages/auth/MfaEnroll.tsx";
import MfaVerify from "./pages/auth/MfaVerify.tsx";
import PortalDashboard from "./pages/portal/Dashboard.tsx";
import PortalProfile from "./pages/portal/Profile.tsx";
import PortalCatalog from "./pages/portal/Catalog.tsx";
import PortalCart from "./pages/portal/Cart.tsx";
import PortalTenders from "./pages/portal/Tenders.tsx";
import TenderNew from "./pages/portal/TenderNew.tsx";
import TenderDetail from "./pages/portal/TenderDetail.tsx";
import PortalOrders from "./pages/portal/Orders.tsx";
import OrderDetail from "./pages/portal/OrderDetail.tsx";
import PortalInvoices from "./pages/portal/Invoices.tsx";
import InvoiceDetail from "./pages/portal/InvoiceDetail.tsx";
import PortalTickets from "./pages/portal/Tickets.tsx";
import TicketNew from "./pages/portal/TicketNew.tsx";
import TicketDetail from "./pages/portal/TicketDetail.tsx";
import PortalAssets from "./pages/portal/Assets.tsx";
import PortalDocuments from "./pages/portal/Documents.tsx";
import AdminOrganizations from "./pages/admin/Organizations.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import AdminOrders from "./pages/admin/Orders.tsx";
import AdminInvoices from "./pages/admin/Invoices.tsx";
import AdminTickets from "./pages/admin/Tickets.tsx";
import AdminAssets from "./pages/admin/Assets.tsx";
import AdminAudit from "./pages/admin/Audit.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/tender-services" element={<TenderServices />} />
            <Route path="/active-tenders" element={<ActiveTenders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-quote" element={<RequestQuote />} />

            {/* Auth */}
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

            {/* Portal */}
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

            {/* Admin (legacy ops dashboard) */}
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

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
