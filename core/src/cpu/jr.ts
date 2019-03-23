import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { JrFlag } from "./lowLevel";

export const createJrN = (opCode: OpCode, flag: JrFlag): Instruction =>
  new InstructionDefinition(opCode, `JR ${flag},nn`)
    .loadSignedByteOperand()
    .jrCheck(flag);

// M = 1: n read: memory access
// ; cc matches or unconditional
// M = 2: internal delay
