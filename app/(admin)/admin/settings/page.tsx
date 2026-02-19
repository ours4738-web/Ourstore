'use client';

import { useState } from 'react';
import { Save, Globe, Info, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Site settings updated successfully');
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold">General Settings</h1>
                    <p className="text-gray-500 text-sm">Manage your website's core information and configuration.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-saffron hover:bg-saffron-600">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-saffron" />
                            Site Information
                        </CardTitle>
                        <CardDescription>Basic details about your online store.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input id="siteName" defaultValue="YouKnowGuru / Ourstore" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteUrl">Site URL</Label>
                                <Input id="siteUrl" defaultValue="https://ourstore.bt" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Site Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                defaultValue="Premium Tech Products and Custom Electronics Services based in Tsirang, Bhutan."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-maroon" />
                            Contact Details
                        </CardTitle>
                        <CardDescription>Information shown on your contact page and footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </Label>
                                <Input id="email" type="email" defaultValue="ours4738@gmail.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Phone Number
                                </Label>
                                <Input id="phone" defaultValue="+975 17XXXXXX" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Physical Address
                            </Label>
                            <Input id="address" defaultValue="Damphu, Tsirang, Bhutan" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
