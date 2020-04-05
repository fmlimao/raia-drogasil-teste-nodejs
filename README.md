# Raia Drogasil - Teste NodeJS

## Instalando e rodando a API

    git clone git@github.com:fmlimao/raia-drogasil-teste-nodejs.git
    cd raia-drogasil-teste-nodejs
    npm install
    node index.js

## Endpoints

### GET /quote/\<from>/\<to>

#### Request

    curl --location --request GET 'http://localhost:3100/quote/GRU/SCL'

#### Response (Status 200)

    {
        "route": "GRU,BRC,SCL",
        "price": 15
    }

### POST /route

#### Exemplo de Body

    {
        "from": "GRU",
        "to": "BA",
        "price": 10
    }

#### Request

    curl --location --request POST 'http://localhost:3100/route' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "from": "GRU",
        "to": "BA",
        "price": 10
    }'

#### Response (Status 201)

    "Rota adicionada com sucesso!"

## Testes Unitários

    npm test