import React from 'react';
import { Card, CardContent } from './Card';
import { formatCurrency, parseCurrency } from '../utils/formatters';

interface DashboardDailyTableProps {
    data: any[];
}

export function DashboardDailyTable({ data }: DashboardDailyTableProps) {
    const sortedData = [...data].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Detalhamento Diário</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Dia</th>
                                <th scope="col" className="px-6 py-3 text-right">Vendas</th>
                                <th scope="col" className="px-6 py-3 text-right">Despesas</th>
                                <th scope="col" className="px-6 py-3 text-right">Duplicatas</th>
                                <th scope="col" className="px-6 py-3 text-right">Lucro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {new Date(item.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.diaSemana}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">
                                        {formatCurrency(item.totalVendas)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-red-600">
                                        {formatCurrency(item.totalDespesas)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-orange-600">
                                        {formatCurrency(item.totalDuplicatas)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium ${parseCurrency(item.faturamentoLiquido) < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                        {formatCurrency(item.faturamentoLiquido)}
                                    </td>
                                </tr>
                            ))}
                            {sortedData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Nenhum dado encontrado para este período.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
