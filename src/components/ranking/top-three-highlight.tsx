// src/components/ranking/top-three-highlight.tsx
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { RankingUser } from '@/hooks';
import { ProfitIndicator } from './profit-indicator';
import { clsx } from 'clsx';

interface TopThreeHighlightProps {
    users: RankingUser[];
}

export const TopThreeHighlight: React.FC<TopThreeHighlightProps> = ({ users }) => {
    if (users.length < 3) return null;

    const getPositionStyle = (position: number) => {
        switch (position) {
            case 1:
                return {
                    container: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700',
                    icon: '🥇',
                    badge: 'bg-yellow-500 text-white',
                    order: 'order-2' // Center position
                };
            case 2:
                return {
                    container: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700',
                    icon: '🥈',
                    badge: 'bg-gray-400 text-white',
                    order: 'order-1' // Left position
                };
            case 3:
                return {
                    container: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700',
                    icon: '🥉',
                    badge: 'bg-orange-500 text-white',
                    order: 'order-3' // Right position
                };
            default:
                return {
                    container: 'bg-muted',
                    icon: '',
                    badge: 'bg-muted',
                    order: ''
                };
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-center mb-6 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7" />
                </svg>
                <span>Top 3 Traders</span>
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-7 7-7" />
                </svg>
            </h3>

            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {users.map((user) => {
                    const style = getPositionStyle(user.position);

                    return (
                        <div key={user.id} className={style.order}>
                            <Card className={clsx(
                                'transition-all duration-300 hover:shadow-lg',
                                style.container,
                                user.isCurrentUser && 'ring-2 ring-primary ring-offset-2',
                                user.position === 1 && 'transform scale-105'
                            )}>
                                <CardContent className="p-4 text-center">
                                    {/* Medal and Position */}
                                    <div className="flex items-center justify-center mb-3">
                                        <span className="text-3xl mr-2">{style.icon}</span>
                                        <div className={clsx(
                                            'px-2 py-1 rounded-full text-sm font-bold',
                                            style.badge
                                        )}>
                                            #{user.position}
                                        </div>
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-16 h-16 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {getInitials(user.name)}
                                    </div>

                                    {/* Name */}
                                    <h4 className={clsx(
                                        'font-semibold text-sm mb-2 truncate',
                                        user.isCurrentUser && 'text-primary'
                                    )}>
                                        {user.name}
                                        {user.isCurrentUser && (
                                            <span className="block text-xs text-primary/70">(Tú)</span>
                                        )}
                                    </h4>

                                    {/* Profit */}
                                    <div className="mb-2">
                                        <ProfitIndicator
                                            value={user.profitPercentage}
                                            compact={true}
                                            showTrend={false}
                                        />
                                    </div>

                                    {/* Operations */}
                                    <p className="text-xs text-muted-foreground">
                                        {user.operations} operaciones
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};