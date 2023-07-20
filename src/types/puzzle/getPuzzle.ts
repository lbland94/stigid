import Joi from 'joi';

export interface IGetPuzzleQuery extends qs.ParsedQs {
  date?: string;
}

export const GetPuzzleQuery = Joi.object<IGetPuzzleQuery>({
  date: Joi.string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .optional(),
});
