import { Router } from "express"
import { body, param } from "express-validator"
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()


router.get("/", 
    
    getProducts)

router.get("/:id", 

    param("id").isInt().withMessage("El ID del producto debe ser un número entero"),

    handleInputErrors,
    
    getProductById
)

router.post("/", 
    
    body("name").notEmpty().withMessage("El nombre del producto no puede estar vacío"),

    body("price").notEmpty().withMessage("El precio del producto no puede estar vacío")
                 .isNumeric().withMessage("El precio del producto debe ser un número")
                 .custom(value => value > 0).withMessage("El precio del producto debe ser un número positivo"), 
    handleInputErrors,
    createProduct)

router.put("/:id", 

    param("id").isInt().withMessage("El ID del producto debe ser un número entero"),

    body("name").notEmpty().withMessage("El nombre del producto no puede estar vacío"),

    body("price").notEmpty().withMessage("El precio del producto no puede estar vacío")
                 .isNumeric().withMessage("El precio del producto debe ser un número")
                 .custom(value => value > 0).withMessage("El precio del producto debe ser un número positivo"),
    body("availability").isBoolean().withMessage("La disponibilidad del producto debe ser un valor booleano"),

    handleInputErrors,
    updateProduct
)

router.patch("/:id",
    param("id").isInt().withMessage("El ID del producto debe ser un número entero"),
    handleInputErrors,
    updateAvailability
)

router.delete("/:id", 
    param("id").isInt().withMessage("El ID del producto debe ser un número entero"),
    handleInputErrors,
    deleteProduct
)

export default router