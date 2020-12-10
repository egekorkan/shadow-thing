import {
    InteractionAffordance,
    RuntimeEvent,
    ComponentFactory,
    ComponentOwner,
    ComponentType,
    Data,
    Component,
    WriteOp,
    IVtdEvent,
    u,
    ReadOp
} from "../common/index";


export class Event extends InteractionAffordance {

    private thing: WoT.ExposedThing = undefined;

    private data: Data = undefined;

    public constructor(name: string, parent: ComponentOwner, jsonObj: IVtdEvent){
        super(name, parent, jsonObj);

        if(jsonObj.data){
            this.data = ComponentFactory.makeComponent(ComponentType.Output, "data", this, jsonObj.data) as Data;
        } 
    }

    public getChildComponent(name: string): Component {

        let component = undefined;

        switch(name){
            case ComponentType.Process:
                component = this.processes;
                break;
            case ComponentType.Data:
                component = this.dataMap;
                break;
            case ComponentType.Output:
                component = this.data;
                break;
            case ComponentType.UriVariable:
                component = this.uriVariables;
                break;
        }
        if(component == undefined){
            this.errChildDoesNotExist(name);
        }
        return component;
    }

    public setThing(thing: WoT.ExposedThing){
        this.thing = thing;
    }

    public async emit(data?: any){
        try{
            if(!this.thing){
                u.fatal("Thing is undefined.")
            }
            if(this.data){
                if(data !== undefined){
                    this.data.write(WriteOp.copy, data);
                }
                this.thing.emitEvent(this.getName(), this.data.read(ReadOp.copy));
            }else{
                this.thing.emitEvent(this.getName(), undefined);
            }            
            await this.onInteractionEvent(RuntimeEvent.emitEvent);
        }catch(err){
            u.fatal("Emit event failed:\n" + err.message, this.getFullPath());
        }        
    }
}