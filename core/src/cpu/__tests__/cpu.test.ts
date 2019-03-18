/* global describe, test, expect */

import { Memory } from '../../memory'
import bios from '../../bios'
import { create as createCpu, runInstruction } from '../'
import { Cpu } from '../types'
import { createCpuWithRegisters, createMemoryWithValues } from '../../test/help'
import { numberToByteHex, numberToWordHex } from '../../types'

describe('cpu', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('runInstruction', () => {
    test('runs NOP', () => {
      memory.writeByte(0x10, 0x00)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x11 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x00 }))
    })

    test('runs single operand', () => {
      memory.writeByte(0x10, 0x06)
      memory.writeByte(0x11, 0x66)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })

    test('runs smoke test on bios', () => {
      bios.forEach((value, address) => {
        memory.writeByte(address, value)
      })

      let num = 0
      while (cpu.registers.pc <= bios.length && num < 100) {
        num++
        console.log(
          'PC ' + numberToWordHex(cpu.registers.pc),
          'OP ' + numberToByteHex(memory.readByte(cpu.registers.pc)) +
          (memory.readByte(cpu.registers.pc) === 0xCB ? ' ' + numberToByteHex(memory.readByte(cpu.registers.pc + 1)) : ''),
          'Bios length: ' + bios.length
        )
        /*console.log(
          sortBy(
            toPairs(memory.getValues())
              .filter(([, value]) => value !== undefined),
            ([address, ]) => address
          )
            .filter(([address,]) => parseInt(address) >= 0xFF)
            .map(([address, value]) =>
              `${numberToWordHex(parseInt(address))}: ${numberToByteHex(value)}`
            )
        )*/
        runInstruction(cpu, memory)
      }

      // expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      // expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })
  })
})
