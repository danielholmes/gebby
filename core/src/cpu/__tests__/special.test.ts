/* global describe, test, expect */

import { Mmu } from "../../memory";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import { createNop } from "../special";
import { createMmu, EMPTY_MEMORY } from "../../test/help";

describe("special", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = createCpu();
    mmu = createMmu();
  });

  describe("createNop", () => {
    test("success", () => {
      const instruction = createNop(0x00);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(createCpu());
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });
});