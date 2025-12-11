import React, { useState } from 'react';
import useAuthStore from '../context/authstore';
import Layout from '../components/shared/Layout';
import axios from 'axios';

const Settings = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        role: user?.role || ''
    });
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState({
        critical: true,
        high: true,
        email: false
    });
    const [message, setMessage] = useState('');

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
            const response = await axios.patch(
                'http://127.0.0.1:5000/api/auth/profile',
                {
                    username: profileData.username,
                    email: profileData.email,
                    role: profileData.role
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update user in auth store
            if (updateUser && response.data.user) {
                updateUser(response.data.user);
            }
            
            setMessage('✅ Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.msg || error.response?.data?.error || 'Failed to update profile'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setProfileData({
            username: user?.username || '',
            email: user?.email || '',
            role: user?.role || ''
        });
        setIsEditing(false);
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">⚙️</span>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-accent-green via-emerald-400 to-accent-green bg-clip-text text-transparent">
                            Settings & Preferences
                        </h1>
                    </div>
                    <p className="text-gray-400">Customize your ThreatLens experience</p>
                </div>

                {/* Profile Card */}
                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-accent-green/20 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span>👤</span> User Profile
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/50 rounded-lg text-accent-green font-semibold text-sm transition-all"
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Username</label>
                            <input 
                                type="text"
                                value={profileData.username}
                                onChange={(e) => handleProfileChange('username', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-lg transition-all ${
                                    isEditing 
                                        ? 'border-accent-green/50 text-white cursor-text focus:outline-none focus:border-accent-green' 
                                        : 'border-gray-700 text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
                            <input 
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-lg transition-all ${
                                    isEditing 
                                        ? 'border-accent-green/50 text-white cursor-text focus:outline-none focus:border-accent-green' 
                                        : 'border-gray-700 text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Role</label>
                            <select
                                value={profileData.role}
                                onChange={(e) => handleProfileChange('role', e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 bg-black/30 border rounded-lg transition-all ${
                                    isEditing 
                                        ? 'border-accent-green/50 text-white cursor-pointer focus:outline-none focus:border-accent-green' 
                                        : 'border-gray-700 text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="analyst">Analyst</option>
                                <option value="developer">Developer</option>
                            </select>
                        </div>
                        
                        {/* Status Message */}
                        {message && (
                            <div className={`p-3 rounded-lg text-sm font-semibold ${
                                message.includes('✅') 
                                    ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                                    : 'bg-red-900/20 border border-red-500/30 text-red-300'
                            }`}>
                                {message}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-green/30 to-emerald-400/30 hover:from-accent-green/50 hover:to-emerald-400/50 border border-accent-green/50 rounded-lg text-white font-bold transition-all disabled:opacity-50"
                                >
                                    {isSaving ? '⏳ Saving...' : '✅ Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 font-bold transition-all disabled:opacity-50"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-accent-green/20 p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>🔔</span> Notification Preferences
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-accent-green/10 hover:border-accent-green/30 cursor-pointer transition-all">
                            <input 
                                type="checkbox"
                                checked={notifications.critical}
                                onChange={() => handleNotificationChange('critical')}
                                className="w-5 h-5 accent-accent-green cursor-pointer"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-white">Critical Alerts</p>
                                <p className="text-sm text-gray-400">Get notified for critical severity threats</p>
                            </div>
                            <span className="text-xl">{notifications.critical ? '✅' : '⭕'}</span>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-accent-green/10 hover:border-accent-green/30 cursor-pointer transition-all">
                            <input 
                                type="checkbox"
                                checked={notifications.high}
                                onChange={() => handleNotificationChange('high')}
                                className="w-5 h-5 accent-accent-green cursor-pointer"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-white">High Alerts</p>
                                <p className="text-sm text-gray-400">Get notified for high severity threats</p>
                            </div>
                            <span className="text-xl">{notifications.high ? '✅' : '⭕'}</span>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-accent-green/10 hover:border-accent-green/30 cursor-pointer transition-all">
                            <input 
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => handleNotificationChange('email')}
                                className="w-5 h-5 accent-accent-green cursor-pointer"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-white">Email Notifications</p>
                                <p className="text-sm text-gray-400">Receive email alerts for threats</p>
                            </div>
                            <span className="text-xl">{notifications.email ? '✅' : '⭕'}</span>
                        </label>
                    </div>
                </div>

                {/* System Information */}
                <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-accent-green/20 p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>ℹ️</span> System Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">Platform Version</p>
                            <p className="text-lg font-bold text-white mt-1">v1.0.0</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-lg font-bold text-accent-green mt-1">🟢 Active</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">Last Updated</p>
                            <p className="text-lg font-bold text-white mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">API Status</p>
                            <p className="text-lg font-bold text-accent-green mt-1">🟢 Connected</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
