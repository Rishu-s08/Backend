const express = require('express');
const { asyncHandler, APIError } = require('../middleware/error_handler');

router = express.Router();

const items = [
    {
        id:1,
        name:"Item 1"
    },
    {
        id:2,
        name:"Item 2"
    },
    {
        id:3,
        name:"Item 3"
    },
    {
        id:4,
        name:"Item 4"
    },  
]

router.get('/items', asyncHandler(async (req, res)=>{
    res.json(items)
}));

router.post('/items', asyncHandler(async (req, res)=>{
    if(!req.body.name){
        throw new APIError('Name is required', 400);
    }else{
        const newItem = {
            id: items.length + 1,
            name: req.body.name
        }
        items.push(newItem)
        res.status(201).json(newItem)
    }
}))

module.exports = router;