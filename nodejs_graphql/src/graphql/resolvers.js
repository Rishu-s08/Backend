//for dummy data

// const products  = require('../data/products')


// const resolvers = {
//     Query :{
//         products: () => products,
//         product : (_, {id}) => products.find(product => product.id === id)  
//     },

//     Mutation:{
//         createProduct: (_, {title, category, price, inStock}) => {
//             const newProduct = {
//                 id : String(products.length + 1),
//                 title,
//                 category,
//                 price,
//                 inStock

//             }

//             products.push(newProduct)
//             return newProduct
//         },
//         deleteProduct:(_, {id})=>{
//             const index = products.findIndex(product => product.id === id);
//             if(index === -1){
//                 return false;
//             }
//             products.splice(index, 1);
//             return true;
//         },
//         updateProduct:(_, {id, title, category, price, inStock})=>{
//             const product = products.find(product => product.id === id);
//             if(!product){
//                 return null;
//             }
//             product.title = title || product.title;
//             product.category = category || product.category;
//             product.price = price || product.price;
//             product.inStock = inStock || product.inStock;
//             return product

//         }
//         //or 
//         // updateProduct:(_, {id, ...updates})=>{
//         //     const index = products.findIndex(product => product.id === id);
//         //     if(!index){
//         //         return null;
//         //     }
//         //     const updatedProduct = {
//         //         ...products[index], 
//         //         ...updates
            
//         //     }
//         //     products[index] = updatedProduct;
//         //     return updatedProduct;

//         // }
//     }
// }

// module.exports = resolvers;



// for data from mongoose
const Product = require('../models/product')

const resolvers = {
    Query : {
        products: async ()=> await Product.find(),
        product : async(_,{id}) => await Product.findById(id) 
    
    },

    Mutation:{
        createProduct: async (_, args) => {
            const newProduct = new Product(args);
            const saved = await newProduct.save();
            return saved;
        },
        updateProduct: async(_, {id, ...updatedFields})=>{
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {new:true});
            return updatedProduct
        },
        deleteProduct: async(_, {id}) => {
            const deltedProduct = await Product.findByIdAndDelete(id);
            if(!deltedProduct){
                return false;
            }
            return true;
        }
    }
}

module.exports = resolvers