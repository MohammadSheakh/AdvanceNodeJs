import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../types/paginate';

export interface IAdvanceNodeJs {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  userId: Types.ObjectId;
  message: String;

  isDeleted: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdvanceNodeJsModel extends Model<IAdvanceNodeJs> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IAdvanceNodeJs>>;
}
