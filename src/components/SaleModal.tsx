import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Sale {
    idVenda: number;
    data: string;
    mes: number;
    ano: number;
    diaSemana: string;
    totalCartao: string;
    totalPix: string;
    totalEspecie: string;
    totalOutro: string;
    totalDia: string;
}

interface SaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SaleFormData) => void;
    loading: boolean;
    sale?: Sale | null;
}

export interface SaleFormData {
    data: string;
    totalCartao: number | '';
    totalPix: number | '';
    totalEspecie: number | '';
    totalOutro: number | '';
}

export function SaleModal({ isOpen, onClose, onSubmit, loading, sale }: SaleModalProps) {
    const [formData, setFormData] = useState<SaleFormData>({
        data: '',
        totalCartao: '',
        totalPix: '',
        totalEspecie: '',
        totalOutro: '',
    });

    useEffect(() => {
        if (sale) {
            setFormData({
                data: sale.data.split('T')[0], // Converter para formato YYYY-MM-DD
                totalCartao: parseFloat(sale.totalCartao),
                totalPix: parseFloat(sale.totalPix),
                totalEspecie: parseFloat(sale.totalEspecie),
                totalOutro: parseFloat(sale.totalOutro),
            });
        } else {
            setFormData({
                data: '',
                totalCartao: '',
                totalPix: '',
                totalEspecie: '',
                totalOutro: '',
            });
        }
    }, [sale, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            totalCartao: typeof formData.totalCartao === 'number' ? formData.totalCartao : 0,
            totalPix: typeof formData.totalPix === 'number' ? formData.totalPix : 0,
            totalEspecie: typeof formData.totalEspecie === 'number' ? formData.totalEspecie : 0,
            totalOutro: typeof formData.totalOutro === 'number' ? formData.totalOutro : 0,
        });
    };

    const calculateTotal = () => {
        const cartao = typeof formData.totalCartao === 'number' ? formData.totalCartao : 0;
        const pix = typeof formData.totalPix === 'number' ? formData.totalPix : 0;
        const especie = typeof formData.totalEspecie === 'number' ? formData.totalEspecie : 0;
        const outro = typeof formData.totalOutro === 'number' ? formData.totalOutro : 0;
        
        return (
            cartao + pix + especie + outro
        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {sale ? 'Editar Venda' : 'Nova Venda'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cartão (R$)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.totalCartao}
                                    onChange={(e) => setFormData({ ...formData, totalCartao: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PIX (R$)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.totalPix}
                                    onChange={(e) => setFormData({ ...formData, totalPix: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Espécie (R$)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.totalEspecie}
                                    onChange={(e) => setFormData({ ...formData, totalEspecie: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Outro (R$)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.totalOutro}
                                    onChange={(e) => setFormData({ ...formData, totalOutro: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-700">Total:</span>
                                <span className="text-2xl font-bold text-green-600">{calculateTotal()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : sale ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
