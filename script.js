// Get DOM elements
const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.querySelector('.qr-body');

// Initialize variables
let size = sizes.value;
let qrCode = null;

// Event Listeners
generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleGenerate();
});

sizes.addEventListener('change', (e) => {
    size = e.target.value;
    if (qrText.value.length > 0) {
        generateQRCode();
    }
});

// Generate on Enter key press
qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleGenerate();
    }
});

downloadBtn.addEventListener('click', (e) => {
    handleDownload(e);
});

// Functions
function handleGenerate() {
    const inputValue = qrText.value.trim();
    
    if (inputValue.length === 0) {
        showNotification('Please enter text or URL to generate QR code', 'error');
        qrText.focus();
        return;
    }
    
    generateQRCode();
    showNotification('QR Code generated successfully!', 'success');
}

function generateQRCode() {
    // Clear previous QR code
    qrContainer.innerHTML = "";
    
    // Create new QR code
    qrCode = new QRCode(qrContainer, {
        text: qrText.value,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Add animation class
    setTimeout(() => {
        const qrImage = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
        if (qrImage) {
            qrImage.style.animation = 'scaleIn 0.4s ease-out';
        }
    }, 100);
}

function handleDownload(e) {
    const img = qrContainer.querySelector('img');
    const canvas = qrContainer.querySelector('canvas');
    
    if (img !== null) {
        const imgAttr = img.getAttribute('src');
        downloadBtn.setAttribute("href", imgAttr);
        showNotification('Downloading QR Code...', 'success');
    } else if (canvas !== null) {
        const dataURL = canvas.toDataURL('image/png');
        downloadBtn.setAttribute("href", dataURL);
        showNotification('Downloading QR Code...', 'success');
    } else {
        e.preventDefault();
        showNotification('Please generate a QR code first', 'error');
        downloadBtn.removeAttribute("href");
    }
}

// Notification system
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-size: 15px;
        font-weight: 500;
    `;
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Button animation effects
generateBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
});

generateBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
});

downloadBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
});

downloadBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
});

// Clear input button functionality (optional enhancement)
qrText.addEventListener('input', function() {
    if (this.value.length > 0) {
        generateBtn.style.opacity = '1';
        generateBtn.style.pointerEvents = 'all';
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    qrText.focus();
});

