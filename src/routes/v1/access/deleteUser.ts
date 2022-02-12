import express, { response } from 'express';

import User, {UserModel} from '../../../database/model/User';

const router = express.Router();

export const deleteUser=router.delete('/', async(req,res,next)=>{
     
       
    try {
        const response =await UserModel.findByIdAndDelete(req.body.id);
        if(!response)
        {
         res.status(200).send("User already deleted");
        }
       else
       {
         res.status(200).send(response);
       }
       
    } catch (error) {
     res.status(500).json({
         err:error
     })
    }
      
      
    
})

