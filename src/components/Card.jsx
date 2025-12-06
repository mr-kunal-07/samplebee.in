"use client"
import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';

const Card = ({
    title,
    subtitle,
    value,
    chartData,
    chartType = 'line',
    footer,
    className = '',
    isDark = false,
    chartColor = '#3b82f6',
    footerIcon,
    footerText,
    icon: Icon,
    trend
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const renderChart = () => {
        if (!chartData || chartData.length === 0 || !isMounted) return null;

        const commonProps = {
            data: chartData,
            margin: { top: 5, right: 5, bottom: 5, left: 5 }
        };

        switch (chartType) {
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={64}>
                        <AreaChart {...commonProps}>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor}
                                fill={chartColor}
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={64}>
                        <BarChart {...commonProps}>
                            <Bar
                                dataKey="value"
                                fill={chartColor}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
            default:
                return (
                    <ResponsiveContainer width="100%" height={64}>
                        <LineChart {...commonProps}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div
            className={`
        ${isDark ? 'bg-linear-to-br from-gray-800 to-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'}
        rounded-md 
        shadow-sm
        hover:shadow-md 
        transition-all 
        duration-200
        p-4
        border
        hover:scale-[1.02]
        ${className}
      `}
        >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wide`}>
                        {title}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {subtitle}
                    </p>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <Icon className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                )}
            </div>

            {/* Value with Trend */}
            <div className="flex items-baseline gap-3 mb-6">
                <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value}
                </div>
                {trend && (
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${trend.includes('+')
                        ? 'bg-green-100 text-green-700'
                        : trend.includes('-')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>

            {/* Chart */}
            {chartData && chartData.length > 0 && (
                <div className="w-full h-16 mb-4">
                    {renderChart()}
                </div>
            )}

            {/* Footer */}
            {footerIcon && (
                <div className="flex items-center gap-2 text-sm pt-4 border-t border-gray-200/10">
                    <span className={`font-semibold ${footerIcon.includes('↑')
                        ? 'text-green-500'
                        : footerIcon.includes('↓')
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                        {footerIcon}
                    </span>
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {footerText || footer}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Card