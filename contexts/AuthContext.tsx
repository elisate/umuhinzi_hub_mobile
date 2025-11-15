import { router, useSegments } from "expo-router";
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the context data
interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// This hook handles the redirect logic
// MODIFIED: Added isLoading parameter
function useProtectedRoute(token: string | null, isLoading: boolean) {
  const segments = useSegments();

  // REMOVED: isNavigationReady state and the useEffect with router.subscribe

  useEffect(() => {
    // MODIFIED: Wait for loading to finish
    if (isLoading) {
      return; // Don't redirect until auth state is loaded
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and not in the auth group,
      // redirect them to the sign-in page.
      !token &&
      !inAuthGroup
    ) {
      router.replace("/(auth)/LogIn");
    } else if (
      // If the user is signed in and in the auth group,
      // redirect them to the home page.
      token &&
      inAuthGroup
    ) {
      router.replace("/(tabs)/home");
    }
    // MODIFIED: Added isLoading to dependency array
  }, [token, segments, isLoading]);
}

// The provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, you would check AsyncStorage or secure store for a token
    // For now, we'll just simulate it.
    const loadToken = async () => {
      // const storedToken = await SecureStore.getItemAsync('userToken');
      // setToken(storedToken);
      
      // Simulating no token on load
      setToken(null); 
      setIsLoading(false);
    };
    loadToken();
  }, []);

  // Call the redirect hook
  // MODIFIED: Pass isLoading to the hook
  useProtectedRoute(token, isLoading);

  const signIn = (newToken: string) => {
    // On sign in, set token in state and async storage
    setToken(newToken);
    // await SecureStore.setItemAsync('userToken', newToken);
  };

  const signOut = () => {
    // On sign out, clear token from state and async storage
    setToken(null);
    // await SecureStore.removeItemAsync('userToken');
  };

  const value: AuthContextType = {
    token,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}