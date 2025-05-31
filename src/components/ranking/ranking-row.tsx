// src/components/ranking/ranking-row.tsx
'use client';
import React from 'react';
import { TableRow, TableCell } from '@/components/ui';
import { RankingUser } from '@/hooks';
import { ProfitIndicator } from './profit-indicator';
import { UserHighlight } from './user-highlight';
import { clsx } from 'clsx';

interface RankingRowProps {
    user: RankingUser;
    compact?: boolean;
    isTopThree?: boolean;
    showAnimation?: boolean;
}

export const RankingRow: React.FC<RankingRowProps> = ({
                                                          user,
                                                          compact = false,
                                                          isTopThree = false,
                                                          showAnimation = true,
                                                      }) => {
    const getPositionClasses = (position: number) => {
        switch (position) {
            case 1:
                return 'ranking-position-1';
            case 2:
                return 'ranking-position-2';
            case 3:
                return 'ranking-position-3';
            default:
                return 'ranking-position-other';
        }
    };

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return null;
        }
    };

    return (
        <TableRow
            variant={user.isCurrentUser ? 'own' : 'default'}
            className={clsx(
                'transition-all duration-300',
                showAnimation && 'animate-fade-in',
                user.isCurrentUser && 'ring-2 ring-primary ring-opacity-50',
                isTopThree && 'bg-accent/30'
            )}
        >
            {/* Position */}
            <TableCell>
                <div className="flex items-center justify-center">
                    {isTopThree ? (
                        <div className="flex items-center space-x-1">
                            <span className="text-lg">{getPositionIcon(user.position)}</span>
                            <span className={clsx('ranking-position', getPositionClasses(user.position))}>
                {user.position}
              </span>
                        </div>
                    ) : (
                        <span className={clsx('ranking-position', getPositionClasses(user.position))}>
              {user.position}
            </span>
                    )}
                </div>
            </TableCell>

            {/* User */}
            <TableCell>
                <UserHighlight
                    user={user}
                    compact={compact}
                    showBadge={user.isCurrentUser}
                />
            </TableCell>

            {/* Profit */}
            <TableCell className="text-right">
                <ProfitIndicator
                    value={user.profitPercentage}
                    compact={compact}
                    showTrend={!compact}
                />
            </TableCell>

            {/* Operations (if not compact) */}
            {!compact && (
                <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                        <span className="font-medium">{user.operations}</span>
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </TableCell>
            )}
        </TableRow>
    );
};