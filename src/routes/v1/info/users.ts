import express from 'express';

import User, {UserModel} from '../../../database/model/User';

const router = express.Router();

const fetchAllUsers = async () => {
    return await UserModel.find();
}

export const getAllUsers = router.get('/', async(req,res,next)=>{
    const data = req.params;
    console.log(data)
   try {
    const response=await UserModel.find();
    res.status(200).json({
        data:response
    });
   } catch (error) {
       console.log(error);
        res.status(500).json({
            err:error
        })
   }
   

}
    
);


