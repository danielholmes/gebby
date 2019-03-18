import { Gpu } from "./gpu";
import { Mmu } from "./memory/mmu";
import { Cpu } from "./cpu";
import { Cartridge } from "./cartridge";

const CLOCK_SPEED = 4194304; // MHz

export class Device {
  private readonly cpu: Cpu;
  private readonly gpu: Gpu;
  private readonly mmu: Mmu;
  private _isOn: boolean;

  public constructor(cpu: Cpu, gpu: Gpu, mmu: Mmu) {
    this.cpu = cpu;
    this.gpu = gpu;
    this.mmu = mmu;
    this._isOn = false;
  }

  public get isOn(): boolean {
    return this._isOn;
  }

  public insertCartridge(cartridge: Cartridge): void {
    if (this.isOn) {
      throw new Error(`Can't insert cartridge while on`);
    }
    console.log("TODO: Cart insert if not present", typeof cartridge);
  }

  public removeCartridge(): void {
    if (this.isOn) {
      throw new Error(`Can't remove cartridge while on`);
    }
    console.log("TODO: Cart remove if present");
  }

  public turnOn(): void {
    if (this.isOn) {
      throw new Error("Already on");
    }
    this._isOn = true;
  }

  public turnOff(): void {
    if (!this.isOn) {
      throw new Error("Already off");
    }
    this._isOn = false;
  }

  /**
   * Ticks all components in parallel
   * @param ms
   */
  public tick(ms: number): void {
    if (!this.isOn) {
      throw new Error("Not powered on");
    }

    const numClockCycles = CLOCK_SPEED * ms;
    // TODO:
    /*
      All are running in parallel so should:
        - each device run for one machine cycle (4 clock cycles)
        - run for number of machine cycles that will fit into ms
        - each device should run up to the current cycles, but never beyond
          - cpu should have everything broken down in to low level operations,
            including instruction fetch
            - each instruction then pushes low level ops on to todo stack
            - low level op can be 4 clock cycles, or 0
            - when todo stack empty, add fetch instruction low level op
     */
    this.cpu.tick(this.mmu, numClockCycles);
    this.gpu.tick(numClockCycles);
    // TODO: Timer
    // TODO: Interrupts
  }

  public tickCycle(): void {
    this.cpu.tick(this.mmu, 1);
    this.gpu.tick(1);
    // TODO: Timer
    // TODO: Interrupts
  }

  public pressButton(button: string): void {
    console.log("TODO: pressButton", button);
  }

  public releaseButton(button: string): void {
    console.log("TODO: releaseButton", button);
  }
}
