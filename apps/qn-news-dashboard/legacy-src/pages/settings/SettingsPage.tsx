import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Shield, Trash } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(profileData);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Username</label>
                  <Input
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new content and run updates
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Weekly Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Get weekly summary reports of your content performance
                </p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Change Password</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Update your password to keep your account secure
              </p>
              <Button variant="outline">Change Password</Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Trash className="h-5 w-5" />
              <span>Danger Zone</span>
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="text-sm font-medium mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};