# Donation System Documentation

## Overview

The GIV Society donation system provides a comprehensive solution for managing donations, donor profiles, and payment processing through Stripe integration. This system supports both one-time and recurring donations with a tier-based donor management system.

## Features

### 🎯 **Core Features**
- **One-time Donations**: Support for single donations of any amount
- **Recurring Donations**: Monthly subscription-based donations with predefined tiers
- **Anonymous Donations**: Option for donors to remain anonymous
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Donor Profiles**: Automatic donor profile creation and tier management
- **Admin Management**: Comprehensive admin interfaces for donation and donor management

### 💰 **Donation Tiers**
- **Bronze**: $10/month - Basic supporter tier
- **Silver**: $50/month - Regular supporter tier  
- **Gold**: $100/month - Premium supporter tier
- **Platinum**: $250/month - VIP supporter tier

### 🔐 **Security & Privacy**
- SSL-encrypted payment processing
- Anonymous donation support
- Secure data handling
- PCI-compliant payment processing through Stripe

## Architecture

### Frontend Components

#### Core Components
- `DonationForm` - Main donation form with amount selection and payment options
- `DonationCard` - Display component for donation information
- `DonationHistory` - User donation history with pagination
- `DonationStats` - Donation statistics and donor profile information

#### Pages
- `DonationSuccess` - Payment success confirmation page
- `DonationCancelled` - Payment cancellation page
- `DonationManagement` - Admin donation management interface
- `DonorManagement` - Admin donor profile management

#### Hooks
- `useDonations` - Donation data fetching and management
- `useStripe` - Stripe payment integration
- `useDonationForm` - Form state management for donations

### Backend Integration

#### API Endpoints
- `POST /donations` - Create new donation
- `GET /donations` - List donations with filters
- `GET /donations/:id` - Get specific donation
- `PATCH /donations/:id/status` - Update donation status (admin)
- `DELETE /donations/:id` - Delete donation (admin)
- `GET /donations/stats` - Get donation statistics (admin)

#### Stripe Integration
- `POST /payments/stripe/session` - Create Stripe checkout session
- `POST /payments/stripe/webhook` - Handle Stripe webhooks

#### Donor Management
- `GET /donors` - List donor profiles
- `GET /donors/:id` - Get specific donor profile
- `PUT /donors/:id` - Update donor profile
- `GET /donors/stats` - Get donor statistics

## Usage

### Basic Donation Flow

1. **User selects campaign** and clicks donate
2. **Donation form appears** with amount and type selection
3. **User fills form** and clicks donate button
4. **Stripe Checkout opens** for payment processing
5. **Payment completion** redirects to success page
6. **Donation recorded** and donor profile updated

### Admin Management

#### Donation Management
- View all donations with filtering and search
- Update donation status
- View donation statistics
- Export donation data

#### Donor Management  
- View all donor profiles
- Update donor tiers and preferences
- View donor statistics
- Manage recurring donations

### User Profile Integration

#### Donation History
- View personal donation history
- Download receipts
- Track donation impact

#### Donor Statistics
- View total donated amount
- See donor tier status
- Track donation frequency
- View tier benefits

## Configuration

### Environment Variables

```env
# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here

# API Configuration  
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Stripe Setup

1. Create Stripe account
2. Get publishable key from Stripe dashboard
3. Configure webhook endpoints for payment processing
4. Set up products and prices for recurring donations

## Development

### Running the System

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Stripe keys
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Testing Donations

#### Test Card Numbers (Stripe)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

#### Test Scenarios
1. One-time donation with various amounts
2. Recurring donation with different tiers
3. Anonymous donation
4. Payment failure handling
5. Admin management workflows

## API Integration

### Creating a Donation

```typescript
import { donationApi } from './lib/donationApi';

const donation = await donationApi.createDonation({
  campaign_id: 'campaign-id',
  amount: 100,
  donation_type: 'one_time',
  is_anonymous: false,
  notes: 'Supporting this great cause!'
});
```

### Stripe Payment Flow

```typescript
import { stripeApi } from './lib/stripeApi';

// Create checkout session
const session = await stripeApi.createCheckoutSession({
  campaign_id: 'campaign-id',
  amount: 100,
  recurring: false
});

// Redirect to Stripe Checkout
window.location.href = session.url;
```

## Error Handling

### Common Errors
- **Payment declined**: Show user-friendly message and retry option
- **Network errors**: Implement retry logic with exponential backoff
- **Validation errors**: Display field-specific error messages
- **Session expired**: Redirect to login page

### Error Recovery
- Automatic retry for transient failures
- Graceful degradation for non-critical features
- Clear error messages for user actions
- Admin notifications for critical errors

## Performance Optimization

### Frontend Optimizations
- React Query for efficient data fetching
- Component lazy loading
- Image optimization
- Bundle splitting

### Backend Optimizations
- Database indexing for donation queries
- Caching for statistics
- Pagination for large datasets
- Background processing for webhooks

## Security Considerations

### Data Protection
- PCI compliance through Stripe
- Encrypted data transmission
- Secure session management
- Input validation and sanitization

### Privacy
- Anonymous donation support
- GDPR compliance
- Data retention policies
- User consent management

## Monitoring & Analytics

### Key Metrics
- Total donations and amounts
- Conversion rates
- Payment success rates
- Donor retention rates
- Average donation amounts

### Monitoring
- Payment processing errors
- API response times
- User experience metrics
- Security incidents

## Support & Troubleshooting

### Common Issues
1. **Stripe key configuration**: Verify environment variables
2. **Payment failures**: Check Stripe dashboard for details
3. **Webhook issues**: Verify endpoint configuration
4. **CORS errors**: Check API CORS settings

### Getting Help
- Check Stripe documentation for payment issues
- Review browser console for frontend errors
- Check server logs for backend issues
- Contact support for critical problems

## Future Enhancements

### Planned Features
- Multiple payment methods (PayPal, bank transfer)
- Donation matching campaigns
- Fundraising goals and progress tracking
- Social sharing integration
- Mobile app support

### Technical Improvements
- Real-time donation updates
- Advanced analytics dashboard
- Automated receipt generation
- Integration with accounting systems
- Multi-currency support
