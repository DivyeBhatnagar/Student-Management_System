import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const classesData = [
  { id: 1, name: 'Class A', students: 30, attendance: '95%' },
  { id: 2, name: 'Class B', students: 25, attendance: '92%' },
  { id: 3, name: 'Class C', students: 35, attendance: '98%' },
];

const notificationsData = [
  { id: 1, message: 'Exam dates for Semester 1 announced.' },
  { id: 2, message: 'Staff meeting at 2 PM today.' },
  { id: 3, message: 'Submit student performance reports by Friday.' },
];

const FacultyDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Class</th>
                <th className="pb-2">Students</th>
                <th className="pb-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {classesData.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.students}</td>
                  <td className="py-2">{c.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Marks Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-muted-foreground">Class</label>
              <select id="class" className="mt-1 block w-full px-3 py-2 bg-accent border border rounded-xl shadow-soft-inset focus:outline-none focus:ring-primary focus:border-primary">
                <option>Class A</option>
                <option>Class B</option>
                <option>Class C</option>
              </select>
            </div>
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-muted-foreground">Student</label>
              <select id="student" className="mt-1 block w-full px-3 py-2 bg-accent border border rounded-xl shadow-soft-inset focus:outline-none focus:ring-primary focus:border-primary">
                <option>Student 1</option>
                <option>Student 2</option>
                <option>Student 3</option>
              </select>
            </div>
            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-muted-foreground">Marks</label>
              <input type="text" id="marks" className="mt-1 block w-full px-3 py-2 bg-accent border border rounded-xl shadow-soft-inset focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" className="w-full px-4 py-2 text-lg font-semibold text-primary-foreground bg-primary rounded-xl shadow-soft hover:bg-primary/90 transition-all duration-300">Submit</button>
          </form>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-3">
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

export default FacultyDashboard;
