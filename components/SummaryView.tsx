import React, { useState, useMemo } from 'react';
import { SummaryRow, DataFile } from '@/types';
import Card from './Card';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SummaryViewProps {
    data: SummaryRow[];
    labels: {
        year1: DataFile;
        year2: DataFile;
    };
    formatCurrency: (value: number) => string;
    theme: {
        primary: string;
        accent: string;
        light: string;
    };
}

type SortKey = keyof SummaryRow;
type SortDirection = 'asc' | 'desc';

const SummaryView: React.FC<SummaryViewProps> = ({ data, labels, formatCurrency, theme }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection } | null>({ key: 'group', direction: 'asc' });

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ sortKey, label }: { sortKey: SortKey, label: string }) => {
        const isSorted = sortConfig?.key === sortKey;
        return (
            <th onClick={() => requestSort(sortKey)} className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                <div className="flex items-center">
                    {label}
                    <span className="ml-1">
                        {isSorted ? (sortConfig?.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 text-gray-400" />}
                    </span>
                </div>
            </th>
        );
    };

    const renderChange = (value: number, isPercent: boolean) => {
        const isPositive = value > 0;
        const isNegative = value < 0;
        const color = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500';
        const formattedValue = isPercent ? `${value.toFixed(2)}%` : formatCurrency(value);
        if (Math.abs(value) < 0.01 && !isPercent) return <span className="text-gray-500">-</span>;
        return <span className={color}>{formattedValue}</span>;
    };

    if (data.length === 0) {
        return (
            <Card className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                    <p className="font-semibold">No data to display.</p>
                    <p className="text-sm">Please upload data files and select a roll-up rule.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="p-5">
                <h3 className="text-lg font-semibold">Roll-up Summary</h3>
                <p className="text-sm text-gray-500">Comparing {labels.year1.label} vs {labels.year2.label}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader sortKey="group" label="Group" />
                            <th colSpan={3} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{backgroundColor: theme.light}}>{labels.year1.label}</th>
                            <th colSpan={3} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{backgroundColor: theme.light}}>{labels.year2.label}</th>
                            <th colSpan={2} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Change</th>
                        </tr>
                        <tr>
                            <th className="p-3"></th>
                            <SortableHeader sortKey="year1Credits" label="Credits" />
                            <SortableHeader sortKey="year1Debits" label="Debits" />
                            <SortableHeader sortKey="year1Net" label="Net" />
                            <SortableHeader sortKey="year2Credits" label="Credits" />
                            <SortableHeader sortKey="year2Debits" label="Debits" />
                            <SortableHeader sortKey="year2Net" label="Net" />
                            <SortableHeader sortKey="netChange" label="Net Change" />
                            <SortableHeader sortKey="percentChange" label="% Change" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((row) => (
                            <tr key={row.group} className="hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{row.group}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600 text-right">{formatCurrency(row.year1Credits)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600 text-right">{formatCurrency(row.year1Debits)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-800 text-right font-semibold">{formatCurrency(row.year1Net)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600 text-right">{formatCurrency(row.year2Credits)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600 text-right">{formatCurrency(row.year2Debits)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-800 text-right font-semibold">{formatCurrency(row.year2Net)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-right">{renderChange(row.netChange, false)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-right">{renderChange(row.percentChange, true)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default SummaryView;