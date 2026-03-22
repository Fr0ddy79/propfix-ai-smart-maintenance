import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: () => signIn(email, password),
    onSuccess: () => {
      navigate("/app/dashboard");
    },
    onError: (err: Error) => {
      setError(err.message ?? "Login failed. Please check your credentials.");
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-base">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">PropFix AI</span>
          </Link>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow p-6">
          <h1 className="text-xl font-bold text-foreground mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Access your property management dashboard
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              loginMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground mb-1.5 block">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loginMutation.isPending || !email || !password}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all font-semibold"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo credentials:{" "}
            <span className="font-mono text-foreground">demo@propfix.ai</span> /{" "}
            <span className="font-mono text-foreground">demo1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}
