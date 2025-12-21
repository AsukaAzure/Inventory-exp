"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to login");
      }

      const data = await res.json();

      // ✅ Store user and token in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);
      console.log(data.user);
      // ✅ redirect to home (or wherever)
      sessionStorage.setItem("triggerReload", "true");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail.trim() || !newPassword) {
      setForgotError("Please provide email and new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/changepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setForgotSuccess(
        "Password updated. You can now login with the new password."
      );
      setShowForgot(false);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setForgotError(err.message || "Something went wrong");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-white text-center">
            Login to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="space-y-1">
              <label htmlFor="email" className="text-slate-300 text-sm">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {forgotSuccess && (
              <p className="text-green-400 text-sm">{forgotSuccess}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(!showForgot);
                    setForgotError("");
                  }}
                  className="underline hover:text-white"
                >
                  {showForgot ? "Close" : "Forgot password?"}
                </button>
              </div>
            </div>

            {showForgot && (
              <form onSubmit={handleChangePassword} className="space-y-3">
                {forgotError && (
                  <p className="text-red-400 text-sm">{forgotError}</p>
                )}
                <div>
                  <label className="text-slate-300 text-sm">Email</label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm">New password</label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm">
                    Confirm password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForgot(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={forgotLoading}
                    className="bg-blue-600 hover:bg-blue-700 ml-2"
                  >
                    {forgotLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </form>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
