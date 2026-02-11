import React from 'react';
import { Card, CardContent } from './Card';
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, Receipt } from 'lucide-react';
import { formatCurrency, parseCurrency } from '../utils/formatters';

interface DashboardSummaryCardsProps {
    data: {
        totalVendas: string;
        totalDespesas: string;
        totalDuplicatas: string;
        faturamentoLiquido: string;
        margemLucro: string;
        ticketMedio?: string;
        mediaDiariaVendas: string;
        mediaDiariaDespesas: string;
    };
}

export function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
    const cards = [
        {
            title: 'Faturamento Bruto',
            value: data.totalVendas,
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            description: `Média diária: ${data.mediaDiariaVendas}`
        },
        {
            title: 'Despesas Totais',
            value: data.totalDespesas,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            description: `Média diária: ${data.mediaDiariaDespesas}`
        },
        {
            title: 'Duplicatas',
            value: data.totalDuplicatas,
            icon: Receipt,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            description: `Total Pendente`
        },
        {
            title: 'Lucro Líquido',
            value: data.faturamentoLiquido,
            icon: Wallet,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            description: `Margem: ${data.margemLucro}`
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 truncate">
                                    {card.title}
                                </p>
                                <h3 className={`text-2xl font-bold mt-2 ${parseCurrency(card.value) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatCurrency(card.value)}
                                </h3>
                                {card.description && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {card.description}
                                    </p>
                                )}
                            </div>
                            <div className={`flex-shrink-0 p-3 rounded-full ${card.bgColor}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
