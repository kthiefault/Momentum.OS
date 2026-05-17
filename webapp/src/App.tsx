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
