// TrustBadge.jsx - UI/UX Pro Max Trust & Authority Component
import React from 'react';
import { Shield, CheckCircle, Lock, Award, Users, Clock } from 'lucide-react';

const TrustBadge = ({ 
  type = 'default',
  size = 'md',
  icon = null,
  title,
  description,
  className = ''
}) => {
  // Icon mapping
  const iconMap = {
    security: Shield,
    verified: CheckCircle,
    encrypted: Lock,
    award: Award,
    community: Users,
    fast: Clock,
    default: Shield
  };

  const IconComponent = icon ? iconMap[icon] || Shield : Shield;

  // Size classes
  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  // Type classes
  const typeClasses = {
    default: 'bg-white border border-neutral-200 text-neutral-800',
    primary: 'bg-primary-50 border border-primary-200 text-primary-800',
    success: 'bg-success-50 border border-success-200 text-success-800',
    premium: 'bg-gradient-to-r from-secondary-50 to-amber-50 border border-secondary-200 text-amber-800'
  };

  return (
    <div className={`
      rounded-xl shadow-sm transition-all duration-200 hover:shadow-md
      ${sizeClasses[size]}
      ${typeClasses[type]}
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        <div className={`
          flex-shrink-0 rounded-lg p-2
          ${type === 'primary' ? 'bg-primary-100 text-primary-600' : 
            type === 'success' ? 'bg-success-100 text-success-600' :
            type === 'premium' ? 'bg-secondary-100 text-secondary-600' :
            'bg-neutral-100 text-neutral-600'}
        `}>
          <IconComponent className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// TrustBadgeGrid component for displaying multiple badges
export const TrustBadgeGrid = ({ badges, columns = 3, className = '' }) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {badges.map((badge, index) => (
        <TrustBadge key={index} {...badge} />
      ))}
    </div>
  );
};

// Predefined trust badges for immigration platform
export const ImmigrationTrustBadges = () => {
  const badges = [
    {
      type: 'security',
      icon: 'encrypted',
      title: 'Bank-Level Security',
      description: 'Your data is encrypted end-to-end',
      size: 'md'
    },
    {
      type: 'verified',
      icon: 'verified',
      title: 'Registered Migration Agent',
      description: 'MARA registered professionals',
      size: 'md'
    },
    {
      type: 'success',
      icon: 'award',
      title: '98% Success Rate',
      description: 'High visa approval success',
      size: 'md'
    },
    {
      type: 'fast',
      icon: 'fast',
      title: 'Fast Processing',
      description: 'Average 2-4 week turnaround',
      size: 'md'
    },
    {
      type: 'community',
      icon: 'community',
      title: '1,000+ Success Stories',
      description: 'Join our community of successful applicants',
      size: 'md'
    },
    {
      type: 'premium',
      icon: 'award',
      title: 'Money-Back Guarantee',
      description: 'Full refund if not satisfied',
      size: 'md'
    }
  ];

  return <TrustBadgeGrid badges={badges} columns={3} />;
};

export default TrustBadge;