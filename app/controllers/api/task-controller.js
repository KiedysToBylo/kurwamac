import Orders from '../../db/models/orders.js'
import fs from "fs";
class TasksController{
    async showTasks(req, res){
        const user = req.user;
        const tasks = await Orders.find({$and:[{driver:user.userId}, {statusOrder:{$lt:6} }]})
        res.json(tasks);
    }
    async getTaskStatus(req, res){
        const taskId=req.body.taskId
        const tasks = await Orders.findOne({$and:[{_id:taskId}, {statusOrder:{$lt:6} }]})
        if (tasks){
            res.json(tasks.statusOrder)
        }else{
            res.status(401);
        }
    }
    async setTaskStatus(req, res){
        const taskId=req.body.taskId
        const status = req.body.status
        const cargo = req.body.cargo
        const tasks = await Orders.findOne({_id:taskId})
            try {
                tasks.statusOrder=status
                if(cargo) {tasks.loadedCargo = cargo}
                await tasks.save()
                res.json(tasks.statusOrder);
            } catch (error) {
                res.status(401);
            }
    }
    async uploadDocs(req,res){
        const order = await Orders.findOne({_id:req.headers.taskid})
        if(!order.image)
        {
            order.image=req.file.filename;
        }else{
            const oldImage = order.image;
            order.image = oldImage+","+req.file.filename
        }
        try {
            order.save();
            res.json('Plik został przesłany i zapisany, czy chcesz przesłać kolejny plik?')
        } catch (e) {
            console.log(e)
        }
    }
}
export default new TasksController