# PROJETO NOTADEZ - TIME G06

O NotaDez é um sistema web desenvolvido para auxiliar professores no gerenciamento de suas turmas.
A plataforma permite cadastrar instituições, cursos, disciplinas, turmas e alunos, além de lançar notas por componente e exportar os resultados em CSV.

Projeto orientado pelo Professor Luã Muriana.
***
### EQUIPE:
- Alinne Monteiro de Melo
- Alycia Santos Bond
- Livia Carvalho Lucizano
- Miriã Nascimento dos Anjos

### TECNOLOGIAS UTILIZADAS:
**Frontend:**
- HTML5
- CSS3
- JavaScript

**Backend:**
- Node.js com Typescript + Express.js

**Banco de dados:**
- Oracle Database 21c XE

## COMO RODAR O PROJETO:

1. Clone o repositório:
```bash
git clone https://github.com/linnemm/ES-PI2-2025-T3-G06.git
cd ES-PI2-2025-T3-G06
```

2. Instale as dependências
```
cd projeto
npm install
```
3. Configure o Banco de Dados
- Crie conexão no Oracle

- Execute ```/database/script.sql```

- Ajuste as credenciais em ```/src/config/database.ts```

4. Inicie o servidor ```npx ts-node-dev src/index.ts```

5. Acesse no navegador ```http://localhost:3000```



