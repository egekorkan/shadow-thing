import {
    ThingInteractionInstruction,
    Entity,
    ValueTarget,
    IVtdInstruction,
    u
} from "../common/index";


export class ReadProperty extends ThingInteractionInstruction {
    
    private result: ValueTarget = undefined;

    public constructor(name: string, parent: Entity, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj, jsonObj.readProperty);

        if(jsonObj.readProperty.result){
            this.result = new ValueTarget("result", this, jsonObj.readProperty.result);
        }
    }

    protected async executeConsumerInstruction(thing: WoT.ConsumedThing, name: string) {
        try{
            let result = await thing.readProperty(name, this.getOptions());     
            if(this.result){
                this.result.set(result);
            }
        }catch(err){
            u.fatal("Read property failed:\n" + err.message);
        }         
    }
}