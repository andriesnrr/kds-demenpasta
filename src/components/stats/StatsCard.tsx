import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{subtitle}</div>
    </div>
  );
}