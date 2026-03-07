import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Redirect /dashboard to / (root)
  redirect("/");
}
