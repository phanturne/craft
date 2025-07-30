# Models

This folder contains service classes that handle database operations and business logic, separated from UI components and state management.

## Architecture

### Separation of Concerns

- **Models**: Handle database operations and business logic
- **Contexts**: Manage application state and provide data to components
- **Components**: Handle UI rendering and user interactions

### Benefits

- **Reusability**: Database operations can be used across different components
- **Testability**: Business logic is isolated and easier to test
- **Maintainability**: Changes to database operations are centralized
- **Type Safety**: Uses generated Supabase types for better type safety

## Structure

```
src/models/
├── index.ts          # Export all models and types
├── profiles.ts       # Profile-related database operations
└── README.md         # This file
```

## Usage

### Importing Models

```typescript
import { ProfileService } from "@/models";
// or
import { ProfileService } from "@/models/profiles";
```

### Using ProfileService

```typescript
// Fetch a profile
const profile = await ProfileService.fetchProfile(userId);

// Update a profile
const updatedProfile = await ProfileService.updateProfile(userId, {
  display_name: "New Name",
  bio: "New bio",
});

// Check username availability
const isAvailable = await ProfileService.isUsernameAvailable("username");

// Search profiles
const results = await ProfileService.searchProfiles("search term");
```

## Adding New Models

1. Create a new service class in a dedicated file
2. Use generated Supabase types from `@/types/database`
3. Export the service from `index.ts`
4. Add documentation here

### Example

```typescript
// src/models/posts.ts
import { createClient } from "@/lib/client";
import { Post, PostInsert, PostUpdate } from "@/types/database";

export class PostService {
  static async createPost(post: PostInsert): Promise<Post | null> {
    // Implementation
  }

  static async getPosts(): Promise<Post[]> {
    // Implementation
  }
}
```

## Type Safety

All models use the generated Supabase types from `@/types/database.ts`:

- `Profile`: Row type for profiles table
- `ProfileInsert`: Insert type for creating profiles
- `ProfileUpdate`: Update type for modifying profiles

This ensures type safety and consistency across the application.
