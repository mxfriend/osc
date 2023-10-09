import { BufferInterface } from './buffer';
import { OSCColorValue, OSCMIDIValue } from './values';
import {
  OSCInt,
  OSCFloat,
  OSCString,
  OSCBlob,
  OSCBigInt,
  OSCTimeTag,
  OSCDouble,
  OSCSymbol,
  OSCChar,
  OSCColor,
  OSCMIDI,
  OSCBool,
  OSCInfinity,
  OSCNull,
} from './types';

export type TypeTag =
  | 'i'
  | 'f'
  | 's'
  | 'b'
  | 'h'
  | 't'
  | 'd'
  | 'S'
  | 'c'
  | 'r'
  | 'm'
  | 'B'
  | 'I'
  | 'iN'
  | 'fN'
  | 'sN'
  | 'bN'
  | 'hN'
  | 'tN'
  | 'dN'
  | 'SN'
  | 'cN'
  | 'rN'
  | 'mN'
  | 'BN'
  | 'IN'
  | 'if'
  | 'is'
  | 'ib'
  | 'ih'
  | 'it'
  | 'id'
  | 'iS'
  | 'ic'
  | 'ir'
  | 'im'
  | 'iB'
  | 'iI'
  | 'fi'
  | 'fs'
  | 'fb'
  | 'fh'
  | 'ft'
  | 'fd'
  | 'fS'
  | 'fc'
  | 'fr'
  | 'fm'
  | 'fB'
  | 'fI'
  | 'si'
  | 'sf'
  | 'sb'
  | 'sh'
  | 'st'
  | 'sd'
  | 'sS'
  | 'sc'
  | 'sr'
  | 'sm'
  | 'sB'
  | 'sI'
  | 'bi'
  | 'bf'
  | 'bs'
  | 'bh'
  | 'bt'
  | 'bd'
  | 'bS'
  | 'bc'
  | 'br'
  | 'bm'
  | 'bB'
  | 'bI'
  | 'hi'
  | 'hf'
  | 'hs'
  | 'hb'
  | 'ht'
  | 'hd'
  | 'hS'
  | 'hc'
  | 'hr'
  | 'hm'
  | 'hB'
  | 'hI'
  | 'ti'
  | 'tf'
  | 'ts'
  | 'tb'
  | 'th'
  | 'td'
  | 'tS'
  | 'tc'
  | 'tr'
  | 'tm'
  | 'tB'
  | 'tI'
  | 'di'
  | 'df'
  | 'ds'
  | 'db'
  | 'dh'
  | 'dt'
  | 'dS'
  | 'dc'
  | 'dr'
  | 'dm'
  | 'dB'
  | 'dI'
  | 'Si'
  | 'Sf'
  | 'Ss'
  | 'Sb'
  | 'Sh'
  | 'St'
  | 'Sd'
  | 'Sc'
  | 'Sr'
  | 'Sm'
  | 'SB'
  | 'SI'
  | 'ci'
  | 'cf'
  | 'cs'
  | 'cb'
  | 'ch'
  | 'ct'
  | 'cd'
  | 'cS'
  | 'cr'
  | 'cm'
  | 'cB'
  | 'cI'
  | 'ri'
  | 'rf'
  | 'rs'
  | 'rb'
  | 'rh'
  | 'rt'
  | 'rd'
  | 'rS'
  | 'rc'
  | 'rm'
  | 'rB'
  | 'rI'
  | 'mi'
  | 'mf'
  | 'ms'
  | 'mb'
  | 'mh'
  | 'mt'
  | 'md'
  | 'mS'
  | 'mc'
  | 'mr'
  | 'mB'
  | 'mI'
  | 'Bi'
  | 'Bf'
  | 'Bs'
  | 'Bb'
  | 'Bh'
  | 'Bt'
  | 'Bd'
  | 'BS'
  | 'Bc'
  | 'Br'
  | 'Bm'
  | 'BI'
  | 'Ii'
  | 'If'
  | 'Is'
  | 'Ib'
  | 'Ih'
  | 'It'
  | 'Id'
  | 'IS'
  | 'Ic'
  | 'Ir'
  | 'Im'
  | 'IB'
  | 'ifN'
  | 'isN'
  | 'ibN'
  | 'ihN'
  | 'itN'
  | 'idN'
  | 'iSN'
  | 'icN'
  | 'irN'
  | 'imN'
  | 'iBN'
  | 'iIN'
  | 'fiN'
  | 'fsN'
  | 'fbN'
  | 'fhN'
  | 'ftN'
  | 'fdN'
  | 'fSN'
  | 'fcN'
  | 'frN'
  | 'fmN'
  | 'fBN'
  | 'fIN'
  | 'siN'
  | 'sfN'
  | 'sbN'
  | 'shN'
  | 'stN'
  | 'sdN'
  | 'sSN'
  | 'scN'
  | 'srN'
  | 'smN'
  | 'sBN'
  | 'sIN'
  | 'biN'
  | 'bfN'
  | 'bsN'
  | 'bhN'
  | 'btN'
  | 'bdN'
  | 'bSN'
  | 'bcN'
  | 'brN'
  | 'bmN'
  | 'bBN'
  | 'bIN'
  | 'hiN'
  | 'hfN'
  | 'hsN'
  | 'hbN'
  | 'htN'
  | 'hdN'
  | 'hSN'
  | 'hcN'
  | 'hrN'
  | 'hmN'
  | 'hBN'
  | 'hIN'
  | 'tiN'
  | 'tfN'
  | 'tsN'
  | 'tbN'
  | 'thN'
  | 'tdN'
  | 'tSN'
  | 'tcN'
  | 'trN'
  | 'tmN'
  | 'tBN'
  | 'tIN'
  | 'diN'
  | 'dfN'
  | 'dsN'
  | 'dbN'
  | 'dhN'
  | 'dtN'
  | 'dSN'
  | 'dcN'
  | 'drN'
  | 'dmN'
  | 'dBN'
  | 'dIN'
  | 'SiN'
  | 'SfN'
  | 'SsN'
  | 'SbN'
  | 'ShN'
  | 'StN'
  | 'SdN'
  | 'ScN'
  | 'SrN'
  | 'SmN'
  | 'SBN'
  | 'SIN'
  | 'ciN'
  | 'cfN'
  | 'csN'
  | 'cbN'
  | 'chN'
  | 'ctN'
  | 'cdN'
  | 'cSN'
  | 'crN'
  | 'cmN'
  | 'cBN'
  | 'cIN'
  | 'riN'
  | 'rfN'
  | 'rsN'
  | 'rbN'
  | 'rhN'
  | 'rtN'
  | 'rdN'
  | 'rSN'
  | 'rcN'
  | 'rmN'
  | 'rBN'
  | 'rIN'
  | 'miN'
  | 'mfN'
  | 'msN'
  | 'mbN'
  | 'mhN'
  | 'mtN'
  | 'mdN'
  | 'mSN'
  | 'mcN'
  | 'mrN'
  | 'mBN'
  | 'mIN'
  | 'BiN'
  | 'BfN'
  | 'BsN'
  | 'BbN'
  | 'BhN'
  | 'BtN'
  | 'BdN'
  | 'BSN'
  | 'BcN'
  | 'BrN'
  | 'BmN'
  | 'BIN'
  | 'IiN'
  | 'IfN'
  | 'IsN'
  | 'IbN'
  | 'IhN'
  | 'ItN'
  | 'IdN'
  | 'ISN'
  | 'IcN'
  | 'IrN'
  | 'ImN'
  | 'IBN';

export interface TypeMap {
  i: number;
  f: number;
  s: string;
  b: BufferInterface;
  h: bigint;
  t: bigint;
  d: number;
  S: string;
  c: string;
  r: OSCColorValue;
  m: OSCMIDIValue;
  B: boolean;
  I: number;
  iN: number | null;
  fN: number | null;
  sN: string | null;
  bN: BufferInterface | null;
  hN: bigint | null;
  tN: bigint | null;
  dN: number | null;
  SN: string | null;
  cN: string | null;
  rN: OSCColorValue | null;
  mN: OSCMIDIValue | null;
  BN: boolean | null;
  IN: number | null;
  if: number;
  is: number | string;
  ib: number | BufferInterface;
  ih: number | bigint;
  it: number | bigint;
  id: number;
  iS: number | string;
  ic: number | string;
  ir: number | OSCColorValue;
  im: number | OSCMIDIValue;
  iB: number | boolean;
  iI: number;
  fi: number;
  fs: number | string;
  fb: number | BufferInterface;
  fh: number | bigint;
  ft: number | bigint;
  fd: number;
  fS: number | string;
  fc: number | string;
  fr: number | OSCColorValue;
  fm: number | OSCMIDIValue;
  fB: number | boolean;
  fI: number;
  si: string | number;
  sf: string | number;
  sb: string | BufferInterface;
  sh: string | bigint;
  st: string | bigint;
  sd: string | number;
  sS: string;
  sc: string;
  sr: string | OSCColorValue;
  sm: string | OSCMIDIValue;
  sB: string | boolean;
  sI: string | number;
  bi: BufferInterface | number;
  bf: BufferInterface | number;
  bs: BufferInterface | string;
  bh: BufferInterface | bigint;
  bt: BufferInterface | bigint;
  bd: BufferInterface | number;
  bS: BufferInterface | string;
  bc: BufferInterface | string;
  br: BufferInterface | OSCColorValue;
  bm: BufferInterface | OSCMIDIValue;
  bB: BufferInterface | boolean;
  bI: BufferInterface | number;
  hi: bigint | number;
  hf: bigint | number;
  hs: bigint | string;
  hb: bigint | BufferInterface;
  ht: bigint;
  hd: bigint | number;
  hS: bigint | string;
  hc: bigint | string;
  hr: bigint | OSCColorValue;
  hm: bigint | OSCMIDIValue;
  hB: bigint | boolean;
  hI: bigint | number;
  ti: bigint | number;
  tf: bigint | number;
  ts: bigint | string;
  tb: bigint | BufferInterface;
  th: bigint;
  td: bigint | number;
  tS: bigint | string;
  tc: bigint | string;
  tr: bigint | OSCColorValue;
  tm: bigint | OSCMIDIValue;
  tB: bigint | boolean;
  tI: bigint | number;
  di: number;
  df: number;
  ds: number | string;
  db: number | BufferInterface;
  dh: number | bigint;
  dt: number | bigint;
  dS: number | string;
  dc: number | string;
  dr: number | OSCColorValue;
  dm: number | OSCMIDIValue;
  dB: number | boolean;
  dI: number;
  Si: string | number;
  Sf: string | number;
  Ss: string;
  Sb: string | BufferInterface;
  Sh: string | bigint;
  St: string | bigint;
  Sd: string | number;
  Sc: string;
  Sr: string | OSCColorValue;
  Sm: string | OSCMIDIValue;
  SB: string | boolean;
  SI: string | number;
  ci: string | number;
  cf: string | number;
  cs: string;
  cb: string | BufferInterface;
  ch: string | bigint;
  ct: string | bigint;
  cd: string | number;
  cS: string;
  cr: string | OSCColorValue;
  cm: string | OSCMIDIValue;
  cB: string | boolean;
  cI: string | number;
  ri: OSCColorValue | number;
  rf: OSCColorValue | number;
  rs: OSCColorValue | string;
  rb: OSCColorValue | BufferInterface;
  rh: OSCColorValue | bigint;
  rt: OSCColorValue | bigint;
  rd: OSCColorValue | number;
  rS: OSCColorValue | string;
  rc: OSCColorValue | string;
  rm: OSCColorValue | OSCMIDIValue;
  rB: OSCColorValue | boolean;
  rI: OSCColorValue | number;
  mi: OSCMIDIValue | number;
  mf: OSCMIDIValue | number;
  ms: OSCMIDIValue | string;
  mb: OSCMIDIValue | BufferInterface;
  mh: OSCMIDIValue | bigint;
  mt: OSCMIDIValue | bigint;
  md: OSCMIDIValue | number;
  mS: OSCMIDIValue | string;
  mc: OSCMIDIValue | string;
  mr: OSCMIDIValue | OSCColorValue;
  mB: OSCMIDIValue | boolean;
  mI: OSCMIDIValue | number;
  Bi: boolean | number;
  Bf: boolean | number;
  Bs: boolean | string;
  Bb: boolean | BufferInterface;
  Bh: boolean | bigint;
  Bt: boolean | bigint;
  Bd: boolean | number;
  BS: boolean | string;
  Bc: boolean | string;
  Br: boolean | OSCColorValue;
  Bm: boolean | OSCMIDIValue;
  BI: boolean | number;
  Ii: number;
  If: number;
  Is: number | string;
  Ib: number | BufferInterface;
  Ih: number | bigint;
  It: number | bigint;
  Id: number;
  IS: number | string;
  Ic: number | string;
  Ir: number | OSCColorValue;
  Im: number | OSCMIDIValue;
  IB: number | boolean;
  ifN: number | null;
  isN: number | string | null;
  ibN: number | BufferInterface | null;
  ihN: number | bigint | null;
  itN: number | bigint | null;
  idN: number | null;
  iSN: number | string | null;
  icN: number | string | null;
  irN: number | OSCColorValue | null;
  imN: number | OSCMIDIValue | null;
  iBN: number | boolean | null;
  iIN: number | null;
  fiN: number | null;
  fsN: number | string | null;
  fbN: number | BufferInterface | null;
  fhN: number | bigint | null;
  ftN: number | bigint | null;
  fdN: number | null;
  fSN: number | string | null;
  fcN: number | string | null;
  frN: number | OSCColorValue | null;
  fmN: number | OSCMIDIValue | null;
  fBN: number | boolean | null;
  fIN: number | null;
  siN: string | number | null;
  sfN: string | number | null;
  sbN: string | BufferInterface | null;
  shN: string | bigint | null;
  stN: string | bigint | null;
  sdN: string | number | null;
  sSN: string | null;
  scN: string | null;
  srN: string | OSCColorValue | null;
  smN: string | OSCMIDIValue | null;
  sBN: string | boolean | null;
  sIN: string | number | null;
  biN: BufferInterface | number | null;
  bfN: BufferInterface | number | null;
  bsN: BufferInterface | string | null;
  bhN: BufferInterface | bigint | null;
  btN: BufferInterface | bigint | null;
  bdN: BufferInterface | number | null;
  bSN: BufferInterface | string | null;
  bcN: BufferInterface | string | null;
  brN: BufferInterface | OSCColorValue | null;
  bmN: BufferInterface | OSCMIDIValue | null;
  bBN: BufferInterface | boolean | null;
  bIN: BufferInterface | number | null;
  hiN: bigint | number | null;
  hfN: bigint | number | null;
  hsN: bigint | string | null;
  hbN: bigint | BufferInterface | null;
  htN: bigint | null;
  hdN: bigint | number | null;
  hSN: bigint | string | null;
  hcN: bigint | string | null;
  hrN: bigint | OSCColorValue | null;
  hmN: bigint | OSCMIDIValue | null;
  hBN: bigint | boolean | null;
  hIN: bigint | number | null;
  tiN: bigint | number | null;
  tfN: bigint | number | null;
  tsN: bigint | string | null;
  tbN: bigint | BufferInterface | null;
  thN: bigint | null;
  tdN: bigint | number | null;
  tSN: bigint | string | null;
  tcN: bigint | string | null;
  trN: bigint | OSCColorValue | null;
  tmN: bigint | OSCMIDIValue | null;
  tBN: bigint | boolean | null;
  tIN: bigint | number | null;
  diN: number | null;
  dfN: number | null;
  dsN: number | string | null;
  dbN: number | BufferInterface | null;
  dhN: number | bigint | null;
  dtN: number | bigint | null;
  dSN: number | string | null;
  dcN: number | string | null;
  drN: number | OSCColorValue | null;
  dmN: number | OSCMIDIValue | null;
  dBN: number | boolean | null;
  dIN: number | null;
  SiN: string | number | null;
  SfN: string | number | null;
  SsN: string | null;
  SbN: string | BufferInterface | null;
  ShN: string | bigint | null;
  StN: string | bigint | null;
  SdN: string | number | null;
  ScN: string | null;
  SrN: string | OSCColorValue | null;
  SmN: string | OSCMIDIValue | null;
  SBN: string | boolean | null;
  SIN: string | number | null;
  ciN: string | number | null;
  cfN: string | number | null;
  csN: string | null;
  cbN: string | BufferInterface | null;
  chN: string | bigint | null;
  ctN: string | bigint | null;
  cdN: string | number | null;
  cSN: string | null;
  crN: string | OSCColorValue | null;
  cmN: string | OSCMIDIValue | null;
  cBN: string | boolean | null;
  cIN: string | number | null;
  riN: OSCColorValue | number | null;
  rfN: OSCColorValue | number | null;
  rsN: OSCColorValue | string | null;
  rbN: OSCColorValue | BufferInterface | null;
  rhN: OSCColorValue | bigint | null;
  rtN: OSCColorValue | bigint | null;
  rdN: OSCColorValue | number | null;
  rSN: OSCColorValue | string | null;
  rcN: OSCColorValue | string | null;
  rmN: OSCColorValue | OSCMIDIValue | null;
  rBN: OSCColorValue | boolean | null;
  rIN: OSCColorValue | number | null;
  miN: OSCMIDIValue | number | null;
  mfN: OSCMIDIValue | number | null;
  msN: OSCMIDIValue | string | null;
  mbN: OSCMIDIValue | BufferInterface | null;
  mhN: OSCMIDIValue | bigint | null;
  mtN: OSCMIDIValue | bigint | null;
  mdN: OSCMIDIValue | number | null;
  mSN: OSCMIDIValue | string | null;
  mcN: OSCMIDIValue | string | null;
  mrN: OSCMIDIValue | OSCColorValue | null;
  mBN: OSCMIDIValue | boolean | null;
  mIN: OSCMIDIValue | number | null;
  BiN: boolean | number | null;
  BfN: boolean | number | null;
  BsN: boolean | string | null;
  BbN: boolean | BufferInterface | null;
  BhN: boolean | bigint | null;
  BtN: boolean | bigint | null;
  BdN: boolean | number | null;
  BSN: boolean | string | null;
  BcN: boolean | string | null;
  BrN: boolean | OSCColorValue | null;
  BmN: boolean | OSCMIDIValue | null;
  BIN: boolean | number | null;
  IiN: number | null;
  IfN: number | null;
  IsN: number | string | null;
  IbN: number | BufferInterface | null;
  IhN: number | bigint | null;
  ItN: number | bigint | null;
  IdN: number | null;
  ISN: number | string | null;
  IcN: number | string | null;
  IrN: number | OSCColorValue | null;
  ImN: number | OSCMIDIValue | null;
  IBN: number | boolean | null;
}

export interface ArgMap {
  i: OSCInt;
  f: OSCFloat;
  s: OSCString;
  b: OSCBlob;
  h: OSCBigInt;
  t: OSCTimeTag;
  d: OSCDouble;
  S: OSCSymbol;
  c: OSCChar;
  r: OSCColor;
  m: OSCMIDI;
  B: OSCBool;
  I: OSCInfinity;
  iN: OSCInt | OSCNull;
  fN: OSCFloat | OSCNull;
  sN: OSCString | OSCNull;
  bN: OSCBlob | OSCNull;
  hN: OSCBigInt | OSCNull;
  tN: OSCTimeTag | OSCNull;
  dN: OSCDouble | OSCNull;
  SN: OSCSymbol | OSCNull;
  cN: OSCChar | OSCNull;
  rN: OSCColor | OSCNull;
  mN: OSCMIDI | OSCNull;
  BN: OSCBool | OSCNull;
  IN: OSCInfinity | OSCNull;
  if: OSCInt | OSCFloat;
  is: OSCInt | OSCString;
  ib: OSCInt | OSCBlob;
  ih: OSCInt | OSCBigInt;
  it: OSCInt | OSCTimeTag;
  id: OSCInt | OSCDouble;
  iS: OSCInt | OSCSymbol;
  ic: OSCInt | OSCChar;
  ir: OSCInt | OSCColor;
  im: OSCInt | OSCMIDI;
  iB: OSCInt | OSCBool;
  iI: OSCInt | OSCInfinity;
  fi: OSCFloat | OSCInt;
  fs: OSCFloat | OSCString;
  fb: OSCFloat | OSCBlob;
  fh: OSCFloat | OSCBigInt;
  ft: OSCFloat | OSCTimeTag;
  fd: OSCFloat | OSCDouble;
  fS: OSCFloat | OSCSymbol;
  fc: OSCFloat | OSCChar;
  fr: OSCFloat | OSCColor;
  fm: OSCFloat | OSCMIDI;
  fB: OSCFloat | OSCBool;
  fI: OSCFloat | OSCInfinity;
  si: OSCString | OSCInt;
  sf: OSCString | OSCFloat;
  sb: OSCString | OSCBlob;
  sh: OSCString | OSCBigInt;
  st: OSCString | OSCTimeTag;
  sd: OSCString | OSCDouble;
  sS: OSCString | OSCSymbol;
  sc: OSCString | OSCChar;
  sr: OSCString | OSCColor;
  sm: OSCString | OSCMIDI;
  sB: OSCString | OSCBool;
  sI: OSCString | OSCInfinity;
  bi: OSCBlob | OSCInt;
  bf: OSCBlob | OSCFloat;
  bs: OSCBlob | OSCString;
  bh: OSCBlob | OSCBigInt;
  bt: OSCBlob | OSCTimeTag;
  bd: OSCBlob | OSCDouble;
  bS: OSCBlob | OSCSymbol;
  bc: OSCBlob | OSCChar;
  br: OSCBlob | OSCColor;
  bm: OSCBlob | OSCMIDI;
  bB: OSCBlob | OSCBool;
  bI: OSCBlob | OSCInfinity;
  hi: OSCBigInt | OSCInt;
  hf: OSCBigInt | OSCFloat;
  hs: OSCBigInt | OSCString;
  hb: OSCBigInt | OSCBlob;
  ht: OSCBigInt | OSCTimeTag;
  hd: OSCBigInt | OSCDouble;
  hS: OSCBigInt | OSCSymbol;
  hc: OSCBigInt | OSCChar;
  hr: OSCBigInt | OSCColor;
  hm: OSCBigInt | OSCMIDI;
  hB: OSCBigInt | OSCBool;
  hI: OSCBigInt | OSCInfinity;
  ti: OSCTimeTag | OSCInt;
  tf: OSCTimeTag | OSCFloat;
  ts: OSCTimeTag | OSCString;
  tb: OSCTimeTag | OSCBlob;
  th: OSCTimeTag | OSCBigInt;
  td: OSCTimeTag | OSCDouble;
  tS: OSCTimeTag | OSCSymbol;
  tc: OSCTimeTag | OSCChar;
  tr: OSCTimeTag | OSCColor;
  tm: OSCTimeTag | OSCMIDI;
  tB: OSCTimeTag | OSCBool;
  tI: OSCTimeTag | OSCInfinity;
  di: OSCDouble | OSCInt;
  df: OSCDouble | OSCFloat;
  ds: OSCDouble | OSCString;
  db: OSCDouble | OSCBlob;
  dh: OSCDouble | OSCBigInt;
  dt: OSCDouble | OSCTimeTag;
  dS: OSCDouble | OSCSymbol;
  dc: OSCDouble | OSCChar;
  dr: OSCDouble | OSCColor;
  dm: OSCDouble | OSCMIDI;
  dB: OSCDouble | OSCBool;
  dI: OSCDouble | OSCInfinity;
  Si: OSCSymbol | OSCInt;
  Sf: OSCSymbol | OSCFloat;
  Ss: OSCSymbol | OSCString;
  Sb: OSCSymbol | OSCBlob;
  Sh: OSCSymbol | OSCBigInt;
  St: OSCSymbol | OSCTimeTag;
  Sd: OSCSymbol | OSCDouble;
  Sc: OSCSymbol | OSCChar;
  Sr: OSCSymbol | OSCColor;
  Sm: OSCSymbol | OSCMIDI;
  SB: OSCSymbol | OSCBool;
  SI: OSCSymbol | OSCInfinity;
  ci: OSCChar | OSCInt;
  cf: OSCChar | OSCFloat;
  cs: OSCChar | OSCString;
  cb: OSCChar | OSCBlob;
  ch: OSCChar | OSCBigInt;
  ct: OSCChar | OSCTimeTag;
  cd: OSCChar | OSCDouble;
  cS: OSCChar | OSCSymbol;
  cr: OSCChar | OSCColor;
  cm: OSCChar | OSCMIDI;
  cB: OSCChar | OSCBool;
  cI: OSCChar | OSCInfinity;
  ri: OSCColor | OSCInt;
  rf: OSCColor | OSCFloat;
  rs: OSCColor | OSCString;
  rb: OSCColor | OSCBlob;
  rh: OSCColor | OSCBigInt;
  rt: OSCColor | OSCTimeTag;
  rd: OSCColor | OSCDouble;
  rS: OSCColor | OSCSymbol;
  rc: OSCColor | OSCChar;
  rm: OSCColor | OSCMIDI;
  rB: OSCColor | OSCBool;
  rI: OSCColor | OSCInfinity;
  mi: OSCMIDI | OSCInt;
  mf: OSCMIDI | OSCFloat;
  ms: OSCMIDI | OSCString;
  mb: OSCMIDI | OSCBlob;
  mh: OSCMIDI | OSCBigInt;
  mt: OSCMIDI | OSCTimeTag;
  md: OSCMIDI | OSCDouble;
  mS: OSCMIDI | OSCSymbol;
  mc: OSCMIDI | OSCChar;
  mr: OSCMIDI | OSCColor;
  mB: OSCMIDI | OSCBool;
  mI: OSCMIDI | OSCInfinity;
  Bi: OSCBool | OSCInt;
  Bf: OSCBool | OSCFloat;
  Bs: OSCBool | OSCString;
  Bb: OSCBool | OSCBlob;
  Bh: OSCBool | OSCBigInt;
  Bt: OSCBool | OSCTimeTag;
  Bd: OSCBool | OSCDouble;
  BS: OSCBool | OSCSymbol;
  Bc: OSCBool | OSCChar;
  Br: OSCBool | OSCColor;
  Bm: OSCBool | OSCMIDI;
  BI: OSCBool | OSCInfinity;
  Ii: OSCInfinity | OSCInt;
  If: OSCInfinity | OSCFloat;
  Is: OSCInfinity | OSCString;
  Ib: OSCInfinity | OSCBlob;
  Ih: OSCInfinity | OSCBigInt;
  It: OSCInfinity | OSCTimeTag;
  Id: OSCInfinity | OSCDouble;
  IS: OSCInfinity | OSCSymbol;
  Ic: OSCInfinity | OSCChar;
  Ir: OSCInfinity | OSCColor;
  Im: OSCInfinity | OSCMIDI;
  IB: OSCInfinity | OSCBool;
  ifN: OSCInt | OSCFloat | OSCNull;
  isN: OSCInt | OSCString | OSCNull;
  ibN: OSCInt | OSCBlob | OSCNull;
  ihN: OSCInt | OSCBigInt | OSCNull;
  itN: OSCInt | OSCTimeTag | OSCNull;
  idN: OSCInt | OSCDouble | OSCNull;
  iSN: OSCInt | OSCSymbol | OSCNull;
  icN: OSCInt | OSCChar | OSCNull;
  irN: OSCInt | OSCColor | OSCNull;
  imN: OSCInt | OSCMIDI | OSCNull;
  iBN: OSCInt | OSCBool | OSCNull;
  iIN: OSCInt | OSCInfinity | OSCNull;
  fiN: OSCFloat | OSCInt | OSCNull;
  fsN: OSCFloat | OSCString | OSCNull;
  fbN: OSCFloat | OSCBlob | OSCNull;
  fhN: OSCFloat | OSCBigInt | OSCNull;
  ftN: OSCFloat | OSCTimeTag | OSCNull;
  fdN: OSCFloat | OSCDouble | OSCNull;
  fSN: OSCFloat | OSCSymbol | OSCNull;
  fcN: OSCFloat | OSCChar | OSCNull;
  frN: OSCFloat | OSCColor | OSCNull;
  fmN: OSCFloat | OSCMIDI | OSCNull;
  fBN: OSCFloat | OSCBool | OSCNull;
  fIN: OSCFloat | OSCInfinity | OSCNull;
  siN: OSCString | OSCInt | OSCNull;
  sfN: OSCString | OSCFloat | OSCNull;
  sbN: OSCString | OSCBlob | OSCNull;
  shN: OSCString | OSCBigInt | OSCNull;
  stN: OSCString | OSCTimeTag | OSCNull;
  sdN: OSCString | OSCDouble | OSCNull;
  sSN: OSCString | OSCSymbol | OSCNull;
  scN: OSCString | OSCChar | OSCNull;
  srN: OSCString | OSCColor | OSCNull;
  smN: OSCString | OSCMIDI | OSCNull;
  sBN: OSCString | OSCBool | OSCNull;
  sIN: OSCString | OSCInfinity | OSCNull;
  biN: OSCBlob | OSCInt | OSCNull;
  bfN: OSCBlob | OSCFloat | OSCNull;
  bsN: OSCBlob | OSCString | OSCNull;
  bhN: OSCBlob | OSCBigInt | OSCNull;
  btN: OSCBlob | OSCTimeTag | OSCNull;
  bdN: OSCBlob | OSCDouble | OSCNull;
  bSN: OSCBlob | OSCSymbol | OSCNull;
  bcN: OSCBlob | OSCChar | OSCNull;
  brN: OSCBlob | OSCColor | OSCNull;
  bmN: OSCBlob | OSCMIDI | OSCNull;
  bBN: OSCBlob | OSCBool | OSCNull;
  bIN: OSCBlob | OSCInfinity | OSCNull;
  hiN: OSCBigInt | OSCInt | OSCNull;
  hfN: OSCBigInt | OSCFloat | OSCNull;
  hsN: OSCBigInt | OSCString | OSCNull;
  hbN: OSCBigInt | OSCBlob | OSCNull;
  htN: OSCBigInt | OSCTimeTag | OSCNull;
  hdN: OSCBigInt | OSCDouble | OSCNull;
  hSN: OSCBigInt | OSCSymbol | OSCNull;
  hcN: OSCBigInt | OSCChar | OSCNull;
  hrN: OSCBigInt | OSCColor | OSCNull;
  hmN: OSCBigInt | OSCMIDI | OSCNull;
  hBN: OSCBigInt | OSCBool | OSCNull;
  hIN: OSCBigInt | OSCInfinity | OSCNull;
  tiN: OSCTimeTag | OSCInt | OSCNull;
  tfN: OSCTimeTag | OSCFloat | OSCNull;
  tsN: OSCTimeTag | OSCString | OSCNull;
  tbN: OSCTimeTag | OSCBlob | OSCNull;
  thN: OSCTimeTag | OSCBigInt | OSCNull;
  tdN: OSCTimeTag | OSCDouble | OSCNull;
  tSN: OSCTimeTag | OSCSymbol | OSCNull;
  tcN: OSCTimeTag | OSCChar | OSCNull;
  trN: OSCTimeTag | OSCColor | OSCNull;
  tmN: OSCTimeTag | OSCMIDI | OSCNull;
  tBN: OSCTimeTag | OSCBool | OSCNull;
  tIN: OSCTimeTag | OSCInfinity | OSCNull;
  diN: OSCDouble | OSCInt | OSCNull;
  dfN: OSCDouble | OSCFloat | OSCNull;
  dsN: OSCDouble | OSCString | OSCNull;
  dbN: OSCDouble | OSCBlob | OSCNull;
  dhN: OSCDouble | OSCBigInt | OSCNull;
  dtN: OSCDouble | OSCTimeTag | OSCNull;
  dSN: OSCDouble | OSCSymbol | OSCNull;
  dcN: OSCDouble | OSCChar | OSCNull;
  drN: OSCDouble | OSCColor | OSCNull;
  dmN: OSCDouble | OSCMIDI | OSCNull;
  dBN: OSCDouble | OSCBool | OSCNull;
  dIN: OSCDouble | OSCInfinity | OSCNull;
  SiN: OSCSymbol | OSCInt | OSCNull;
  SfN: OSCSymbol | OSCFloat | OSCNull;
  SsN: OSCSymbol | OSCString | OSCNull;
  SbN: OSCSymbol | OSCBlob | OSCNull;
  ShN: OSCSymbol | OSCBigInt | OSCNull;
  StN: OSCSymbol | OSCTimeTag | OSCNull;
  SdN: OSCSymbol | OSCDouble | OSCNull;
  ScN: OSCSymbol | OSCChar | OSCNull;
  SrN: OSCSymbol | OSCColor | OSCNull;
  SmN: OSCSymbol | OSCMIDI | OSCNull;
  SBN: OSCSymbol | OSCBool | OSCNull;
  SIN: OSCSymbol | OSCInfinity | OSCNull;
  ciN: OSCChar | OSCInt | OSCNull;
  cfN: OSCChar | OSCFloat | OSCNull;
  csN: OSCChar | OSCString | OSCNull;
  cbN: OSCChar | OSCBlob | OSCNull;
  chN: OSCChar | OSCBigInt | OSCNull;
  ctN: OSCChar | OSCTimeTag | OSCNull;
  cdN: OSCChar | OSCDouble | OSCNull;
  cSN: OSCChar | OSCSymbol | OSCNull;
  crN: OSCChar | OSCColor | OSCNull;
  cmN: OSCChar | OSCMIDI | OSCNull;
  cBN: OSCChar | OSCBool | OSCNull;
  cIN: OSCChar | OSCInfinity | OSCNull;
  riN: OSCColor | OSCInt | OSCNull;
  rfN: OSCColor | OSCFloat | OSCNull;
  rsN: OSCColor | OSCString | OSCNull;
  rbN: OSCColor | OSCBlob | OSCNull;
  rhN: OSCColor | OSCBigInt | OSCNull;
  rtN: OSCColor | OSCTimeTag | OSCNull;
  rdN: OSCColor | OSCDouble | OSCNull;
  rSN: OSCColor | OSCSymbol | OSCNull;
  rcN: OSCColor | OSCChar | OSCNull;
  rmN: OSCColor | OSCMIDI | OSCNull;
  rBN: OSCColor | OSCBool | OSCNull;
  rIN: OSCColor | OSCInfinity | OSCNull;
  miN: OSCMIDI | OSCInt | OSCNull;
  mfN: OSCMIDI | OSCFloat | OSCNull;
  msN: OSCMIDI | OSCString | OSCNull;
  mbN: OSCMIDI | OSCBlob | OSCNull;
  mhN: OSCMIDI | OSCBigInt | OSCNull;
  mtN: OSCMIDI | OSCTimeTag | OSCNull;
  mdN: OSCMIDI | OSCDouble | OSCNull;
  mSN: OSCMIDI | OSCSymbol | OSCNull;
  mcN: OSCMIDI | OSCChar | OSCNull;
  mrN: OSCMIDI | OSCColor | OSCNull;
  mBN: OSCMIDI | OSCBool | OSCNull;
  mIN: OSCMIDI | OSCInfinity | OSCNull;
  BiN: OSCBool | OSCInt | OSCNull;
  BfN: OSCBool | OSCFloat | OSCNull;
  BsN: OSCBool | OSCString | OSCNull;
  BbN: OSCBool | OSCBlob | OSCNull;
  BhN: OSCBool | OSCBigInt | OSCNull;
  BtN: OSCBool | OSCTimeTag | OSCNull;
  BdN: OSCBool | OSCDouble | OSCNull;
  BSN: OSCBool | OSCSymbol | OSCNull;
  BcN: OSCBool | OSCChar | OSCNull;
  BrN: OSCBool | OSCColor | OSCNull;
  BmN: OSCBool | OSCMIDI | OSCNull;
  BIN: OSCBool | OSCInfinity | OSCNull;
  IiN: OSCInfinity | OSCInt | OSCNull;
  IfN: OSCInfinity | OSCFloat | OSCNull;
  IsN: OSCInfinity | OSCString | OSCNull;
  IbN: OSCInfinity | OSCBlob | OSCNull;
  IhN: OSCInfinity | OSCBigInt | OSCNull;
  ItN: OSCInfinity | OSCTimeTag | OSCNull;
  IdN: OSCInfinity | OSCDouble | OSCNull;
  ISN: OSCInfinity | OSCSymbol | OSCNull;
  IcN: OSCInfinity | OSCChar | OSCNull;
  IrN: OSCInfinity | OSCColor | OSCNull;
  ImN: OSCInfinity | OSCMIDI | OSCNull;
  IBN: OSCInfinity | OSCBool | OSCNull;
}
