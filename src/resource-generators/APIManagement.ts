import * as fs from 'fs-extra';
import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { ApiGatewayResource } from "../types/APIManagement/ApiGatewayResource";
import { ResourceType } from "../types/ResourceType";

export class APIManagementGenerator implements ResourceGenerator{
    // Create a map for api gateway route methods
    private apiGatewayRouteMethods: { [key: string]: string } = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        PATCH: "PATCH"
    };

    public generateResource(resource: ApiGatewayResource): void {
        if (resource.ResourceType !== ResourceType.ApiGateway) return;
        this.writeToTSFile(resource);
    }
    
    private getCdkCode(resource: ApiGatewayResource): string {
        const {
            ApiName,
            Routes,
            AccessControl,
            CustomAttributes  
        } = resource.Configuration;
      
        const routes = Routes.map(route => {
            if (route.Resource.ResourceType !== ResourceType.Function) return '';
            return `
            const lambdaFn = lambda.Function.fromFunctionArn(
              this,
              '${route.Resource.Configuration.Name}Lambda',
              props?.resouceIds["${ResourceType.Function}::${route.Resource.Configuration.Name}"]
            );
            api.root.addResource('${route.Path.replace('/', '')}')
            .addMethod('${this.apiGatewayRouteMethods[route.Method]}', 
            new apigateway.LambdaIntegration(lambdaFn), {
              authorizationType: apigateway.AuthorizationType.NONE
            });`
        }).join("\n");
        
            
        let cdkCode = `
        import * as cdk from '@aws-cdk/core';
        import * as apigateway from '@aws-cdk/aws-apigateway';
        import * as lambda from '@aws-cdk/aws-lambda';
        import { ConstructProps } from './ConstructProps';

        export class ${ApiName}Api extends cdk.Construct {
          readonly resourceArn: string = '';
            constructor(scope: cdk.Construct, id: string, props?: ConstructProps) {
                super(scope, id, props);

                const api = new apigateway.RestApi(this, '${ApiName}Api', {
                    restApiName: '${ApiName}'
                });
                
                ${routes}

                const apiKey = api.addApiKey("${ApiName}ApiKey");
                const plan = api.addUsagePlan("${ApiName}Plan", {
                    name: "${ApiName}UsagePlan",
                    apiKey,
                    throttle: {
                        rateLimit: ${AccessControl.RateLimit?.PerSecond},
                        burstLimit: ${AccessControl.RateLimit?.PerDay}
                    }
                });
            }
        }
        `
        return cdkCode;
    }
    async writeToTSFile(resource: ApiGatewayResource): Promise<void> {
        const cdkCode = this.getCdkCode(resource);
        await fs.writeFile(`./generated/${resource.Configuration.ApiName}.ts`, cdkCode);
      }
    
}