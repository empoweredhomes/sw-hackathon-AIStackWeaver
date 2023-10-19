import { ResourceGenerator } from "../interfaces/ResourceGenerator";
import { BaseGenerator } from "./Base";

export namespace Generators {
    export class Function  extends BaseGenerator implements ResourceGenerator{
        public generateResource(): void {
            console.log("Base generator");
        }
    }
}