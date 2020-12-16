import {
    ThingInteractionInstruction,
    VTMNode,
    ValueTarget,
    IVtdInstruction,
    u
} from "../common/index";


export class ReadProperty extends ThingInteractionInstruction {
    
    private result: ValueTarget = undefined;

    public constructor(name: string, parent: VTMNode, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj, jsonObj.readProperty);

        if(jsonObj.readProperty.result){
            this.result = new ValueTarget("result", this, jsonObj.readProperty.result);
        }
    }

    protected async executeConsumerInstruction(thing: WoT.ConsumedThing, name: string) {
        try{
            let result = await thing.readProperty(name, await this.getOptions());     
            if(this.result){
                await this.result.set(result);
            }
        }catch(err){
            u.fatal("Read property failed:\n" + err.message);
        }         
    }
}