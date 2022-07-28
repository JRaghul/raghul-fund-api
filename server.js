const express = require('express')
const { MongoClient } = require("mongodb");
const bp = require('body-parser')
const app = express()
const cors = require('cors');
require('dotenv').config()
app.use(bp.json())
app.use(cors())

const client = new MongoClient(process.env.DB_CRED)

async function get_all_data(client) {
    console.log(" inside get all data")
    const data = await client.db('fundmanage').collection('fund').find().toArray()
    console.log("raghul")
    return data
}

async function get_data_with_name(client, params) {
    console.log("raw"+params)
    const data = await client.db('fundmanage').collection('fund').find({fund_name:params}).toArray()
    console.log("data :", data)
    return data
}

async function post_data(client,data) {
    console.log(" inside get with name data")
    await client.db('fundmanage').collection('fund').insertOne(data)
    return {}
}

async function edit_data(client,data,param) {
    await client.db('fundmanage').collection('fund').replaceOne({fund_name:param},{
        fund_name:data.fund_name,
        fund_start_date:data.fund_start_date,
        fund_start_end:data.fund_start_end,
        fund_total_amound:data.fund_total_amound,
        fund_total_mouths:data.fund_total_mouths
        })
    return {"status":"sucess"}
}

async function delete_data_with_name(client, params) {
    console.log(" inside delete with name data")
    await client.db('fundmanage').collection('fund').findOneAndDelete({ fund_name: params })
    return {
        "opration deletion": "sucess"
    }
}   
const port = process.env.PORT || 9998

app.listen(port, async () => {
    console.log('http://localhost:9998/')
})

app.get('/fund/:fundname?', async (req,res) =>{
    if(req.params.fundname === undefined){
        const data = await get_all_data(client)
        res.status(200).json(data)
    }
    else{
        const data = await get_data_with_name(client,req.params.fundname)
        res.status(200).json(data)
    }
})

app.post('/fund', async (req,res) =>{
    if(req.body){
        const data = await post_data(client,req.body)
        res.status(201).json(data)
    }
})

app.put('/fund/:fundname', async (req,res) =>{
    console.log("raw data"+req.body)
    if (req.body){
        if(req.params.fundname){
            const data = await edit_data(client,req.body,req.params.fundname)
            res.status(200).json(data)
        }
    }
})

app.delete('/fund/:fundname', async (req,res) =>{
    console.log(req.params.fundname === undefined)
    if(req.params.fundname !== undefined){
        
        const data = await delete_data_with_name(client,req.params.fundname)
        res.status(200).json(data)
    }
    else{
        res.status(400).json("fund id needed")
    }
})
