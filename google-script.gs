/**
 * ============================================================================
 * EVOCAA - Google Apps Script for Automatic Lead Capture
 * ============================================================================
 * 
 * FEATURES:
 * ✅ Automatically receives form data from website
 * ✅ Saves all data to Google Sheet in real-time
 * ✅ Sends email notification to owner
 * ✅ Sends confirmation email to user
 * ✅ No hardcoding - everything automatic
 * ✅ Error handling and logging
 * ✅ Test function included
 * 
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - AUTOMATIC (NO CHANGES NEEDED)
// ============================================================================

// Get the current spreadsheet (where this script is attached)
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
const sheet = spreadsheet.getActiveSheet();

// Get the owner's email automatically
const ownerEmail = Session.getActiveUser().getEmail();

// ============================================================================
// MAIN FUNCTION - Receives POST requests from the booking form
// ============================================================================

function doPost(e) {
  try {
    // ====================================================================
    // STEP 1: RECEIVE AND VALIDATE FORM DATA
    // ====================================================================
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📨 NEW FORM SUBMISSION RECEIVED');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Timestamp:', new Date().toLocaleString());
    
    // Get form data from the POST request
    const formData = e.parameter;
    
    // Check if data was received
    if (!formData || Object.keys(formData).length === 0) {
      console.error('❌ ERROR: No form data received');
      return sendResponse('error', 'No form data received', 400);
    }
    
    // Log received fields
    console.log('📋 Fields received:', Object.keys(formData).join(', '));
    
    // ====================================================================
    // STEP 2: EXTRACT AND VALIDATE FORM FIELDS
    // ====================================================================
    
    const userData = {
      name: formData.name || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      business: formData.business || 'N/A',
      revenue: formData.revenue || 'N/A',
      bottleneck: formData.bottleneck || 'N/A'
    };
    
    console.log('✅ Form data extracted successfully');
    console.log('   Name:', userData.name);
    console.log('   Email:', userData.email);
    console.log('   Phone:', userData.phone);
    console.log('   Business:', userData.business);
    console.log('   Revenue:', userData.revenue);
    
    // ====================================================================
    // STEP 3: SAVE DATA TO GOOGLE SHEET
    // ====================================================================
    
    console.log('');
    console.log('💾 SAVING TO GOOGLE SHEET...');
    
    const timestamp = new Date();
    
    // Create row with all data
    const newRow = [
      timestamp,                    // Column A: Timestamp
      userData.name,                // Column B: Name
      userData.email,               // Column C: Email
      userData.phone,               // Column D: Phone
      userData.business,            // Column E: Business Name
      userData.revenue,             // Column F: Monthly Revenue
      userData.bottleneck           // Column G: Bottleneck
    ];
    
    // Append the row to the sheet
    sheet.appendRow(newRow);
    
    console.log('✅ Data saved to Google Sheet successfully');
    console.log('   Row added:', sheet.getLastRow());
    console.log('   Sheet ID:', spreadsheet.getId());
    console.log('   Sheet URL: https://docs.google.com/spreadsheets/d/' + spreadsheet.getId() + '/edit');
    
    // ====================================================================
    // STEP 4: SEND EMAIL NOTIFICATION TO OWNER
    // ====================================================================
    
    console.log('');
    console.log('📧 SENDING OWNER NOTIFICATION EMAIL...');
    
    const ownerEmailSubject = `🎯 New Lead: ${userData.name} - Growth Diagnosis Booking`;
    
    const ownerEmailBody = `
╔════════════════════════════════════════════════════════════════╗
║                  NEW GROWTH DIAGNOSIS LEAD                     ║
╚════════════════════════════════════════════════════════════════╝

Hello,

A new booking request has been received for the 90-Day Growth Diagnosis!

────────────────────────────────────────────────────────────────

📋 LEAD INFORMATION:

  Name:                 ${userData.name}
  Email:                ${userData.email}
  Phone:                ${userData.phone}
  Business Name:        ${userData.business}
  Monthly Revenue:      ${userData.revenue}

────────────────────────────────────────────────────────────────

💭 MAIN GROWTH CHALLENGE:

${userData.bottleneck}

────────────────────────────────────────────────────────────────

📊 SUBMISSION DETAILS:

  Received at:          ${timestamp.toLocaleString()}
  Sheet ID:             ${spreadsheet.getId()}
  Total Leads:          ${sheet.getLastRow() - 1}

────────────────────────────────────────────────────────────────

🔗 VIEW ALL LEADS:
https://docs.google.com/spreadsheets/d/${spreadsheet.getId()}/edit

────────────────────────────────────────────────────────────────

📞 RECOMMENDED NEXT STEPS:

1. Review the lead details above
2. Open your Google Sheet to see all leads
3. Contact the prospect within 24 hours
4. Schedule the diagnosis consultation
5. Send the diagnosis report

────────────────────────────────────────────────────────────────

This is an automated notification from Evocaa Lead Capture System.
Do not reply to this email.

════════════════════════════════════════════════════════════════
`;
    
    // Send email to owner
    GmailApp.sendEmail(
      ownerEmail,
      ownerEmailSubject,
      ownerEmailBody,
      {
        name: 'Evocaa Lead Capture System'
      }
    );
    
    console.log('✅ Owner notification email sent');
    console.log('   Recipient:', ownerEmail);
    console.log('   Subject:', ownerEmailSubject);
    
    // ====================================================================
    // STEP 5: SEND CONFIRMATION EMAIL TO USER
    // ====================================================================
    
    console.log('');
    console.log('📧 SENDING USER CONFIRMATION EMAIL...');
    
    const userEmailSubject = '✅ Your Growth Diagnosis Booking Confirmed - Evocaa';
    
    const userEmailBody = `
╔════════════════════════════════════════════════════════════════╗
║          BOOKING CONFIRMATION - GROWTH DIAGNOSIS               ║
╚════════════════════════════════════════════════════════════════╝

Hello ${userData.name},

Thank you for booking your 90-Day Business Growth Diagnosis with Evocaa!

We have successfully received your booking request and will review your 
business situation to provide you with actionable insights.

────────────────────────────────────────────────────────────────

📋 YOUR BOOKING DETAILS:

  Business Name:        ${userData.business}
  Monthly Revenue:      ${userData.revenue}
  Booking Date:         ${timestamp.toLocaleString()}
  Booking Status:       ✅ CONFIRMED

────────────────────────────────────────────────────────────────

📞 WHAT HAPPENS NEXT:

Our team will contact you within 24 hours at ${userData.phone} to:

  ✓ Confirm your diagnosis appointment date & time
  ✓ Discuss your specific growth challenges in detail
  ✓ Understand your business goals and constraints
  ✓ Prepare for the comprehensive diagnosis

────────────────────────────────────────────────────────────────

💡 YOUR 90-DAY GROWTH DIAGNOSIS INCLUDES:

  ✓ Business Growth Score (0-100)
  ✓ Detailed Competitor Analysis
  ✓ Lead Generation Audit
  ✓ Sales Conversion Analysis
  ✓ Operations Efficiency Review
  ✓ Personalized 90-Day Growth Blueprint
  ✓ Priority Action Plan (Top 5 Actions)
  ✓ 30-Minute Growth Strategy Consultation

────────────────────────────────────────────────────────────────

❓ FREQUENTLY ASKED QUESTIONS:

Q: How long does the diagnosis take?
A: The initial consultation is 30 minutes, followed by a 3-5 day analysis.

Q: What if I need to reschedule?
A: No problem! Just reply to this email or call us.

Q: Will you share my information with others?
A: No, your information is completely confidential.

Q: What's the investment for the diagnosis?
A: ₹499 for the complete 90-day diagnosis package.

────────────────────────────────────────────────────────────────

📧 CONTACT INFORMATION:

  Email:  support@evocaa.com
  Phone:  [Your Phone Number]
  Hours:  Monday - Friday, 9 AM - 6 PM

────────────────────────────────────────────────────────────────

We're excited to help you grow your interior design business!

Best regards,

The Evocaa Team
Business Growth Consulting for Interior Designers

════════════════════════════════════════════════════════════════
`;
    
    // Send email to user
    GmailApp.sendEmail(
      userData.email,
      userEmailSubject,
      userEmailBody,
      {
        name: 'Evocaa'
      }
    );
    
    console.log('✅ User confirmation email sent');
    console.log('   Recipient:', userData.email);
    
    // ====================================================================
    // STEP 6: RETURN SUCCESS RESPONSE
    // ====================================================================
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ALL OPERATIONS COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════════');
    
    return sendResponse('success', 'Lead captured and saved successfully', 200);
    
  } catch (error) {
    // ====================================================================
    // ERROR HANDLING
    // ====================================================================
    
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ ERROR OCCURRED');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Error Message:', error.toString());
    console.error('Stack Trace:', error.stack);
    
    // Send error notification to owner
    try {
      GmailApp.sendEmail(
        ownerEmail,
        '⚠️ Evocaa Lead Capture - ERROR ALERT',
        `An error occurred while processing a form submission:\n\n` +
        `Error: ${error.toString()}\n\n` +
        `Stack: ${error.stack}\n\n` +
        `Please check the Apps Script logs for more details.\n` +
        `Apps Script URL: https://script.google.com/home`
      );
    } catch (emailError) {
      console.error('Failed to send error notification:', emailError);
    }
    
    return sendResponse('error', error.toString(), 500);
  }
}

// ============================================================================
// HELPER FUNCTION - Send JSON Response
// ============================================================================

function sendResponse(status, message, httpCode) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      httpCode: httpCode
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// TEST FUNCTION - Test the script locally
// ============================================================================

function testFormSubmission() {
  console.log('');
  console.log('🧪 RUNNING TEST SUBMISSION...');
  console.log('');
  
  // Simulate form data from the website
  const testData = {
    parameter: {
      name: 'Rajesh Kumar',
      email: 'rajesh@interiordesigns.com',
      phone: '9876543210',
      business: 'Modern Interior Designs',
      revenue: '₹15L - ₹40L',
      bottleneck: 'Not getting enough enquiries from new clients. Mostly relying on referrals.'
    }
  };
  
  // Call the main doPost function
  const response = doPost(testData);
  
  // Log the response
  console.log('');
  console.log('📤 RESPONSE:');
  console.log(response.getContent());
}

// ============================================================================
// UTILITY FUNCTION - View Recent Logs
// ============================================================================

function viewRecentLogs() {
  const logs = console.getLog();
  Logger.log(logs);
  console.log('Logs displayed in Execution log tab');
}

// ============================================================================
// SETUP INSTRUCTIONS
// ============================================================================

/*

╔════════════════════════════════════════════════════════════════╗
║           GOOGLE APPS SCRIPT SETUP INSTRUCTIONS                ║
╚════════════════════════════════════════════════════════════════╝

STEP 1: PREPARE YOUR GOOGLE SHEET
─────────────────────────────────────────────────────────────────

1. Go to https://sheets.google.com
2. Create a new spreadsheet named "Evocaa Leads"
3. In Row 1, add these headers:
   
   A1: Timestamp
   B1: Name
   C1: Email
   D1: Phone
   E1: Business Name
   F1: Monthly Revenue
   G1: Bottleneck

4. Save the sheet


STEP 2: CREATE APPS SCRIPT
─────────────────────────────────────────────────────────────────

1. In your Google Sheet, click Extensions > Apps Script
2. Delete any existing code
3. Copy and paste this entire script
4. Click Save


STEP 3: TEST THE SCRIPT
─────────────────────────────────────────────────────────────────

1. In the Apps Script editor, select "testFormSubmission" from the 
   function dropdown (top center)
2. Click the ▶ Run button
3. You may see an authorization prompt - click "Review Permissions"
4. Select your Google account and click "Allow"
5. Check the Execution log (bottom) for results
6. Check your email inbox for test emails


STEP 4: DEPLOY AS WEB APP
─────────────────────────────────────────────────────────────────

1. Click Deploy (top right)
2. Click "New Deployment"
3. Select Type: "Web App"
4. Execute as: "Me" (your account)
5. Who has access: "Anyone"
6. Click Deploy
7. Click "Review Permissions" and authorize
8. Copy the Web App URL (looks like:
   https://script.google.com/macros/d/ABC123XYZ/userweb)


STEP 5: ADD TO VERCEL ENVIRONMENT
─────────────────────────────────────────────────────────────────

1. Go to Vercel Dashboard
2. Select your Evocaa project
3. Settings > Environment Variables
4. Add: VITE_GOOGLE_SCRIPT_URL = [Web App URL from Step 4]
5. Click Save
6. Go to Deployments and Redeploy


STEP 6: TEST END-TO-END
─────────────────────────────────────────────────────────────────

1. Visit your website
2. Click "Book Your Diagnosis"
3. Fill out the form
4. Submit
5. Check your Google Sheet - new row should appear
6. Check your email inbox for notification
7. Check the test email inbox for confirmation


TROUBLESHOOTING
─────────────────────────────────────────────────────────────────

❌ "No data received"
   → Verify form field names match (name, email, phone, business, revenue, bottleneck)
   → Check browser console for errors
   → Verify Web App URL is correct in Vercel

❌ Data not appearing in Sheet
   → Check Sheet permissions (must be editable)
   → Check Execution log for errors
   → Verify Sheet headers are in Row 1

❌ Email not received
   → Check spam folder
   → Check Gmail quota (100 emails/day)
   → Check Execution log for email errors

❌ Web App URL error
   → Verify deployment is active
   → Try redeploying
   → Check "Who has access" is set to "Anyone"


MONITORING
─────────────────────────────────────────────────────────────────

To check what's happening:

1. Open your Apps Script project
2. Click "Execution log" at the bottom
3. You'll see all submissions with timestamps and status
4. Click any execution to see detailed logs


IMPORTANT NOTES
─────────────────────────────────────────────────────────────────

✅ No hardcoding needed - script auto-detects your email and sheet
✅ Emails are sent from your Gmail account automatically
✅ Data is saved to the active sheet in real-time
✅ Script includes error handling and notifications
✅ Gmail limit: 100 emails per day (quota resets daily)
✅ Sheet size limit: 10 million cells per sheet

════════════════════════════════════════════════════════════════

*/
