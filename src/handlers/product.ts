import { Request, Response } from "express"
import Product from "../models/Product.model"
import { Identifier } from "sequelize"

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [["id", "DESC"]],
            attributes: { exclude: ["createdAt", "updatedAt"] }
        })
        res.json({ data: products })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id as Identifier)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        res.json({ data: product })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
}

export const createProduct = async (req: Request, res: Response) => {

    try{
        const product = await Product.create(req.body)
        res.status(201).json({data: product})
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id as Identifier)

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        await product.update(req.body)
        await product.save()

        res.json({ data: product })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id as Identifier)

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        product.availability = !product.dataValues.availability
        await product.save()

        res.json({ data: product })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id as Identifier)

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        await product.destroy()

        res.json({ data: "Producto eliminado" })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
}