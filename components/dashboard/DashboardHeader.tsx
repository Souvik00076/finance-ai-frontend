"use client";

import { useRouter } from "next/navigation";
import { Wallet, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardHeader() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Spendly</h1>
            <p className="text-xs text-muted-foreground">WhatsApp-powered expense tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3 text-primary" />
            <span>Synced</span>
          </div>
          <ThemeToggle />
          <button onClick={() => router.push("/settings")} className="hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}
