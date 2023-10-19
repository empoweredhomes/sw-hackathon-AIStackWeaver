import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { NoSQLDatabaseResource } from "../types/Database/NoSQLDatabaseResource";
import { ResourceType } from "../types/ResourceType";

export class DatabaseGenerator implements ResourceGenerator{
    public generateResource(resource: NoSQLDatabaseResource): void {
        // Switch or if-else logic based on ResourceType to handle different databases
        if (resource.ResourceType !== ResourceType.NoSQLDatabase) return;
        // Generate NoSQL database (e.g., DynamoDB) configuration
        // Here you'll put the specific code to generate this type of database using your preferred cloud SDK
        // Adapt the properties from this.config to fit the SDK's API
    }
}