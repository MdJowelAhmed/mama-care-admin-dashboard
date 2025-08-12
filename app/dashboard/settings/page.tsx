'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/lib/store';
import { User, Lock, FileText, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface CurrentUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
}

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type TabValue = 'profile' | 'password' | 'terms' | 'policy';

// Mock current user data
const currentUser: CurrentUser = {
  name: 'John Smith',
  email: 'john.smith@admin.com',
  role: 'Super Admin',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
  joinDate: '2023-01-15'
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: currentUser.name,
    email: currentUser.email
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Content state
  const [termsContent, setTermsContent] = useState<string>('');
  const [privacyContent, setPrivacyContent] = useState<string>('');
  
  const [profileError, setProfileError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError('');
    
    try {
      await updateProfile(profileData).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to update profile';
      setProfileError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to change password';
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSaveContent = (type: 'terms' | 'privacy') => {
    toast.success(`${type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'} saved successfully!`);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your profile and application settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <Lock size={16} />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Terms and Conditions</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Privacy Policy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {profileError && (
                    <Alert variant="destructive">
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={currentUser.role} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <Input value={new Date(currentUser.joinDate).toLocaleDateString()} disabled />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
                      disabled={isUpdatingProfile}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
                      disabled={isChangingPassword}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="terms">
            <div className="space-y-6">
              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>
                    Edit your application`s terms and conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms & Conditions Content</Label>
                      <Textarea
                        id="terms"
                        placeholder="Enter your terms and conditions here..."
                        value={termsContent}
                        onChange={(e) => setTermsContent(e.target.value)}
                        rows={10}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSaveContent('terms')}
                        className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Terms
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </TabsContent>


          <TabsContent value="policy">
            <div className="space-y-6">
              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>
                    Edit your application`s terms and conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms & Conditions Content</Label>
                      <Textarea
                        id="terms"
                        placeholder="Enter your terms and conditions here..."
                        value={termsContent}
                        onChange={(e) => setTermsContent(e.target.value)}
                        rows={10}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSaveContent('terms')}
                        className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Terms
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

             
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}