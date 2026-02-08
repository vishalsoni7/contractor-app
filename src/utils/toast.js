import toast from 'react-hot-toast';

// Store active toasts to prevent duplicates
const activeToasts = new Map();

// Helper to create a unique key for toast content
const getToastKey = (message, type) => {
  return `${type}-${message}`;
};

// Custom toast functions that prevent duplicates
export const showToast = {
  success: (message, options = {}) => {
    const key = getToastKey(message, 'success');
    
    // If this toast is already showing, don't show it again
    if (activeToasts.has(key)) {
      return activeToasts.get(key);
    }

    const toastId = toast.success(message, {
      ...options,
      onClose: () => {
        activeToasts.delete(key);
        options.onClose?.();
      },
    });

    activeToasts.set(key, toastId);
    return toastId;
  },

  error: (message, options = {}) => {
    const key = getToastKey(message, 'error');
    
    if (activeToasts.has(key)) {
      return activeToasts.get(key);
    }

    const toastId = toast.error(message, {
      ...options,
      onClose: () => {
        activeToasts.delete(key);
        options.onClose?.();
      },
    });

    activeToasts.set(key, toastId);
    return toastId;
  },

  loading: (message, options = {}) => {
    const key = getToastKey(message, 'loading');
    
    if (activeToasts.has(key)) {
      return activeToasts.get(key);
    }

    const toastId = toast.loading(message, {
      ...options,
      onClose: () => {
        activeToasts.delete(key);
        options.onClose?.();
      },
    });

    activeToasts.set(key, toastId);
    return toastId;
  },

  // Dismiss a specific toast
  dismiss: (toastId) => {
    toast.dismiss(toastId);
    // Clean up from active toasts
    for (const [key, id] of activeToasts.entries()) {
      if (id === toastId) {
        activeToasts.delete(key);
        break;
      }
    }
  },

  // Promise-based toast (useful for async operations)
  promise: (promise, messages, options = {}) => {
    return toast.promise(promise, messages, options);
  },
};

// Helper function to get toast messages based on current language setting
export const getToastMessage = (english, hindi) => {
  const language = localStorage.getItem('kaamgar_language') || 'bi';
  
  switch (language) {
    case 'en':
      return english;
    case 'hi':
      return hindi;
    case 'bi':
    default:
      return `${english} / ${hindi}`;
  }
};

// Common toast messages
export const TOAST_MESSAGES = {
  // Worker messages
  WORKER_ADDED: { en: 'Worker added successfully', hi: 'कर्मचारी सफलतापूर्वक जोड़ा गया' },
  WORKER_UPDATED: { en: 'Worker updated successfully', hi: 'कर्मचारी सफलतापूर्वक अपडेट किया गया' },
  WORKER_DELETED: { en: 'Worker deleted', hi: 'कर्मचारी हटाया गया' },
  WORKER_ADD_FAILED: { en: 'Failed to add worker', hi: 'कर्मचारी जोड़ने में विफल' },
  WORKER_UPDATE_FAILED: { en: 'Failed to update worker', hi: 'कर्मचारी अपडेट करने में विफल' },
  WORKER_DELETE_FAILED: { en: 'Failed to delete worker', hi: 'कर्मचारी हटाने में विफल' },
  
  // Attendance messages
  ATTENDANCE_MARKED: { en: 'Attendance marked', hi: 'हाज़िरी चिह्नित' },
  ATTENDANCE_FAILED: { en: 'Failed to mark attendance', hi: 'हाज़िरी चिह्नित करने में विफल' },
  
  // Advance messages
  ADVANCE_RECORDED: { en: 'Advance recorded', hi: 'अग्रिम दर्ज' },
  ADVANCE_UPDATED: { en: 'Advance updated', hi: 'अग्रिम अपडेट किया गया' },
  ADVANCE_DELETED: { en: 'Advance deleted', hi: 'अग्रिम हटाया गया' },
  ADVANCE_FAILED: { en: 'Failed to record advance', hi: 'अग्रिम दर्ज करने में विफल' },
  ADVANCE_UPDATE_FAILED: { en: 'Failed to update advance', hi: 'अग्रिम अपडेट करने में विफल' },
  ADVANCE_DELETE_FAILED: { en: 'Failed to delete advance', hi: 'अग्रिम हटाने में विफल' },
  
  // Holiday messages
  HOLIDAY_ADDED: { en: 'Holiday added', hi: 'छुट्टी जोड़ी गई' },
  HOLIDAY_DELETED: { en: 'Holiday deleted', hi: 'छुट्टी हटाई गई' },
  HOLIDAY_ADD_FAILED: { en: 'Failed to add holiday', hi: 'छुट्टी जोड़ने में विफल' },
  HOLIDAY_DELETE_FAILED: { en: 'Failed to delete holiday', hi: 'छुट्टी हटाने में विफल' },
  
  // Profile messages
  PROFILE_UPDATED: { en: 'Profile updated', hi: 'प्रोफ़ाइल अपडेट' },
  PROFILE_UPDATE_FAILED: { en: 'Failed to update profile', hi: 'प्रोफ़ाइल अपडेट करने में विफल' },
  
  // Auth messages
  LOGGED_OUT: { en: 'Logged out', hi: 'लॉग आउट' },
};

// Helper to use predefined messages
export const getToast = (messageKey) => {
  const msg = TOAST_MESSAGES[messageKey];
  if (!msg) return '';
  return getToastMessage(msg.en, msg.hi);
};
