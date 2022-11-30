const express= require("express");
const app= express();
const bodyparser= require("body-parser");
const PORT= 4000;
const Todo = require("./models/todo");
const mongoose= require("mongoose");
const MONGO_URI= "mongodb+srv://barkha:barkha@cluster0.ar4wkeh.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
.then(() => console.log(`Connected to database`))
.catch((error) => console.log(`Connection error: ${error}`))
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.json());

app.get("/", (req, res) =>{
    try {
        res.status(200).json({
            message: "Server side"
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})

//test case 1
app.post("/v1/tasks", async(req, res) => {
    try {
        const todos= await Todo.find();
        const todolength= todos.length;
        let maxId= 0;
        for(let i=0;i<todolength;i++){
            maxId= Math.max(maxId, todos[i].id)
        }
        const {title, isComplete} = req.body;
        const todo= await Todo.create({
            title, 
            isComplete,
            id: maxId + 1
        })
        res.status(201).json({
            todoId : todo.id
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})

//text case 2
app.get("/v1/tasks", async(req, res) =>{
    try {
        const todos= await Todo.find();
        res.status(200).json({
            todos
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})
//test case 3
app.get("/v1/tasks/:id", async(req, res) =>{
    try {
        const todo= await Todo.findOne({id: req.params.id});
        if(todo){
            res.status(200).json({
                todo
            });
        }
        else{
            res.status(404).json({
                message: `No todo with task id ${req.params.id}`
            });
        }
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})

//test case 4
app.delete("/v1/tasks/:id", async(req, res) =>{
    try {
        const todo= await Todo.findOne({id: req.params.id});
        if(!todo){
            res.status(204).send({
                message: "none"
            })
            return
        }
        const deletetodo= await Todo.deleteOne({id: req.params.id});
        res.status(200).json({
            deletetodo
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})

//test case 5
app.put("/v1/tasks/:id", async(req, res) =>{
    try {
        const todo= await Todo.findOne({id: req.params.id});
        if(!todo){
            res.status(404).send({
                message: `No todo of ${req.params.id} found`
            })
            return
        }
        else{
            const todo= await Todo.updateOne({id: req.params.id}, req.body)
            res.status(200).json({
            todo
        });
        }
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
})

//test case 6 
// app.post("/v1/tasks", async(req, res) => {
//     try {
//         const todos= await Todo.find();
//         const todolength= todos.length;
//         const {title, isComplete} = req.body;
//         const todo= await Todo.create({
//             title, 
//             isComplete,
//             id: todolength + 1
//         })
//         res.status(201).json({
//             todoId : todo.id
//         })
//     } catch (error) {
//         res.status(401).json({
//             message: error.message
//         });
//     }
// })


app.listen(PORT, console.log(`Server connected at ${PORT}`));