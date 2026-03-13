import React, { useEffect, useMemo, useState } from 'react';
import {
    Book,
    Edit,
    Image as ImageIcon,
    LogIn,
    LogOut,
    MessageSquare,
    Milestone,
    PlusCircle,
    Settings,
    ShieldCheck,
    Sparkles,
    Trash2,
    Users,
    Video,
} from 'lucide-react';
import './App.css';
import sustLogo from './assets/sust-logo-transparent.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010/api';
const UPLOAD_SECTIONS = new Set(['books', 'gallery', 'timeline', 'auliyas', 'videos']);

const withAuth = async (url, options = {}) => {
    const token = localStorage.getItem('slc_auth_token');
    const headers = { ...(options.headers || {}) };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${url}`, { ...options, headers });
};

const toDisplayUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const normalized = url.replace(/\\/g, '/');
    const base = API_URL.replace(/\/api\/?$/, '');
    return `${base}/${normalized}`;
};

const SECTION_CONFIG = {
    books: {
        title: 'Books',
        icon: Book,
        columns: ['title', 'author', 'category', 'description'],
        empty: 'No books yet.',
    },
    authors: {
        title: 'Authors',
        icon: Users,
        columns: ['name', 'bio'],
        empty: 'No authors yet.',
    },
    quotes: {
        title: 'Quotes',
        icon: MessageSquare,
        columns: ['text', 'author'],
        empty: 'No quotes yet.',
    },
    timeline: {
        title: 'Timeline',
        icon: Milestone,
        columns: ['year', 'title', 'sortOrder', 'description'],
        empty: 'No timeline events yet.',
    },
    auliyas: {
        title: 'Auliyas',
        icon: Users,
        columns: ['name', 'title', 'address', 'lat', 'lng'],
        empty: 'No auliya entries yet.',
    },
    gallery: {
        title: 'Gallery',
        icon: ImageIcon,
        columns: ['caption', 'category', 'imageUrl'],
        empty: 'No gallery images yet.',
    },
    videos: {
        title: 'Videos',
        icon: Video,
        columns: ['title', 'category', 'url', 'description'],
        empty: 'No videos yet.',
    },
    requests: {
        title: 'Research Requests',
        icon: MessageSquare,
        columns: ['name', 'email', 'institution', 'bookTitle', 'status'],
        empty: 'No research requests yet.',
    },
    settings: {
        title: 'Settings',
        icon: Settings,
        columns: ['key', 'value'],
        empty: 'No settings yet.',
    },
};

const INITIAL_FORM = {
    title: '',
    author: '',
    description: '',
    category: '',
    text: '',
    year: '',
    sortOrder: '',
    name: '',
    caption: '',
    url: '',
    key: '',
    value: '',
    status: '',
    bio: '',
    address: '',
    lat: '',
    lng: '',
    image: null,
    pdf: null,
    coverImage: null,
    video: null,
    thumbnail: null,
};

const SECTION_OPTIONS = {
    books: {
        category: ['Biography', 'History', 'Teachings', 'Poetry'],
    },
    gallery: {
        category: ['SUST', 'Dargah Sharif', 'Library', 'Events'],
    },
    videos: {
        category: ['SUST', 'Dargah Sharif', 'Library', 'Events', 'Speeches'],
    },
    requests: {
        status: ['Pending', 'Reviewed', 'Closed'],
    },
};

const validateSectionForm = (section, form, isEditing) => {
    if (section === 'books') {
        if (!form.title?.trim()) return 'Book title is required.';
        if (!form.author?.trim()) return 'Author is required.';
        if (!form.description?.trim()) return 'Description is required.';
        if (!form.category?.trim()) return 'Category is required.';
        if (!isEditing && !form.pdf) return 'Please upload a PDF for new book entries.';
        if (!isEditing && !form.coverImage) return 'Please upload a cover image for new book entries.';
        return '';
    }

    if (section === 'gallery') {
        if (!form.caption?.trim()) return 'Caption is required.';
        if (!form.category?.trim()) return 'Category is required.';
        if (!isEditing && !form.image) return 'Please upload an image for new gallery entries.';
        return '';
    }

    if (section === 'timeline') {
        if (!form.year?.trim()) return 'Year is required.';
        if (!form.title?.trim()) return 'Title is required.';
        if (!form.description?.trim()) return 'Description is required.';
        if (!String(form.sortOrder || '').trim()) return 'Sort order is required.';
        if (!isEditing && !form.image) return 'Please upload an image for new timeline entries.';
        return '';
    }

    if (section === 'auliyas') {
        if (!form.name?.trim()) return 'Name is required.';
        if (!form.title?.trim()) return 'Title is required.';
        if (!form.description?.trim()) return 'Description is required.';
        if (!form.address?.trim()) return 'Address is required.';
        if (!String(form.lat || '').trim() || Number.isNaN(Number(form.lat))) return 'Valid latitude is required.';
        if (!String(form.lng || '').trim() || Number.isNaN(Number(form.lng))) return 'Valid longitude is required.';
        if (!isEditing && !form.image) return 'Please upload an image for new auliya entries.';
        return '';
    }

    if (section === 'videos') {
        if (!form.title?.trim()) return 'Video title is required.';
        if (!form.category?.trim()) return 'Category is required.';
        if (!isEditing && !form.url?.trim() && !form.video) {
            return 'Provide either a video URL or upload a video file for new entries.';
        }
        return '';
    }

    if (section === 'authors') {
        if (!form.name?.trim()) return 'Author name is required.';
        return '';
    }

    if (section === 'quotes') {
        if (!form.text?.trim()) return 'Quote text is required.';
        return '';
    }

    if (section === 'settings') {
        if (!form.key?.trim()) return 'Settings key is required.';
        if (!String(form.value || '').trim()) return 'Settings value is required.';
        return '';
    }

    return '';
};

const LoginView = ({ onLogin }) => {
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('demo12345');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);
        const ok = await onLogin(username, password);
        setIsSubmitting(false);
        if (!ok) {
            setError('Invalid SUST SLC admin credentials.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-grid">
                <div className="admin-login-branding">
                    <div className="branding-badge">
                        <Sparkles size={16} />
                        SUST SLC Administration Portal
                    </div>
                    <div className="branding-logo-wrap">
                        <img src={sustLogo} alt="SUST logo" className="branding-logo" />
                    </div>
                    <h1>Shahjalal Library Corner (SLC)</h1>
                    <p>Official content management portal for Shahjalal University of Science and Technology Central Library.</p>
                    <div className="branding-points">
                        <div><ShieldCheck size={16} /> Manage books, authors, quotes, and research requests</div>
                        <div><ShieldCheck size={16} /> Maintain timeline, gallery, and educational video archive</div>
                        <div><ShieldCheck size={16} /> Secure access for SUST Library authorized administrators</div>
                    </div>
                </div>
                <div className="admin-login-card">
                    <div className="admin-login-logo-wrap">
                        <img src={sustLogo} alt="SUST SLC" className="admin-login-logo" />
                    </div>
                    <h2>SUST SLC Admin Login</h2>
                    <p>Sign in to manage Shahjalal University Library Corner resources.</p>

                    <form onSubmit={submit}>
                        <label>Admin ID</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter SUST SLC admin ID"
                            required
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter secure password"
                            required
                        />

                        <div className="login-credential-hint">
                            Default demo login: <strong>demo</strong> / <strong>demo12345</strong>
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button type="submit" className="primary-button" disabled={isSubmitting}>
                            <LogIn size={17} />
                            {isSubmitting ? 'Signing In...' : 'Access Admin Panel'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const normalizeItem = (section, item) => {
    if (section === 'books') {
        return {
            ...item,
            author: typeof item.author === 'object' ? item.author?._id || '' : item.author || '',
            authorName: typeof item.author === 'object' ? item.author?.name || '' : '',
        };
    }
    if (section === 'auliyas') {
        return {
            ...item,
            address: item.mazarLocation?.address || '',
            lat: item.mazarLocation?.lat ?? '',
            lng: item.mazarLocation?.lng ?? '',
        };
    }
    return item;
};

function App() {
    const [token, setToken] = useState(localStorage.getItem('slc_auth_token'));
    const [activeSection, setActiveSection] = useState('books');
    const [data, setData] = useState({
        books: [],
        authors: [],
        quotes: [],
        timeline: [],
        auliyas: [],
        gallery: [],
        videos: [],
        requests: [],
        settings: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);

    const sectionKeys = useMemo(() => Object.keys(SECTION_CONFIG), []);

    const loadAllData = async () => {
        if (!token) return;
        setLoading(true);
        setError('');

        try {
            const responses = await Promise.all(
                sectionKeys.map((section) => withAuth(`/admin/${section}`))
            );

            const unauthorized = responses.find((r) => r.status === 401);
            if (unauthorized) {
                localStorage.removeItem('slc_auth_token');
                setToken(null);
                setError('Session expired. Please log in again.');
                return;
            }

            const payloads = await Promise.all(responses.map((r) => r.json()));
            const nextData = {};
            sectionKeys.forEach((key, index) => {
                nextData[key] = Array.isArray(payloads[index]) ? payloads[index] : [];
            });
            setData(nextData);
        } catch (err) {
            setError('Failed to load admin data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, [token]);

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) return false;

            const payload = await response.json();
            localStorage.setItem('slc_auth_token', payload.token);
            setToken(payload.token);
            return true;
        } catch (err) {
            return false;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('slc_auth_token');
        setToken(null);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setForm(INITIAL_FORM);
        setModalOpen(true);
    };

    const openEditModal = (rawItem) => {
        const item = normalizeItem(activeSection, rawItem);
        setEditingItem(item);
        setForm({
            ...INITIAL_FORM,
            ...item,
            value: item.value == null ? '' : JSON.stringify(item.value),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
        setForm(INITIAL_FORM);
    };

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const buildBody = () => {
        if (activeSection === 'auliyas') {
            return {
                name: form.name,
                title: form.title,
                description: form.description,
                imageUrl: form.imageUrl || '',
                mazarLocation: {
                    address: form.address,
                    lat: Number(form.lat),
                    lng: Number(form.lng),
                },
            };
        }
        if (activeSection === 'settings') {
            let parsedValue = form.value;
            try {
                parsedValue = JSON.parse(form.value);
            } catch (err) {
                parsedValue = form.value;
            }
            return {
                key: form.key,
                value: parsedValue,
            };
        }
        if (activeSection === 'books') {
            return {
                title: form.title,
                author: form.author,
                description: form.description,
                category: form.category,
                coverImageUrl: form.coverImageUrl || '',
                pdfUrl: form.pdfUrl || '',
            };
        }

        const payload = {};
        const keys = SECTION_CONFIG[activeSection].columns;
        keys.forEach((key) => {
            payload[key] = form[key];
        });
        return payload;
    };

    const submitModal = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const validationError = validateSectionForm(activeSection, form, Boolean(editingItem?._id));
            if (validationError) {
                throw new Error(validationError);
            }

            let response;
            const isUploadSection = UPLOAD_SECTIONS.has(activeSection);
            const isEditing = Boolean(editingItem?._id);

            if (!isEditing && isUploadSection) {
                const formData = new FormData();

                if (activeSection === 'books') {
                    formData.append('title', form.title || '');
                    formData.append('author', form.author || '');
                    formData.append('description', form.description || '');
                    formData.append('category', form.category || '');
                    if (form.pdf) formData.append('pdf', form.pdf);
                    if (form.coverImage) formData.append('coverImage', form.coverImage);
                }

                if (activeSection === 'gallery') {
                    formData.append('caption', form.caption || '');
                    formData.append('category', form.category || '');
                    if (form.image) formData.append('image', form.image);
                }

                if (activeSection === 'timeline') {
                    formData.append('year', form.year || '');
                    formData.append('title', form.title || '');
                    formData.append('description', form.description || '');
                    formData.append('sortOrder', form.sortOrder || '');
                    if (form.image) formData.append('image', form.image);
                }

                if (activeSection === 'auliyas') {
                    formData.append('name', form.name || '');
                    formData.append('title', form.title || '');
                    formData.append('description', form.description || '');
                    formData.append('address', form.address || '');
                    formData.append('lat', form.lat || '');
                    formData.append('lng', form.lng || '');
                    if (form.image) formData.append('image', form.image);
                }

                if (activeSection === 'videos') {
                    formData.append('title', form.title || '');
                    formData.append('description', form.description || '');
                    formData.append('category', form.category || '');
                    formData.append('url', form.url || '');
                    if (form.video) formData.append('video', form.video);
                    if (form.thumbnail) formData.append('thumbnail', form.thumbnail);
                }

                response = await withAuth(`/admin/${activeSection}/upload`, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                const body = buildBody();
                response = await withAuth(
                    isEditing
                        ? `/admin/${activeSection}/${editingItem._id}`
                        : `/admin/${activeSection}`,
                    {
                        method: isEditing ? 'PUT' : 'POST',
                        body: JSON.stringify(body),
                    }
                );
            }

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Save failed.');
            }

            closeModal();
            await loadAllData();
        } catch (err) {
            setError(err.message || 'Could not save item.');
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async (id) => {
        const sure = window.confirm('Delete this item permanently?');
        if (!sure) return;

        try {
            const response = await withAuth(`/admin/${activeSection}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Delete failed.');
            }
            await loadAllData();
        } catch (err) {
            setError(err.message || 'Delete failed.');
        }
    };

    const seedSampleData = async () => {
        try {
            const response = await withAuth('/admin/seed-sample-data', { method: 'POST' });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || 'Failed to seed sample data.');
            await loadAllData();
            window.alert(payload.message || 'Sample data seeded successfully.');
        } catch (err) {
            setError(err.message || 'Failed to seed sample data.');
        }
    };

    if (!token) {
        return <LoginView onLogin={handleLogin} />;
    }

    const activeConfig = SECTION_CONFIG[activeSection];
    const activeRows = data[activeSection] || [];

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="brand">
                    <h2>SLC Admin</h2>
                    <p>Knowledge and Heritage</p>
                </div>

                <nav>
                    {Object.entries(SECTION_CONFIG).map(([section, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                            <button
                                key={section}
                                className={`nav-item ${activeSection === section ? 'active' : ''}`}
                                onClick={() => setActiveSection(section)}
                            >
                                <Icon size={16} />
                                <span>{cfg.title}</span>
                                <small>{data[section]?.length || 0}</small>
                            </button>
                        );
                    })}
                </nav>

                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>
            </aside>

            <main className="admin-content">
                <header className="content-header">
                    <div>
                        <h1>{activeConfig.title}</h1>
                        <p>Manage records, uploads, and structured content for the public website.</p>
                    </div>
                    <div className="header-actions">
                        <button className="outline-button" onClick={seedSampleData}>
                            Seed Sample Data
                        </button>
                        {activeSection !== 'requests' && (
                            <button className="primary-button" onClick={openCreateModal}>
                                <PlusCircle size={16} />
                                Add {activeConfig.title.slice(0, -1) || activeConfig.title}
                            </button>
                        )}
                    </div>
                </header>

                <section className="stat-strip">
                    {Object.entries(SECTION_CONFIG).map(([key, cfg]) => (
                        <div key={key} className={`stat-card ${key === activeSection ? 'focused' : ''}`}>
                            <span>{cfg.title}</span>
                            <strong>{data[key]?.length || 0}</strong>
                        </div>
                    ))}
                </section>

                {error && <div className="global-error">{error}</div>}

                <section className="table-card">
                    {loading ? (
                        <div className="empty-state">Loading admin data...</div>
                    ) : activeRows.length === 0 ? (
                        <div className="empty-state">{activeConfig.empty}</div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        {activeConfig.columns.map((column) => (
                                            <th key={column}>{column}</th>
                                        ))}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeRows.map((item) => {
                                        const normalized = normalizeItem(activeSection, item);
                                        return (
                                            <tr key={item._id}>
                                                {activeConfig.columns.map((column) => {
                                                    const value =
                                                        column === 'author'
                                                            ? normalized.authorName || normalized.author
                                                            : normalized[column];
                                                    const printable =
                                                        typeof value === 'object' && value !== null
                                                            ? JSON.stringify(value)
                                                            : String(value ?? '');
                                                    if (column.toLowerCase().includes('image') || column === 'thumbnail') {
                                                        return (
                                                            <td key={column}>
                                                                {value ? (
                                                                    <a href={toDisplayUrl(value)} target="_blank" rel="noreferrer">
                                                                        preview
                                                                    </a>
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </td>
                                                        );
                                                    }
                                                    return <td key={column}>{printable}</td>;
                                                })}
                                                <td>
                                                    <div className="row-actions">
                                                        {activeSection !== 'requests' && (
                                                            <button className="icon-button" onClick={() => openEditModal(item)}>
                                                                <Edit size={15} />
                                                            </button>
                                                        )}
                                                        <button className="icon-button danger" onClick={() => deleteItem(item._id)}>
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {modalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <h3>{editingItem ? 'Edit Item' : `Add ${activeConfig.title}`}</h3>
                        <form onSubmit={submitModal} className="modal-form">
                            <FormFields
                                section={activeSection}
                                form={form}
                                authors={data.authors || []}
                                isEditing={Boolean(editingItem?._id)}
                                onChange={updateForm}
                            />
                            <div className="modal-actions">
                                <button type="button" className="outline-button" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-button" disabled={saving}>
                                    {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const FormFields = ({ section, form, onChange, authors, isEditing }) => {
    const onFile = (name) => (event) => onChange(name, event.target.files?.[0] || null);
    const pick = (...keys) => keys.map((key) => (
        <label key={key}>
            <span>{key}</span>
            <input value={form[key] || ''} onChange={(e) => onChange(key, e.target.value)} required />
        </label>
    ));

    if (section === 'authors') {
        return <>{pick('name', 'bio')}</>;
    }
    if (section === 'quotes') {
        return <>{pick('text', 'author')}</>;
    }
    if (section === 'settings') {
        return <>{pick('key', 'value')}</>;
    }
    if (section === 'requests') {
        return (
            <label>
                <span>status</span>
                <select value={form.status || ''} onChange={(e) => onChange('status', e.target.value)} required>
                    <option value="">Select status</option>
                    {SECTION_OPTIONS.requests.status.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </label>
        );
    }
    if (section === 'gallery') {
        return (
            <>
                {pick('caption')}
                <label>
                    <span>category</span>
                    <select value={form.category || ''} onChange={(e) => onChange('category', e.target.value)} required>
                        <option value="">Select category</option>
                        {SECTION_OPTIONS.gallery.category.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>image</span>
                    <input type="file" accept="image/*" onChange={onFile('image')} required={!isEditing} />
                </label>
            </>
        );
    }
    if (section === 'timeline') {
        return (
            <>
                {pick('year', 'title', 'description', 'sortOrder')}
                <label>
                    <span>image</span>
                    <input type="file" accept="image/*" onChange={onFile('image')} required={!isEditing} />
                </label>
            </>
        );
    }
    if (section === 'auliyas') {
        return (
            <>
                {pick('name', 'title', 'description', 'address')}
                <label>
                    <span>lat</span>
                    <input type="number" step="any" value={form.lat || ''} onChange={(e) => onChange('lat', e.target.value)} required />
                </label>
                <label>
                    <span>lng</span>
                    <input type="number" step="any" value={form.lng || ''} onChange={(e) => onChange('lng', e.target.value)} required />
                </label>
                <label>
                    <span>image</span>
                    <input type="file" accept="image/*" onChange={onFile('image')} required={!isEditing} />
                </label>
            </>
        );
    }
    if (section === 'videos') {
        return (
            <>
                {pick('title', 'description', 'url')}
                <label>
                    <span>category</span>
                    <select value={form.category || ''} onChange={(e) => onChange('category', e.target.value)} required>
                        <option value="">Select category</option>
                        {SECTION_OPTIONS.videos.category.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>video file (optional)</span>
                    <input type="file" accept="video/*" onChange={onFile('video')} />
                </label>
                <label>
                    <span>thumbnail (optional)</span>
                    <input type="file" accept="image/*" onChange={onFile('thumbnail')} />
                </label>
            </>
        );
    }
    if (section === 'books') {
        return (
            <>
                <label>
                    <span>title</span>
                    <input value={form.title || ''} onChange={(e) => onChange('title', e.target.value)} required />
                </label>
                <label>
                    <span>author</span>
                    <select value={form.author || ''} onChange={(e) => onChange('author', e.target.value)} required>
                        <option value="">Select author</option>
                        {authors.map((author) => (
                            <option key={author._id} value={author._id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                </label>
                {pick('description')}
                <label>
                    <span>category</span>
                    <select value={form.category || ''} onChange={(e) => onChange('category', e.target.value)} required>
                        <option value="">Select category</option>
                        {SECTION_OPTIONS.books.category.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>book pdf</span>
                    <input type="file" accept="application/pdf" onChange={onFile('pdf')} required={!isEditing} />
                </label>
                <label>
                    <span>cover image</span>
                    <input type="file" accept="image/*" onChange={onFile('coverImage')} required={!isEditing} />
                </label>
            </>
        );
    }
    return null;
};

export default App;
