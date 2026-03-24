import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WorkshopProvider } from "@/context/WorkshopContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NewMaintenance from "@/pages/NewMaintenance";
import MaintenanceDetail from "@/pages/MaintenanceDetail";
import Records from "@/pages/Records";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import SearchPage from "@/pages/SearchPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WorkshopProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/maintenance/new" element={<NewMaintenance />} />
                <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
                <Route path="/records" element={<Records />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkshopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
