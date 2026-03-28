import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ClerkProtectedRoute({ children}: {children: React.ReactNode}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
