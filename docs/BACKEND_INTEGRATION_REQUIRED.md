# Backend Integration Requirements

## Missing Backend Endpoints

The frontend donation system requires the following backend endpoints to be implemented for full functionality:

### 1. Stripe Session Details Endpoint

**Endpoint:** `GET /api/payments/stripe/session/:sessionId`

**Purpose:** Retrieve payment session details after successful Stripe checkout

**Request:**
```
GET /api/payments/stripe/session/cs_test_1234567890
Authorization: Bearer <token> (optional for anonymous donations)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "cs_test_1234567890",
    "donation_id": "donation_123",
    "campaign_id": "campaign_456",
    "amount": "25.00",
    "currency": "USD",
    "payment_status": "completed",
    "receipt_url": "https://pay.stripe.com/receipts/...",
    "customer_email": "donor@example.com",
    "payment_intent_id": "pi_1234567890"
  }
}
```

**Implementation Notes:**
- This endpoint should retrieve the Stripe session using the Stripe API
- Extract donation details from the session metadata
- Return the associated donation record from the database
- Handle both authenticated and anonymous donations

### 2. Webhook Processing Verification

**Current Issue:** Donations made through Stripe are not being recorded in the database

**Required Verification:**
1. Ensure Stripe webhook endpoint is properly configured
2. Verify webhook signature validation
3. Check that `checkout.session.completed` events create donation records
4. Ensure campaign statistics are updated after successful donations

**Webhook Endpoint:** `POST /api/payments/stripe/webhook`

**Expected Webhook Flow:**
1. User completes payment on Stripe
2. Stripe sends `checkout.session.completed` webhook
3. Backend creates donation record in database
4. Backend updates campaign statistics (current_amount, donor_count)
5. Backend creates/updates donor profile
6. Backend sends confirmation email (optional)

### 3. Campaign Donation Statistics

**Current Issue:** Campaign statistics may not be updating in real-time

**Required Endpoints:**
- Ensure `GET /api/campaigns/:id` returns updated statistics
- Verify donation counts and amounts are calculated correctly

## Frontend Integration Points

### 1. Payment Success Page
- **File:** `src/pages/donations/DonationSuccess.tsx`
- **Issue:** Shows $0.00 instead of actual donation amount
- **Fix:** Requires backend endpoint to retrieve session details

### 2. Campaign Donors Section
- **File:** `src/components/campaigns/detail/CampaignDetailContent.tsx`
- **Status:** ✅ Fixed - Now uses real donation data
- **Endpoint Used:** `GET /api/donations?campaign_id=:id`

### 3. Donation Form Success Handling
- **File:** `src/components/campaigns/detail/DonationSidebar.tsx`
- **Status:** ✅ Fixed - Now refreshes page on success
- **Behavior:** Reloads page to show updated campaign statistics

## Testing Checklist

### Backend Testing
- [ ] Stripe webhook receives and processes `checkout.session.completed` events
- [ ] Donation records are created in database with correct data
- [ ] Campaign statistics are updated (current_amount, donor_count)
- [ ] Donor profiles are created/updated
- [ ] Session details endpoint returns correct data

### Frontend Testing
- [ ] Donation form redirects to Stripe correctly
- [ ] Payment success page shows correct amount and details
- [ ] Campaign statistics update after donation
- [ ] Donors section shows real donation data
- [ ] User profile shows donation history
- [ ] Admin pages show donation management

## Implementation Priority

1. **High Priority:** Fix Stripe webhook processing
2. **High Priority:** Implement session details endpoint
3. **Medium Priority:** Verify campaign statistics updates
4. **Low Priority:** Add email notifications

## Error Handling

### Frontend Fallbacks
- Payment success page shows fallback data if backend endpoint fails
- Donors section shows loading state while fetching data
- Error messages are displayed for failed API calls

### Backend Requirements
- Proper error responses with meaningful messages
- Webhook retry logic for failed processing
- Transaction rollback for failed donation creation

## Security Considerations

- Stripe webhook signature verification
- Session ID validation to prevent unauthorized access
- Anonymous donation privacy protection
- Proper authentication for admin endpoints
