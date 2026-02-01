import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Heart, MessageCircle, Share, Image as ImageIcon, Send } from 'lucide-react';
import Modal from '../components/Modal';
import { postAPI } from '../api';

const SharePlatform = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', details: '' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postAPI.getAll();
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await postAPI.create({
                ...newPost,
                date: 'Just now',
                likes: 0,
                comments: 0
            });
            fetchPosts();
            setIsCreateModalOpen(false);
            setNewPost({ title: '', details: '' });
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    const handleShare = (post) => {
        alert(`Sharing: ${post.title}`);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Share Platform</h1>
                    <p className="text-[var(--text-muted)] mt-1">Share updates and resources with your student community.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Post
                </button>
            </div>

            {/* Create Post Input Trigger */}
            <div
                className="bg-[var(--bg-card)] p-6 rounded-[2rem] shadow-sm border border-[var(--border)] flex items-center gap-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCreateModalOpen(true)}
            >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                    <ImageIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-[var(--text-muted)] font-medium">
                    What's on your mind? Share an update...
                </div>
                <div className="btn-secondary rounded-full p-2 border border-[var(--border)]">
                    <Send className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors" />
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-8">
                {posts.map((post) => (
                    <div key={post._id} className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-sm border border-[var(--border)] p-8 scale-in hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
                                    {post.title?.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-main)] text-lg">{post.title}</h3>
                                    <p className="text-xs text-[var(--text-muted)] font-medium flex items-center uppercase tracking-widest leading-none mt-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 opacity-50"></span>
                                        {post.date || 'Recently'}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl transition-all">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-[var(--text-muted)] text-base leading-relaxed mb-6 whitespace-pre-line px-1">{post.details}</p>

                        {post.image && (
                            <div className="aspect-video bg-[var(--bg-surface)] rounded-[2rem] border border-[var(--border)] overflow-hidden mb-6 flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-[var(--text-muted)]/20" />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 rounded-2xl transition-all group">
                                    <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                                    <span className="text-sm font-bold">{post.likes || 0}</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 hover:bg-sky-500/10 text-[var(--text-muted)] hover:text-sky-500 rounded-2xl transition-all">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm font-bold">{post.comments || 0}</span>
                                </button>
                            </div>
                            <button
                                onClick={() => handleShare(post)}
                                className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-2xl font-bold text-sm transition-all shadow-sm"
                            >
                                <Share className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Post">
                <form onSubmit={handleCreatePost} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Title</label>
                        <input
                            className="input-field"
                            placeholder="Post Title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Details</label>
                        <textarea
                            rows={4}
                            className="input-field resize-none py-4"
                            placeholder="Share something with the community..."
                            value={newPost.details}
                            onChange={(e) => setNewPost({ ...newPost, details: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <button type="button" className="p-3 bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)] rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] rounded-2xl transition-all">Cancel</button>
                            <button type="submit" className="btn-primary px-8">Post Now</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SharePlatform;
