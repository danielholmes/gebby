"use strict";

var _core = require("@gebby/core");

var _lodash = require("lodash");

/* const cartridge = new Cartridge(
  new Uint8Array([
    0x00, // 0x0100
    0x00, // 0x0101
    0x00, // 0x0102
    0xce, // 0x0104
    0xed,
    0x66,
    0x66,
    0xcc,
    0x0d,
    0x00,
    0x0b,
    0x03,
    0x73,
    0x00,
    0x83,
    0x00,
    0x0c,
    0x00,
    0x0d,
    0x00,
    0x08,
    0x11,
    0x1f,
    0x88,
    0x89,
    0x00,
    0x0e,
    0xdc,
    0xcc,
    0x6e,
    0xe6,
    0xdd,
    0xdd,
    0xd9,
    0x99,
    0xbb,
    0xbb,
    0x67,
    0x63,
    0x6e,
    0x0e,
    0xec,
    0xcc,
    0xdd,
    0xdc,
    0x99,
    0x9f,
    0xbb,
    0xb9,
    0x33,
    0x3e
  ])
);*/
var vRam = _core.VRam.initializeRandomly();

var mmu = new _core.Mmu(_core.bios, new _core.WorkingRam(), vRam, new _core.IOMemory(), new _core.OamMemory(), new _core.ZeroPageRam());
var screen = {
  setPixel: function setPixel() {// TODO:
  }
};
var cpu = new _core.Cpu();
var device = new _core.Device(cpu, new _core.Gpu(mmu, screen), mmu);
device.turnOn(); // process.stdout.write instead of console.log
// Clear: console.log('\033c')
// Alt: console.log('\033c\033[3J')
// Console pixels: console.log('\u2591', '\u2592', '\u2588');

var TOTAL = 250000;

for (var i = 0; i < TOTAL; i++) {
  var opCode = mmu.readByte(cpu.registers.pc);
  /*console.log(
    i.toString() + ")",
    "@0x" + cpu.registers.pc.toString(16),
    "0x" + opCode.toString(16),
    cpu.getInstructionLabel(opCode)
  );*/

  device.tickCycle(); // if (i % 1000 === 0 || i === (TOTAL - 1)) {
  //   const values = vRam.getValues();
  //   const filled: { [address: number]: number } = {};
  //   for (let j = 0; j < values.length; j++) {
  //     if (values[j] !== 0) {
  //       filled[j] = values[j];
  //     }
  //   }
  //   const addresses = Object.keys(filled).map((k) => parseInt(k)).sort();
  //   console.log("MEM", addresses.length);
  //   if (addresses.length > 0) {
  //     const V_RAM_BASE = 0x8000;
  //     console.log(
  //       "  0x" + (addresses.sort()[0] + V_RAM_BASE).toString(16),
  //       "(0x" + filled[addresses[0]].toString(16) + ")",
  //       "-",
  //       "0x" + (addresses[addresses.length - 1] + V_RAM_BASE).toString(16)
  //     );
  //   }
  //   // console.log(
  //   //   sortBy(
  //   //     toPairs(filled),
  //   //     ([address, ]) => address
  //   //   )
  //   //     .map(([address, value]) =>
  //   //       `0x${parseInt(address).toString(16)}: 0x${value.toString(16)}`
  //   //     )
  //   //     .join(' ')
  //   // );
  // }
}

var pixelToOutChar = function pixelToOutChar(color) {
  switch (color) {
    case 3:
      return "\u2588";

    case 2:
      return "\u2592";

    case 1:
      return "\u2591";
  }

  return " ";
};

var tileToString = function tileToString(tile) {
  return tile.map(function (r) {
    return r.map(pixelToOutChar).join('');
  }).join("\n");
};

console.log("\u2591", "\u2592", "\u2588");
console.log("bg & window palette", mmu.bGP.toString(2));
console.log("table 1 tiles:");
(0, _lodash.range)(0, 255).forEach(function (i) {
  var tile = vRam.getTileDataFromTable1(i);

  if ((0, _lodash.flatMap)(tile).some(function (c) {
    return c !== 0;
  })) {
    console.log(i + ')');
    console.log(tileToString(tile));
  }
});
console.log("table 2 tiles:");
(0, _lodash.range)(0, 255).forEach(function (i) {
  var tile = vRam.getTileDataFromTable2(i);

  if ((0, _lodash.flatMap)(tile).some(function (c) {
    return c !== 0;
  })) {
    console.log(i + ')');
    console.log(tileToString(tile));
  }
});
console.log("done");
//# sourceMappingURL=index.js.map