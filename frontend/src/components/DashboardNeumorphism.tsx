import { NeuContainer, NeuPanel, NeuCard, NeuButton, NeuIconButton } from './ui/NeumorphismComponents';

function DashboardNeumorphism() {
  const stats = [
    { title: 'Total Students', value: '1,234', change: '+12%', icon: '👥' },
    { title: 'Active Courses', value: '45', change: '+5%', icon: '📚' },
    { title: 'Pending Fees', value: '₹2.4L', change: '-8%', icon: '💰' },
    { title: 'New Admissions', value: '89', change: '+23%', icon: '🎓' },
  ];

  const recentActivities = [
    'New student admission: John Doe',
    'Fee payment received from Jane Smith',
    'Grade updated for Math Course',
    'Hostel room allocated to Mike Johnson',
  ];

  return (
    <NeuContainer className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening in your institution.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <NeuCard key={index} className="text-center">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {stat.change}
              </span>
            </NeuCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities Panel */}
          <NeuPanel title="Recent Activities">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-neu-light rounded-neu-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-600 text-sm">{activity}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <NeuButton className="w-full">View All Activities</NeuButton>
            </div>
          </NeuPanel>

          {/* Quick Actions Panel */}
          <NeuPanel title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
              <NeuButton className="p-6 flex flex-col items-center space-y-2">
                <span className="text-2xl">➕</span>
                <span className="text-sm">Add Student</span>
              </NeuButton>
              <NeuButton className="p-6 flex flex-col items-center space-y-2">
                <span className="text-2xl">💰</span>
                <span className="text-sm">Process Fee</span>
              </NeuButton>
              <NeuButton className="p-6 flex flex-col items-center space-y-2">
                <span className="text-2xl">📝</span>
                <span className="text-sm">Create Report</span>
              </NeuButton>
              <NeuButton className="p-6 flex flex-col items-center space-y-2">
                <span className="text-2xl">🏠</span>
                <span className="text-sm">Hostel Mgmt</span>
              </NeuButton>
            </div>
          </NeuPanel>
        </div>

        {/* Chart/Analytics Section */}
        <div className="mt-8">
          <NeuPanel title="Student Enrollment Trends" className="h-64">
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>Chart component would go here</p>
                <p className="text-sm">(Integration with Chart.js or similar)</p>
              </div>
            </div>
          </NeuPanel>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
          <NeuIconButton>
            <span className="text-xl">💬</span>
          </NeuIconButton>
          <NeuIconButton>
            <span className="text-xl">🔔</span>
          </NeuIconButton>
        </div>
      </div>
    </NeuContainer>
  );
}

export default DashboardNeumorphism;
