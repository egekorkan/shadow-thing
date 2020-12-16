/**
 * This file contains interfaces that correspond to the vocabulary of the
 * Virtual Thing Description JSON Validation Scheme.
 */

import {
    RuntimeEvent,
    ReadOp,
    WriteOp,
    ControlType
} from "./index";


export type IVtdTriggers = IVtdTrigger[];
export type IVtdInstructions = IVtdInstruction[];
export type IVtdEnumRuntimeEvent = RuntimeEvent;
export type IVtdDelay = string;
export type IVtdParameterizedString = string | string[];
export type IVtdCompoundData = any;
export type IVtdEnumReadOp = ReadOp;
export type IVtdEnumWriteOp = WriteOp;
export type IVtdPointer = IVtdParameterizedString;
export type IVtdInstructionConsole = IVtdParameterizedString;
export type IVtdInstructionControl = ControlType;
export type IVtdProperty = IVtdInteractionAffordance;
export type IVtdSensor = IVtdBehavior;
export type IVtdActuator = IVtdBehavior;
export type IVtdInstructionUnsubscribeEvent = IVtdInstructionThingInteraction;
export type IVtdInstructionUnobserveProperty = IVtdInstructionThingInteraction;
export type IVtdMath = IVtdMathObj | IVtdParameterizedString;

export interface IVirtualThingDescription {
    title?: string,
    properties?: {
        [k: string]: IVtdProperty;
    };
    actions?: {
        [k: string]: IVtdAction;
    };
    events?: {
        [k: string]: IVtdEvent;
    };
    sensors?: {
        [k: string]: IVtdSensor;
    };
    actuators?: {
        [k: string]: IVtdActuator;
    };
    dataMap?: IVtdDataMap;
    processes?: IVtdProcessMap;
    dataSchemas?: IVtdDataSchemaMap;
}

export interface IVtdBehavior {
    dataMap?: IVtdDataMap;
    processes?: IVtdProcessMap;
}

export interface IVtdInteractionAffordance extends IVtdBehavior {
    uriVariables?: IVtdDataMap;
}

export interface IVtdAction extends IVtdInteractionAffordance {
    input?: IVtdDataSchema;
    output?: IVtdDataSchema;
}

export interface IVtdEvent extends IVtdInteractionAffordance {
    data?: IVtdDataSchema;
    subscription?: IVtdDataSchema;
    cancellation?: IVtdDataSchema;
}

export interface IVtdDataMap {
    [k: string]: IVtdDataSchema;
}

export interface IVtdDataSchemaMap {
    [k: string]: IVtdDataSchema;
}

export interface IVtdProcessMap {
    [k: string]: IVtdProcess;
}

export interface IVtdProcess {
    triggers?: IVtdTriggers;
    condition?: IVtdMath;
    dataMap?: IVtdDataMap;
    instructions: IVtdInstructions;
    wait?: boolean;
}

export interface IVtdMathObj {
    expr: IVtdParameterizedString;
    conf?: {
      [k: string]: unknown;
    };
}

export interface IVtdTrigger {
    runtimeEvent?: IVtdEnumRuntimeEvent;
    interactionAffordance?: string;
    interval?: IVtdMath;
    condition?: IVtdMath;
    wait?: boolean;
}

export interface IVtdInstruction {
    delay?: IVtdDelay;
    wait?: boolean;
    readProperty?: IVtdInstructionReadProperty;
    writeProperty?: IVtdInstructionWriteProperty;
    observeProperty?: IVtdInstructionObserveProperty;
    unobserveProperty?: IVtdInstructionUnobserveProperty;
    invokeAction?: IVtdInstructionInvokeAction;
    subscribeEvent?: IVtdInstructionSubscribeEvent;
    unsubscribeEvent?: IVtdInstructionUnsubscribeEvent;
    emitEvent?: IVtdInstructionEmitEvent;
    invokeProcess?: IVtdPointer;
    move?: IVtdInstructionuctionMove;
    ifelse?: IVtdInstructionIfelse;
    switch?: IVtdInstructionSwitch;
    loop: IVtdInstructionLoop;
    try?: IVtdInstructionTry;
    log?: IVtdInstructionConsole;
    info?: IVtdInstructionConsole;
    warn?: IVtdInstructionConsole;
    debug?: IVtdInstructionConsole;
    error?: IVtdInstructionConsole;
    fake?: IVtdPointer;
    control?: IVtdInstructionControl;
}

export interface IVtdValueSourceMap {
    [k: string]: IVtdValueSource;
}

export interface IVtdValueSource {
    math?: IVtdMath;
    compound?: IVtdCompoundData;
    pointer?: IVtdPointer;
    file?: IVtdParameterizedString;
    operation?: IVtdEnumReadOp;
}

export interface IVtdValueTarget {
    pointer?: IVtdPointer;
    file?: IVtdParameterizedString;
    operation?: IVtdEnumWriteOp;
}

export interface IVtdInstructionThingInteraction {
    webUri?: IVtdParameterizedString;
    name: IVtdParameterizedString;
    uriVariables?: IVtdValueSourceMap;
}

export interface IVtdInstructionReadProperty extends IVtdInstructionThingInteraction {
    result?: IVtdValueTarget;
}

export interface IVtdInstructionWriteProperty extends IVtdInstructionThingInteraction {
    value?: IVtdValueSource;
}

export interface IVtdInstructionObserveProperty extends IVtdInstructionThingInteraction {
    onChange: IVtdInstructions;
    newValue: IVtdValueTarget;
}

export interface IVtdInstructionInvokeAction extends IVtdInstructionThingInteraction {
    input?: IVtdValueSource;
    output?: IVtdValueTarget;
}

export interface IVtdInstructionSubscribeEvent extends IVtdInstructionThingInteraction {
    onEmit: IVtdInstructions;
    data: IVtdValueTarget;
}

export interface IVtdInstructionEmitEvent {
    pointer: IVtdParameterizedString;
    data?: IVtdValueSource;
}

export interface IVtdInstructionuctionMove {
    from: IVtdValueSource;
    to?: IVtdValueTarget;
}

export interface IVtdInstructionIfelse {
    if: IVtdInstructionIfelseIf;
    elif?: IVtdInstructionIfelseIf[];
    else?: IVtdInstructions;
}

export interface IVtdInstructionIfelseIf {
    condition: IVtdMath;
    instructions?: IVtdInstructions;
}

export interface IVtdInstructionSwitch {
    switch: IVtdPointer;
    cases: IVtdInstructionSwitchCase[];
    default?: IVtdInstructions;
}

export interface IVtdInstructionSwitchCase {
    case: IVtdValueSource;
    break?: boolean;
    instructions?: IVtdInstructions;
}

export interface IVtdInstructionSwitchDefault {
    break?: boolean;
    instructions?: IVtdInstructions;
}

export interface IVtdInstructionLoop {
    interval?: IVtdMath;
    iterator?: IVtdPointer;
    initialValueExpr?: IVtdMath;
    increment?: number;
    condition?: IVtdMath;
    instructions?: IVtdInstructions;
    conditionFirst?: boolean;
}

export interface IVtdInstructionTry {
    try: IVtdInstructions;
    catch?: IVtdInstructions;
}

export interface IVtdDataSchema {
    enum?: [unknown, ...unknown[]];
    format?: string;
    type: "boolean" | "integer" | "number" | "string" | "object" | "array" | "null";
    default?: any;
    const?: any;
    fake?: boolean;
    items?: IVtdDataSchema | IVtdDataSchema[];
    maxItems?: number;
    minItems?: number;
    minimum?: number;
    maximum?: number;
    properties?: {
      [k: string]: IVtdDataSchema;
    };
    required?: string[];
    [k: string]: unknown;
    schema?: string;
}
