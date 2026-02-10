import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import RoadmapDetail from "@/pages/RoadmapDetail";
import GenerateRoadmap from "@/pages/GenerateRoadmap";
import CareerExplorer from "@/pages/CareerExplorer";
import Assessment from "@/pages/Assessment";
import CareerResults from "@/pages/CareerResults";
import Resources from "@/pages/Resources";

function AuthenticatedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect handled by useAuth hook or just show LandingPage
    return <LandingPage />;
  }

  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-16">
      <Navigation />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/careers" component={CareerExplorer} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/career-results" component={CareerResults} />
        <Route path="/resources" component={Resources} />
        
        {/* Protected Routes */}

        <Route path="/dashboard">
          <AuthenticatedRoute component={Dashboard} />
        </Route>
        <Route path="/generate">
          <AuthenticatedRoute component={GenerateRoadmap} />
        </Route>
        <Route path="/roadmap/:id">
          <AuthenticatedRoute component={RoadmapDetail} />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
