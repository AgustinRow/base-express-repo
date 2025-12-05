import { JSONSchemaType } from 'ajv';

export interface CreateExampleInput {
  prompt: string;
}

export const CreateExampleSchema: JSONSchemaType<CreateExampleInput> = {
  type: 'object',
  properties: {
    prompt: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['prompt'],
  additionalProperties: false,
};
