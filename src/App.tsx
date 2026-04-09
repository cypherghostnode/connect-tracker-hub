import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import IpTracker from "./pages/IpTracker.tsx";
import ShowIp from "./pages/ShowIp.tsx";
import PhoneTracker from "./pages/PhoneTracker.tsx";
import UsernameTracker from "./pages/UsernameTracker.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ip-tracker" element={<IpTracker />} />
          <Route path="/show-ip" element={<ShowIp />} />
          <Route path="/phone-tracker" element={<PhoneTracker />} />
          <Route path="/username-tracker" element={<UsernameTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
