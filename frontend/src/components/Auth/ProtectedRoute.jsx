import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, clearStoredUser, storeUser } from "../../lib/api";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    api
      .getSession()
      .then(({ user }) => {
        if (!mounted) return;
        storeUser(user);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!mounted) return;
        clearStoredUser();
        setStatus("unauthenticated");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#fcf8ee] flex items-center justify-center text-sm text-gray-600">
        Checking session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return children;
}
