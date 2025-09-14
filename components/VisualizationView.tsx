import React, { useState, useMemo } from 'react';
import { SummaryRow, DataFile, ChartType, VisualizationMetric } from '@/types';
import Card from './Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronRight, TrendingUp, Percent, BarChart2, GitCommit } from 'lucide-react';

interface VisualizationViewProps {
    data: SummaryRow[];
    labels: {
        year1: DataFile;
        year2: DataFile;
    };
    currencyFormatter: (value: number) => string;
    theme: {
        primary: string;
        accent: string;
        light: string;
    };
    chartType: ChartType;
    setChartType: React.Dispatch<React.SetStateAction<ChartType>>;
    metric: VisualizationMetric;
    setMetric: React.Dispatch<React.SetStateAction<VisualizationMetric>>;
}

const metricLabels: Record<VisualizationMetric, string> = {
    netChange: 'Net Change ($)',
    percentChange: 'Percent Change (%)',
    year1Net: 'Year 1 Net',
    year2Net: 'Year 2 Net',
};

const VisualizationView: React.FC<VisualizationViewProps> = ({ data, labels, currencyFormatter, theme, chartType, setChartType, metric, setMetric }) => {
    const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set());
    const [topN, setTopN] = useState(10);

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => Math.abs(b[metric]) - Math.abs(a[metric]));
    }, [data, metric]);

    const chartData = useMemo(() => {
        return sortedData.slice(0, topN);
    }, [sortedData, topN]);

    const toggleGroup = (group: string) => {
        setVisibleGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(group)) {
                newSet.delete(group);
            } else {
                newSet.add(group);
            }
            return newSet;
        });
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-indigo-600">{`${metricLabels[metric]}: ${metric === 'percentChange' ? data[metric].toFixed(2) + '%' : currencyFormatter(data[metric])}`}</p>
                    <p className="text-xs text-gray-500 mt-1">{`Net ${labels.year1.label}: ${currencyFormatter(data.year1Net)}`}</p>
                    <p className="text-xs text-gray-500">{`Net ${labels.year2.label}: ${currencyFormatter(data.year2Net)}`}</p>
                </div>
            );
        }
        return null;
    };

    const renderWaterfallChart = () => {
        let cumulative = 0;
        const waterfallData = chartData.map(item => {
            const start = cumulative;
            cumulative += item.netChange;
            return {
                group: item.group,
                netChange: item.netChange,
                range: [start, cumulative]
            };
        });

        return (
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="group" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={currencyFormatter} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="range">
                        {waterfallData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.netChange >= 0 ? theme.accent : '#EF4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="group" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={metric === 'percentChange' ? (v) => `${v}%` : currencyFormatter} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={metric}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry[metric] >= 0 ? theme.accent : '#EF4444'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    if (data.length === 0) {
        return (
            <Card className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                    <p className="font-semibold">No data for visualization.</p>
                    <p className="text-sm">Upload data and select a rule to see charts.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-lg font-semibold">Data Visualization</h3>
                        <div className="flex items-center gap-4">
                            {/* Chart Type and Metric controls */}
                        </div>
                    </div>
                    {chartType === 'bar' ? renderBarChart() : renderWaterfallChart()}
                </div>
            </Card>
            <Card>
                <div className="p-5">
                    <h3 className="text-lg font-semibold">Data Breakdown</h3>
                    <p className="text-sm text-gray-500 mb-4">Top {topN} groups by absolute {metricLabels[metric]}</p>
                    <div className="space-y-2">
                        {chartData.map(item => (
                            <div key={item.group}>
                                <div onClick={() => toggleGroup(item.group)} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center">
                                        {visibleGroups.has(item.group) ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                                        <span className="font-medium text-sm">{item.group}</span>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {metric === 'percentChange' ? `${item[metric].toFixed(2)}%` : currencyFormatter(item[metric])}
                                    </div>
                                </div>
                                {visibleGroups.has(item.group) && (
                                    <div className="pl-8 pr-4 py-2 text-xs bg-gray-50 rounded-b-md">
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            <div className="font-semibold text-gray-600">{labels.year1.label} Net:</div>
                                            <div className="text-right">{currencyFormatter(item.year1Net)}</div>
                                            <div className="font-semibold text-gray-600">{labels.year2.label} Net:</div>
                                            <div className="text-right">{currencyFormatter(item.year2Net)}</div>
                                            <div className="font-semibold text-gray-600">Net Change:</div>
                                            <div className="text-right">{currencyFormatter(item.netChange)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default VisualizationView;