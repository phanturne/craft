import { Database } from './database'

// Status enum for type safety
export type ProfileStatus = 'active' | 'suspended' | 'banned' | 'deactivated' | 'deleted'

// Type aliases for commonly used types
export type Profile = Omit<Database['public']['Tables']['profiles']['Row'], 'status'> & {
  status: ProfileStatus
}

export type ProfileInsert = Omit<Database['public']['Tables']['profiles']['Insert'], 'status'> & {
  status?: ProfileStatus
}

export type ProfileUpdate = Omit<Database['public']['Tables']['profiles']['Update'], 'status'> & {
  status?: ProfileStatus
} 