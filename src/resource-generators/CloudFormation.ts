import * as fs from "fs-extra";
import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { BaseResource } from "../types/BaseResource";
import { ResourceCategory } from "../types/ResourceCategory";
import { APIManagementGenerator } from "./APIManagement";
import { ComputeGenerator } from "./Compute";
import { DatabaseGenerator } from "./Database";
import { ResourceGroup } from '../types/ResourceGroup';
import { ResourceType } from "../types/ResourceType";
import { NoSQLDatabaseResource } from "../types/Database/NoSQLDatabaseResource";
import { FunctionResource } from "../types/Compute/FunctionResource";
import { ApiGatewayResource } from "../types/APIManagement/ApiGatewayResource";

export class CloudFormationGenerator {
    private resouceGenerators: { [key: string]:  ResourceGenerator } = {
        [ResourceCategory.APIManagement]: new APIManagementGenerator(),
        [ResourceCategory.Compute]: new ComputeGenerator(),
        [ResourceCategory.Database]: new DatabaseGenerator()
    };

    private getConstructPropCode(): string {
        let cdkCode = `
            export interface ConstructProps {
                resouceIds: {[key: string]: string};
            }
      `;
      return cdkCode;
    }

    private getStackCdkCode(resource: ResourceGroup): string {
        const {
            Name,
            Resources
          } = resource;
          const resourceDetails = resource.Resources.map( (resource: BaseResource) => {
            const type = resource.ResourceType;
            console.log('NoSQLDatabaseResource')
            let resourceObj = null;
            let importFrom = '';
            let importStatement = '';
            switch (type) {
                case ResourceType.NoSQLDatabase:
                    console.log('NoSQLDatabaseResource');
                    resourceObj = resource as NoSQLDatabaseResource;
                    importFrom = resourceObj.Configuration.TableName;
                    importStatement = importFrom;
                    break;
                case ResourceType.Function: {
                    console.log('FunctionResource');
                    resourceObj = resource as FunctionResource;
                    importFrom = resourceObj.Configuration.Name;
                    importStatement = `${importFrom}Lambda`;
                    break;
                }
                case ResourceType.ApiGateway: {
                    console.log('ApiGatewayResource');
                    resourceObj = resource as ApiGatewayResource;
                    importFrom = resourceObj.Configuration.ApiName;
                    importStatement = `${importFrom}Api`;
                    break;
                }
                default:
                    
            }
            return {
                importCode: `import { ${importStatement} } from './${importFrom}';\n`,
                constructorCode: `
                    resource = new ${importStatement}(this, '${importStatement}', this.constructProps);
                    this.constructProps.resouceIds['${resource.ResourceType}::${importFrom}'] = resource.resourceArn;
                `
            }
          });
          console.log('Resource Details: ', JSON.stringify(resourceDetails));
          const importStatement = resourceDetails.reduce((agg, curr) => agg.concat(curr.importCode), '')
          const resourceStatements = resourceDetails.reduce((agg, curr) => agg.concat(curr.constructorCode), '')
            
          let cdkCode = `
          ${importStatement}
          import { ConstructProps } from './ConstructProps';
          import * as cdk from '@aws-cdk/core';

          export class ${Name}Stack extends cdk.Stack {
            private constructProps: ConstructProps = {
                resouceIds: {}
            };
            constructor(scope: cdk.App, id: string) {
              super(scope, id);
              let resource: any;
                ${resourceStatements}
            }
          }
        `;
        return cdkCode;
    }

     writeToTSFile(resource: ResourceGroup): void {
        const constructPropCode = this.getConstructPropCode();
        const directory = './generated';
        fs.ensureDirSync(directory);
        fs.writeFileSync(`${directory}/ConstructProps.ts`, constructPropCode);
        const cdkCode = this.getStackCdkCode(resource);
         fs.writeFileSync(`./generated/${resource.Name}Stack.ts`, cdkCode);
      }

    public generateResourceGroup(group: ResourceGroup): void {
        this.writeToTSFile(group);
        console.log(group.Resources);
        group.Resources.map((resource: BaseResource) => {
            const generator = this.resouceGenerators[resource.ResourceCategory];
            if (!generator) return;
            generator.generateResource(resource);
        });
    }
}