
        import * as cdk from '@aws-cdk/core';
        import * as apigateway from '@aws-cdk/aws-apigateway';
        import * as lambda from '@aws-cdk/aws-lambda';
        import { ConstructProps } from './ConstructProps';

        export class ThermoNuclearAPIApi extends cdk.Construct {
          readonly resourceArn: string = '';
            constructor(scope: cdk.Construct, id: string, props?: ConstructProps) {
                super(scope, id);

                const api = new apigateway.RestApi(this, 'ThermoNuclearAPIApi', {
                    restApiName: 'ThermoNuclearAPI'
                });
                
                
            const lambdaFn = lambda.Function.fromFunctionArn(
              this,
              'HeatExtractorLambda',
              props?.resouceIds["Function::HeatExtractor"] ?? ''
            );
            api.root.addResource('bringtheheat')
            .addMethod('GET', 
            new apigateway.LambdaIntegration(lambdaFn), {
              authorizationType: apigateway.AuthorizationType.NONE
            });

                const apiKey = api.addApiKey("ThermoNuclearAPIApiKey");
                const plan = api.addUsagePlan("ThermoNuclearAPIPlan", {
                    name: "ThermoNuclearAPIUsagePlan",
                    apiKey,
                    throttle: {
                        rateLimit: 100,
                        burstLimit: 10000
                    }
                });
            }
        }
        