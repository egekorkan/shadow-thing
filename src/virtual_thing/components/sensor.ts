import {
    ComponentType,
    ComponentOwner,
    Hardware
} from "../index";


export class Sensor extends Hardware {

    public constructor(name: string, parent: ComponentOwner, jsonObj: any){
        super(name, parent, jsonObj);
    }

    public getChildComponent(type: string, name: string) {

        let component = undefined;
        
        switch(type){
            case ComponentType.Process:
                component = this.processes ? this.processes.get(name) : undefined;
                break;
            case ComponentType.Data:
                component = this.dataMap ? this.dataMap.get(name) : undefined;
                break;
            default:
                this.errInvalidChildType(type);
        }
        if(component == undefined){
            this.errChildDoesNotExist(type, name);
        }
        return component;
    }
}