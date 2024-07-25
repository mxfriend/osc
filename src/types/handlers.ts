import type { OSCMessage } from './basic';
import type { TypedOSCMessage } from './typeTag';

export type OSCMessageHandler<Peer = unknown> = {
  (message: OSCMessage, peer?: Peer): void;
};

export type TypedOSCMessageHandler<S extends string, Peer = unknown> = {
  (message: TypedOSCMessage<S>, peer?: Peer): void;
};
