/* global describe, test, expect */

import { Memory, create as createMemory, writeByte } from '../../memory'
import { toPairs } from 'lodash'
import bios from '../../bios'
import { create as createCpu, runInstruction } from '../'
import { CpuRegisters } from '../registers'
import { Cpu } from '../types'

const createCpuWithRegisters = (withRegisters: Partial<CpuRegisters>): Cpu => {
  const cpu = createCpu()
  return {
    ...cpu,
    registers: {
      ...cpu.registers,
      ...withRegisters
    }
  }
}

const createMemoryWithValues = (values: { [address: number]: number }): Memory => {
  const memory = createMemory()
  toPairs(values)
    .forEach(([address, value]) => writeByte(memory, parseInt(address), value))
  return memory
}

describe('cpu', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = createMemory()
  })

  describe('runInstruction', () => {
    test('runs NOP', () => {
      writeByte(memory, 0x10, 0x00)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x11 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x00 }))
    })

    test('runs single operand', () => {
      writeByte(memory, 0x10, 0x06)
      writeByte(memory, 0x11, 0x66)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })

    test('runs smoke test on bios', () => {
      bios.forEach((value, address) => {
        writeByte(memory, address, value)
      })

      while (cpu.registers.pc < bios.length) {
        console.log(cpu.registers.pc, bios.length)
        runInstruction(cpu, memory)
      }

      // expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      // expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })
  })
})