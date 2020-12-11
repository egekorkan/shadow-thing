import {
    IVtdAction,
    InteractionAffordance,
    RuntimeEvent,
    ComponentOwner,
    ComponentType,
    Component,
    Data,
    WriteOp,
    ReadOp,
    u
} from "../common/index";


export class Action extends InteractionAffordance {

    private input: Data = undefined;
    private output: Data = undefined;

    public constructor(name: string, parent: ComponentOwner, jsonObj: IVtdAction){        
        super(name, parent, jsonObj);

        if(jsonObj.input){
            this.input = new Data("input", this, jsonObj.input);
        }            

        if(jsonObj.output){
            this.output = new Data("output", this, jsonObj.input);
        }
    }

    public getChildComponent(type: string): Component {

        let component = undefined;
        
        switch(type){
            case ComponentType.Processes:
                component = this.processes;
                break;
            case ComponentType.DataMap:
                component = this.dataMap;
                break;
            case ComponentType.UriVariables:
                component = this.uriVariables;
                break;
            case ComponentType.Input:
                component = this.input;
                break;
            case ComponentType.Output:
                component = this.output;
                break;
        }
        if(component == undefined){
            this.errChildDoesNotExist(type);
        }
        return component;
    }

    public async onInvoke(input: any, options?: WoT.InteractionOptions) {        
        try{   
            this.parseUriVariables(options);                             
            if(this.input){
                this.input.reset();
                if(input !== undefined){
                    this.input.write(WriteOp.copy, input);
                }                
            }
            await this.onInteractionEvent(RuntimeEvent.invokeAction);
            if(this.output){
                return this.output.read(ReadOp.copy);
            }            
        }catch(err){
            u.error("Invoke action failed:\n" + err.message, this.getFullPath());
        }
    }
}