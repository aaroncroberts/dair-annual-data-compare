"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { DataFile, RollupRule, SummaryRow, Transaction, ChartType, VisualizationMetric } from '@/types';
import DataManagementPanel from './DataManagementPanel';
import SummaryView from './SummaryView';
import VisualizationView from './VisualizationView';

const theme = {
    primary: '#1E4D2B',
    accent: '#6A9F46',
    light: '#F0F5F0',
};

export default function FinancialDashboard() {
    const [activeView, setActiveView] = useState<'summary' | 'visualization'>('summary');
    const [dataFiles, setDataFiles] = useState<{ year1: DataFile | null, year2: DataFile | null }>({
        year1: null,
        year2: null
    });
    const [rollupRules, setRollupRules] = useState<RollupRule[]>([
        { id: 1, name: 'By Account Name', groupBy: 'Account Name' },
        { id: 2, name: 'By Department', groupBy: 'Department' },
    ]);
    const [activeRuleId, setActiveRuleId] = useState<number | null>(1);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [visualizationMetric, setVisualizationMetric] = useState<VisualizationMetric>('netChange');

    const processData = useCallback((data: Transaction[] | undefined, rule: RollupRule) => {
        if (!data || !rule) return {};

        let filteredData = data;
        if (rule.filterColumn && rule.filterValue) {
            filteredData = data.filter(item => {
                const itemValue = item[rule.filterColumn!];
                return itemValue && String(itemValue).toLowerCase().includes(rule.filterValue!.toLowerCase());
            });
        }

        return filteredData.reduce((acc: { [key: string]: { debits: number, credits: number } }, item) => {
            const key = item[rule.groupBy];
            if (typeof key !== 'string' && typeof key !== 'number') return acc;
            const groupKey = String(key);
            if (!acc[groupKey]) acc[groupKey] = { debits: 0, credits: 0 };
            const amount = item['Transaction Amount'];
            if (item['Transaction Type'] === 'debit') acc[groupKey].debits += amount;
            else if (item['Transaction Type'] === 'credit') acc[groupKey].credits += amount;
            return acc;
        }, {});
    }, []);

    const summaryData: SummaryRow[] = useMemo(() => {
        const activeRule = rollupRules.find(r => r.id === activeRuleId);
        if (!activeRule || (!dataFiles.year1 && !dataFiles.year2)) return [];
        
        const processed1 = processData(dataFiles.year1?.data, activeRule);
        const processed2 = processData(dataFiles.year2?.data, activeRule);
        
        const allKeys = [...new Set([...Object.keys(processed1), ...Object.keys(processed2)])];
        
        return allKeys.sort().map(key => {
            const y1 = processed1[key] || { debits: 0, credits: 0 };
            const y2 = processed2[key] || { debits: 0, credits: 0 };
            const net1 = y1.credits - y1.debits;
            const net2 = y2.credits - y2.debits;
            const netChange = net2 - net1;
            return {
                group: key,
                year1Debits: y1.debits, year1Credits: y1.credits, year1Net: net1,
                year2Debits: y2.debits, year2Credits: y2.credits, year2Net: net2,
                netChange,
                percentChange: net1 !== 0 ? (netChange / Math.abs(net1)) * 100 : (net2 !== 0 ? 100 : 0)
            };
        });
    }, [dataFiles, rollupRules, activeRuleId, processData]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    const currencyFormatter = (value: number) => `$${(value / 1000).toFixed(0)}k`;

    const labels = {
        year1: dataFiles.year1 || { name: 'Year 1', label: 'Year 1', data: [] },
        year2: dataFiles.year2 || { name: 'Year 2', label: 'Year 2', data: [] }
    };

    return (
        <div style={{'--theme-primary': theme.primary, '--theme-accent': theme.accent} as React.CSSProperties} className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <header className="mb-8 bg-[var(--theme-primary)] text-white shadow-md">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-bold">Financial Data Analysis</h1>
                    <p className="text-green-100 mt-1">The Office of Data Analytics & Institutional Reseach (DAIR)</p>
                </div>
            </header>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DataManagementPanel {...{dataFiles, setDataFiles, rollupRules, setRollupRules, activeRuleId, setActiveRuleId}} />
                    <div className="lg:col-span-2">
                        <div className="flex border-b border-gray-200 mb-4">
                            {(['summary', 'visualization'] as const).map(view => (
                                <button key={view} onClick={() => setActiveView(view)} className={`px-4 py-2 text-sm font-semibold transition-colors capitalize ${activeView === view ? 'border-b-2 border-[var(--theme-accent)] text-[var(--theme-primary)]' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {view}
                                </button>
                            ))}
                        </div>
                        <div className="min-h-[600px]">
                           {activeView === 'summary' && <SummaryView data={summaryData} labels={labels} formatCurrency={formatCurrency} theme={theme} />}
                           {activeView === 'visualization' && <VisualizationView data={summaryData} labels={labels} currencyFormatter={currencyFormatter} theme={theme} chartType={chartType} setChartType={setChartType} metric={visualizationMetric} setMetric={setVisualizationMetric} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}