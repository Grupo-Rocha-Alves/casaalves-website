/**
 * Formata um CPF ou CNPJ com a máscara apropriada
 * CPF: 000.000.000-00
 * CNPJ: 00.000.000/0000-00
 */
export function formatCpfCnpj(value: string | null | undefined): string {
    if (!value) return '';
    
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    // CPF (11 dígitos)
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    // CNPJ (14 dígitos)
    return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Aplica a máscara de CPF/CNPJ enquanto o usuário digita
 * Limita a 14 dígitos (CNPJ)
 */
export function maskCpfCnpj(value: string): string {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 14);
    return formatCpfCnpj(limited);
}

/**
 * Remove a máscara do CPF/CNPJ, retornando apenas os números
 */
export function unmaskCpfCnpj(value: string): string {
    return value.replace(/\D/g, '');
}
