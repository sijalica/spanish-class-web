import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import {
  findChannel,
  professorChannels,
  studentChannels,
  type ChannelGroup,
} from '@/nav/channels'
import '@/styles/discord.css'

export function DiscordLayout({ role }: { role: 'PROFESSOR' | 'STUDENT' }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const groups: ChannelGroup[] =
    role === 'PROFESSOR' ? professorChannels : studentChannels
  const active = findChannel(groups, location.pathname)
  const appName = import.meta.env.VITE_APP_NAME || 'Español Vivo'

  return (
    <div className="dc-root">
      <aside className="dc-rail" aria-hidden>
        <div className="dc-rail-pill" title={appName}>
          EV
        </div>
      </aside>

      <aside className="dc-sidebar">
        <header className="dc-server">
          <h1>{appName}</h1>
          <p>{role === 'PROFESSOR' ? 'Professor studio' : 'Student space'}</p>
        </header>

        <nav className="dc-channels" aria-label="Channels">
          {groups.map((group) => (
            <div key={group.title} className="dc-group">
              <p className="dc-group-title">{group.title}</p>
              <ul>
                {group.channels.map((ch) => (
                  <li key={ch.id}>
                    <NavLink
                      to={ch.path}
                      end={ch.path === '/professor' || ch.path === '/student'}
                      className={({ isActive }) =>
                        isActive ? 'dc-channel active' : 'dc-channel'
                      }
                    >
                      <span className="dc-hash">#</span>
                      {ch.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <footer className="dc-userbar">
          <div className="dc-avatar" aria-hidden>
            {(user?.fullName ?? '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="dc-user-meta">
            <strong>{user?.fullName}</strong>
            <span>{user?.email}</span>
          </div>
          <button
            type="button"
            className="dc-signout"
            onClick={() => void logout()}
            title="Sign out"
          >
            ⎋
          </button>
        </footer>
      </aside>

      <section className="dc-main">
        <header className="dc-top">
          <h2>
            <span className="dc-hash">#</span>
            {active?.label ?? 'channel'}
          </h2>
          <p>{active?.description}</p>
        </header>
        <div className="dc-content">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
