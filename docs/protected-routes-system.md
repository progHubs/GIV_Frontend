# Protected Routes System

## Overview

The GIV Society frontend implements a comprehensive role-based access control (RBAC) system with three levels of access:

1. **Public Access** - No authentication required
2. **Authenticated User Access** - Login required
3. **Admin Access** - Admin role required

## Route Structure

### 🌐 Public Routes (No Authentication Required)

These routes are accessible to all visitors, including unauthenticated users:

- **`/`** - Homepage with hero section and features overview
- **`/campaigns`** - View all donation campaigns (read-only)
- **`/events`** - View all community events (read-only)
- **`/posts`** - View blog posts and news (read-only)
- **`/login`** - User login page
- **`/register`** - User registration page
- **`/forgot-password`** - Password reset request
- **`/reset-password/:token`** - Password reset with token
- **`/unauthorized`** - Access denied page

### 🔐 Authenticated User Routes

These routes require user authentication but are available to all logged-in users:

- **`/dashboard`** - User dashboard with personal statistics and activity
- **`/profile`** - User profile management and settings

**Dashboard Features:**
- Personal donation history
- Registered events overview
- Volunteer hours tracking
- Impact statistics
- Quick action buttons

**Profile Features:**
- Personal information editing
- Account settings
- Activity summary
- Password change
- Notification preferences

### 👑 Admin Routes

These routes require admin role and provide administrative functionality:

- **`/admin`** - Admin dashboard with system overview

**Admin Dashboard Features:**
- System-wide statistics (users, donations, events, campaigns)
- User management tools
- Content management (campaigns, events, posts)
- System status monitoring
- Quick administrative actions

## Implementation Details

### ProtectedRoute Component

The `ProtectedRoute` component handles access control:

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  redirectTo?: string;
}
```

**Usage Examples:**

```jsx
// Authenticated user route
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>

// Admin-only route
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardPage />
    </ProtectedRoute>
  } 
/>
```

### Authentication Flow

1. **Unauthenticated Access**: Users can browse public content
2. **Login Required**: Redirects to `/login` with return URL
3. **Role Check**: Verifies user role for admin routes
4. **Unauthorized Access**: Redirects to `/unauthorized` page

### Navigation System

#### PublicLayout Navigation
- Home, Campaigns, Events, Posts, About
- Login/Register buttons for unauthenticated users
- User menu for authenticated users

#### PrivateLayout Navigation
- Dashboard (always visible to authenticated users)
- Public pages (Home, Campaigns, Events)
- Admin link (only visible to admin users)
- User profile and logout options

## User Experience Features

### Loading States
- Authentication check loading spinner
- Smooth transitions between routes
- Proper error handling

### Responsive Design
- Mobile-friendly navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

## Security Features

### Frontend Security
- Route-level access control
- Role-based component rendering
- Automatic token refresh
- Secure logout handling

### Backend Integration
- JWT token validation
- Role verification
- Session management
- API endpoint protection

## Future Enhancements

### Recommended Additions

1. **Enhanced User Roles**
   - Volunteer coordinators
   - Campaign managers
   - Content editors

2. **Additional Protected Routes**
   - `/donations` - Donation management
   - `/events/manage` - Event management for coordinators
   - `/campaigns/create` - Campaign creation for managers
   - `/reports` - Analytics and reporting

3. **Advanced Features**
   - Real-time notifications
   - Advanced search and filtering
   - Social features (following, sharing)
   - Mobile app integration

4. **Admin Enhancements**
   - User role management interface
   - Content moderation tools
   - System analytics dashboard
   - Bulk operations

## Testing the System

### Manual Testing Steps

1. **Public Access**: Visit public routes without logging in
2. **Authentication**: Try accessing protected routes while logged out
3. **User Access**: Login as regular user and test dashboard/profile
4. **Admin Access**: Login as admin and test admin dashboard
5. **Role Restrictions**: Try accessing admin routes as regular user

### Expected Behaviors

- ✅ Public routes accessible to all
- ✅ Protected routes redirect to login when unauthenticated
- ✅ Admin routes show unauthorized for non-admin users
- ✅ Proper navigation based on user role
- ✅ Smooth user experience with loading states

## Conclusion

The protected routes system provides a solid foundation for role-based access control while maintaining excellent user experience. The modular design allows for easy extension and customization as the application grows.
