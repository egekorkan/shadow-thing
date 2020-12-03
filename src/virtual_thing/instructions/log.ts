import {
    Instruction,
    Instructions,
    ParameterizedStringResolver,
    IVtdInstruction,
    u
} from "../index";


export class Log extends Instruction {

    private textExpr: string = undefined;
    
    private strResolver: ParameterizedStringResolver = undefined;

    public constructor(name: string, parent: Instructions, jsonObj: IVtdInstruction){
        super(name, parent, jsonObj);

        this.textExpr = jsonObj.log;

        let strResolver = new ParameterizedStringResolver(undefined, this);
        if(strResolver.hasParams(this.textExpr)){
            this.strResolver = strResolver;
        }
    }

    protected executeBody(){        
        try{
            if(this.strResolver){
                u.log(this.strResolver.resolveParams(this.textExpr), this.getFullPath());
            }else{
                u.log(this.textExpr, this.getFullPath());
            }
        }catch(err){
            u.fatal(err.message, this.getFullPath());
        }   
    }    
}