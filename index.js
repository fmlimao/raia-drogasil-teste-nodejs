const express = require('express')
const bodyParser = require('body-parser')
const helpers = require('./helpers')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/quote/:from/:to', (req, res) => {
    let ret = {}
    let statusCode = 200

    try {
        // Buscando todas as possiveis rotas.
        const allRoutes = helpers.generateAllRoutes(helpers.generateRoutesData(helpers.getCsvData('data.csv')))

        const from = req.params.from
        const to = req.params.to

        // Validando se a Origem e Destino existem.
        if (typeof allRoutes[from] === 'undefined') throw new Error('Origem não encontrada.')
        if (typeof allRoutes[from][to] === 'undefined') throw new Error('Destino não encontrado.')

        // Retornando a rota com menor preço.
        let smaller = null

        for (let slug in allRoutes[from][to]) {
            if (smaller == null || smaller.price > allRoutes[from][to][slug].price) {
                smaller = {
                    route: allRoutes[from][to][slug].route.join(','),
                    price: allRoutes[from][to][slug].price,
                }
            }
        }

        ret = smaller
    } catch (e) {
        ret = e.message
        statusCode = 400
    }

    res.status(statusCode).json(ret)
})

app.post('/route', (req, res) => {
    let ret = 'Rota adicionada com sucesso!'
    let statusCode = 201

    try {
        let from = req.body.from || null
        let to = req.body.to || null
        let price = req.body.price || null

        // Validando as variáveis.
        if (!from) throw new Error('Origem é obrigatória.')
        if (!to) throw new Error('Destino é obrigatório.')
        if (!price) throw new Error('Preço é obrigatório.')

        price = parseFloat(price)

        // Buscando todos os registros do CSV.
        const routesData = helpers.generateRoutesData(helpers.getCsvData('data.csv'))

        // Verificando se esta rota ja está cadastrada.
        const model = [
            from,
            to,
        ]
        let exists = false
        for (let i in routesData) {
            let lineModel = [
                routesData[i][0],
                routesData[i][1],
            ]
            if (model.join(',') == lineModel.join(',')) exists = routesData[i]
        }

        if (exists) throw new Error('Já existe este registro')

        routesData.push([
            from,
            to,
            price,
        ])

        helpers.writeFile('data.csv', routesData.join('\n'))
    } catch (e) {
        ret = e.message
        statusCode = 400
    }

    res.status(statusCode).json(ret)
})

if (require.main === module) {
    app.listen(3100, () => {
        console.log('Server listening on port 3100.')
    })
}

module.exports = app
