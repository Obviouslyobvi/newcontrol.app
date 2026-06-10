import { Toaster } from "react-hot-toast";
import { eq } from "drizzle-orm";
import { requirePageSession } from "@/lib/auth/get-session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const PLAN_LABELS: Record<string, string> = {
  free_trial: "Free Trial",
  solo: "Solo",
  professional: "Professional",
  agency: "Agency",
  enterprise: "Enterprise",
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requirePageSession();

  let userName: string | null = null;
  let userEmail = "";
  let trialNote: string | null = null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    if (user) {
      userName = user.name;
      userEmail = user.email;
      if (user.planTier === "free_trial" && user.trialEndsAt) {
        const daysLeft = Math.max(
          0,
          Math.ceil((user.trialEndsAt.getTime() - Date.now()) / 86_400_000)
        );
        trialNote =
          daysLeft > 0
            ? `${daysLeft} trial day${daysLeft === 1 ? "" : "s"} remaining`
            : "Trial ended — subscribe to keep creating";
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        planLabel={PLAN_LABELS[session.planTier] ?? session.planTier}
        trialNote={trialNote}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar userName={userName} userEmail={userEmail} />
        <main className="flex-1 px-4 md:px-8 py-8">{children}</main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgb(var(--surface))",
            color: "rgb(var(--fg))",
            border: "1px solid rgb(var(--fg) / 0.1)",
          },
        }}
      />
    </div>
  );
}
