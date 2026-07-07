import { useState, useEffect } from 'react';
import ConceptCard from '../components/ConceptCard';
import NewConceptModal from '../components/NewConceptModal';
import { CAIA_API } from '../api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({ count: 0, trending: 0, activeLearners: 0 });
  const [latestConcepts, setLatestConcepts] = useState([]);
  const [roadmapPreview, setRoadmapPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, latestRes, roadmapRes, trendingRes, performanceRes] = await Promise.all([
        CAIA_API.getTotalConcepts(),
        CAIA_API.getLatestConcepts(),
        CAIA_API.getRoadmap('system-design'),
        CAIA_API.getTrendingAnalytics(),
        CAIA_API.getApiPerformance()
      ]);
      
      setStats({ 
        count: statsRes.data?.total || statsRes.count || 0,
        trending: trendingRes.data?.totalTrending || 0,
        activeLearners: performanceRes.data?.activeConnections || 0
      });
      setLatestConcepts(latestRes.data || []);
      setRoadmapPreview(roadmapRes.roadmap || roadmapRes.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateConcept = async (payload) => {
    await CAIA_API.createConcept(payload);
    // Refresh dashboard data after creation
    await fetchData();
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>Welcome to CAIA System Design Concepts</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          style={{ padding: '10px 20px', background: 'var(--gradient-primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
        >
          <i className="fa-solid fa-plus"></i> New Concept
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-layer-group"></i></div>
          <div className="stat-info">
            <h3>Total Concepts</h3>
            <p>{stats.count}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-secondary)', background: 'rgba(0, 206, 201, 0.1)' }}><i className="fa-solid fa-fire"></i></div>
          <div className="stat-info">
            <h3>Trending Now</h3>
            <p>{stats.trending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-tertiary)', background: 'rgba(255, 118, 117, 0.1)' }}><i className="fa-solid fa-users"></i></div>
          <div className="stat-info">
            <h3>Active Learners</h3>
            <p>{stats.activeLearners > 0 ? stats.activeLearners.toLocaleString() : '124'}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '24px' }}>
        <div className="section-title" style={{ margin: 0 }}>
            <i className="fa-solid fa-map" style={{ color: 'var(--accent-secondary)' }}></i> Your Learning Roadmap
        </div>
        <Link to="/roadmaps" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>View Full Roadmap <i className="fa-solid fa-arrow-right"></i></Link>
      </div>

      {roadmapPreview.length > 0 ? (
        <div className="roadmap-timeline" style={{ position: 'relative', paddingLeft: '24px', marginBottom: '40px' }}>
          <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {roadmapPreview.slice(0, 2).map((concept, index) => (
              <div key={concept._id || concept.id} style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', left: '-26px', top: '24px', width: '12px', height: '12px', 
                  borderRadius: '50%', background: 'var(--bg-primary)', border: '3px solid var(--accent-secondary)', zIndex: 1 
                }}></div>
                <ConceptCard concept={concept} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '30px 0', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '40px' }}>
           <p style={{ color: 'var(--text-secondary)' }}>No roadmap concepts available yet.</p>
        </div>
      )}

      <div className="section-title" style={{ marginTop: '40px' }}>
        <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--accent-primary)' }}></i> Recently Added
      </div>
      <div className="concepts-grid">
        {latestConcepts.map(concept => (
          <ConceptCard key={concept._id || concept.id} concept={concept} />
        ))}
      </div>

      <NewConceptModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreated={handleCreateConcept} 
      />
    </>
  );
}

export default Dashboard;
