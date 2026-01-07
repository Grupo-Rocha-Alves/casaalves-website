/**
 * Retorna o label/nome de exibição para um nível de acesso
 * @param level - Nível de acesso do usuário (1, 2 ou 3)
 * @returns Nome do nível de acesso
 */
export function getAccessLevelLabel(level: number): string {
    switch (level) {
        case 1:
            return 'Usuário';
        case 2:
            return 'Gerente';
        case 3:
            return 'Administrador';
        default:
            return 'Desconhecido';
    }
}

/**
 * Retorna as classes CSS do Tailwind para estilizar badges de nível de acesso
 * @param level - Nível de acesso do usuário (1, 2 ou 3)
 * @returns Classes CSS do Tailwind
 */
export function getAccessLevelColor(level: number): string {
    switch (level) {
        case 1:
            return 'bg-blue-100 text-blue-700';
        case 2:
            return 'bg-green-100 text-green-700';
        case 3:
            return 'bg-purple-100 text-purple-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

/**
 * Constantes para níveis de acesso
 */
export const ACCESS_LEVELS = {
    USER: 1,
    MANAGER: 2,
    ADMIN: 3,
} as const;

/**
 * Type para os níveis de acesso
 */
export type AccessLevel = typeof ACCESS_LEVELS[keyof typeof ACCESS_LEVELS];
