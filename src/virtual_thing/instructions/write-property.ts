import {
    Instruction,
    Instructions,
    ValueSource,
    ParameterizedStringResolver,
    IVtdInstruction,
    u
} from "../index";


export class WriteProperty extends Instruction {

    private webUri: string = undefined;
    private propertyName: string = undefined;
    private uriVariables: Map<string, ValueSource> = new Map();
    private value: ValueSource = undefined;

    private strResolver: ParameterizedStringResolver = undefined;

    public constructor(name: string, parent: Instructions, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj);

        let writePropertyObj = jsonObj.writeProperty;

        this.propertyName = writePropertyObj.name;
        if(writePropertyObj.webUri){
            this.webUri = writePropertyObj.webUri;
        }      
        if(writePropertyObj.value){
            this.value = new ValueSource("value", this, writePropertyObj.value);
        }
        if(writePropertyObj.uriVariables){
            for (let key in writePropertyObj.uriVariables){
                this.uriVariables.set(key, new ValueSource("uriVariables/" + key,
                                        this, writePropertyObj.uriVariables[key]));
            } 
        }

        this.strResolver = new ParameterizedStringResolver(undefined, this);
    }

    private getOptions(): WoT.InteractionOptions {
        let options: WoT.InteractionOptions = { uriVariables: {} };
        for(let key of Array.from(this.uriVariables.keys())){
            options.uriVariables[key] = this.uriVariables.get(key).get();
        }
        return options;
    }

    protected async executeBody(){
        try{
            let uri = this.strResolver.resolveParams(this.webUri);
            let property = this.strResolver.resolveParams(this.propertyName);
            let thing = await this.getModel().getExposedThing(uri);
            let options = this.getOptions();
            let value = this.value ? this.value.get() : undefined;
            await thing.writeProperty(property, value, options);
        }catch(err){
            u.fatal(err.message, this.getFullPath());
        }   
    }
}