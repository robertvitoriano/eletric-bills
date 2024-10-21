
# Teste Técnico - Extração e Exibição de Dados de uma Fatura de Energia Elétrica

**Desenvolvedor:** Robert da Silva Vitoriano

---
Aplicação Hospedada na AWS: [eletric-invoices.robertvitoriano.com](https://eletric-invoices.robertvitoriano.com/)

## Pré-requisitos para a Execução deste Projeto

### 1. Configuração do Amazon S3

Para utilizar o armazenamento na nuvem, siga os passos abaixo para criar e configurar um bucket no AWS S3:

- **Criação do Bucket:**
  1. Acesse o console da AWS e crie um **bucket S3**.
  2. Selecione as opções **ACLs enabled** e **General Purpose**.
  3. Desmarque a opção **Block all public access** e marque a opção que indica que você entende os efeitos dessa ação.
  4. Clique em **Criar Bucket**.

- **Configuração de Permissões CORS:**
  1. Após criar o bucket, clique na aba **Permissões** do bucket.
  2. Role até a seção **CORS** e clique em **Editar**.
  3. Adicione os seguintes valores:

    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": [],
            "MaxAgeSeconds": 3000
        }
    ]
    ```

Com isso, seu bucket estará configurado e pronto para uso na aplicação.

### 2. Criação do Arquivo `.env`

Na raiz da pasta `eletric-bills-backend`, crie um arquivo `.env` com as seguintes variáveis:

```plaintext
DB_USER=docker
DB_HOST=eletric_invoices_db
DB_PASSWORD=123
DB_PORT=5432
DB_NAME=eletric_invoices_db
PORT=5555
AWS_ACCESS_KEY_ID= -- sua chave de acesso AWS
AWS_SECRET_ACCESS_KEY= -- sua chave secreta de acesso AWS
AWS_REGION= -- sua região
S3_BUCKET= -- nome do bucket criado
```

- **Nota:** Se não puder utilizar o S3, deixe as variáveis com o prefixo `AWS` e a variável do Bucket vazia. A aplicação ainda poderá ser executada sem problemas.

Na raiz da pasta `eletric-bills-frontend`, crie um arquivo `.env.local` com os seguintes valores:

```plaintext
VITE_API_URL=http://localhost:5555
```

### 3. Execução da Aplicação

#### 3.1. Execução do Backend

Para executar o backend na raiz da pasta `eletric-bills-backend`, siga os passos abaixo:

1. Instale a ferramenta **Docker** em um ambiente Linux ou WSL através do site: [Docker](https://www.docker.com/).
2. Execute o comando:

   ```bash
   docker compose up --build
   ```

   O projeto será executado sem problemas.

- **Alternativa (sem Docker):**
  1. Instale o **pnpm** através do Node.js com o comando:

   ```bash
   npm install -g pnpm
   ```

   O Node.js pode ser baixado no site: [Node.js](https://nodejs.org/en) (será necessário para a execução do Frontend).

  2. Para executar sem Docker, você precisará de um banco de dados PostgreSQL em funcionamento. Altere as variáveis de ambiente para refletir suas credenciais do PostgreSQL:

```plaintext
DB_USER= -- seu usuário do PostgreSQL
DB_HOST= -- endereço do servidor PostgreSQL (por exemplo, localhost)
DB_PASSWORD= -- sua senha do PostgreSQL
DB_PORT=5432
DB_NAME= -- nome do banco de dados que deseja usar
```

  3. Execute `pnpm install` na raiz do projeto e, em seguida, execute:

   ```bash
   pnpm run dev
   ```

#### 3.2. Execução do Frontend

Para executar o frontend, siga os passos abaixo:

1. Execute o comando:

   ```bash
   npm install
   ```

   na raiz da pasta `eletric-bills-frontend`.
   
2. Após isso, execute:

   ```bash
   npm run dev
   ```

A aplicação iniciará por padrão em `http://localhost:5173/`. No entanto, caso inicie em outra **PORTA**, isso será informado no terminal durante a execução.

---
