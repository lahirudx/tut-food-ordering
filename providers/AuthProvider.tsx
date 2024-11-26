import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profile: any;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) {
        // fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();
        setProfile(profileData || null);
      }

      setLoading(false);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        isAdmin: profile?.group === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
