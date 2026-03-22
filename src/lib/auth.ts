import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

const DEMO_EMAIL = "demo@propfix.ai";
const DEMO_PASSWORD = "demo1234";
const DEMO_USER: AuthUser = {
  id: "demo-user-id",
  email: DEMO_EMAIL,
  profile: {
    id: "demo-user-id",
    email: DEMO_EMAIL,
    full_name: "Alex Rivera",
    role: "manager",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export function isDemoUser(user: AuthUser | null) {
  return user?.id === "demo-user-id";
}

export async function signIn(email: string, password: string) {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    localStorage.setItem("demo_session", "true");
    return DEMO_USER;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (localStorage.getItem("demo_session") === "true") {
    localStorage.removeItem("demo_session");
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (localStorage.getItem("demo_session") === "true") {
    return DEMO_USER;
  }
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    profile: profile ?? null,
  };
}
