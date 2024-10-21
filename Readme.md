- Teste técnico - Extraçao e exibição de dadosde uma fatura de energia elétrica

- Desenvolvedor: Robert da Silva Vitoriano

- Pré-requisitos para a execução desse projeto
  - na AWS crie um bucket `S3` a opção `ACLs enabled` e `General Purpose`  selecionada
    - desmarque a opção: `Block all public access` e marque a opção abaixo dizendo que você entende os efeitos dessa ação
    - Clique em criar bucket
    
    
    
  - Adicione um arquivo .env da raiz da pasta `eletric-bills-backend` com os seguintes valores: 
  
    `
      DB_USER=docker
      DB_HOST=eletric_invoices_db
      DB_PASSWORD=123
      DB_PORT=5432
      DB_NAME=eletric_invoices_db
      PORT=5555
      AWS_ACCESS_KEY_ID= --sua chave de acesso aws
      AWS_SECRET_ACCESS_KEY= -- sua chave secreta de acesso aws
      AWS_REGION= --sua região
      S3_BUCKET= -- nome do bucket criado
    `

- Como Executar:

 - para a execução desse projeto é recomendado o uso de docker para o Backend e necessário  ferramenta npm para execução do Frontend
 
 - Execução do Backend por meio do docker:
  - execute o comando: docker compose up -d
