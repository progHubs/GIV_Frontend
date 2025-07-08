import React, { useState } from 'react';
import PrivateLayout from '../../layouts/PrivateLayout';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: '',
    location: '',
    interests: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone Number"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.full_name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-gray-600">{user?.phone || 'No phone number provided'}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bio</p>
                    <p className="text-gray-600 mt-1">
                      {formData.bio || 'No bio provided yet.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-600 mt-1">
                      {formData.location || 'No location provided yet.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-gray-600 mt-1">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Donations</span>
                  <span className="font-semibold text-gray-900">$1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Events Attended</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Volunteer Hours</span>
                  <span className="font-semibold text-gray-900">48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impact Score</span>
                  <span className="font-semibold text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Notification Preferences</p>
                    <p className="text-sm text-gray-600">Manage email and push notifications</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm">Permanently delete your account and data</p>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default ProfilePage;
