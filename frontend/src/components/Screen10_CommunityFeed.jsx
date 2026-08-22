import React, { useState } from 'react';
import {
  Heart, MessageSquare, Share2, ArrowRight, Search, SlidersHorizontal, MapPin, Calendar, Compass, Sparkles, User, Tag
} from 'lucide-react';
import { Button } from './ui/Button';

const MOCK_POSTS = [
  {
    id: 'post-1',
    author: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timeAgo: '2d ago',
    title: '5 Days of Magical Cherry Blossoms in Kyoto & Gion',
    city: 'Kyoto, Japan',
    days: 5,
    budgetTier: '₹45,000',
    excerpt: 'Exploring ancient wooden temples, peaceful bamboo groves, and traditional tea houses during peak cherry blossom season in Kansai.',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    comments: 8,
    isLiked: false
  },
  {
    id: 'post-2',
    author: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    timeAgo: '4d ago',
    title: 'Offbeat North Goa: Hidden Beaches, Spice Plantations & Forts',
    city: 'Goa, India',
    days: 4,
    budgetTier: '₹22,000',
    excerpt: 'Ditching the crowded party strips for quiet beaches, historic Portuguese churches, and authentic Goan seafood thali spots.',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    likes: 28,
    comments: 5,
    isLiked: true
  },
  {
    id: 'post-3',
    author: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    timeAgo: '1w ago',
    title: 'Himalayan Pass Trek in Solang & Atal Tunnel Expedition',
    city: 'Manali, India',
    days: 6,
    budgetTier: '₹32,000',
    excerpt: 'High-altitude paragliding, river rafting, and scenic snow mountain drives through Himachal Pradesh.',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    likes: 64,
    comments: 12,
    isLiked: false
  }
];

export const Screen10_CommunityFeed = ({
  onViewCommunityTrip
}) => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const handleToggleLike = (postId) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = selectedTag === 'All' || p.city.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-surface-canvas pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Page Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
            Screen 10 · Community Feed
          </span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
            Community Itineraries & Stories
          </h1>
          <p className="text-sm text-slate-600 font-sans mt-1">
            Browse authentic travel write-ups, itineraries, and recommendations shared by fellow GlobeTrotter explorers.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-accent-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community posts by title, city, or author..."
              className="w-full bg-slate-50 text-ink-900 text-sm pl-10 pr-4 py-2 rounded-md border border-slate-200 outline-none hover:border-slate-300 focus:border-accent-400 focus:bg-white font-sans transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Kyoto', 'Goa', 'Manali'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                  selectedTag === tag
                    ? 'bg-accent-400 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-accent-50 hover:text-accent-800 border border-slate-200 hover:border-accent-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FEED COLUMN (75% width) */}
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-accent-300 hover:-translate-y-1 transition-all duration-300 space-y-4 group cursor-pointer"
              >
                {/* Author Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-accent-400/30 transition-all">
                      <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-ink-900 leading-snug group-hover:text-accent-600 transition-colors">
                        {post.author}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-accent-700 bg-accent-50 px-2.5 py-1 rounded border border-accent-200 group-hover:border-accent-300 transition-colors">
                    📍 {post.city}
                  </span>
                </div>

                {/* Post Title in Lora font */}
                <h3 className="font-display font-semibold text-xl text-ink-900 group-hover:text-accent-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-slate-500 font-sans">
                  <span>📅 {post.days}-Day Itinerary</span>
                  <span>·</span>
                  <span className="font-bold text-slate-700">Est. {post.budgetTier}</span>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Footer Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleLike(post.id); }}
                      className={`flex items-center gap-1.5 cursor-pointer transition-all transform hover:scale-110 active:scale-95 ${
                        post.isLiked ? 'text-semantic-danger font-bold' : 'hover:text-semantic-danger'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-semantic-danger text-semantic-danger' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{post.comments}</span>
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); alert("Post link copied!"); }}
                      className="flex items-center gap-1 hover:text-accent-600 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => onViewCommunityTrip && onViewCommunityTrip(post)}
                    className="cursor-pointer"
                  >
                    View Trip →
                  </Button>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: About Community Panel */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-accent-400" /> About Community
                </h3>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Search, filter, or sort to find authentic trip write-ups that match what you're currently planning.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Trending Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['#KyotoBlossom', '#GoaRetreat', '#ManaliTreks', '#BackpackingAsia', '#SoloTravel'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 hover:text-accent-900 hover:border-accent-300 hover:scale-105 transition-all cursor-pointer px-2.5 py-1 rounded-full border border-accent-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
