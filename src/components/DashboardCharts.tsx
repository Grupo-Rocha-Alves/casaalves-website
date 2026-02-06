import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardContent } from './Card';
import { parseCurrency, formatCurrency } from '../utils/formatters';

interface DashboardChartsProps {
    dadosDiarios: any[];
    vendasPorDiaSemana: any[];
    vendas: any;
    despesas: any;
    duplicatas: any;
}

const COLORS = ['#16a34a', '#dc2626', '#2563eb', '#d97706', '#9333ea', '#0891b2'];
const PAYMENT_COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#64748b']; // Cartão, Pix, Espécie, Outro

export function DashboardCharts({
    dadosDiarios,
    vendasPorDiaSemana,
    vendas,
    despesas,
    duplicatas
}: DashboardChartsProps) {

    const dailyData = dadosDiarios.map(day => ({
        ...day,
        totalVendasNum: parseCurrency(day.totalVendas),
        totalDespesasNum: parseCurrency(day.totalDespesas),
        totalDuplicatasNum: parseCurrency(day.totalDuplicatas),
        lucroNum: parseCurrency(day.faturamentoLiquido)
    })).sort((a, b) => new Date(a.data + 'T12:00:00').getTime() - new Date(b.data + 'T12:00:00').getTime());

    const paymentData = [
        { name: 'Cartão', value: parseCurrency(vendas.totalCartao) },
        { name: 'Pix', value: parseCurrency(vendas.totalPix) },
        { name: 'Espécie', value: parseCurrency(vendas.totalEspecie) },
        { name: 'Outro', value: parseCurrency(vendas.totalOutro) },
    ].filter(item => item.value > 0);

    const expenseData = [
        { name: 'Mercadorias', value: parseCurrency(despesas.mercadorias) },
        { name: 'Serviços', value: parseCurrency(despesas.servicos) },
        { name: 'Impostos', value: parseCurrency(despesas.impostos) },
        { name: 'Diversos', value: parseCurrency(despesas.diversos) },
        { name: 'Proventos', value: parseCurrency(despesas.proventos) },
    ].filter(item => item.value > 0);

    const weeklyData = vendasPorDiaSemana.map(item => ({
        ...item,
        totalNum: parseCurrency(item.total)
    }));



    return (
        <div className="space-y-6 mb-8">
            {/* Vendas vs Despesas (Daily Trend) */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Diária</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="h-[300px] min-w-[800px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0}/>
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0}/>
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                                        </linearGradient>
                                         <linearGradient id="colorDuplicatas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0}/>
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis 
                                        dataKey="data" 
                                        tickFormatter={(val) => new Date(val + 'T12:00:00').getDate().toString()}
                                        tick={{fontSize: 12}}
                                    />
                                    <YAxis 
                                        tickFormatter={(val) => `R$${val/1000}k`}
                                        tick={{fontSize: 12}}
                                    />
                                    <Tooltip 
                                        formatter={(value: any) => formatCurrency(value)}
                                        labelFormatter={(label) => new Date(label + 'T12:00:00').toLocaleDateString('pt-BR')}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="totalVendasNum" name="Vendas" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                                    <Area type="monotone" dataKey="totalDespesasNum" name="Despesas" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                                    <Area type="monotone" dataKey="totalDuplicatasNum" name="Duplicatas" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorDuplicatas)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Forma de Pagamento</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Duplicatas</h3>
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Pendente', value: parseCurrency(duplicatas?.pendente) },
                                            { name: 'Pago', value: parseCurrency(duplicatas?.pago) }
                                        ].filter(item => item.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#16a34a" />
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>
            <Card className="lg:col-span-2">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Dia da Semana</h3>
                     <div className="overflow-x-auto pb-2">
                        <div className="h-[300px] min-w-[600px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="diaSemana" />
                                    <YAxis tickFormatter={(val) => `R$${val/1000}k`} />
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                    <Bar dataKey="totalNum" name="Vendas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
