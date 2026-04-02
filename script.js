// HydroGuard Global Design & Logic System
const API_BASE_URL = 'http://127.0.0.1:5000';

// 2. API & Data Layer (Mirrors Android's ApiService.kt)
window.hg = {
    api: {
        async post(endpoint, data) {
            try {
                const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return { status: 'error', message: 'Server connection failed' };
            }
        },
        async get(endpoint, params = {}) {
            try {
                const query = new URLSearchParams(params).toString();
                const response = await fetch(`${API_BASE_URL}/${endpoint}${query ? '?' + query : ''}`);
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return { status: 'error', message: 'Server connection failed' };
            }
        },
        // Specific Endpoints
        register: (data) => hg.api.post('register', data),
        login: (data) => hg.api.post('login', data),
        adminLogin: (data) => hg.api.post('api/admin/login', data),
        forgotPassword: (email) => hg.api.post('forgot-password', { email }),
        verifyOtp: (data) => hg.api.post('verify-otp', data),
        resetPassword: (data) => hg.api.post('reset-password', data),
        waterCheck: (data) => hg.api.post('citizen/water-check', data),
        reportIssue: (data) => hg.api.post('citizen/report', data),
        deleteAccount: (data) => hg.api.post('citizen/delete-account', data),
        deleteUser: (data) => hg.api.post('delete-account', data),
        getPatientCases: (severity) => hg.api.get('patient-cases', { severity }),
        getAdminPatientCases: (severity) => hg.api.get('admin/patient-cases', { severity }),
        getSummaryReports: () => hg.api.get('admin/summary-reports'),
        createCase: (data) => hg.api.post('healthworker/create-case', data),
        addWaterSource: (data) => hg.api.post('healthworker/add-water-source', data),
        getNotifications: (userId) => hg.api.get('health-worker/notifications', { user_id: userId }),
        getReportById: (id) => hg.api.get(`report/${id}`),
        updateReportStatus: (id, status) => hg.api.post(`report/${id}/status`, { status })
    },

    session: {
        save(user) {
            // Normalize backend snake_case to frontend expected properties
            const normalized = {
                ...user,
                id: user.user_id || user.id,
                name: user.full_name || user.name,
                location: user.district || user.location,
                timestamp: Date.now()
            };
            localStorage.setItem('hg_session', JSON.stringify(normalized));
        },
        get() {
            const session = localStorage.getItem('hg_session');
            return session ? JSON.parse(session) : null;
        },
        logout() {
            localStorage.removeItem('hg_session');
            window.location.href = 'index.html';
        },
        isAuthenticated() {
            return !!this.get();
        }
    },

    ui: {
        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `glass hg-toast hg-toast-${type}`;
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" style="width: 20px;"></i>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(toast);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(() => {
                toast.classList.add('out');
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        },
        togglePassword(input, icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global UI
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Global Interactions
    // Auto-update Footer Copyright
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.innerHTML = `&copy; ${new Date().getFullYear()} HydroGuard. Empowering communities through water safety.`;
    }
});
