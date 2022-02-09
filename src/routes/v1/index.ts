import express from 'express';
import apikey from '../../auth/apikey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import postList from './post/postList';
import postDetail from './post/postDetail';
import writer from './post/writer';
import editor from './post/editor';
import user from './profile/user';
import {getAllUsers} from './info/users';
const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use('/', apikey);
/*-------------------------------------------------------------------------*/

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/posts', postList);
router.use('/post', postDetail);
router.use('/writer/post', writer);
router.use('/editor/post', editor);
router.use('/profile', user);
router.use('/info/users',getAllUsers);
export default router;
