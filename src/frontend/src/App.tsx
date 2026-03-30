import { useEffect, useState } from "react";
import AdminApp from "./apps/AdminApp";
import OwnerApp from "./apps/OwnerApp";
import UserApp from "./apps/UserApp";
import { Skeleton } from "./components/ui/skeleton";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import type { UserRole } from "./types";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!actor || !isAuthenticated) {
      setRole(null);
      return;
    }
    setRoleLoading(true);
    actor
      .getCallerUserRole()
      .then((r) => {
        const mapped: UserRole =
          r === "admin" ? "admin" : r === "user" ? "user" : "user";
        setRole(mapped);
        setRoleLoading(false);
        // Check if onboarding was done
        const done = localStorage.getItem("onboarding-done");
        if (done) setOnboardingDone(true);
      })
      .catch(() => {
        setRole("user");
        setRoleLoading(false);
      });
  }, [actor, isAuthenticated]);

  // Apply pending role when actor is ready
  useEffect(() => {
    if (!actor || !pendingRole || !isAuthenticated) return;
    // Store role preference locally
    localStorage.setItem("user-role-pref", pendingRole);
    setPendingRole(null);
  }, [actor, pendingRole, isAuthenticated]);

  // After login, check for role preference from signup
  useEffect(() => {
    if (role === "user") {
      const pref = localStorage.getItem("user-role-pref");
      if (pref === "owner") {
        setRole("owner");
      }
    }
  }, [role]);

  if (isInitializing || (isAuthenticated && (isFetching || roleLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full"
            style={{ background: "#3c4555" }}
          />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onRoleSelect={(r) => setPendingRole(r)} />;
  }

  if (!onboardingDone && role === "user") {
    return (
      <OnboardingPage
        onDone={() => {
          localStorage.setItem("onboarding-done", "1");
          setOnboardingDone(true);
        }}
      />
    );
  }

  if (role === "admin") return <AdminApp />;
  if (role === "owner") return <OwnerApp />;
  return <UserApp />;
}
