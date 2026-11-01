import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Briefcase,
  Clock,
  Percent,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  CalendarCheck,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { StatsCard } from '../components/common/StatsCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  selectDashboardSummaryCards,
  selectStatusDistributionChartData,
  selectDailyTrendChartData,
  selectSubjectAttendanceChartData,
  selectDepartmentComparisonChartData,
  selectMonthlyAttendanceChartData,
  selectRecentAttendanceSessions,
} from '../selectors/dashboardSelectors';
import { selectStudentsBelowThreshold } from '../selectors/attendanceSelectors';

/**
 * Attendify - Executive Academic Attendance Dashboard
 */
export const DashboardPage = () => {
  const navigate = useNavigate();

  const summary = useSelector(selectDashboardSummaryCards);
  const statusDistribution = useSelector(selectStatusDistributionChartData);
  const dailyTrend = useSelector(selectDailyTrendChartData);
  const subjectAttendance = useSelector(selectSubjectAttendanceChartData);
  const departmentComparison = useSelector(selectDepartmentComparisonChartData);
  const monthlyAttendance = useSelector(selectMonthlyAttendanceChartData);
  const recentSessions = useSelector(selectRecentAttendanceSessions);
  const lowAttendanceStudents = useSelector(selectStudentsBelowThreshold);
  const theme = useSelector((state) => state.preferences?.theme || 'light');

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1E2D52' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Executive Dashboard
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0 0',
            }}
          >
            Real-time academic attendance overview, status distributions, and active alert monitoring.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            icon={CalendarCheck}
            onClick={() => navigate('/attendance')}
          >
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* 8 Live Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatsCard
          title="Total Enrolled"
          value={summary.totalEnrolled}
          icon={Users}
          variant="primary"
          subtitle="Registered Active Students"
          onClick={() => navigate('/students')}
        />
        <StatsCard
          title="Overall Attendance"
          value={summary.formattedPercentage}
          icon={Percent}
          variant={summary.overallPercentage && summary.overallPercentage < summary.threshold ? 'danger' : 'success'}
          subtitle={`Policy Threshold: ${summary.threshold}%`}
        />
        <StatsCard
          title="Total Present"
          value={summary.totalPresent}
          icon={CheckCircle2}
          variant="success"
          subtitle="Cumulative Present Logs"
        />
        <StatsCard
          title="Total Absent"
          value={summary.totalAbsent}
          icon={XCircle}
          variant="danger"
          subtitle="Unexcused Class Absences"
        />
        <StatsCard
          title="Internship Placed"
          value={summary.totalInternshipPlaced}
          icon={Award}
          variant="warning"
          subtitle="Approved PL (Excluded)"
        />
        <StatsCard
          title="Official Engagement"
          value={summary.totalOfficialEngagement}
          icon={Briefcase}
          variant="info"
          subtitle="Academic Leaves (Excluded)"
        />
        <StatsCard
          title="Late Arrivals"
          value={summary.totalLate}
          icon={Clock}
          variant="warning"
          subtitle="Counted in Present %"
        />
        <StatsCard
          title="Below Threshold"
          value={summary.lowAttendanceCount}
          icon={AlertTriangle}
          variant="danger"
          subtitle={`Students < ${summary.threshold}% Attendance`}
        />
      </div>

      {/* Row 1 Charts: Daily Trend (Area Chart) & Status Distribution (Donut Chart) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Daily Attendance Trend */}
        <Card
          title="Daily Attendance Trend"
          subtitle="Daily percentage fluctuations across academic sessions"
          icon={TrendingUp}
        >
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="formattedDate" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value) => [`${value}%`, 'Attendance Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Donut Chart */}
        <Card
          title="Status Distribution"
          subtitle="Ratio of Present, Absent, Placement, and Engagement records"
          icon={BarChart3}
        >
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span style={{ color: textColor, fontSize: '0.8rem' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2 Charts: Subject-wise Percentage & Department-wise Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Subject-wise Bar Chart */}
        <Card
          title="Subject-wise Attendance Rate"
          subtitle="Average attendance percentage per academic course"
          icon={CalendarCheck}
        >
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="subjectCode" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(val, name, props) => [
                    `${val}% (${props.payload.subjectName})`,
                    'Attendance Rate',
                  ]}
                />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department-wise Comparison */}
        <Card
          title="Department Attendance Comparison"
          subtitle="Comparative student attendance aggregated by academic department"
          icon={Building}
        >
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="department" stroke={textColor} fontSize={11} />
                <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(val, name, props) => [
                    `${val}% (${props.payload.studentCount} students)`,
                    'Attendance Rate',
                  ]}
                />
                <Bar dataKey="percentage" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Low Attendance Alerts & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Low Attendance Alerts Panel */}
        <Card
          title={`Low Attendance Alerts (< ${summary.threshold}%)`}
          subtitle="Students below academic policy attendance threshold"
          icon={AlertTriangle}
          action={
            <Button variant="outline" size="sm" onClick={() => navigate('/reports')}>
              View Full Report
            </Button>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            {lowAttendanceStudents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>
                Excellent! All enrolled students meet or exceed the {summary.threshold}% attendance threshold.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Student ID</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Department</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Sessions</th>
                    <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {lowAttendanceStudents.slice(0, 5).map((item) => (
                    <tr key={item.student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#EF4444' }}>
                        {item.student.id}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>
                        {item.student.name}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {item.student.department}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        {item.present}P / {item.absent}A
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', textAlign: 'right', fontWeight: 800, color: '#EF4444' }}>
                        {item.formattedPercentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Recent Attendance Sessions Activity */}
        <Card
          title="Recent Attendance Sessions"
          subtitle="Latest classroom attendance records taken"
          icon={CalendarCheck}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/attendance')}>
              Take Attendance
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentSessions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No attendance sessions recorded yet.
              </div>
            ) : (
              recentSessions.map((sess) => (
                <div
                  key={sess.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-hover)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {sess.subjectCode} - {sess.subjectName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {sess.formattedDate} • Sem {sess.semester} (Sec {sess.section})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: sess.percentage !== null && sess.percentage < summary.threshold ? '#EF4444' : '#10B981',
                      }}
                    >
                      {sess.formattedPercentage}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {sess.present} Present / {sess.absent} Absent
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
