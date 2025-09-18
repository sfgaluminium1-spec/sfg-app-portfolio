
'use client'

// Common button actions for the marketing website
export const buttonActions = {
  installExtension: () => {
    // In a real implementation, this would open Chrome Web Store
    window.open('https://chrome.google.com/webstore', '_blank')
  },

  watchDemo: () => {
    // In a real implementation, this would open a demo video
    alert('Demo video would be shown here. Contact us for a live demonstration!')
  },

  tryExtension: () => {
    // Same as install for marketing purposes
    window.open('https://chrome.google.com/webstore', '_blank')
  },

  downloadiOS: () => {
    // In a real implementation, this would go to App Store
    window.open('https://apps.apple.com', '_blank')
  },

  downloadAndroid: () => {
    // In a real implementation, this would go to Google Play Store
    window.open('https://play.google.com/store', '_blank')
  },

  becomePartner: () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  },

  viewDocumentation: () => {
    // In a real implementation, this would go to API docs
    alert('API Documentation would be available here. Contact us for access!')
  },

  startFreeTrial: () => {
    // Same as install for marketing purposes
    window.open('https://chrome.google.com/webstore', '_blank')
  },

  contactSales: () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  },

  bookDemo: () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  },

  getStarted: () => {
    // Same as install for marketing purposes
    window.open('https://chrome.google.com/webstore', '_blank')
  },

  viewIntegrations: () => {
    // In a real implementation, this would show all integrations
    alert('All integrations page would be shown here. Contact us for more details!')
  }
}

// Share functionality using Web Share API
export const shareWebsite = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'SFG Chrome Extension - AI-Powered Automation',
        text: 'Check out this revolutionary Chrome extension with AI automation!',
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to clipboard
      fallbackShare()
    }
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('Link copied to clipboard!')
  }).catch(() => {
    alert('Unable to share. Please copy the URL manually.')
  })
}
