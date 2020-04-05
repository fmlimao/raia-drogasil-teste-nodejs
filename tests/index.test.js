const test = require('tape')
const supertest = require('supertest')

const index = require('../index')

test('GET /quote/GRU/SCL', (t) => {
    supertest(index)
        .get('/quote/GRU/SCL')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.route === 'GRU,BRC,SCL', 'Rota correta')
            t.assert(res.body.price === 15, 'Preço correto')
            t.end()
        })
})

test('POST /route', (t) => {
    supertest(index)
        .post('/route')
        .send({
            from: "GRU",
            to: "BA2",
            price: 10
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body === 'Já existe este registro', 'Rota correta')
            t.end()
        })
})
