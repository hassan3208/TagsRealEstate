import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaFileUpload, FaChartBar, FaHome } from 'react-icons/fa';

export const Layout: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc' }}>
            <header style={{
                background: 'linear-gradient(to right, #1f2937, #111827)',
                color: 'white',
                padding: '0 24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '72px', maxWidth: '1280px', margin: '0 auto', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                            src="https://nwxwbasdsjeszoxlwfoa.supabase.co/storage/v1/object/sign/logo/tagsolutionsltd_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81Y2VmMzg5OS0wODY1LTRlODgtODBjMS0zZDk5MTY0YWI0NmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3RhZ3NvbHV0aW9uc2x0ZF9sb2dvLmpwZyIsImlhdCI6MTc3MDIwODAxMywiZXhwIjoxODAxNzQ0MDEzfQ.eYcYaGjl8xPJvi_BWVzZMTycEEkID1bATvznrw8qrk0"
                            alt="TAGS RealEstate Logo"
                            style={{ height: '40px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.1)' }}
                        />
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TAGS RealEstate</span>
                    </div>

                    <nav style={{ display: 'flex', gap: '32px' }}>
                        <NavLink
                            to="/explorer"
                            style={({ isActive }) => ({
                                color: isActive ? '#fff' : '#9ca3af',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'color 0.2s ease'
                            })}
                        >
                            <FaHome size={18} /> Explorer
                        </NavLink>
                        <NavLink
                            to="/import"
                            style={({ isActive }) => ({
                                color: isActive ? '#fff' : '#9ca3af',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'color 0.2s ease'
                            })}
                        >
                            <FaFileUpload size={18} /> Import
                        </NavLink>
                        <NavLink
                            to="/market-summary"
                            style={({ isActive }) => ({
                                color: isActive ? '#fff' : '#9ca3af',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.95rem',
                                transition: 'color 0.2s ease'
                            })}
                        >
                            <FaChartBar size={18} /> Analytics
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: '32px 20px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>

            <footer style={{ backgroundColor: '#fff', padding: '20px', textAlign: 'center', borderTop: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.875rem' }}>
                &copy; {new Date().getFullYear()} TAGS Real Estate. All rights reserved.
            </footer>
        </div>
    );
};
