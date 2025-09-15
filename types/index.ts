export type TransactionType = 'credit' | 'debit';

export interface Transaction {
    'Account Code': string;
    'Account Name': string;
    'Transaction Type': TransactionType;
    'Transaction Amount': number;
    'Department': string;
    'Fund': string;
    'College': string;
    [key: string]: any;
}

export interface DataFile {
    name: string;
    label: string;
    data: Transaction[];
}

export interface RollupRule {
    id: number;
    name: string;
    groupBy: keyof Transaction;
    filterColumn?: keyof Transaction;
    filterValue?: string;
}

export interface SummaryRow {
    group: string;
    year1Debits: number;
    year1Credits: number;
    year1Net: number;
    year2Debits: number;
    year2Credits: number;
    year2Net: number;
    netChange: number;
    percentChange: number;
}

export type ChartType = 'bar' | 'waterfall';
export type VisualizationMetric = 'netChange' | 'percentChange' | 'year1Net' | 'year2Net';