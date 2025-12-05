const express=require('express')
const {authMiddleware}=require('../middlewares/auth')
const Project=require('../models/Project')
const Task=require('../models/Task')
const TaskRouter=express.Router()

//Protects all routes in this router
TaskRouter.use(authMiddleware)


// /**
//  * GET/api/projects/:projectId/tasks
//  */
// TaskRouter.get('/projects/:projectId/tasks',async(req,res)=>{
//     try{
//         const userProjects=await Project.find({user:req.user._id})
//         res.json(userProjects)

//     }catch(error){
//         console.error(error)
//         res.status(500).json({error:error.message})
//     }
// })

/**
 * GET/api/projects/:projectId/tasks
 */
TaskRouter.get('/:projectId/tasks',async(req,res)=>{
    try{
        const {projectId}=req.params
        const project=await Project.findById(projectId)
        if(!project){
            return res
            .status(404)
            .json({message:`Project with id: ${req.params.projectId} not found!`})
        }
        //console.log(req.user)
        if(project.user.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"User is not authorized!"})
        }
        const tasks=await Task.find({project:projectId})
        res.json(tasks)

    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
})


/**
 * POST/api/projects/:projectId/tasks
 */
TaskRouter.post('/:projectId/tasks',async(req,res)=>{
    try{
        const {projectId}=req.params;//getting the projectId 

        //Checks whether the project exists
        const project=await Project.findById(projectId)
        if(!project) return res.status(404).json({message:"Project not found"})

        //Checks if the project belongs to user
        if(project.user.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"Not authorized"})
        }
        
        const task=await Task.create({
            ...req.body,
            project:projectId
        })
    
    res.status(201).json(task)
    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }

})

/**
 * PUT/api/projects/projectId
 */
TaskRouter.put('/:projectId',async(req,res)=>{
    try{
        const updateProject=await Project.findById(req.params.projectId,req.body,{new:true})
        res.json(project)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

/**
 * DELETE/api/projects/projectId
 */
TaskRouter.delete('/:projectId',async(req,res)=>{
   try{
    const updateProject=await Project.findById(req.params.projectId)

    if(req.user._id!==updateProject.user.toString()){
        return res.status(403).json({message:"User is not authorized to update this project"})
        res.json({message:"Project deleted"})
    }
    const project=await Project.findByIdAndDelete(req.params.projectId)
   }catch(error){
    res.status(500).json({error:error.message})
   }
})

module.exports=TaskRouter