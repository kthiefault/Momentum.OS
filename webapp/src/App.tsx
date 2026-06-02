import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

const Funnel = lazy(() => import("./pages/Funnel"));
const Demo = lazy(() => import("./pages/Demo"));

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Workflows = lazy(() => import("./pages/admin/Workflows"));
const Leads = lazy(() => import("./pages/admin/Leads"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const SpeedOptimizer = lazy(() => import("./pages/admin/SpeedOptimizer"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const ThemePickerModal = lazy(() => import("./components/ThemePickerModal"));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="animate-spin w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full" />
  </div>
);

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000 } } });

const suppressThemePicker = (pathname: string) =>
  pathname === "/sign-in" ||
  pathname === "/funnel" ||
  pathname === "/demo" ||
  pathname.startsWith("/admin") ||
  pathname.startsWith("/blog");

function AppRoutes() {
  const { hasChosen, chooseTheme } = useTheme();
  const { pathname } = useLocation();
  const showThemePicker = !hasChosen && !suppressThemePicker(pathname);

  return (
    <>
      {showThemePicker ? (
        <Suspense fallback={null}>
          <ThemePickerModal open onChoose={chooseTheme} />
        </Suspense>
      ) : null}
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
        <Route path="/blog" element={<Suspense fallback={<PageLoader />}><Blog /></Suspense>} />
        <Route path="/blog/:slug" element={<Suspense fallback={<PageLoader />}><BlogPost /></Suspense>} />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Suspense fallback={<PageLoader />}>
                  <AdminBlog />
                </Suspense>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/funnel" element={<Suspense fallback={<PageLoader />}><Funnel /></Suspense>} />
        <Route path="/demo" element={<Suspense fallback={<PageLoader />}><Demo /></Suspense>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
      </Routes>
    </>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
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
