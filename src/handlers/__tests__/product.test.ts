import request from "supertest"
import server from "../../server"

describe("POST => /api/products", () => {
    it("should display validation errors for product price", async () => {
        const response = await request(server).post("/api/products")
        .send({
            "name": "Tucroondas - test",
            "price": 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)

        
        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("should display validation errors", async () => {
        const response = await request(server).post("/api/products")
        .send({
            "name": "Tucroondas - test",
            "price": "hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)

        
        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4 | 1)
    })

    it("should display validation errors", async () => {
        const response = await request(server).post("/api/products").send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)
        
        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("should create a new product", async () => {
        const response = await request(server).post("/api/products")
        .send({
            "name": "Microondas",
            "price": 70
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("GET => /api/products", () => {
    it("get a JSON response with products", async () => {
        const response = await request(server).get("/api/products")

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400 | 404)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("GET => /api/products/:id", () => {
    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("error")
    })

    it("should check an invalid ID field", async () => {
        const productId = "papito"
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe(productId)
    })

    it("should get a product id", async () => {
        const productId = 1
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.id).toBe(productId)
    })
})

describe("PUT => /api/products/:id", () => {

    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1000
        const response = await request(server).put(`/api/products/${productId}`)
        .send({
            "name": "Carton mojado",
            "price": 2,
            "availability": true
        })

        expect(response.status).toBe(404)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("error")
    })

    it("should check an invalid ID field", async () => {
        const productId = "papito"
        const response = await request(server).put(`/api/products/${productId}`)
        .send({
            "name": "Carton mojado",
            "price": 2,
            "availability": true
        })

        expect(response.status).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe(productId)
    })

    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1
        const response = await request(server).put(`/api/products/${productId}`).send({})

        expect(response.status).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(5)
    })

    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1
        const productPrice = 0
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .send({
                                    "name": "Carton mojado",
                                    "price": productPrice,
                                    "availability": true
                                })
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe(productPrice)
        expect(response.body.errors[0].msg).toBe("El precio del producto debe ser un número positivo")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update correctly the data", async () => {
        const productId = 1
        const productPrice = 2
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .send({
                                    "name": "Carton mojado",
                                    "price": productPrice,
                                    "availability": true
                                })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBeTruthy()
        expect(response.body.data.price).toBe(productPrice)
        expect(response.body.data.id).toBe(productId)

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("PATCH => /api/products/:id", () => {
    it("should check an invalid ID field", async () => {
        const productId = "papito"
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe(productId)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should patch correctly the data", async () => {
        const productId = 1
        const response = await request(server).patch(`/api/products/${productId}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBeTruthy()
        expect(response.body.data.id).toBe(productId)

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("DELETE => /api/products/:id", () => {
    it("should check an invalid ID field", async () => {
        const productId = "papito"
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].value).toBe(productId)
    })

    it("should validate that id exists or not (for this test the answer is not)", async () => {
        const productId = 1000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty("error")
    })

    it("should delete correctly the data", async () => {
        const productId = 1
        const response = await request(server).delete(`/api/products/${productId}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toBeTruthy()
        expect(response.body.data).toBe("Producto eliminado")

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})