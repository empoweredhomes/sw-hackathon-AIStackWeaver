import * as fs from 'fs-extra';
import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { NoSQLDatabaseResource } from "../types/Database/NoSQLDatabaseResource";
import { ResourceType } from "../types/ResourceType";

export class StackGenerator implements ResourceGenerator{
    
    public generateResource(resource: NoSQLDatabaseResource): void {
        // Switch or if-else logic based on ResourceType to handle different databases
        if (resource.ResourceType !== ResourceType.NoSQLDatabase) return;
        // Generate NoSQL database (e.g., DynamoDB) configuration
        // Here you'll put the specific code to generate this type of database using your preferred cloud SDK
        // Adapt the properties from this.config to fit the SDK's API
        this.writeToTSFile(resource);
    }

    private getCdkCode(resource: NoSQLDatabaseResource): string {
        const {
            TableName,
            PrimaryKey,
            SecondaryKey,
            CustomAttributes
          } = resource.Configuration;

        let cdkConfiguration = `
      import * as cdk from '@aws-cdk/core';
      import * as dynamodb from '@aws-cdk/aws-dynamodb';
      
      export class ${TableName} extends cdk.Stack {
        
      }
    `;
        return cdkConfiguration;
    }

    async writeToTSFile(resource: NoSQLDatabaseResource): Promise<void> {
        const cdkCode = this.getCdkCode(resource);
        await fs.writeFile(`./generated/${resource.Configuration.TableName}.ts`, cdkCode);
      }
}