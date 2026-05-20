import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Platform from "./pages/Platform";
import Automation from "./pages/Automation";
import AI from "./pages/AI";
import Pipeline from "./pages/Pipeline";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ThemePickerModal from "./components/ThemePickerModal";
import { useTheme } from "./hooks/use-theme";
import SignIn from "./pages/SignIn";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

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

const queryClient = new QueryClient();

function AppContent() {
  const { hasChosen, chooseTheme } = useTheme();

  return (
    <>
      <ThemePickerModal open={!hasChosen} onChoose={chooseTheme} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/sign-in" element={<SignIn />} />
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
          <Route path="*" element={<NotFound />} />
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
