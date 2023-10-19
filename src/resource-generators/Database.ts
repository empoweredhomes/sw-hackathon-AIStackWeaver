import * as fs from 'fs-extra';
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
      import { ConstructProps } from './ConstructProps';
      
      export class ${TableName} extends cdk.Construct {
        readonly resourceArn: string;
        constructor(scope: cdk.Construct, id: string, props?: ConstructProps ) {
          super(scope, id);
  
          const table = new dynamodb.Table(this, '${TableName}', {
            tableName: '${TableName}',
            partitionKey: {
              name: '${PrimaryKey.Name}',
              type: dynamodb.AttributeType.${PrimaryKey.DataType.toUpperCase()}
            },
            ${SecondaryKey ? `sortKey: {
              name: '${SecondaryKey.Name}',
              type: dynamodb.AttributeType.${SecondaryKey.DataType.toUpperCase()}
            },` : ''}
            ${CustomAttributes.BillingConfiguration ? `billingMode: dynamodb.BillingMode.${CustomAttributes.BillingConfiguration.toUpperCase()},` : ''}
            ${CustomAttributes.ThroughputConfig ? `provisionedThroughput: {
              readCapacity: ${CustomAttributes.ThroughputConfig.Read},
              writeCapacity: ${CustomAttributes.ThroughputConfig.Write}
            },` : ''}
            ${CustomAttributes.DataExpiryField ? `timeToLiveAttribute: '${CustomAttributes.DataExpiryField}',` : ''}
            ${CustomAttributes.EncryptionConfig ? `encryption: dynamodb.TableEncryption.${CustomAttributes.EncryptionConfig.Type.toUpperCase()},` : ''}
          });
            this.resourceArn = table.tableArn;
        }
      }
    `;
        return cdkConfiguration;
    }

    async writeToTSFile(resource: NoSQLDatabaseResource): Promise<void> {
        const cdkCode = this.getCdkCode(resource);
        await fs.writeFile(`./generated/${resource.Configuration.TableName}.ts`, cdkCode);
      }
}