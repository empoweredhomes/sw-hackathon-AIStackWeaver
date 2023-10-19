import { ResourceGenerator } from "../interfaces/ResourceGenerator";

export class BaseGenerator implements ResourceGenerator {
    public generateResource(): void {
        console.log("Base generator");
    }
}