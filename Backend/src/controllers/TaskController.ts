import { Request, Response } from "express";
import Task from "../models/Task.js";
import { logger } from "../utils/logger.js"; 


interface AuthRequest extends Request {
  userId: string;
}
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, discription, status, dueDate } = req.body;
    const DueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.create({
      title,
      discription,
      status,
      dueDate: DueDate,
      userId: req.userId
    });

    logger.info(`Task created successfully: ID ${task.id}`);

    res.status(201).json({ 
      success: true,
      data: task,
      message: "Task created successfully"
    });

  } catch (error: any) {
    logger.error(`Error creating task for User ${error.message}`);
    
    res.status(500).json({
      success: false, 
      error: error.message 
    });
  }
};

export const getTasks = async ( req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId }
    });
    
    logger.info(`Fetched ${tasks.length} tasks for User ${req.userId}`);

    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks
      });
  } catch (error: any) {
    logger.error(`Error fetching tasks for User ${req.userId}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    let updateData: any = { ...req.body };

    if (req.body.dueDate) {
      updateData.dueDate = new Date(req.body.dueDate);
    }

    await Task.update(updateData, { where: { id, userId: req.userId } });

    const updatedTask = await Task.findByPk(id);

    logger.info(`Task ${id} updated for User ${req.userId}`);

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });

  } catch (error: any) {
    logger.error(`Error updating task ${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deletedCount = await Task.destroy({ 
      where: { id, userId: req.userId }
    });
    
    if (deletedCount === 0) {
      logger.warn(`Attempted to delete non-existent task ${id}`);
    } else {
      logger.info(`Task ${id} deleted by User ${req.userId}`);
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error: any) {
    logger.error(`Error deleting task ${req.params.id}: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
};