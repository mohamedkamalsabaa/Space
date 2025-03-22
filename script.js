document.addEventListener('DOMContentLoaded', function() {
    // التحقق مما إذا كنا في صفحة الرحلات
    if (window.location.pathname.includes('trips.html')) {
        // استرجاع معايير البحث من localStorage
        const searchParams = localStorage.getItem('searchParams');
        if (searchParams) {
            const params = JSON.parse(searchParams);
            const searchResults = document.getElementById('searchResults');
            
            // إظهار معايير البحث
            searchResults.innerHTML = `
                <div class="search-summary">
                    <p>Showing results for:</p>
                    <ul>
                        <li>Destination: ${params.destination}</li>
                        <li>Date: ${params.date}</li>
                        <li>Passengers: ${params.passengers}</li>
                    </ul>
                </div>
            `;
            
            // مسح معايير البحث بعد عرضها
            localStorage.removeItem('searchParams');
        }
    }

    // Initialize minimum date (today)
    const dateInput = document.getElementById('date');
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.min = minDate;

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle search form with animation
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;
        const passengers = document.getElementById('passengers').value;

        if (!destination || !date || !passengers) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Animate search button
        const searchButton = this.querySelector('.search-button');
        searchButton.innerHTML = 'Searching...';
        searchButton.style.opacity = '0.7';
        
        // حفظ معايير البحث في localStorage
        localStorage.setItem('searchParams', JSON.stringify({
            destination,
            date,
            passengers
        }));
        
        // التحويل إلى صفحة الرحلات
        window.location.href = 'trips.html';
    });

    // Enhanced booking button interaction
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        document.getElementById('search').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Add hover effect to form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-5px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
});

function searchTrips(destination, date, passengers) {
    showNotification('Search completed! Showing available trips...', 'success');
    console.log('Search Parameters:', {
        destination,
        date,
        passengers
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// إضافة معالج النقر لأزرار الحجز
document.querySelectorAll('.book-button').forEach(button => {
    button.addEventListener('click', function() {
        const tripCard = this.closest('.trip-card') || this.closest('.accommodation-card');
        const bookingInfo = {
            type: tripCard.querySelector('h3').textContent,
            price: tripCard.querySelector('.trip-price')?.textContent || '$0',
            duration: tripCard.querySelector('.trip-features li:first-child')?.textContent || '-'
        };
        
        // حفظ معلومات الحجز في localStorage
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        
        // الانتقال إلى صفحة الدفع
        window.location.href = 'payment.html';
    });
});

// التحقق من وجود معلومات الحجز في صفحة الدفع
if (window.location.pathname.includes('payment.html')) {
    const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo') || '{}');
    
    // ملء ملخص الحجز
    document.getElementById('bookingType').textContent = bookingInfo.type || '-';
    document.getElementById('duration').textContent = bookingInfo.duration || '-';
    document.getElementById('totalAmount').textContent = bookingInfo.price || '-';
    
    // معالجة تأكيد الدفع
    document.getElementById('confirmPayment').addEventListener('click', function(e) {
        e.preventDefault();
        
        // التحقق من صحة النموذج
        const passengerForm = document.getElementById('passenger-form');
        const paymentForm = document.getElementById('payment-form');
        
        if (passengerForm.checkValidity() && paymentForm.checkValidity()) {
            showNotification('Payment successful! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showNotification('Please fill in all required fields', 'error');
        }
    });
} 