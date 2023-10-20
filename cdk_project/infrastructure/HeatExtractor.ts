
          import * as cdk from '@aws-cdk/core';
          import * as lambda from '@aws-cdk/aws-lambda';
          import * as iam from '@aws-cdk/aws-iam';
          import { ConstructProps } from './ConstructProps';
          
          export class HeatExtractorLambda extends cdk.Construct {
            readonly resourceArn: string;
            constructor(scope: cdk.Construct, id: string, props: ConstructProps ) {
              super(scope, id);
    
              const HeatExtractorLambda = new lambda.Function(this, "HeatExtractorFunction", {
                runtime: lambda.Runtime.NODEJS,
                handler: "heat-extractor.handler",
                code: lambda.Code.fromAsset("./deploy.zip"),  // specify your code path
                memorySize: 128,
                timeout: cdk.Duration.seconds(3),
                environment: { "Company": "Mysa" }
              });
    
              const HeatSourcePolicy = new iam.PolicyStatement({
              actions: ["dynamodb:GetItem"],
              resources: [props.resouceIds["NoSQLDatabase::HeatSource"]],
            });
            HeatExtractorLambda.addToRolePolicy(HeatSourcePolicy);
    
            this.resourceArn = HeatExtractorLambda.functionArn;
            }
          }
        