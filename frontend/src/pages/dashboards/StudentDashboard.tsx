import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const examResultsData = [
  { name: 'Sem 1', marks: 75 },
  { name: 'Sem 2', marks: 82 },
  { name: 'Sem 3', marks: 78 },
  { name: 'Sem 4', marks: 85 },
];

const notificationsData = [
    { id: 1, message: 'Your fee payment is due next week.' },
    { id: 2, message: 'Mid-term exams start on the 15th.' },
    { id: 3, message: 'Library books are due for return.' },
];

const StudentDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-soft mb-4">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <p className="text-xl font-semibold">John Doe</p>
          <p className="text-muted-foreground">Student ID: 12345</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fee Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$500</p>
          <p className="text-muted-foreground">Amount Due</p>
          <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-lg font-semibold text-primary-foreground bg-primary rounded-xl shadow-soft hover:bg-primary/90 transition-all duration-300">
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hostel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><span className="font-semibold">Room:</span> 101</p>
          <p><span className="font-semibold">Roommate:</span> Jane Smith</p>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examResultsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="marks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {notificationsData.map((n) => (
              <li key={n.id} className="p-2 rounded-lg bg-accent">{n.message}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
