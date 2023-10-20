
      import * as cdk from '@aws-cdk/core';
      import * as dynamodb from '@aws-cdk/aws-dynamodb';
      import { ConstructProps } from './ConstructProps';
      
      export class HeatSource extends cdk.Construct {
        readonly resourceArn: string;
        constructor(scope: cdk.Construct, id: string, props?: ConstructProps ) {
          super(scope, id);
  
          const table = new dynamodb.Table(this, 'HeatSource', {
            tableName: 'HeatSource',
            partitionKey: {
              name: 'Id',
              type: dynamodb.AttributeType.STRING
            },
            sortKey: {
              name: 'Timestamp',
              type: dynamodb.AttributeType.NUMBER
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 5,
            writeCapacity: 5,
            timeToLiveAttribute: 'ExpiryDate',
            
          });
            this.resourceArn = table.tableArn;
        }
      }
    