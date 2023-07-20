import Joi from 'joi';

export interface IUpdatePuzzleQuery extends qs.ParsedQs {
  date?: string;
}

export const UpdatePuzzleQuery = Joi.object<IUpdatePuzzleQuery>({
  date: Joi.string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .optional(),
});

export interface IUpdatePuzzleBodyItem {
  target: number;
  numbers: number[];
  steps: any[];
}

export type IUpdatePuzzleBody = IUpdatePuzzleBodyItem[];

export const UpdatePuzzleBody = Joi.array<IUpdatePuzzleBody>()
  .items(
    Joi.object({
      target: Joi.number(),
      numbers: Joi.array().items(Joi.number()).length(6),
      steps: Joi.array().items().optional().default([]),
    })
  )
  .length(5);
