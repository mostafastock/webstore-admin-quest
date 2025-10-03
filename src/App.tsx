import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Products />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Orders />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              {/* Placeholder routes for other admin pages */}
              <Route
                path="/admin/collections"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Collections</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bundles"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Bundles</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/offers"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Offers</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/shipping"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Shipping</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Notifications</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/popups"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Popups</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold">Settings</h2>
                        <p className="text-muted-foreground mt-2">Coming soon...</p>
                      </div>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
