import React from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  BarChart3,
  Award,
  CalendarCheck,
  Building,
  CheckCircle2,
  PieChart as PieIcon,
  Percent,
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
import { Card } from '../components/common/Card';
import { StatsCard } from '../components/common/StatsCard';
import {
  selectStatusDistributionChartData,
  selectDailyTrendChartData,
  selectSubjectAttendanceChartData,
  selectDepartmentComparisonChartData,
  selectMonthlyAttendanceChartData,
  selectDashboardSummaryCards,
} from '../selectors/dashboardSelectors';

/**
 * Attendify - Deep-Dive Attendance Analytics & Trends Page
 */
export const AnalyticsPage = () => {
  const summary = useSelector(selectDashboardSummaryCards);
  const statusDistribution = useSelector(selectStatusDistributionChartData);
  const dailyTrend = useSelector(selectDailyTrendChartData);
  const subjectAttendance = useSelector(selectSubjectAttendanceChartData);
  const departmentComparison = useSelector(selectDepartmentComparisonChartData);
  const monthlyAttendance = useSelector(selectMonthlyAttendanceChartData);
  const theme = useSelector((state) => state.preferences?.theme || 'light');

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
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
          Attendance Analytics & Intelligence
        </h1>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            margin: '0.25rem 0 0 0',
          }}
        >
          Visual examination of institutional trends, attendance consistency, and departmental performance.
        </p>
      </div>

      {/* Analytics KPI Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatsCard
          title="Overall Attendance"
          value={summary.overallPercentageFormatted}
          subtext="Based on countable sessions"
          icon={Percent}
          variant="primary"
        />
        <StatsCard
          title="Daily Trend Momentum"
          value={`${dailyTrend.length} Days`}
          subtext="Continuously tracked"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Department Coverage"
          value={`${departmentComparison.length} Depts`}
          subtext="Active academic divisions"
          icon={Building}
          variant="default"
        />
        <StatsCard
          title="Monitored Courses"
          value={`${subjectAttendance.length} Courses`}
          subtext="Curriculum subjects"
          icon={Award}
          variant="default"
        />
      </div>

      {/* Row 1: Daily Trend & Status Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Daily Attendance Trend */}
        <Card title="Daily Attendance Progression" icon={TrendingUp}>
          <div style={{ width: '100%', height: '320px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsPresentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="analyticsAbsentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  name="Present Students"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#analyticsPresentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  name="Absent Students"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#analyticsAbsentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Donut */}
        <Card title="Attendance Status Ratio" icon={PieIcon}>
          <div style={{ width: '100%', height: '320px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Subject-wise & Department-wise Benchmarks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Subject-wise Bar Chart */}
        <Card title="Subject-wise Attendance Rate (%)" icon={BarChart3}>
          <div style={{ width: '100%', height: '320px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendance} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="code" stroke={textColor} fontSize={12} />
                <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Attendance Rate']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="percentage" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Comparison */}
        <Card title="Departmental Attendance Cross-Section" icon={Building}>
          <div style={{ width: '100%', height: '320px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="department" stroke={textColor} fontSize={11} interval={0} />
                <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Average Rate']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="percentage" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Monthly Attendance Overview */}
      <Card title="Monthly Attendance Overview" icon={CalendarCheck}>
        <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAttendance} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} domain={[0, 100]} />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Monthly Rate']}
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-light)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
              />
              <Bar dataKey="percentage" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
