import {
    Instructions,
    ConsumerInteractionInstruction,
    IVtdInstruction,
    ValueTarget,
    u
} from "../index";


export class SubscribeEvent extends ConsumerInteractionInstruction {

    private onEmit: Instructions = undefined;
    private data: ValueTarget = undefined;

    public constructor(name: string, parent: Instructions, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj, jsonObj.subscribeEvent);
        
        if(jsonObj.subscribeEvent.onEmit){
            this.onEmit = new Instructions("onEmit", this, jsonObj.subscribeEvent.onEmit, this.getProcess(), this.getParentLoop());
        }  

        if(jsonObj.subscribeEvent.data){
            this.data = new ValueTarget("data", this, jsonObj.subscribeEvent.data);
        }
    }

    private async onEventEmitted(data: any){
        try{
            if(this.data){
                this.data.set(data);
            }
            await this.onEmit.execute();
        }catch(err){
            u.fatal("Event handler: " + err.message, this.getFullPath());
        }
    }

    protected async executeConsumerInstruction(thing: WoT.ConsumedThing, name: string) {
        try{
            await thing.subscribeEvent(name, data => this.onEventEmitted(data), this.getOptions());
        }catch(err){
            u.fatal("Subscribe event failed: " + err.message);
        }         
    }
}