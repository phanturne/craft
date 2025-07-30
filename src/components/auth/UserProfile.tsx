'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/client'
import { ProfileStatus, ProfileUpdate } from '@/types/profiles'
import Image from 'next/image'
import { useRef, useState } from 'react'

export function UserProfile() {
  const { user, profile, signOut, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editForm, setEditForm] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  if (!user || !profile) return null

  const handleSave = async () => {
    try {
      const updates: ProfileUpdate = {
        display_name: editForm.display_name || null,
        bio: editForm.bio || null
      }
      await updateProfile(updates)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setEditForm({
      display_name: profile.display_name || '',
      bio: profile.bio || ''
    })
    setIsEditing(false)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading avatar:', error)
        alert('Failed to upload avatar. Please try again.')
        return
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl })
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeAvatar = async () => {
    if (!profile.avatar_url) return

    try {
      await updateProfile({ avatar_url: null })
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert('Failed to remove avatar. Please try again.')
    }
  }

  const getStatusColor = (status: ProfileStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'deactivated': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'deleted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full"
                    priority
                  />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Avatar upload overlay */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-white text-xs hover:text-blue-200 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Change'}
                    </button>
                    {profile.avatar_url && (
                      <button
                        onClick={removeAvatar}
                        disabled={isUploading}
                        className="text-white text-xs hover:text-red-200 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {profile.display_name || profile.username}
              </h2>
              <p className="text-blue-100">@{profile.username}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white">
                  {profile.bio || 'No bio added yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Profile Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Username
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">@{profile.username}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  placeholder="Enter display name..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile.display_name || 'Not set'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Email Address
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Member Since
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              User ID
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{user.id}</p>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Sign Out */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={signOut}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 