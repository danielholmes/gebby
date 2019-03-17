import { Cpu, Cycles } from './types'
import { Memory } from '../memory'
import { ByteRegister } from './registers'
import { getGroupedRegister, GroupedWordRegister, setGroupedRegister } from './groupedRegisters'
import { ByteValue, formatByte, formatWord, WordValue } from '../types'

export type LowLevelState = ByteValue | WordValue | undefined
export type LowLevelStateReturn = ByteValue | WordValue | void

export interface LowLevelOperation
{
  readonly cycles: Cycles;
  readonly execute: (cpu: Cpu, memory: Memory, value: LowLevelState) => LowLevelStateReturn;
}

export class LoadRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 0
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, state: LowLevelState): LowLevelStateReturn {
    return cpu.registers[this.register]
  }
}

export class ReadMemory implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    return memory.readByte(value)
  }
}

export class LoadGroupedRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 0
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    return getGroupedRegister(cpu, this.register)
  }
}

export class WriteMemoryFromGroupedRegisterAddress implements LowLevelOperation
{
  public readonly cycles: Cycles = 8
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    const address = getGroupedRegister(cpu, this.register)
    memory.writeByte(address, value)
  }
}

const FLAG_Z = 7

export class BitFlags implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const t = cpu.registers[this.register] & (1 << 7)
    const flag = 0x0010 + (((t & 0xFF) === 0 ? 1 : 0) << FLAG_Z)
    cpu.registers.f &= 0x0001
    cpu.registers.f |= flag
  }
}

export class WriteMemoryFromProgramWordAddress implements LowLevelOperation
{
  public readonly cycles: Cycles = 16

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    const address = memory.readWord(cpu.registers.pc)
    memory.writeByte(address, value)
    cpu.registers.pc += 2
  }
}

export class StoreInRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value not defined')
    }
    cpu.registers[this.register] = value & 255
  }
}

export class StoreInGroupedRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value not defined')
    }
    setGroupedRegister(cpu, this.register, value)
  }
}

export class DecrementStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 4
  private readonly amount: WordValue

  public constructor(amount: WordValue)
  {
    this.amount = amount
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    cpu.registers.sp -= this.amount
  }
}

export class LoadProgramCounter implements LowLevelOperation {
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    return cpu.registers.pc
  }
}

export class WriteMemoryFromStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 16

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    memory.writeWord(cpu.registers.sp, value)
  }
}

export class StoreInStackPointer implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value not defined')
    }
    cpu.registers.sp = value
  }
}

export class SetProgramCounter implements LowLevelOperation
{
  public readonly cycles: Cycles = 8
  private readonly value: WordValue

  public constructor(value: WordValue) {
    this.value = value
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    cpu.registers.pc = this.value
  }
}

export class LoadProgramByte implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const byte = memory.readByte(cpu.registers.pc)
    cpu.registers.pc = (cpu.registers.pc + 1) & 0xFFFF // Mask to 16 bits
    return byte
  }
}

export class LoadProgramWord implements LowLevelOperation
{
  public readonly cycles: Cycles = 8

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const byte = memory.readWord(cpu.registers.pc)
    cpu.registers.pc = (cpu.registers.pc + 2) & 0xFFFF // Mask to 16 bits
    return byte
  }
}

export class IncrementGroupedRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister) {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    setGroupedRegister(cpu, this.register, getGroupedRegister(cpu, this.register) + 1)
  }
}

export class XOrRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    cpu.registers.a = cpu.registers[this.register] & 0xFF
    cpu.registers.f = cpu.registers.a ? 0x00 : 0x80
  }
}

export class Nop implements LowLevelOperation {
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
  }
}

export class IncrementStackPointer implements LowLevelOperation
{
  public readonly cycles: Cycles = 8

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    cpu.registers.sp++
  }
}

export class LoadStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    return cpu.registers.sp
  }
}

export class DecrementRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    cpu.registers[this.register]--
  }
}

export class DecrementGroupedRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    setGroupedRegister(cpu, this.register, getGroupedRegister(cpu, this.register) - 1)
  }
}
