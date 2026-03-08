import { Ajv, ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import betterAjvErrors from "better-ajv-errors";

export function validateSchema(schema: object, data: unknown) {
    const ajv = new Ajv({ 
        allErrors: true,
        strict: true 
    });
    addFormats(ajv);

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        const output = betterAjvErrors(schema, data, validate.errors || []);
        throw new Error(output);
    }
}

