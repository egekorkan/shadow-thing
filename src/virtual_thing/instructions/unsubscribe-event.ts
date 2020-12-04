import {
    Instructions,
    ConsumerInteractionInstruction,
    IVtdInstruction,
    u
} from "../index";


export class UnsubscribeEvent extends ConsumerInteractionInstruction {

    public constructor(name: string, parent: Instructions, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj, jsonObj.unsubscribeEvent);        
    }

    protected async executeConsumerInstruction(thing: WoT.ConsumedThing, name: string) {
        try{
            await thing.unsubscribeEvent(name);
        }catch(err){
            u.fatal("Unubscribe event failed: " + err.message);
        }         
    }
}