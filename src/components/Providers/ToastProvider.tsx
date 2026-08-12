'use client';

import toast, { Toaster, ToastBar } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{
        top: 82,
      }}
      toastOptions={{
        duration: 7000,
        style: {
          background: '#ffffff',
          color: '#1a1a2e',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontWeight: 500,
          padding: '10px 16px',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    padding: '2px 4px',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close notification"
                >
                  ✕
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
