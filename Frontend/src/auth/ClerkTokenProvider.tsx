import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setClerkTokenGetter } from "../lib/axios";
import { useLocation } from "react-router-dom";

export default function ClerkTokenProvider({ children}: {children: React.ReactNode}) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/sign-in") || location.pathname.startsWith("/sign-up")) {
      return;
    }
    if (!isLoaded || !isSignedIn) return;

    setClerkTokenGetter(getToken);
  }, [getToken, isLoaded, isSignedIn, location.pathname]);

  return <>{children}</>;
}
