import React, { useState, useMemo, useCallback } from 'react';
import { DataFile, RollupRule, Transaction } from '@/types';
import Card from './Card';
import { FileUp, Settings, Trash2, PlusCircle, UploadCloud } from 'lucide-react';
import Papa, { ParseResult } from 'papaparse';

interface DataManagementPanelProps {
    dataFiles: { year1: DataFile | null, year2: DataFile | null };
    setDataFiles: React.Dispatch<React.SetStateAction<{ year1: DataFile | null, year2: DataFile | null }>>;
    rollupRules: RollupRule[];
    setRollupRules: React.Dispatch<React.SetStateAction<RollupRule[]>>;
    activeRuleId: number | null;
    setActiveRuleId: React.Dispatch<React.SetStateAction<number | null>>;
}

const DataManagementPanel: React.FC<DataManagementPanelProps> = ({ dataFiles, setDataFiles, rollupRules, setRollupRules, activeRuleId, setActiveRuleId }) => {
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [newRule, setNewRule] = useState({ name: '', groupBy: '' });

    const availableColumns = useMemo(() => {
        const allData = [...(dataFiles.year1?.data || []), ...(dataFiles.year2?.data || [])];
        if (allData.length === 0) return [];
        return Object.keys(allData[0]) as (keyof Transaction)[];
    }, [dataFiles]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, year: 'year1' | 'year2') => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: ParseResult<any>) => {
                    const typedData = results.data.map((row: any) => ({
                        ...row,
                        'Transaction Amount': parseFloat(row['Transaction Amount']),
                        'Transaction Type': row['Transaction Type'].toLowerCase()
                    })).filter((row: any) => !isNaN(row['Transaction Amount']));

                    setDataFiles(prev => ({
                        ...prev,
                        [year]: { name: file.name, label: prev[year]?.label || file.name.split('.')[0], data: typedData as Transaction[] }
                    }));
                }
            });
        }
    }, [setDataFiles]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>, year: 'year1' | 'year2') => {
        const newLabel = e.target.value;
        setDataFiles(prev => ({
            ...prev,
            [year]: prev[year] ? { ...prev[year]!, label: newLabel } : null
        }));
    };

    const handleAddRule = () => {
        if (newRule.name && newRule.groupBy) {
            const newId = Math.max(0, ...rollupRules.map(r => r.id)) + 1;
            const ruleToAdd: RollupRule = { id: newId, name: newRule.name, groupBy: newRule.groupBy as keyof Transaction };
            setRollupRules([...rollupRules, ruleToAdd]);
            setActiveRuleId(newId);
            setNewRule({ name: '', groupBy: '' });
            setIsRuleModalOpen(false);
        }
    };

    const handleDeleteRule = (id: number) => {
        setRollupRules(rollupRules.filter(rule => rule.id !== id));
        if (activeRuleId === id) {
            setActiveRuleId(rollupRules.length > 1 ? rollupRules.filter(r => r.id !== id)[0].id : null);
        }
    };

    const FileInput = ({ year, file }: { year: 'year1' | 'year2', file: DataFile | null }) => (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={file?.label || ''}
                    onChange={(e) => handleLabelChange(e, year)}
                    placeholder={`Label for ${year}`}
                    className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                />
                <label className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">
                    <UploadCloud className="h-5 w-5 text-gray-600" />
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileChange(e, year)} />
                </label>
            </div>
            {file && <p className="text-xs text-gray-500 truncate" title={file.name}>{file.name}</p>}
        </div>
    );

    return (
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <div className="p-5">
                    <h2 className="font-semibold text-lg flex items-center"><FileUp className="mr-2 h-5 w-5 text-gray-500" />Data Files</h2>
                    <p className="text-sm text-gray-500 mb-4">Upload and label your yearly CSV data.</p>
                    <div className="space-y-4">
                        <FileInput year="year1" file={dataFiles.year1} />
                        <FileInput year="year2" file={dataFiles.year2} />
                    </div>
                </div>
            </Card>
            <Card>
                <div className="p-5">
                    <h2 className="font-semibold text-lg flex items-center"><Settings className="mr-2 h-5 w-5 text-gray-500" />Roll-up Rules</h2>
                    <p className="text-sm text-gray-500 mb-4">Define how to group and summarize data.</p>
                    <div className="space-y-2">
                        {rollupRules.map(rule => (
                            <div key={rule.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${activeRuleId === rule.id ? 'bg-green-100 border-green-300' : 'hover:bg-gray-50'}`} onClick={() => setActiveRuleId(rule.id)}>
                                <span className="font-medium text-sm">{rule.name}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteRule(rule.id); }} className="p-1 hover:bg-red-100 rounded-full">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setIsRuleModalOpen(true)} className="mt-3 w-full flex items-center justify-center p-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-md border border-dashed border-green-300">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Rule
                    </button>
                </div>
            </Card>

            {isRuleModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Create New Roll-up Rule</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Rule Name (e.g., 'By Department')"
                                value={newRule.name}
                                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <select
                                value={newRule.groupBy}
                                onChange={(e) => setNewRule({ ...newRule, groupBy: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                disabled={availableColumns.length === 0}
                            >
                                <option value="">Select a column to group by</option>
                                {availableColumns.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsRuleModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                            <button onClick={handleAddRule} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md" disabled={!newRule.name || !newRule.groupBy}>Create Rule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManagementPanel;