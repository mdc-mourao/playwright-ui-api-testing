import { JSONSchemaType } from 'ajv';

interface ApiResponse {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
  _meta: {
    powered_by: string;
    docs_url: string;
    upgrade_url: string;
    example_url: string;
    variant: string;
    message: string;
    cta: {
      label: string;
      url: string;
    };
    context: string;
  };
}

export const userSchema: JSONSchemaType<ApiResponse> = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        avatar: { type: 'string', format: 'uri' }
      },
      required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
      additionalProperties: false
    },
    support: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
        text: { type: 'string' }
      },
      required: ['url', 'text'],
      additionalProperties: false
    },
    _meta: {
      type: 'object',
      properties: {
        powered_by: { type: 'string' },
        docs_url: { type: 'string', format: 'uri' },
        upgrade_url: { type: 'string', format: 'uri' },
        example_url: { type: 'string', format: 'uri' },
        variant: { type: 'string' },
        message: { type: 'string' },
        cta: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            url: { type: 'string', format: 'uri' }
          },
          required: ['label', 'url'],
          additionalProperties: false
        },
        context: { type: 'string' }
      },
      required: [
        'powered_by',
        'docs_url',
        'upgrade_url',
        'example_url',
        'variant',
        'message',
        'cta',
        'context'
      ],
      additionalProperties: false
    }
  },
  required: ['data', 'support', '_meta'],
  additionalProperties: false
};
