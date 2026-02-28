"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, avatar: avatarPreview });
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-10 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences</p>
          </div>

          {/* Avatar */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {name ? name[0]?.toUpperCase() : <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                Click the camera icon to upload a photo.
                <br />
                JPG, PNG or GIF. Max 2MB.
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-medium">Profile Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +91 {user?.phone}
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>

          {/* Theme */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Theme</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Logout */}
          <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
