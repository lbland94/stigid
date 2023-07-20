import Joi from 'joi';

export interface IGeneratePuzzleQuery extends qs.ParsedQs {
  date?: string;
}

export const GeneratePuzzleQuery = Joi.object<IGeneratePuzzleQuery>({
  date: Joi.string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .optional(),
});
