import { StatusCodes } from 'http-status-codes';
import { AdvanceNodeJs } from './AdvanceNodeJs.model';
import { IAdvanceNodeJs } from './AdvanceNodeJs.interface';
import { GenericService } from '../__Generic/generic.services';

export class AdvanceNodeJsService extends GenericService<
  typeof AdvanceNodeJs,
  IAdvanceNodeJs
> {
  constructor() {
    super(AdvanceNodeJs);
  }
}
