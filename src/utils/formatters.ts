export function formatCpfCnpj(value: string | null | undefined): string {
    if (!value) return '';
    
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskCpfCnpj(value: string): string {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 14);
    return formatCpfCnpj(limited);
}

export function unmaskCpfCnpj(value: string): string {
    return value.replace(/\D/g, '');
}

export function parseCurrency(value: string | number | undefined | null): number {
    if (value === undefined || value === null || value === '') {
        return 0;
    }

    if (typeof value === 'string') {
        if (value.includes(',') || value.includes('R$')) {
            const cleanString = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            const parsed = parseFloat(cleanString);
            return isNaN(parsed) ? 0 : parsed;
        } else {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
    }
    
    return value;
}

export function formatCurrency(value: string | number | undefined | null): string {
    const numberValue = parseCurrency(value);

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numberValue);
}