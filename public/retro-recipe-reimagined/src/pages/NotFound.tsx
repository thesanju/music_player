
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className="recipe-container py-24 md:py-32">
        <div className="text-center max-w-xl mx-auto">
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-4 text-primary">404</h1>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Recipe Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
