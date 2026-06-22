# Casa Alves Website

Interface web da loja Casa Alves. Aplicação frontend responsável pela gestão administrativa e interface do usuário do sistema.

## Tecnologias

- **Next.js 16** com **TypeScript**
- **Tailwind CSS** - Framework de estilização
- **Axios** - Cliente HTTP para comunicação com a API
- **JWT** - Autenticação com JSON Web Tokens
- **React Hot Toast** - Notificações toast
- **Lucide React** - Biblioteca de ícones

## Variáveis de Ambiente

```env
API_URL    // URL da API (padrão: http://localhost:3001)
NODE_ENV        // Ambiente de execução (development ou production)
JWT_SECRET      // Chave secreta para validação dos tokens JWT
```

## Scripts

```bash
npm run dev         # Executa em modo desenvolvimento
npm run build       # Compila o projeto para produção
npm start           # Executa em produção
npm run lint        # Executa o linter
```

## Hospedagem

- Frontend hospedado na [Vercel](https://vercel.com/ianfelps-projects)
