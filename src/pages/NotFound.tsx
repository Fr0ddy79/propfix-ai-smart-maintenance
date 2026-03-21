import { Link } from "react-router-dom";
import { LayoutDashboard, Ticket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <div className="flex gap-3">
            <Link to="/app/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <Link to="/app/tickets" className="flex-1">
              <Button variant="outline" className="w-full">
                <Ticket className="w-4 h-4 mr-2" /> Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
