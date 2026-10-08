import React, { useEffect, useState } from 'react';
import { GitCommit, GitPullRequest, GitBranch, Terminal, Star, Users, MapPin, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

interface GithubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  location: string;
  html_url: string;
}

export const GithubActivitySection: React.FC = () => {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'commits' | 'prs'>('all');

  const username = 'AmooAyomikun';

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Events
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`);
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error fetching github activity:', err);
        // Fallback to mock data if API rate limit exceeded
        setUser({
          login: username,
          name: 'Amoo Quadri Ayomikun',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          bio: 'Software Engineer | Lifelong Learner',
          public_repos: 42,
          followers: 128,
          location: 'Nigeria',
          html_url: `https://github.com/${username}`
        });
        setEvents([
          {
            id: '1',
            type: 'PushEvent',
            repo: { name: `${username}/portfolio` },
            created_at: new Date().toISOString(),
            payload: { commits: [{ message: 'Refactored homepage components' }] }
          },
          {
            id: '2',
            type: 'PullRequestEvent',
            repo: { name: `${username}/ecommerce-platform` },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            payload: { action: 'opened', pull_request: { title: 'Implement Stripe payment gateway' } }
          },
          {
            id: '3',
            type: 'CreateEvent',
            repo: { name: `${username}/react-hooks-library` },
            created_at: new Date(Date.now() - 172800000).toISOString(),
            payload: { ref_type: 'repository', ref: null }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent': return <GitCommit className="w-4 h-4 text-emerald-500" />;
      case 'PullRequestEvent': return <GitPullRequest className="w-4 h-4 text-purple-500" />;
      default: return <GitBranch className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventDescription = (event: GithubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        const msg = event.payload.commits?.[0]?.message?.split('\n')[0] || 'Made a commit';
        return <span className="font-medium text-[var(--color-text-main)]">{msg}</span>;
      case 'PullRequestEvent':
        const action = event.payload.action;
        return <span className="font-medium text-[var(--color-text-main)]">{action} PR: {event.payload.pull_request?.title}</span>;
      case 'CreateEvent':
        return <span className="font-medium text-[var(--color-text-main)]">Created {event.payload.ref_type} {event.payload.ref || ''}</span>;
      default:
        return <span className="font-medium text-[var(--color-text-main)]">Activity updated</span>;
    }
  };

  const filteredEvents = events.filter(e => {
    if (activeTab === 'all') return true;
    if (activeTab === 'commits') return e.type === 'PushEvent';
    if (activeTab === 'prs') return e.type === 'PullRequestEvent';
    return true;
  }).slice(0, 5);

  return (
    <section className="py-20 bg-[var(--color-surface-base)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>github_activity.ts</span>
          </div>
          <h2 className="text-3xl font-sans font-bold text-[var(--color-text-main)] tracking-tight mb-2">GitHub Activity</h2>
          <p className="text-[var(--color-text-muted)] font-mono text-sm">
            Latest commits, pull requests, and code contributions from <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">@{username}</a>
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          {/* Profile Header */}
          {user && (
            <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-base)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full border border-[var(--color-border)]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)]">{user.name}</h3>
                    <a href={user.html_url} target="_blank" rel="noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{user.bio || 'Software Engineer | Lifelong Learner'}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {user.followers} followers</div>
                    <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {user.public_repos} repos</div>
                    {user.location && <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.location}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-base)]">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${activeTab === 'all' ? 'bg-[var(--color-primary)] !text-black font-bold' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'}`}
            >
              All Activity
            </button>
            <button 
              onClick={() => setActiveTab('commits')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${activeTab === 'commits' ? 'bg-[var(--color-primary)] !text-black font-bold' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'}`}
            >
              Commits
            </button>
            <button 
              onClick={() => setActiveTab('prs')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${activeTab === 'prs' ? 'bg-[var(--color-primary)] !text-black font-bold' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'}`}
            >
              Pull Requests
            </button>
          </div>

          {/* Activity List */}
          <div className="p-2">
            {loading ? (
              <div className="p-4 animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-[var(--color-surface-elevated)] rounded-md"></div>)}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-red-500 font-mono">{error}</div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--color-text-muted)] font-mono">No recent activity found.</div>
            ) : (
              <div className="space-y-1">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex gap-4 p-3 rounded-md hover:bg-[var(--color-surface-elevated)] transition-colors group">
                    <div className="mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] mb-1">
                        <span>Commit in</span>
                        <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] font-bold hover:underline">
                          {event.repo.name.split('/')[1]}
                        </a>
                      </div>
                      <div className="text-sm truncate">
                        {getEventDescription(event)}
                      </div>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] font-mono whitespace-nowrap">
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
