import emailjs from '@emailjs/nodejs';
import "dotenv/config";

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID,
  templateId: process.env.EMAILJS_TEMPLATE_ID,
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
};

// Initialize EmailJS with credentials
const initEmailJS = () => {
  emailjs.init({
    publicKey: EMAILJS_CONFIG.publicKey,
    privateKey: EMAILJS_CONFIG.privateKey,
  });
};

// Global email sending function
export const sendEmail = async ({ to, subject, templateParams, templateId }) => {
  try {
    initEmailJS();
    
    const params = {
      to_email: to,
      subject: subject,
      ...templateParams,
    };
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateId || EMAILJS_CONFIG.templateId,
      params
    );
    
    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Booking Confirmation Email
export const sendBookingConfirmationEmail = async (bookingData) => {
  const {
    userEmail,
    userName,
    bookingId,
    serviceName,
    servicePrice,
    professionalName,
    bookingDate,
    bookingTime,
    duration,
    location,
    notes
  } = bookingData;

  const templateParams = {
    to_email:userEmail,
    to_name: userName,
    booking_id: bookingId,
    service_name: serviceName,
    service_price: servicePrice,
    professional_name: professionalName,
    booking_date: bookingDate,
    booking_time: bookingTime,
    duration: duration || '1 hour',
    location: location || 'To be confirmed',
    notes: notes || 'No special notes',
    status: 'Confirmed',
    year: new Date().getFullYear(),
    support_email: process.env.SUPPORT_EMAIL || 'support@servicehub.com',
  };

  return await sendEmail({
    to_email: userEmail,
    subject: `Booking ${bookingData.message}: ${serviceName} with ${professionalName}`,
    templateParams,
  });
};

// Booking Status Update Email
export const sendBookingStatusEmail = async (bookingData) => {
  const {
    userEmail,
    userName,
    bookingId,
    serviceName,
    professionalName,
    status,
    statusMessage,
    bookingDate,
    bookingTime
  } = bookingData;

  const statusColors = {
    confirmed: '#10b981',
    pending: '#f59e0b',
    cancelled: '#ef4444',
    completed: '#3b82f6',
    'in-progress': '#8b5cf6'
  };

  const templateParams = {
    to_name: userName,
    to_email:userEmail,
    booking_id: bookingId,
    service_name: serviceName,
    professional_name: professionalName,
    status: status.toUpperCase(),
    status_message: statusMessage || getStatusMessage(status),
    booking_date: bookingDate,
    booking_time: bookingTime,
    status_color: statusColors[status] || '#6b7280',
    year: new Date().getFullYear(),
    support_email: process.env.SUPPORT_EMAIL || 'support@servicehub.com',
  };

  return await sendEmail({
    to_email: userEmail,
    subject: `Booking ${status.toUpperCase()}: ${serviceName}`,
    templateParams,
  });
};

// Booking Reminder Email
export const sendBookingReminderEmail = async (bookingData) => {
  const {
    userEmail,
    userName,
    bookingId,
    serviceName,
    professionalName,
    bookingDate,
    bookingTime,
    hoursRemaining
  } = bookingData;

  const templateParams = {
    to_name: userName,
    booking_id: bookingId,
    service_name: serviceName,
    professional_name: professionalName,
    booking_date: bookingDate,
    booking_time: bookingTime,
    hours_remaining: hoursRemaining || '24',
    year: new Date().getFullYear(),
    support_email: process.env.SUPPORT_EMAIL || 'support@servicehub.com',
  };

  return await sendEmail({
    to: userEmail,
    subject: `Reminder: Your ${serviceName} Booking in ${hoursRemaining || '24'} Hours`,
    templateParams,
  });
};

// Welcome Email for New Users
export const sendWelcomeEmail = async (userData) => {
  const {
    userEmail,
    userName,
    userRole
  } = userData;

  const templateParams = {
    to_name: userName,
    to_email: userEmail,
    user_role: userRole || 'customer',
    year: new Date().getFullYear(),
    support_email: process.env.SUPPORT_EMAIL || 'support@servicehub.com',
  };

  return await sendEmail({
    to_email: userEmail,
    subject: 'Welcome to ServiceHub! 🎉',
    templateParams,
    templateId: process.env.EMAILJS_WELCOME_TEMPLATE_ID, // Optional different template
  });
};


// Professional Notification for New Booking
export const sendProfessionalNotificationEmail = async (bookingData) => {
  const {
    professionalEmail,
    professionalName,
    customerName,
    bookingId,
    serviceName,
    servicePrice,
    bookingDate,
    bookingTime,
    customerNotes
  } = bookingData;

  const templateParams = {
    to_name: professionalName,
    to_email:professionalEmail,
    customer_name: customerName,
    booking_id: bookingId,
    service_name: serviceName,
    service_price: servicePrice,
    booking_date: bookingDate,
    booking_time: bookingTime,
    customer_notes: customerNotes || 'No special requests',
    year: new Date().getFullYear(),
    support_email: process.env.SUPPORT_EMAIL || 'support@servicehub.com',
  };

  return await sendEmail({
    to_email: professionalEmail,
    subject: `New Booking Request: ${serviceName} with ${customerName}`,
    templateParams,
  });
};

// Helper function to get status message
const getStatusMessage = (status) => {
  const messages = {
    confirmed: 'Your booking has been confirmed! The professional will arrive at the scheduled time.',
    pending: 'Your booking request has been received and is awaiting confirmation.',
    cancelled: 'Your booking has been cancelled. If this was a mistake, please contact support.',
    completed: 'Your service has been marked as completed. Thank you for choosing ServiceHub!',
    'in-progress': 'Your service is currently in progress. The professional is on their way.',
  };
  return messages[status] || 'Your booking status has been updated.';
};

// Bulk Email Sending
export const sendBulkEmails = async (emailList, templateParams, templateId) => {
  const results = [];
  
  for (const recipient of emailList) {
    const result = await sendEmail({
      to_email: recipient.email,
      subject: templateParams.subject || 'Important Update from ServiceHub',
      templateParams: {
        ...templateParams,
        to_name: recipient.name,
        to_email:recipient.email
      },
      templateId,
    });
    
    results.push({
      email: recipient.email,
      success: result.success,
      error: result.error,
    });
  }
  
  return results;
};






export const sendServiceAddedEmail = async (data) => {


//   <h2>Hello {{to_name}} 👋</h2>

// <p>Your service has been successfully added!</p>

// <div>
//   <p><strong>Service:</strong> {{service_name}}</p>
//   <p><strong>Experience:</strong> {{experience}} years</p>
//   <p><strong>Pricing:</strong> ₹{{pricing}}</p>
// </div>

// <p>You can now start receiving bookings 🚀</p>

// <p>© {{year}} ServiceHub</p>

  const {
    professionalEmail,
    professionalName,
    serviceName,
    pricing,
    experience,
  } = data;

  const templateParams = {
    to_name: professionalName,
    service_name: serviceName,
    pricing,
    experience,
    year: new Date().getFullYear(),
  };

  return await sendEmail({
    to: professionalEmail, // ✅ ONLY HERE
    subject: `Service Added Successfully`,
    templateParams,
    templateId: process.env.EMAILJS_TEMPLATE_SERVICE_ADDED,
  });
};
// Export all functions
export default {
  sendEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusEmail,
  sendBookingReminderEmail,
  sendWelcomeEmail,
  sendProfessionalNotificationEmail,
  sendBulkEmails,
  sendServiceAddedEmail
};