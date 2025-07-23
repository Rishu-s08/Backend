const product = require('../models/product')


const getProductStats = async(req, res)=>{
    try {
        const result = await product.aggregate([
        
            //stage 1
           {
             $match : {
                inStock:true,
                price:{
                    $gte: 100,
                    }
                }
            },
        //stage 2 : group documents
            {   
                $group:{
                    _id : "$category",
                    avgPrice : {
                        $avg : "$price"
                    },
                    count : {
                        $sum : 1,
                    }
                }
            }   
        ])

        res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const getProductAnalysis = async(req, res)=>{
    try {
        const result = await product.aggregate([
            {
                $match : {
                    category: "Electronics"

                }
            },{
                $group:{
                    _id : null,
                    totalRevenue: {
                        $sum : "$price"
                    },
                    avgPrice:{
                        $avg : "$price"
                    },
                    maxProductPrice:{
                        $max : "$price"
                    },
                    minProductPrice:{
                        $min : "$price"
                    }
                }
            },
            {
                $project : {
                    _id : 0,
                    totalRevenue : 1,
                    avgPrice :1,
                    maxProductPrice : 1,
                    minProductPrice : 1,
                    priceRange : {
                        $subtract : [
                            "$maxProductPrice",
                            "$minProductPrice"
                        ]
                    }
                }
            }
        ])
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const insertSampleProducts = async(req, res)=>{
    try {
        const sampleProducts = [
            {
                name: "Laptop",
                category: "Electronics",
                price: 999,
                inStock: true,
                tags: ["computer", "tech"],
            },
            {
                name: "Smartphone",
                category: "Electronics",
                price: 699,
                inStock: true,
                tags: ["mobile", "tech"],
            },
            {
                name: "Headphones",
                category: "Electronics",
                price: 199,
                inStock: false,
                tags: ["audio", "tech"],
            },
            {
                name: "Running Shoes",
                category: "Sports",
                price: 89,
                inStock: true,
                tags: ["footwear", "running"],
            },
            {
                name: "Novel",
                category: "Books",
                price: 15,
                inStock: true,
                tags: ["fiction", "bestseller"],
            },
        ];

        const result = await product.insertMany(sampleProducts);
        res.status(201).json({
            success:true,
            data:` insterted ${result.length} products}`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }

}


module.exports = {insertSampleProducts, getProductStats, getProductAnalysis};