import React, { useState, useEffect } from 'react';
import { Search, Book, Edit2, IndianRupee, Clock, Users, Save, X, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { courseAPI } from '../api';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const addFormRef = React.useRef(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        courseCode: '',
        description: '',
        totalFee: '',
        durationValue: '',
        durationUnit: 'months'
    });
    const [addForm, setAddForm] = useState({
        name: '',
        courseCode: '',
        description: '',
        totalFee: '',
        durationValue: '',
        durationUnit: 'months'
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getAll();
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course);
        setEditForm({
            name: course.name || '',
            courseCode: course.courseCode || '',
            description: course.description || '',
            totalFee: course.fees?.total || '',
            durationValue: course.duration?.value || '',
            durationUnit: course.duration?.unit || 'months'
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await courseAPI.update(selectedCourse._id, {
                name: editForm.name,
                courseCode: editForm.courseCode,
                description: editForm.description,
                totalFee: editForm.totalFee,
                duration: {
                    value: parseInt(editForm.durationValue),
                    unit: editForm.durationUnit
                }
            });
            fetchCourses();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Error updating course:", err);
            const msg = err.response?.data?.message || "Failed to update course";
            alert(msg);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await courseAPI.create({
                name: addForm.name,
                courseCode: addForm.courseCode,
                description: addForm.description,
                fees: { total: parseFloat(addForm.totalFee) },
                duration: {
                    value: parseInt(addForm.durationValue),
                    unit: addForm.durationUnit
                }
            });
            fetchCourses();
            setShowAddForm(false);
            setAddForm({
                name: '',
                courseCode: '',
                description: '',
                totalFee: '',
                durationValue: '',
                durationUnit: 'months'
            });
        } catch (err) {
            console.error("Error adding course:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to add course";
            alert(`Failed to add course: ${errorMessage}`);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tight">Course Management</h1>
                    <p className="text-[var(--text-muted)] font-medium max-w-2xl mx-auto">Manage course details, descriptions, and fee structures with ease.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-emerald-500/30 transition-all w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            if (!showAddForm) {
                                setTimeout(() => addFormRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                        }}
                        className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto ${showAddForm ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-emerald-400'}`}
                    >
                        {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {showAddForm ? 'Cancel Adding' : 'Add New Course'}
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <div key={course._id} className="glass-card group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                    <Book className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={() => handleEditClick(course)}
                                    className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all border border-[var(--border)]"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">{course.name}</h3>
                                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{course.courseCode}</p>
                            </div>

                            <p className="text-[var(--text-muted)] text-sm line-clamp-3 h-[60px]">
                                {course.description || "No description available."}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-1">Total Fee</p>
                                    <p className="text-emerald-500 font-bold flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3" />
                                        {course.fees?.total?.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-1">Duration</p>
                                    <p className="text-[var(--text-main)] font-bold flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                                        {course.duration?.value || 0} {course.duration?.unit || 'months'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${selectedCourse?.name}`} position="center" maxWidth="max-w-3xl">
                <form onSubmit={handleUpdate} className="space-y-6 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Code</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editForm.courseCode}
                                    onChange={(e) => setEditForm({ ...editForm, courseCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Total Fee (₹)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={editForm.totalFee}
                                    onChange={(e) => setEditForm({ ...editForm, totalFee: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-3 p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    Specify Course Duration
                                </label>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            className="w-full bg-[var(--bg-main)] border-2 border-[var(--border)] rounded-3xl px-8 py-6 text-4xl font-black text-emerald-500 focus:border-emerald-500/50 transition-all outline-none"
                                            value={editForm.durationValue}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '0') return; // Block solo '0'
                                                setEditForm({ ...editForm, durationValue: val });
                                            }}
                                            required
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xl uppercase tracking-widest pointer-events-none">
                                            {editForm.durationUnit}
                                        </div>
                                    </div>

                                    <div className="flex p-1.5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] gap-1.5">
                                        {['months', 'weeks', 'days'].map((unit) => (
                                            <button
                                                key={unit}
                                                type="button"
                                                onClick={() => setEditForm({ ...editForm, durationUnit: unit })}
                                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${editForm.durationUnit === unit
                                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
                                                    }`}
                                            >
                                                {unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Description & Overview</label>
                            <textarea
                                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-6 text-sm text-[var(--text-main)] focus:outline-none focus:border-emerald-500/50 flex-grow min-h-[300px] leading-relaxed"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Enter comprehensive course details, objectives, and curriculum overview..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Inline Add Course Section */}
            {showAddForm && (
                <div ref={addFormRef} className="mt-20 fade-in pt-10 border-t border-[var(--border)]">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                            <div>
                                <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Create New Course</h2>
                                <p className="text-[var(--text-muted)] text-sm font-medium">Add a new curriculum entry to the database</p>
                            </div>
                        </div>

                        <div className="glass-card p-10">
                            <form onSubmit={handleAddCourse} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Name</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={addForm.name}
                                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                                placeholder="e.g., Fullstack AI & ML"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Code</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={addForm.courseCode}
                                                onChange={(e) => setAddForm({ ...addForm, courseCode: e.target.value })}
                                                placeholder="e.g., FSD-101"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Total Fee (₹)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={addForm.totalFee}
                                                onChange={(e) => setAddForm({ ...addForm, totalFee: e.target.value })}
                                                placeholder="e.g., 50000"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3 p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-emerald-500" />
                                                Specify Course Duration
                                            </label>
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        className="w-full bg-[var(--bg-main)] border-2 border-[var(--border)] rounded-3xl px-8 py-6 text-4xl font-black text-emerald-500 focus:border-emerald-500/50 transition-all outline-none"
                                                        value={addForm.durationValue}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '0') return; // Block solo '0'
                                                            setAddForm({ ...addForm, durationValue: val });
                                                        }}
                                                        placeholder="6"
                                                        required
                                                    />
                                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xl uppercase tracking-widest pointer-events-none">
                                                        {addForm.durationUnit}
                                                    </div>
                                                </div>

                                                <div className="flex p-1.5 bg-[var(--bg-main)] rounded-2xl border border-[var(--border)] gap-1.5">
                                                    {['months', 'weeks', 'days'].map((unit) => (
                                                        <button
                                                            key={unit}
                                                            type="button"
                                                            onClick={() => setAddForm({ ...addForm, durationUnit: unit })}
                                                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${addForm.durationUnit === unit
                                                                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'
                                                                }`}
                                                        >
                                                            {unit}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1">Course Description & Overview</label>
                                        <textarea
                                            className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-6 text-sm text-[var(--text-main)] focus:outline-none focus:border-emerald-500/50 flex-grow min-h-[300px] leading-relaxed"
                                            value={addForm.description}
                                            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                            placeholder="Enter comprehensive course details, objectives, and curriculum overview..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 gap-4 border-t border-[var(--border)]">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="btn-secondary"
                                    >
                                        Discard
                                    </button>
                                    <button type="submit" className="btn-primary px-10">
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Course to Database
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
