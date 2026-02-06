import React from 'react';

interface DashboardFiltersProps {
    month: number;
    year: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    loading?: boolean;
}

export function DashboardFilters({ month, year, onMonthChange, onYearChange, loading }: DashboardFiltersProps) {
    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i);

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-48">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                    Mês
                </label>
                <select
                    id="month"
                    value={month}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                    disabled={loading}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white py-2 px-3 text-sm text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 border"
                >
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-full sm:w-32">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                </label>
                <select
                    id="year"
                    value={year}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    disabled={loading}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white py-2 px-3 text-sm text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 border"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
