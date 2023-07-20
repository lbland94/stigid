import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     StigidPuzzle:
 *       type: object
 *       properties:
 *         target:
 *           type: number
 *         date:
 *           type: string
 *         numbers:
 *           type: array
 *           items:
 *             type: number
 *         solutions:
 *           type: array
 *           items:
 *             type: number
 */
export interface IStigidPuzzle extends mongoose.Document {
  date: Date;
  number: number;
  puzzles: Array<{ target: number; numbers: number[]; solutions: number[] }>;
}

export interface IStigidPuzzleJson {
  date: Date | string;
  number: number;
  puzzles: Array<{ target: number; numbers: number[]; solutions: number[] }>;
  _id: string;
}

export const StigidPuzzleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
      unique: true,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    puzzles: {
      type: [
        new mongoose.Schema({
          target: {
            type: Number,
            required: true,
          },
          numbers: {
            type: Array,
            default: [],
            required: true,
          },
          solutions: {
            type: Array,
            default: [],
            trim: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
    useNestedStrict: true,
  }
);

StigidPuzzleSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id;
    ret.puzzles.forEach((p) => delete p._id);
  },
});

export default mongoose.model<IStigidPuzzle>(
  'StigidPuzzle',
  StigidPuzzleSchema
);
