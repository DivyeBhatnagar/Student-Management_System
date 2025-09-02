import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const admissionsData = [
  { name: 'Jan', admissions: 400 },
  { name: 'Feb', admissions: 300 },
  { name: 'Mar', admissions: 600 },
  { name: 'Apr', admissions: 800 },
  { name: 'May', admissions: 500 },
  { name: 'Jun', admissions: 700 },
];

const feeData = [
  { name: 'Mon', collected: 4000, due: 2400 },
  { name: 'Tue', collected: 3000, due: 1398 },
  { name: 'Wed', collected: 2000, due: 9800 },
  { name: 'Thu', collected: 2780, due: 3908 },
  { name: 'Fri', collected: 1890, due: 4800 },
  { name: 'Sat', collected: 2390, due: 3800 },
];

const hostelData = [
  { name: 'Occupied', value: 450 },
  { name: 'Available', value: 50 },
];

const examData = [
    { name: 'Pass', value: 85 },
    { name: 'Fail', value: 15 },
];

const COLORS = ['#0088FE', '#FFBB28'];
const EXAM_COLORS = ['#00C49F', '#FF8042'];


const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Admissions Overview */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Admissions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-muted-foreground">Total Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold">56</p>
              <p className="text-muted-foreground">Pending Applications</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={admissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="admissions" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fee Management */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Fee Management</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-2xl font-bold">$1.2M</p>
                    <p className="text-muted-foreground">Collected</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">$150K</p>
                    <p className="text-muted-foreground">Due</p>
                </div>
            </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#82ca9d" />
              <Bar dataKey="due" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hostel Management */}
      <Card>
        <CardHeader>
          <CardTitle>Hostel Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={hostelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {hostelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Examination & Academics */}
      <Card>
        <CardHeader>
          <CardTitle>Examination & Academics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={examData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                {examData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXAM_COLORS[index % EXAM_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4">
                    <button className="flex items-center justify-center px-4 py-2 text-lg font-semibold text-primary-foreground bg-primary rounded-xl shadow-soft hover:bg-primary/90 transition-all duration-300">
                        <Download className="w-5 h-5 mr-2" />
                        Export Admissions (CSV)
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 text-lg font-semibold text-primary-foreground bg-primary rounded-xl shadow-soft hover:bg-primary/90 transition-all duration-300">
                        <Download className="w-5 h-5 mr-2" />
                        Export Fees (PDF)
                    </button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default AdminDashboard;
