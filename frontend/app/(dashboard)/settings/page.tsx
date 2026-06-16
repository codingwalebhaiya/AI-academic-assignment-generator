"use client";

import { User, Mail, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Satyam"
                                className="w-full bg-muted border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                            <input
                                type="email"
                                defaultValue="satyam@example.com"
                                className="w-full bg-muted border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                            />
                        </div>
                    </div>
                </section>

                {/* Account Security */}
                <section className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Account Security</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                            <div>
                                <p className="text-sm font-semibold text-foreground">Change Password</p>
                                <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                            </div>
                            <Button variant="outline" className="rounded-xl px-4 py-2 text-xs border-border text-foreground hover:bg-card">Update</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                            <div>
                                <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" className="rounded-xl px-4 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 border-none">Enable</Button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                                <p className="text-xs text-muted-foreground">Receive updates about your assignments via email.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-6 h-auto shadow-lg shadow-primary/10 flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

