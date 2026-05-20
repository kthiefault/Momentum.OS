import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemePickerModal from "./components/ThemePickerModal";
import { useTheme } from "./hooks/use-theme";

import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Platform = lazy(() => import("./pages/Platform"));
const Automation = lazy(() => import("./pages/Automation"));
const AI = lazy(() => import("./pages/AI"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const Pricing = lazy(() => import("./pages/Pricing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/SignIn"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Workflows = lazy(() => import("./pages/admin/Workflows"));
const Leads = lazy(() => import("./pages/admin/Leads"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const SpeedOptimizer = lazy(() => import("./pages/admin/SpeedOptimizer"));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="animate-spin w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full" />
  </div>
);

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000 } } });

function AppContent() {
  const { hasChosen, chooseTheme } = useTheme();
  const isAdminRoute = window.location.pathname === "/sign-in" || window.location.pathname.startsWith("/admin");

  return (
    <>
      <ThemePickerModal open={!hasChosen && !isAdminRoute} onChoose={chooseTheme} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Index /></Suspense>} />
          <Route path="/platform" element={<Suspense fallback={<PageLoader />}><Platform /></Suspense>} />
          <Route path="/automation" element={<Suspense fallback={<PageLoader />}><Automation /></Suspense>} />
          <Route path="/ai" element={<Suspense fallback={<PageLoader />}><AI /></Suspense>} />
          <Route path="/pipeline" element={<Suspense fallback={<PageLoader />}><Pipeline /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><Pricing /></Suspense>} />
          <Route path="/sign-in" element={<Suspense fallback={<PageLoader />}><SignIn /></Suspense>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workflows"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Workflows />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Leads />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <AdminSettings />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/speed"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<PageLoader />}>
                    <SpeedOptimizer />
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
