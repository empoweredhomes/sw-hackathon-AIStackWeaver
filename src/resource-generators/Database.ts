import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { BaseGenerator } from "./Base";

export namespace Generators {
    export class DatabaseGenerator extends BaseGenerator implements ResourceGenerator{
        public generateResource(resource: DatabaseResource): void {
            // Switch or if-else logic based on ResourceType to handle different databases
            if (resource.ResourceType === 'NoSQLDatabase') {
            // Generate NoSQL database (e.g., DynamoDB) configuration
            // Here you'll put the specific code to generate this type of database using your preferred cloud SDK
            // Adapt the properties from this.config to fit the SDK's API
            }
        }
    }
}