import { ByteValue, MemoryAddress, numberToWordHex, WordValue } from "../types";
import { WorkingRam, VRam, ZeroPageRam, IOMemory, OamMemory } from "./ram";
import { Bios } from "../bios";
import { Cartridge } from "../cartridge";

export const WORKING_RAM_RANGE: Readonly<{ start: MemoryAddress, end: MemoryAddress }> =
  { start: 0xc000, end: 0xe000 };

export class Mmu {
  private readonly bios: Bios;
  private readonly workingRam: WorkingRam;
  private readonly vRam: VRam;
  private readonly io: IOMemory;
  private readonly oam: OamMemory;
  private readonly zeroPage: ZeroPageRam;
  private cartridge?: Cartridge;

  public constructor(
    bios: Bios,
    ram: WorkingRam,
    vRam: VRam,
    io: IOMemory,
    oam: OamMemory,
    zeroPage: ZeroPageRam,
    cartridge?: Cartridge
  ) {
    this.bios = bios;
    this.workingRam = ram;
    this.vRam = vRam;
    this.oam = oam;
    this.io = io;
    this.zeroPage = zeroPage;
    this.cartridge = cartridge;
  }

  public get isInBios(): boolean {
    return this.readByte(0xff50) === 0x00;
  }

  public get bGP(): ByteValue {
    return this.readByte(0xff47);
  }

  public get scY(): ByteValue {
    return this.readByte(0xff42);
  }

  public get scX(): ByteValue {
    return this.readByte(0xff43);
  }

  public get workingRamValues(): Uint8Array {
    return this.workingRam.getValues();
  }

  public loadCartridge(cartridge: Cartridge): void {
    this.cartridge = cartridge;
  }

  // TODO: Test access and shadowing
  public readByte(address: MemoryAddress): ByteValue {
    if (address >= 0x0000 && address <= 0x00ff && this.isInBios) {
      return this.bios.readByte(address);
    }
    if (address >= 0x0000 && address <= 0x7fff) {
      if (!this.cartridge) {
        return 0x00;
      }
      return this.cartridge.readByte(address);
    }
    if (address >= 0x8000 && address < 0xa000) {
      return this.vRam.readByte(address - 0x8000);
    }
    if (address >= 0xa000 && address < WORKING_RAM_RANGE.start) {
      throw new Error("TODO: Access memory on cartridge");
    }
    if (address >= WORKING_RAM_RANGE.start && address <= WORKING_RAM_RANGE.end) {
      return this.workingRam.readByte(address - WORKING_RAM_RANGE.start);
    }
    // Shadow of working ram
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.workingRam.readByte(address - 0xe000);
    }
    if (address >= 0xff80 && address <= 0xffff) {
      return this.zeroPage.readByte(address - 0xff80);
    }
    if (address >= 0xfe00 && address <= 0xfe9f) {
      return this.oam.readByte(address - 0xfe00);
    }
    if (address >= 0xfea0 && address <= 0xfeff) {
      // Unused space
      return 0;
    }
    if (address >= 0xfe00 && address <= 0xfe9f) {
      // Graphics: sprite information: Data about the sprites rendered by the graphics chip are held here, including the
      // sprites' positions and attributes.
      throw new Error("graphics mem not yet implemented");
    }
    if (address >= 0xff00 && address <= 0xff7f) {
      return this.io.readByte(address - 0xff00);
    }

    throw new Error("Address not readable");
  }

  /**
   * @deprecated should be done separate
   * @param address
   */
  public readBigEndianWord(address: MemoryAddress): WordValue {
    return (this.readByte(address + 1) << 8) + this.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    if (address === 0xff50) {
      console.log('Writing bios', value.toString(16))
    }

    if (address >= 0x8000 && address <= 0x9fff) {
      this.vRam.writeByte(address - 0x8000, value);
    } else if (address >= 0xa000 && address <= 0xbfff) {
      throw new Error(
        `Cannot write to ${numberToWordHex(address)} which is on cartridge`
      );
    } else if (address >= 0xc000 && address <= 0xdfff) {
      this.workingRam.writeByte(address - 0xc000, value);
    } else if (address >= 0xe000 && address <= 0xfdff) {
      this.workingRam.writeByte(address - 0xe000, value);
    } else if (address >= 0xff80 && address <= 0xffff) {
      this.zeroPage.writeByte(address - 0xff80, value);
    } else if (address >= 0xff00 && address <= 0xff7f) {
      this.io.writeByte(address - 0xff00, value);
    } else if (address >= 0xfe00 && address <= 0xfe9f) {
      this.oam.writeByte(address - 0xfe00, value);
    } else if (address >= 0xfea0 && address <= 0xfeff) {
      // Unused space, do nothing
    } else {
      throw new Error(`Can't write address ${numberToWordHex(address)}`);
    }
  }

  /**
   * @deprecated Should always be split up in usage
   * @param address
   * @param value
   */
  public writeWordBigEndian(address: MemoryAddress, value: WordValue): void {
    this.writeByte(address + 1, value >> 8);
    this.writeByte(address, value & 255);
  }
}
