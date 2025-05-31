// src/components/ranking/user-highlight.tsx
'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { RankingUser } from '@/hooks';
import { clsx } from 'clsx';

interface UserHighlightProps {
    user: RankingUser;
    compact?: boolean;
    showBadge?: boolean;
    showAvatar?: boolean;
}

export const UserHighlight: React.FC<UserHighlightProps> = ({
                                                                user,
                                                                compact = false,
                                                                showBadge = false,
                                                                showAvatar = true,
                                                            }) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    const getAvatarColor = (name: string) => {
        // Generate consistent color based on name
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    if (compact) {
        return (
            <div className="flex items-center space-x-2">
                {showAvatar && (
                    <div className={clsx(
                        'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
                        getAvatarColor(user.name),
                        user.isCurrentUser && 'ring-2 ring-primary ring-offset-1'
                    )}>
                        {getInitials(user.name)}
                    </div>
                )}
                <span className={clsx(
                    'font-medium truncate',
                    user.isCurrentUser && 'text-primary'
                )}>
          {user.name}
        </span>
                {showBadge && user.isCurrentUser && (
                    <Badge variant="secondary" size="sm">Tú</Badge>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            {showAvatar && (
                <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                    getAvatarColor(user.name),
                    user.isCurrentUser && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}>
                    {getInitials(user.name)}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <p className={clsx(
                        'font-medium truncate',
                        user.isCurrentUser && 'text-primary'
                    )}>
                        {user.name}
                    </p>
                    {showBadge && user.isCurrentUser && (
                        <Badge variant="default" size="sm">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Tú
                        </Badge>
                    )}
                </div>
                {!compact && (
                    <p className="text-sm text-muted-foreground">
                        Posición #{user.position}
                    </p>
                )}
            </div>
        </div>
    );
};