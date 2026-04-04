import { useState } from 'react'
import GitHubHeatmap from '../components/GitHubHeatmap'
import StravaHeatmap from '../components/StravaHeatmap'
import SpotifyNow from '../components/SpotifyNow'

const dashboardTabs = [
  { id: 'github', label: '🟩 github' },
  { id: 'strava', label: '🏃 strava' },
  { id: 'spotify', label: '🎵 spotify' },
] as const

type DashboardTab = (typeof dashboardTabs)[number]['id']

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('github')

  return (
    <section>
      <h2 className="font-display text-5xl italic text-charcoal mb-4">
        dashboard
      </h2>
      <p className="font-body text-warm-gray mb-8">
        a little window into my life, updated live.
      </p>

      {/* Dashboard sub-chips */}
      <div className="flex gap-2 mb-8">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-body tracking-wide
              transition-all duration-300 cursor-pointer
              ${activeTab === tab.id
                ? 'bg-charcoal text-cream shadow-md'
                : 'bg-cream-dark text-warm-gray hover:bg-charcoal/10'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard content */}
      <div className="bg-cream-dark rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'github' && <GitHubHeatmap />}
        {activeTab === 'strava' && <StravaHeatmap />}
        {activeTab === 'spotify' && <SpotifyNow />}
      </div>
    </section>
  )
}

export default Dashboard
