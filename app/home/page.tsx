"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Wallet, MessageSquare, BarChart3, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Powered",
    description: "Simply text your expenses on WhatsApp. Our AI parses and categorizes them instantly.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description: "Daily, weekly, monthly breakdowns with category insights and spending trends.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "End-to-end encryption. Your financial data stays yours, always.",
  },
  {
    icon: Zap,
    title: "Zero Effort",
    description: "No manual entry. No spreadsheets. Just message and track effortlessly.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Spendly</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/login">
                Login
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <MessageSquare className="w-3 h-3" />
              Powered by AI
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Track expenses
              <br />
              <span className="gradient-text">effortlessly</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Just send your expenses via WhatsApp. We handle the rest — categorization,
              analytics, and beautiful insights, all in real time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="px-8 text-base">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-base">
                See Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="mt-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl stat-glow">
              <Image
                src="/dashboard-preview.png"
                alt="Spendly dashboard showing expense analytics with charts and category breakdowns"
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Your expenses, beautifully visualized
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to <span className="gradient-text">stay on track</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, powerful, and built for people who hate tracking expenses manually.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card p-6 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "$50Cr+", label: "Expenses Tracked" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands who track smarter with just a WhatsApp message.
            </p>
            <Button asChild size="lg" className="px-10 text-base">
              <Link href="/login">
                Start Tracking Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Spendly</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Spendly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
