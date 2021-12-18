import express from 'express';
const router = new express.Router();
import CompanyController from '../controllers/api/company-controller.js';
import userController from '../controllers/api/user-controller.js';
import upload from '../services/uploader.js'
import uploadCMR from '../services/uploaderCMR.js'
import TasksController from '../controllers/api/task-controller.js'
import {isAuthApi} from '../middleware/isAuthApi.js'
import {isAuthGetApi} from '../middleware/isAuthGetApi.js'

router.get('/tasks',isAuthGetApi, TasksController.showTasks);
router.post('/tasks',isAuthApi, TasksController.getTaskStatus);
router.post('/tasks/setStatus',isAuthApi, TasksController.setTaskStatus);
router.post('/tasks/uploadDocs',isAuthApi,uploadCMR.single('image'), TasksController.uploadDocs);
router.post('/firmy', isAuthApi, CompanyController.create);
router.put('/firmy/:slug', isAuthApi, upload.single('image'),CompanyController.edit);
router.delete('/firmy/:slug', isAuthApi, CompanyController.delete);

router.post('/login', userController.login);
router.post('/logout', userController.logout);

export default router;
