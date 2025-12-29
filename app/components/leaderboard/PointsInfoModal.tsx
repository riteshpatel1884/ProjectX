// components/PointsInfoModal.tsx

'use client';

import { X, Trophy, Code, GitBranch, Award, BookOpen, Flame, Users, FileText } from 'lucide-react';

interface PointsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PointsInfoModal({ isOpen, onClose }: PointsInfoModalProps) {
  if (!isOpen) return null;

  const pointActivities = [
    {
      icon: <Code className="w-5 h-5 text-blue-500" />,
      activity: 'Coding Projects',
      points: '50-200 points',
      description: 'Complete and submit quality coding projects',
    },
    {
      icon: <GitBranch className="w-5 h-5 text-green-500" />,
      activity: 'Open Source Contribution',
      points: '30-100 points',
      description: 'Contribute to open source repositories',
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      activity: 'Certifications',
      points: '100-300 points',
      description: 'Earn industry-recognized certifications',
    },
    {
      icon: <Trophy className="w-5 h-5 text-purple-500" />,
      activity: 'Hackathons',
      points: '150-500 points',
      description: 'Participate and win in hackathons',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      activity: 'Complete Courses',
      points: '20-100 points',
      description: 'Finish online courses and bootcamps',
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      activity: 'Daily Coding Streak',
      points: '5-20 points/day',
      description: 'Maintain consistent daily coding practice',
    },
    {
      icon: <Users className="w-5 h-5 text-pink-500" />,
      activity: 'Mentoring & Reviews',
      points: '10-50 points',
      description: 'Help others through code reviews and mentoring',
    },
    {
      icon: <FileText className="w-5 h-5 text-teal-500" />,
      activity: 'Technical Blogging',
      points: '40-100 points',
      description: 'Write and publish technical articles',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-7 h-7" />
              How Points Are Calculated
            </h2>
            <p className="text-blue-100 mt-1">Earn points through various activities</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {pointActivities.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.activity}
                  </h3>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {item.points}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 <span className="font-semibold">Pro Tip:</span> Consistent daily activity earns bonus multipliers!
          </p>
        </div>
      </div>
    </div>
  );
}