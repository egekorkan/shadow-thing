import {
    Entity,
    Process,
    Delay,
    Loop,
    InvokeAction,
    ReadProperty,
    WriteProperty,
    FireEvent,
    InvokeProcess,
    IfElse,
    Switch,
    Move,
    Try,
    Log,
    Control
} from "../index";


export enum InstructionType {
    readProperty = "readProperty",
    writeProperty = "writeProperty",
    invokeAction = "invokeAction",
    fireEvent = "fireEvent",
    invokeProcess = "invokeProcess",
    move = "move",
    ifelse = "ifelse",
    switch = "switch",
    loop = "loop",
    try = "try",
    log = "log",
    control = "control",
    empty = "emepty"
}

export class Instructions extends Entity {

    private process: Process = undefined;
    private parentLoop: Loop = undefined;

    private instructions: Instruction[] = [];

    public constructor(name: string, parent: Entity, jsonObj: any, process: Process, parentLoop: Loop){
        super(name, parent);

        this.process = process;
        this.parentLoop = parentLoop;

        if(jsonObj instanceof Array){   
            let index = 0;         
            jsonObj.forEach(instrObj => 
                this.instructions.push(this.createInstruction(instrObj, index++)));
        }
    }

    private createInstruction(jsonObj: any, index: number): Instruction{
        if(jsonObj.readProperty){
            return new ReadProperty("" + index + "/" + InstructionType.readProperty, this, jsonObj);
        }else if(jsonObj.writeProperty){
            return new WriteProperty("" + index + "/" + InstructionType.writeProperty, this, jsonObj);
        }else if(jsonObj.invokeAction){
            return new InvokeAction("" + index + "/" + InstructionType.invokeAction, this, jsonObj);
        }else if(jsonObj.fireEvent){
            return new FireEvent("" + index + "/" + InstructionType.fireEvent, this, jsonObj);
        }else if(jsonObj.invokeProcess){
            return new InvokeProcess("" + index + "/" + InstructionType.invokeProcess, this, jsonObj);
        }else if(jsonObj.move){
            return new Move("" + index + "/" + InstructionType.move, this, jsonObj);
        }else if(jsonObj.ifelse){
            return new IfElse("" + index + "/" + InstructionType.ifelse, this, jsonObj);
        }else if(jsonObj.switch){
            return new Switch("" + index + "/" + InstructionType.switch, this, jsonObj);
        }else if(jsonObj.loop){
            return new Loop("" + index + "/" + InstructionType.loop, this, jsonObj);
        }else if(jsonObj.try){
            return new Try("" + index + "/" + InstructionType.try, this, jsonObj);
        }else if(jsonObj.log){
            return new Log("" + index + "/" + InstructionType.log, this, jsonObj);
        }else if(jsonObj.control){
            return new Control("" + index + "/" + InstructionType.control, this, jsonObj);
        }else{
            return new Instruction("" + index + "/" + InstructionType.empty, this, jsonObj);
        }
    }

    public async execute() {
        for (const instr of this.instructions) {         
            if(this.process.canContinueExecution()
                && (!this.parentLoop || this.parentLoop.canExecuteNextInstruction())){
                    await instr.execute();
            }                
        }
    }

    public getProcess(){
        return this.process;
    }

    public getParentLoop(){
        return this.parentLoop;
    }

    public getInstructions(){
        return this.instructions;
    }
}

export class Instruction extends Entity {

    protected delay: Delay = undefined;
    protected wait: boolean = true;

    public constructor(name: string, parent: Instructions, jsonObj: any){        
        super(name, parent);

        if(jsonObj.delay){
            this.delay = new Delay("delay", this, jsonObj.delay);
        }
        if(jsonObj.wait != undefined){
            this.wait = jsonObj.wait;        
        }
    }

    protected getProcess(){
        return (this.getParent() as Instructions).getProcess();
    }

    protected getParentLoop(){
        return (this.getParent() as Instructions).getParentLoop();
    }

    public async execute() {
        if(this.delay){
            await this.delay.execute();
        }
    }
}