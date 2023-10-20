import * as fs from "fs-extra";
import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { FunctionResource } from "../types/Compute/FunctionResource";
import { ResourceType } from "../types/ResourceType";

export class ComputeGenerator implements ResourceGenerator{
    private policyActionsMap: { [key: string]: string } = {
        Read: "dynamodb:GetItem",
        Write: "dynamodb:PutItem",
        Update: "dynamodb:UpdateItem",
        Delete: "dynamodb:DeleteItem",
    };
    public generateResource(resource: FunctionResource): void {
        if (resource.ResourceType !== ResourceType.Function) return;
        this.writeToTSFile(resource);
    }
    private getCdkCode(resource: FunctionResource): string {
        const {
            Name,
            Runtime,
            Handler,
            MemorySize,
            Timeout,
            AccessControl,
            Environment
          } = resource.Configuration;

          const envVariables = Environment.Variables.map(variable => {
            return `"${variable.Name}": "${variable.Value}"`;
          }).join(", ");
          
          const permissionsCode = AccessControl.Permissions.map(permission => {
            if(permission.ResourceType !== ResourceType.NoSQLDatabase) {
              return '';
            }
            return `const ${permission.Resource}Policy = new iam.PolicyStatement({
              actions: [${permission.Actions.map(action => `"${this.policyActionsMap[action]}"`).join(", ")}],
              resources: [props.resouceIds["${permission.ResourceType}::${permission.Resource}"]],
            });
            ${Name}Lambda.addToRolePolicy(${permission.Resource}Policy);`;
          }).join("\n");

          let cdkCode = `
          import * as cdk from '@aws-cdk/core';
          import * as lambda from '@aws-cdk/aws-lambda';
          import * as iam from '@aws-cdk/aws-iam';
          import { ConstructProps } from './ConstructProps';
          
          export class ${Name}Lambda extends cdk.Construct {
            readonly resourceArn: string;
            constructor(scope: cdk.Construct, id: string, props: ConstructProps ) {
              super(scope, id);
    
              const ${Name}Lambda = new lambda.Function(this, "${Name}Function", {
                runtime: lambda.Runtime.${Runtime.toUpperCase()},
                handler: "${Handler}",
                code: lambda.Code.fromAsset("./deploy.zip"),  // specify your code path
                memorySize: ${MemorySize},
                timeout: cdk.Duration.seconds(${Timeout}),
                environment: { ${envVariables} }
              });
    
              ${permissionsCode}
    
            this.resourceArn = ${Name}Lambda.functionArn;
            }
          }
        `;
        return cdkCode;

    }

     writeToTSFile(resource: FunctionResource): void {
        const cdkCode = this.getCdkCode(resource);
         fs.writeFileSync(`./generated/${resource.Configuration.Name}.ts`, cdkCode);
      }
    
    
}