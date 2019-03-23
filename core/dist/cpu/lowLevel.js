"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DecrementRegister = exports.XOrRegister = exports.IncrementRegister = exports.LoadWordOperandHighByte = exports.LoadOperand = exports.SetRegister = exports.WriteMemoryWordLowByteFromStackPointer = exports.WriteMemoryWordHighByteFromStackPointer = exports.InternalDelay = exports.WriteMemoryFromRegisterAddress = exports.WriteMemoryLowByteFromOperandAddress = exports.WriteMemoryHighByteFromOperandAddress = exports.StoreInRegister = exports.WriteWordFromOperandAddress = exports.WriteByteFromOperandAddress = exports.ByteValueToSignedByte = exports.JrCheck = exports.JR_FLAGS = exports.BitFlags = exports.WriteWordFromGroupedRegisterAddress = exports.ReadMemory = exports.ReadMemoryWord = exports.RotateLeftThroughCarry = exports.CompareToRegister = exports.LoadRegister = void 0;

var _registers = require("./registers");

var _types = require("../types");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LoadRegister =
/*#__PURE__*/
function () {
  function LoadRegister(register) {
    _classCallCheck(this, LoadRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(LoadRegister, [{
    key: "execute",
    value: function execute(cpu) {
      return cpu.registers[this.register];
    }
  }]);

  return LoadRegister;
}();

exports.LoadRegister = LoadRegister;

var CompareToRegister =
/*#__PURE__*/
function () {
  function CompareToRegister(register) {
    _classCallCheck(this, CompareToRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(CompareToRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("Undefined value");
      }

      var previous = cpu.registers[this.register];
      var next = previous - value;
      cpu.registers.setFFromParts(next === 0x00, 1, (previous & 0xf) - (value & 0xf) < 0, next < 0);
      return next;
    }
  }]);

  return CompareToRegister;
}();

exports.CompareToRegister = CompareToRegister;

var RotateLeftThroughCarry =
/*#__PURE__*/
function () {
  function RotateLeftThroughCarry(register) {
    _classCallCheck(this, RotateLeftThroughCarry);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(RotateLeftThroughCarry, [{
    key: "execute",
    value: function execute(cpu) {
      var newFC = (cpu.registers[this.register] & 1 << 7) !== 0 ? 1 : 0;
      var newValue = (cpu.registers[this.register] << 1) + cpu.registers.fC;
      cpu.registers[this.register] = newValue;
      var newF = 0x00;

      if (newFC === 1) {
        newF |= _registers.FLAG_C_MASK;
      } else {
        newF &= ~_registers.FLAG_C_MASK;
      }

      if (newValue === 0) {
        newF |= _registers.FLAG_Z_MASK;
      }

      cpu.registers.f = newF;
    }
  }]);

  return RotateLeftThroughCarry;
}();

exports.RotateLeftThroughCarry = RotateLeftThroughCarry;

var ReadMemoryWord =
/*#__PURE__*/
function () {
  function ReadMemoryWord() {
    _classCallCheck(this, ReadMemoryWord);

    _defineProperty(this, "cycles", 8);
  }

  _createClass(ReadMemoryWord, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return mmu.readBigEndianWord(value);
    }
  }]);

  return ReadMemoryWord;
}();

exports.ReadMemoryWord = ReadMemoryWord;

var ReadMemory =
/*#__PURE__*/
function () {
  function ReadMemory() {
    _classCallCheck(this, ReadMemory);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(ReadMemory, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return mmu.readByte(value);
    }
  }]);

  return ReadMemory;
}();

exports.ReadMemory = ReadMemory;

var WriteWordFromGroupedRegisterAddress =
/*#__PURE__*/
function () {
  function WriteWordFromGroupedRegisterAddress(register) {
    _classCallCheck(this, WriteWordFromGroupedRegisterAddress);

    _defineProperty(this, "cycles", 4);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(WriteWordFromGroupedRegisterAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = cpu.registers[this.register];
      mmu.writeByte(address, value);
    }
  }]);

  return WriteWordFromGroupedRegisterAddress;
}();

exports.WriteWordFromGroupedRegisterAddress = WriteWordFromGroupedRegisterAddress;

var BitFlags =
/*#__PURE__*/
function () {
  function BitFlags(register) {
    _classCallCheck(this, BitFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(BitFlags, [{
    key: "execute",
    value: function execute(cpu) {
      var t = cpu.registers[this.register] & _registers.FLAG_Z_MASK;
      var flag = 0x20 + (((t & 0xff) === 0 ? 1 : 0) << _registers.FLAG_Z_BIT);
      cpu.registers.f &= 0x10;
      cpu.registers.f |= flag;
    }
  }]);

  return BitFlags;
}();

exports.BitFlags = BitFlags;
var JR_FLAGS = ['fNz', 'fZ', 'fC', 'fNc'];
exports.JR_FLAGS = JR_FLAGS;

var JrCheck =
/*#__PURE__*/
function () {
  function JrCheck(flag) {
    _classCallCheck(this, JrCheck);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "flag", void 0);

    this.flag = flag;
  }

  _createClass(JrCheck, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      if (this.flag) {
        // TODO: Becomes a longer cycle operation, in internal
        cpu.registers.pc += value;
      }
    }
  }]);

  return JrCheck;
}();

exports.JrCheck = JrCheck;

var ByteValueToSignedByte =
/*#__PURE__*/
function () {
  function ByteValueToSignedByte() {
    _classCallCheck(this, ByteValueToSignedByte);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(ByteValueToSignedByte, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return (0, _types.byteValueToSignedByte)(value);
    }
  }]);

  return ByteValueToSignedByte;
}();
/**
 * @deprecated should be split
 */


exports.ByteValueToSignedByte = ByteValueToSignedByte;

var WriteByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteByteFromOperandAddress() {
    _classCallCheck(this, WriteByteFromOperandAddress);

    _defineProperty(this, "cycles", 12);
  }

  _createClass(WriteByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = mmu.readBigEndianWord(cpu.registers.pc);
      mmu.writeByte(address, value);
      cpu.registers.pc += 2;
    }
  }]);

  return WriteByteFromOperandAddress;
}();
/**
 * @deprecated should be split
 */


exports.WriteByteFromOperandAddress = WriteByteFromOperandAddress;

var WriteWordFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteWordFromOperandAddress() {
    _classCallCheck(this, WriteWordFromOperandAddress);

    _defineProperty(this, "cycles", 16);
  }

  _createClass(WriteWordFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = mmu.readBigEndianWord(cpu.registers.pc);
      mmu.writeWordBigEndian(address, value);
      cpu.registers.pc += 2;
    }
  }]);

  return WriteWordFromOperandAddress;
}();

exports.WriteWordFromOperandAddress = WriteWordFromOperandAddress;

var StoreInRegister =
/*#__PURE__*/
function () {
  function StoreInRegister(register) {
    _classCallCheck(this, StoreInRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(StoreInRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value not defined");
      }

      cpu.registers[this.register] = value;
    }
  }]);

  return StoreInRegister;
}();

exports.StoreInRegister = StoreInRegister;

var WriteMemoryHighByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteMemoryHighByteFromOperandAddress() {
    _classCallCheck(this, WriteMemoryHighByteFromOperandAddress);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryHighByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var operand = mmu.readByte(cpu.registers.pc);
      mmu.writeByte(0xff00 + operand + 1, value >> 8);
      return value;
    }
  }]);

  return WriteMemoryHighByteFromOperandAddress;
}();

exports.WriteMemoryHighByteFromOperandAddress = WriteMemoryHighByteFromOperandAddress;

var WriteMemoryLowByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteMemoryLowByteFromOperandAddress() {
    _classCallCheck(this, WriteMemoryLowByteFromOperandAddress);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryLowByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var operand = mmu.readByte(cpu.registers.pc);
      mmu.writeByte(0xff00 + operand, value & 255);
      return value;
    }
  }]);

  return WriteMemoryLowByteFromOperandAddress;
}();

exports.WriteMemoryLowByteFromOperandAddress = WriteMemoryLowByteFromOperandAddress;

var WriteMemoryFromRegisterAddress =
/*#__PURE__*/
function () {
  function WriteMemoryFromRegisterAddress(register) {
    _classCallCheck(this, WriteMemoryFromRegisterAddress);

    _defineProperty(this, "cycles", 4);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(WriteMemoryFromRegisterAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeWordBigEndian(0xff00 + cpu.registers[this.register], value);
    }
  }]);

  return WriteMemoryFromRegisterAddress;
}();

exports.WriteMemoryFromRegisterAddress = WriteMemoryFromRegisterAddress;

var InternalDelay =
/*#__PURE__*/
function () {
  function InternalDelay() {
    _classCallCheck(this, InternalDelay);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(InternalDelay, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      return value;
    }
  }]);

  return InternalDelay;
}();

exports.InternalDelay = InternalDelay;

var WriteMemoryWordHighByteFromStackPointer =
/*#__PURE__*/
function () {
  function WriteMemoryWordHighByteFromStackPointer() {
    _classCallCheck(this, WriteMemoryWordHighByteFromStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryWordHighByteFromStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeByte(cpu.registers.sp + 1, value >> 8);
      return value;
    }
  }]);

  return WriteMemoryWordHighByteFromStackPointer;
}();

exports.WriteMemoryWordHighByteFromStackPointer = WriteMemoryWordHighByteFromStackPointer;

var WriteMemoryWordLowByteFromStackPointer =
/*#__PURE__*/
function () {
  function WriteMemoryWordLowByteFromStackPointer() {
    _classCallCheck(this, WriteMemoryWordLowByteFromStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryWordLowByteFromStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeByte(cpu.registers.sp, value & 255);
      return value;
    }
  }]);

  return WriteMemoryWordLowByteFromStackPointer;
}();

exports.WriteMemoryWordLowByteFromStackPointer = WriteMemoryWordLowByteFromStackPointer;

var SetRegister =
/*#__PURE__*/
function () {
  function SetRegister(register, value) {
    _classCallCheck(this, SetRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    _defineProperty(this, "value", void 0);

    this.register = register;
    this.value = value;
  }

  _createClass(SetRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register] = this.value;
    }
  }]);

  return SetRegister;
}();

exports.SetRegister = SetRegister;

var LoadOperand =
/*#__PURE__*/
function () {
  function LoadOperand() {
    _classCallCheck(this, LoadOperand);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadOperand, [{
    key: "execute",
    value: function execute(cpu, mmu) {
      var byte = mmu.readByte(cpu.registers.pc);
      cpu.registers.pc++;
      return byte;
    }
  }]);

  return LoadOperand;
}();

exports.LoadOperand = LoadOperand;

var LoadWordOperandHighByte =
/*#__PURE__*/
function () {
  function LoadWordOperandHighByte() {
    _classCallCheck(this, LoadWordOperandHighByte);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadWordOperandHighByte, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error('value undefined');
      }

      var byte = mmu.readByte(cpu.registers.pc);
      cpu.registers.pc++;
      return (byte << 8) + value;
    }
  }]);

  return LoadWordOperandHighByte;
}();

exports.LoadWordOperandHighByte = LoadWordOperandHighByte;

var IncrementRegister =
/*#__PURE__*/
function () {
  function IncrementRegister(register) {
    _classCallCheck(this, IncrementRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(IncrementRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      cpu.registers[this.register]++;
      return value;
    }
  }]);

  return IncrementRegister;
}();

exports.IncrementRegister = IncrementRegister;

var XOrRegister =
/*#__PURE__*/
function () {
  function XOrRegister(register) {
    _classCallCheck(this, XOrRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(XOrRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers.a = cpu.registers[this.register] & 0xff;
      cpu.registers.f = cpu.registers.a ? 0x00 : 0x80;
    }
  }]);

  return XOrRegister;
}();

exports.XOrRegister = XOrRegister;

var DecrementRegister =
/*#__PURE__*/
function () {
  function DecrementRegister(register) {
    _classCallCheck(this, DecrementRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(DecrementRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      cpu.registers[this.register]--;
      return value;
    }
  }]);

  return DecrementRegister;
}();

exports.DecrementRegister = DecrementRegister;
//# sourceMappingURL=lowLevel.js.map