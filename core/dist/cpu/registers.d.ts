import { BitValue, ByteValue, WordValue } from "../types";
export declare type ByteRegister = "a" | "b" | "c" | "d" | "e" | "h" | "l";
export declare type NonAfGroupedWordRegister = "bc" | "de" | "hl";
export declare type GroupedWordRegister = "af" | NonAfGroupedWordRegister;
export declare type NativeWordRegister = "sp" | "pc";
export declare type Register = ByteRegister | "f" | GroupedWordRegister | NativeWordRegister;
export declare const NON_AF_GROUPED_WORD_REGISTERS: ReadonlyArray<NonAfGroupedWordRegister>;
export declare const GROUPED_WORD_REGISTERS: ReadonlyArray<GroupedWordRegister>;
export declare const BYTE_REGISTERS: ReadonlyArray<ByteRegister>;
export declare const NON_A_BYTE_REGISTERS: ReadonlyArray<ByteRegister>;
export declare const BYTE_REGISTER_PAIR_PERMUTATIONS: ReadonlyArray<Readonly<[ByteRegister, ByteRegister]>>;
export declare const FLAG_Z = 7;
export declare const FLAG_Z_MASK: number;
export declare const FLAG_N_MASK: number;
export declare const FLAG_H_MASK: number;
export declare const FLAG_C_MASK: number;
export interface CpuRegisters {
    a: ByteValue;
    b: ByteValue;
    c: ByteValue;
    d: ByteValue;
    e: ByteValue;
    h: ByteValue;
    l: ByteValue;
    f: ByteValue;
    pc: WordValue;
    sp: WordValue;
    bc: WordValue;
    de: WordValue;
    hl: WordValue;
    af: WordValue;
    fZ: BitValue;
    fNz: BitValue;
    fN: BitValue;
    fH: BitValue;
    fC: BitValue;
    fNc: BitValue;
}
export declare class CpuRegistersImpl implements CpuRegisters {
    private _a;
    private _b;
    private _c;
    private _d;
    private _e;
    private _h;
    private _l;
    private _f;
    private _pc;
    private _sp;
    constructor();
    readonly fNz: BitValue;
    fZ: BitValue;
    fN: BitValue;
    fH: BitValue;
    fC: BitValue;
    readonly fNc: BitValue;
    a: ByteValue;
    b: ByteValue;
    c: ByteValue;
    d: ByteValue;
    e: ByteValue;
    h: ByteValue;
    l: ByteValue;
    f: ByteValue;
    pc: ByteValue;
    sp: ByteValue;
    bc: ByteValue;
    de: ByteValue;
    af: ByteValue;
    hl: ByteValue;
}
//# sourceMappingURL=registers.d.ts.map