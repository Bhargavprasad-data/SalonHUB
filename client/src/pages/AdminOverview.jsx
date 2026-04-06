import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, HardHat, ShoppingCart, Headset } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const AdminOverview = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      const fetchUsers = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(res.data);
        } catch (err) {
          setError('Failed to fetch analytics data');
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [token, user]);

  if (loadingUsers) return <div className="admin-loading">Loading Dashboard Data...</div>;
  if (error) return <div className="text-danger p-2">{error}</div>;

  const buyCount = users.filter(u => u.role === 'Buy').length;
  const sellCount = users.filter(u => u.role === 'Sell').length;
  const helpCount = users.filter(u => u.role === 'Help').length;
  const hateresCount = users.filter(u => u.role === 'Hateres').length;

  const roleDistributionData = [
    { name: 'Buy', value: buyCount },
    { name: 'Sell', value: sellCount },
    { name: 'Help', value: helpCount },
    { name: 'Hateres', value: hateresCount },
  ];
  
  const COLORS = ['#FF8A00', '#00C49F', '#FFBB28', '#FF8042'];

  // Process data for growth chart (Registrations over time by month)
  const growthDataMap = {};
  users.forEach(u => {
    if(u.createdAt) {
      const monthYear = format(parseISO(u.createdAt), 'MMM yyyy');
      growthDataMap[monthYear] = (growthDataMap[monthYear] || 0) + 1;
    }
  });
  
  const growthChartData = Object.keys(growthDataMap).map(key => ({
    name: key,
    users: growthDataMap[key]
  }));

  const statCards = [
    { title: 'Total Users', count: users.length, icon: <Users size={28} color="#FF8A00"/> },
    { title: 'Sell Users', count: sellCount, icon: <HardHat size={28} color="#00C49F"/> },
    { title: 'Buy Users', count: buyCount, icon: <ShoppingCart size={28} color="#FFBB28"/> },
    { title: 'Help Users', count: helpCount, icon: <Headset size={28} color="#FF8042"/> },
    { title: 'Hateres Users', count: hateresCount, icon: <Users size={28} color="#8884d8"/> },
  ];

  return (
    <div className="admin-overview">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Monitor metrics and platform growth</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-details">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>User Role Distribution</h3>
          <div className="chart-wrapper">
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Registration Growth</h3>
          <div className="chart-wrapper">
             <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#FF8A00" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
