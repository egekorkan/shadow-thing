import {
    Entity,
    Expression,
    Trigger,
    u
} from "../index";


export class Interval extends Entity {

    private periodicTriggerMode: boolean = false;
    private trigger: Trigger = undefined;
    
    private expression: Expression = undefined;

    private started: boolean = false;
    private startMillis: number = 0;
    public tick: number = 0;

    public constructor(name: string, parent: Entity, jsonObj: any, periodicTriggerMode: boolean = false){
        super(name, parent);

        this.periodicTriggerMode = periodicTriggerMode;
        this.expression = new Expression("expression", this, jsonObj);       

        if(this.periodicTriggerMode){
            this.getModel().registerPeriodicTriggerInterval(this);
        }
    }

    private async runPeriodicTrigger(interval: Interval){
        if(!interval.started){
            return;
        }
        try{ 
            await interval.nextTick();           
            if(interval.trigger){
                await interval.trigger.invoke();
            }            
        }catch(err){
            u.failure(err.message, interval.getPath());
        }   
        setImmediate(interval.runPeriodicTrigger, interval);
    }

    private async nextTick() {        
        
        let goalInterval = this.expression.evaluate();
        if(!goalInterval || goalInterval < 0){
            u.fatal(`Invalid interval: ${goalInterval}.`, this.getPath());
        }
        
        let goalDelay = (this.tick + 1) * goalInterval + this.startMillis - Date.now();

        if(goalDelay > 0){
            try{
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.tick++;
                        resolve();
                    }, goalDelay);
                });   
            }catch(err){
                throw err;
            }            
        }else{
            this.tick++;
        }             
    }

    public setTrigger(trigger: Trigger){
        this.trigger = trigger;
    }

    public async waitForNextTick(){
        if(this.periodicTriggerMode){
            u.fatal("Can't explicitely call waitForNextTick() in \"perdiodicTriggerMode\".", this.getPath());
        }else if(!this.started){
            u.fatal("Interval is not started.", this.getPath());
        }
        try{
            await this.nextTick();
        }catch(err){
            u.fatal(err.message, this.getPath());
        }   
    }    

    public start(){        
        if(this.started){
            return;
        }
        this.started = true;
        this.reset();
        if(this.periodicTriggerMode){
            this.runPeriodicTrigger(this);
        }
    }

    public reset(){
        this.startMillis = Date.now();
        this.tick = 0;
    }

    public stop(){
        this.started = false;
    }

    public isStarted(): boolean {
        return this.started;
    }
}