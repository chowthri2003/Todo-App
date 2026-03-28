import { DataTypes, Model, Optional } from "sequelize";
import SequelizeConfig from "../config/db.config.js";

interface TaskAttributes {
  id: number;
  userId: string;
  title: string;
  discription: string;
  status: "yet" | "ongoing" | "completed" | "Delayed";
  dueDate: Date | null;
  lastReminderAt: Date | null;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, "id"| "status"> {}
class Task extends Model<TaskAttributes, TaskCreationAttributes> 
implements TaskAttributes {
  declare id: number;
  declare userId: string;
  declare title: string;
  declare discription: string;
  declare status: "yet" | "ongoing" | "completed" | "Delayed";
  declare dueDate: Date | null;
  declare lastReminderAt: Date | null;
}
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("yet", "ongoing", "completed", "Delayed"),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastReminderAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: SequelizeConfig, // ✅ FIXED
    tableName: "task",
    timestamps: false,
  }
);

export default Task;

