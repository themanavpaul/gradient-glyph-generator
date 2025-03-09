
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="glass-morphism rounded-xl p-8 text-center max-w-md mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-gradient-purple">404</h1>
        <p className="text-xl text-white mb-6">This dimension doesn't exist</p>
        <a href="/" className="flex items-center justify-center space-x-2 text-nebula-400 hover:text-nebula-300 transition-colors duration-200">
          <Home className="h-5 w-5" />
          <span>Return to Reality</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
