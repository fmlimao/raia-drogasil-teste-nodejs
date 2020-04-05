const fs = require('fs')

module.exports = {

    // Helper para limpar elementos repetidos do array.
    arrayDistinct: function (arr) {
        const distinct = (v, i, s) => s.indexOf(v) === i
        return arr.filter(distinct)
    },

    // Helper que le o conteudo do arquivo CSV
    // e retorna ele separado por linhas.
    getCsvData: function (filePath) {
        return fs.readFileSync(filePath, 'utf8').split('\n')
    },

    // Helper para limpar o CSV das rotas.
    generateRoutesData: function (routesData) {
        return routesData.map((a) => {
            a = a.split(',')
            a[2] = parseFloat(a[2])
            return a
        })
    },

    // Helper que monta todas as possibilidades de rotas.
    generateAllRoutes: function (routesData, allRoutes) {
        if (routesData) {
            allRoutes = {}

            for (let i in routesData) {
                let from = routesData[i][0]
                let to = routesData[i][1]
                let price = routesData[i][2]
                let route = [from, to]
                let slug = route.join('-')

                if (typeof allRoutes[from] === 'undefined') allRoutes[from] = {}
                if (typeof allRoutes[from][to] === 'undefined') allRoutes[from][to] = {}

                allRoutes[from][to][slug] = {
                    price: price,
                    route: route,
                }
            }

            return this.generateAllRoutes(null, allRoutes)
        } else {
            const before = JSON.stringify(allRoutes)

            for (let from1 in allRoutes) {

                for (let to1 in allRoutes[from1]) {
                    let from2 = to1

                    for (let slug1 in allRoutes[from1][to1]) {
                        let price1 = allRoutes[from1][to1][slug1].price
                        let route1 = allRoutes[from1][to1][slug1].route

                        if (typeof allRoutes[from2] !== 'undefined') {

                            for (let to2 in allRoutes[from2]) {

                                for (let slug2 in allRoutes[from2][to2]) {
                                    let price2 = allRoutes[from2][to2][slug2].price
                                    let route2 = allRoutes[from2][to2][slug2].route

                                    let price3 = parseFloat(price1) + parseFloat(price2)
                                    let route3 = this.arrayDistinct(route1.concat(route2))
                                    let slug3 = route3.join('-')

                                    if (typeof allRoutes[from1][to2] === 'undefined') allRoutes[from1][to2] = {}
                                    if (typeof allRoutes[from1][to2][slug3] === 'undefined') allRoutes[from1][to2][slug3] = {
                                        price: price3,
                                        route: route3,
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const after = JSON.stringify(allRoutes)

            // Eu comparo o objeto ANTES e DEPOIS para saber se continuo
            // chamando essa função recursivamente. Ela para quando não
            // houver mais mudanças antes e depois da execução.
            if (before == after) return allRoutes
            else return this.generateAllRoutes(null, allRoutes)
        }
    },

    writeFile: function (filePath, content) {
        return fs.writeFileSync(filePath, content, 'utf8')
    },

}