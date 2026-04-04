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
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-3xl italic text-charcoal">dashboard</h2>
        <p className="font-body text-xs text-warm-gray">live data from my life</p>
      </div>

      {/* Sub-chips */}
      <div className="flex gap-2 mb-5">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-body tracking-wide
                       transition-all duration-200 cursor-pointer
                       ${activeTab === tab.id
                         ? 'bg-charcoal text-cream'
                         : 'bg-cream-dark text-warm-gray hover:bg-charcoal/10'
                       }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-cream-dark rounded-2xl p-5 flex-1 overflow-auto">
        {activeTab === 'github' && <GitHubHeatmap />}
        {activeTab === 'strava' && <StravaHeatmap />}
        {activeTab === 'spotify' && <SpotifyNow />}
      </div>
    </div>
  )
}

export default Dashboard
