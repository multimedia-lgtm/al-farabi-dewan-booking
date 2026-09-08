// Data Penyimpanan (menggunakan localStorage)
const STORAGE_KEY = 'bookings_data';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadBookingsFromStorage();
});

// Event Listeners
function initializeEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.btn-login');

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', bukaLogin);
    }

    // Smooth scroll untuk nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    updateActiveNav(target);
                }
            }
        });
    });
}

// Update active navigation
function updateActiveNav(target) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`a[href="${target}"]`).classList.add('active');
}

// Scroll to booking section
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

// Pilih Ruangan
function pilihRuangan(namaRuangan) {
    const ruanganSelect = document.getElementById('ruangan');
    ruanganSelect.value = namaRuangan;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    ruanganSelect.focus();
}

// Handle Booking Form Submit
function handleBookingSubmit(e) {
    e.preventDefault();

    // Validasi form
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const ruangan = document.getElementById('ruangan').value;
    const tarihMula = document.getElementById('tarihMula').value;
    const tarihAkhir = document.getElementById('tarihAkhir').value;
    const jenisTempahan = document.getElementById('jenisTempahan').value;
    const jumlahOrang = document.getElementById('jumlahOrang').value;
    const catatan = document.getElementById('catatan').value;

    // Validasi tanggal
    if (new Date(tarihMula) > new Date(tarihAkhir)) {
        alert('Tarikh mula tidak boleh lebih besar daripada tarikh akhir!');
        return;
    }

    // Buat object booking
    const booking = {
        id: generateId(),
        nama: nama,
        email: email,
        telefon: telefon,
        ruangan: ruangan,
        tarihMula: tarihMula,
        tarihAkhir: tarihAkhir,
        jenisTempahan: jenisTempahan,
        jumlahOrang: jumlahOrang,
        catatan: catatan,
        status: 'Menunggu Pengesahan',
        tarikhTempahan: new Date().toLocaleString('ms-MY'),
        harga: hitungHarga(ruangan, tarihMula, tarihAkhir)
    };

    // Simpan ke localStorage
    saveBooking(booking);

    // Tampilkan pesan sukses
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';

    // Kirim email (simulasi)
    console.log('Email akan dikirim ke:', email);
    kirimKonfirmasiEmail(booking);
}

// Hitung harga
function hitungHarga(ruangan, tarihMula, tarihAkhir) {
    const hargaPerHari = {
        'Dewan Utama': 2000,
        'Dewan Tengah': 1500,
        'Dewan Kecil': 800
    };

    const mulai = new Date(tarihMula);
    const akhir = new Date(tarihAkhir);
    const jumlahHari = Math.ceil((akhir - mulai) / (1000 * 60 * 60 * 24)) + 1;

    return (hargaPerHari[ruangan] || 0) * jumlahHari;
}

// Generate ID unik
function generateId() {
    return 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Simpan Booking
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// Muat Bookings dari Storage
function loadBookingsFromStorage() {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    console.log('Bookings yang tersimpan:', bookings);
}

// Kirim Konfirmasi Email (Simulasi)
function kirimKonfirmasiEmail(booking) {
    const emailContent = `
    Terima kasih ${booking.nama},
    
    Kami telah menerima permintaan tempahan Anda:
    
    ID Tempahan: ${booking.id}
    Ruangan: ${booking.ruangan}
    Tarikh: ${booking.tarihMula} hingga ${booking.tarihAkhir}
    Jenis: ${booking.jenisTempahan}
    Jumlah Tetamu: ${booking.jumlahOrang}
    Harga: RM ${booking.harga.toLocaleString('ms-MY')}
    
    Kami akan menghubungi Anda dalam masa 24 jam untuk mengesahkan tempahan.
    
    Terima kasih,
    Dewan Al Farabi
    `;

    console.log('Email dikirim ke:', booking.email);
    console.log(emailContent);

    // Dalam implementasi sebenarnya, ini akan memanggil API backend
    // fetch('/api/send-email', {
    //     method: 'POST',
    //     body: JSON.stringify(booking)
    // });
}

// Reset Form
function resetForm() {
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('bookingForm').reset();
}

// Login Functions
function bukaLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function tutupLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Simpan session
        sessionStorage.setItem('adminLogged', 'true');
        
        // Buka dashboard admin
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Nama pengguna atau kata laluan salah!');
    }
}

// Close modal ketika klik di luar
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Validate Email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Phone
function validatePhone(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR'
    }).format(amount);
}

// Get Bookings
function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Get Booking by ID
function getBookingById(id) {
    const bookings = getBookings();
    return bookings.find(b => b.id === id);
}

// Update Booking Status
function updateBookingStatus(id, newStatus) {
    let bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    
    if (booking) {
        booking.status = newStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
        return true;
    }
    return false;
}

// Delete Booking
function deleteBooking(id) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// Check Ketersediaan Ruangan
function checkKetersediaan(ruangan, tarihMula, tarihAkhir) {
    const bookings = getBookings();
    const terbooking = bookings.filter(b => b.ruangan === ruangan && b.status !== 'Dibatalkan');

    for (let booking of terbooking) {
        const existingStart = new Date(booking.tarihMula);
        const existingEnd = new Date(booking.tarihAkhir);
        const newStart = new Date(tarihMula);
        const newEnd = new Date(tarihAkhir);

        // Check overlapping
        if ((newStart >= existingStart && newStart <= existingEnd) ||
            (newEnd >= existingStart && newEnd <= existingEnd) ||
            (newStart < existingStart && newEnd > existingEnd)) {
            return false;
        }
    }
    return true;
}

// Export data
function exportBookingsToCSV() {
    const bookings = getBookings();
    
    if (bookings.length === 0) {
        alert('Tiada data untuk dieksport!');
        return;
    }

    let csv = 'ID,Nama,Email,Telefon,Ruangan,Tarikh Mula,Tarikh Akhir,Jenis,Jumlah Orang,Status,Harga\n';
    
    bookings.forEach(booking => {
        csv += `${booking.id},"${booking.nama}","${booking.email}","${booking.telefon}","${booking.ruangan}","${booking.tarihMula}","${booking.tarihAkhir}","${booking.jenisTempahan}",${booking.jumlahOrang},"${booking.status}",${booking.harga}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
}

// Statistik Booking
function getStatistik() {
    const bookings = getBookings();
    
    return {
        totalBooking: bookings.length,
        menungguPengesahan: bookings.filter(b => b.status === 'Menunggu Pengesahan').length,
        disahkan: bookings.filter(b => b.status === 'Disahkan').length,
        selesai: bookings.filter(b => b.status === 'Selesai').length,
        dibatalkan: bookings.filter(b => b.status === 'Dibatalkan').length,
        totalPendapatan: bookings
            .filter(b => b.status !== 'Dibatalkan')
            .reduce((sum, b) => sum + b.harga, 0)
    };
}
