import Ajv from "ajv";
import addFormats from "ajv-formats";

// Import your JSON schema here. You can either import it directly if it's a .json file or fetch it if it's hosted somewhere.
import schema from "../schemas/architecture-definition-schema.json";

export class SchemaValidator {
    private ajv: Ajv;
    private validate: any;

    constructor() {
        // Initialize Ajv
        this.ajv = new Ajv({ allErrors: true });
        addFormats(this.ajv);

        // Compile the schema
        this.validate = this.ajv.compile(schema);
    }

    public isValid(data: any): boolean {
        const valid = this.validate(data);
        if (!valid) {
            console.log(this.validate.errors);
        }
        return !!valid;
    }
}
