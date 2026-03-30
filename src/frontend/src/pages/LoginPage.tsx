import { useState } from "react";
import { Button } from "../components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { UserRole } from "../types";

interface Props {
  onRoleSelect: (role: UserRole) => void;
}

export default function LoginPage({ onRoleSelect }: Props) {
  const { login, isLoggingIn } = useInternetIdentity();
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const handleLogin = () => {
    localStorage.setItem("user-role-pref", selectedRole);
    onRoleSelect(selectedRole);
    login();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, #3c4555 0%, #2a3142 60%, #1e2538 100%)",
      }}
    >
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="mb-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "#ff6b6b" }}
          >
            🏠
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">
          NestBengaluru
        </h1>
        <p className="text-white/70 text-center mt-2 text-base">
          Find your perfect PG in Bengaluru
        </p>

        <div className="mt-10 w-full max-w-sm space-y-3">
          <p className="text-white/60 text-sm text-center">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole("user")}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedRole === "user"
                  ? "border-[#ff6b6b] bg-white/10"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <span className="text-2xl block mb-2">🔍</span>
              <span className="text-white font-medium text-sm">PG Seeker</span>
              <span className="text-white/50 text-xs block mt-0.5">
                Find & book PGs
              </span>
            </button>
            <button
              onClick={() => setSelectedRole("owner")}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedRole === "owner"
                  ? "border-[#ff6b6b] bg-white/10"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <span className="text-2xl block mb-2">🏢</span>
              <span className="text-white font-medium text-sm">PG Owner</span>
              <span className="text-white/50 text-xs block mt-0.5">
                List your PG
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Login CTA */}
      <div className="px-6 pb-10 max-w-sm w-full mx-auto">
        <Button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full h-14 rounded-2xl text-base font-semibold text-white"
          style={{ background: "#ff6b6b", border: "none" }}
        >
          {isLoggingIn ? "Connecting..." : "Continue with Internet Identity"}
        </Button>
        <p className="text-white/40 text-xs text-center mt-3">
          Secure, decentralized login — no password needed
        </p>
      </div>
    </div>
  );
}
