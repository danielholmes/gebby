import { CpuRegisters, Register } from "../cpu/registers";
import { toPairs } from "lodash";
import { ByteValue } from "../types";
import { Mmu } from "../memory/mmu";
import bios from "../bios";
import {
  IOMemory,
  OamMemory,
  VRam,
  WorkingRam,
  ZeroPageRam
} from "../memory/ram";
import { Cpu } from "../cpu";
import { Cartridge } from "../cartridge";

export const createMmu = (): Mmu =>
  new Mmu(
    bios,
    new WorkingRam(),
    new VRam(),
    new IOMemory(),
    new OamMemory(),
    new ZeroPageRam()
  );

export const EMPTY_MEMORY = createMmu();

// Dummy to get around typing
const isRegister = (name: string): name is Register => !!name;

export const createCpuWithRegisters = (
  withRegisters: Partial<CpuRegisters>
): Cpu => {
  const cpu = new Cpu();
  toPairs(withRegisters).forEach(([register, value]) => {
    if (isRegister(register) && typeof value !== "undefined") {
      cpu.registers[register] = value;
    }
  });
  return cpu;
};

export const createCpuRegistersWithRegisters = (
  withRegisters: Partial<CpuRegisters>
): CpuRegisters => {
  return createCpuWithRegisters(withRegisters).registers;
};

export const createMmuWithValues = (values: {
  [address: number]: ByteValue;
}): Mmu => {
  const mmu = createMmu();
  toPairs(values).forEach(([address, value]) =>
    mmu.writeByte(parseInt(address), value)
  );
  return mmu;
};

export const createMmuWithCartridgeAndValues = (
  cartridge: Cartridge,
  values?: { [address: number]: ByteValue }
): Mmu => {
  const mmu = createMmuWithValues(values || {});
  mmu.loadCartridge(cartridge);
  return mmu;
};

// TODO:
export const createMemorySnapshot = (mmu: Mmu): string => {
  return typeof mmu;
};

// TODO:
export const createCpuSnapshot = (cpu: Cpu): string => {
  return typeof cpu;
};
