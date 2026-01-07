export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="py-6 text-center">
                <p className="text-sm text-gray-500">
                    © {currentYear} Grupo Rocha Alves. Todos os direitos reservados.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Desenvolvido por <a href="https://github.com/ianfelps" target="_blank" rel="noopener noreferrer">ianfelps</a>.
                </p>
            </div>
        </footer>
    );
}
