# Admin Content Management System

A comprehensive content management system for the GIV Society admin panel, featuring EditorJS integration for rich content creation and editing.

## 🚀 Features

### Content Management
- **Create & Edit Posts**: Rich content editor with EditorJS
- **Content Types**: Support for blog posts, news articles, and press releases
- **Multi-language**: English and Amharic language support
- **Featured Posts**: Mark posts as featured for homepage display
- **Media Management**: Upload and manage images, videos, and attachments
- **SEO Friendly**: Auto-generated slugs and meta information

### Content Editor (EditorJS)
- **Rich Text Editing**: Headers, paragraphs, lists, quotes
- **Media Support**: Images, videos, embeds
- **Advanced Blocks**: Tables, code blocks, checklists
- **File Attachments**: Upload and attach files to posts
- **Link Tool**: Automatic link preview and metadata extraction
- **Responsive Design**: Works seamlessly on desktop and mobile

### Content Management Features
- **List View**: Paginated table with search and filtering
- **Bulk Actions**: Select multiple posts for batch operations
- **Quick Actions**: Edit, delete, feature/unfeature posts
- **Preview Mode**: Preview posts before publishing
- **Statistics**: Content overview and engagement metrics
- **Responsive Design**: Mobile-friendly admin interface

## 📁 Component Structure

```
src/components/admin/
├── EditorJSWrapper.tsx      # Reusable EditorJS component
├── ContentListTable.tsx     # Content listing and management
├── ContentForm.tsx          # Create/edit form with EditorJS
├── ContentStats.tsx         # Content statistics dashboard
└── README.md               # This documentation
```

## 🎯 Usage

### Accessing Content Management
1. Navigate to `/admin/content` (requires admin role)
2. Or click "Content Management" from the admin dashboard

### Creating New Content
1. Click "Create New" button
2. Fill in the title (slug auto-generates)
3. Select post type and language
4. Use the rich editor to create content
5. Upload feature image (optional)
6. Add tags and set featured status
7. Save or preview before publishing

### Editing Existing Content
1. Click the edit icon in the content list
2. Modify content using the same form interface
3. Changes are saved immediately upon submission

### Content Features
- **Auto-save**: Editor content is preserved during editing
- **Image Upload**: Drag & drop or click to upload images
- **File Attachments**: Support for various file types
- **Link Previews**: Automatic URL metadata extraction
- **Responsive Editor**: Works on all screen sizes

## 🔧 Technical Details

### EditorJS Configuration
The EditorJS wrapper includes the following tools:
- Header (H1-H6)
- Paragraph with inline formatting
- Lists (ordered/unordered)
- Quote blocks
- Code blocks
- Tables
- Images with upload
- File attachments
- Embeds (YouTube, Vimeo, etc.)
- Link tool with previews
- Markers/highlights
- Checklists
- Warning blocks
- Delimiters

### API Integration
- Uses existing content hooks (`useCreatePost`, `useUpdatePost`, etc.)
- File upload integration with backend
- Real-time content statistics
- Pagination and filtering support

### State Management
- React Hook Form for form validation
- React Query for server state management
- Local state for editor content and UI interactions

## 🎨 Styling
- Consistent with existing admin panel design
- Tailwind CSS for styling
- Framer Motion for animations
- Responsive design patterns
- Dark/light theme support

## 🔒 Security
- Admin role required for access
- Protected routes with authentication
- File upload validation
- XSS protection in content rendering

## 📱 Responsive Design
- Mobile-friendly interface
- Touch-optimized controls
- Responsive tables and forms
- Adaptive layout for different screen sizes

## 🚀 Getting Started

1. **Prerequisites**: Ensure EditorJS packages are installed (already done)
2. **Access**: Login with admin credentials
3. **Navigate**: Go to `/admin/content` or use dashboard link
4. **Create**: Click "Create New" to start creating content
5. **Manage**: Use the list view to manage existing content

## 🔄 Future Enhancements

- Content scheduling and publishing workflow
- Content versioning and revision history
- Advanced SEO tools and meta tag management
- Content templates and reusable blocks
- Collaborative editing features
- Content analytics and performance metrics
- Export/import functionality
- Advanced search and filtering options

## 🐛 Troubleshooting

### Common Issues
1. **Editor not loading**: Check EditorJS package installation
2. **Upload failures**: Verify backend upload endpoint configuration
3. **Permission errors**: Ensure user has admin role
4. **Styling issues**: Check Tailwind CSS compilation

### Support
For technical support or feature requests, contact the development team or create an issue in the project repository.
