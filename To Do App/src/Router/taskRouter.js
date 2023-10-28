const express = require('express');
const { saveTask, getAllTask, countTotal, countPending, countCompleted, getPendingTask, getCompletedTask, deleteById, marksAsCompleted } = require('../Controller/taskController');

const router = express.Router();

router.post('/save',saveTask);

router.get('/all/Task',getAllTask )

router.get('/get/pending',getPendingTask)

router.get('/get/completed',getCompletedTask)

router.put('/update/:id',marksAsCompleted)

router.delete('/remove/:id',deleteById)

router.get('/all/count',countTotal)

router.get('/all/pending',countPending)

router.get('/all/completed',countCompleted)

module.exports = router;