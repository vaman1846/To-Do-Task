const taskModel = require("../Model/taskModel");
const { ObjectId } = require("mongoose").Types;

async function saveTask(req, res) {
    try {
        const data = req.body;
        const { name, title, description, date, startTime, endTime, isCompleted } =
            data;
        const currentDate = new Date();

        if (new Date(date) < currentDate) {
            return res
                .status(400)
                .send({
                    message: "You entered an old date. Please enter a future date.",
                });
        }

        if (new Date(startTime) < currentDate) {
            return res
                .status(400)
                .send({
                    message:
                        "You entered a past start time. Please enter a future start time.",
                });
        }

        if (
            new Date(endTime) < currentDate ||
            new Date(endTime) < new Date(startTime)
        ) {
            return res
                .status(400)
                .send({
                    message:
                        "You entered an invalid end time. Please enter a future end time that is after the start time.",
                });
        }

        const task = new taskModel({
            name,
            title,
            description,
            date,
            startTime,
            endTime,
            isCompleted,
            createdOn: currentDate,
        });
        await task.save();
        return res.status(201).send({ message: "Task saved successfully", task });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function getAllTask(req, res) {
    try {
        const allTask = await taskModel.find().sort({ createdOn: -1 });
        return res
            .status(200)
            .send({ message: "Tasks fetched Successfully", allTask });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function getCompletedTask(req, res) {
    try {
        const completedTask = await taskModel
            .find({ isCompleted: true })
            .sort({ createdOn: -1 });
        if (completedTask.length > 0) {
            return res.status(201).send({ message: completedTask });
        }

        return res
            .status(200)
            .send({ message: "Tasks Fetched Successfully", completedTask });
    } catch (error) {
        console.log(error);
        res.send(500).send({ msg: "Internal server error" });
    }
}

async function getPendingTask(req, res) {
    try {
        const pendingTasks = await taskModel
            .find({ isCompleted: false })
            .sort({ createdOn: -1 });
        if (!pendingTasks) {
            return res.status(404).send({ message: "No Pending Tasks Found" });
        }
        return res
            .status(200)
            .send({ message: "Tasks Fetched Successfully", pendingTasks });
    } catch (error) {
        console.log(error);
        res.send(500).send({ message: "Internal Server Error" });
    }
}

async function deleteById(req, res) {
    try {
        let id = req.params.id;
        const deletedTask = await taskModel.deleteOne({ _id: new ObjectId(id) });
        if (!deletedTask) {
            throw new Error("Could not find a user with that ID");
        }
        return res.status(200).send({ message: `Deletion successful` });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
}

async function marksAsCompleted(req, res) {
    try {
        let id = req.body._id;
        console.log("task to be updated", req.body);
        const updateStatus = await taskModel.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isCompleted: true } }
        );
        if (!updateStatus) {
            throw new Error("Could not find the task to mark as complete");
        }

        const completedTaskCount = await taskModel.countDocuments({
            isCompleted: true,
        });

        return res.status(200).send({
            message: "Marking Complete Successful",
            completedTaskCount: completedTaskCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

async function countPending(req, res) {
    try {
        const totalPending = await taskModel.countDocuments({ isCompleted: false });
        return res.status(200).send({ totalPending });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
}
async function countCompleted(req, res) {
    try {
        const totalComplete = await taskModel.countDocuments({ isCompleted: true });
        return res.status(200).send({ totalComplete });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
}

async function countTotal(req, res) {
    try {
        const totalTasks = await taskModel.estimatedDocumentCount();
        return res.status(200).send({ totalTasks });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
}

module.exports = {
    saveTask,
    getAllTask,
    getCompletedTask,
    getPendingTask,
    deleteById,
    marksAsCompleted,
    countPending,
    countCompleted,
    countTotal,
};
