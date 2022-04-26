import { Socket, RemoteInfo, createSocket } from 'dgram';
import { EventEmitter } from 'events';
import { OSCBundle, OSCMessage, OSCArgument, OSCBundleElement } from './types';
import { decode, encodeMessage, encodeBundle } from './utils';

export type OSCPortOptions = {
  localAddress?: string;
  localPort?: number;
  remoteAddress?: string;
  remotePort?: number;
  broadcast?: boolean;
};

export type OSCPeer = {
  ip: string;
  port: number;
};

export class OSCPort extends EventEmitter {
  private readonly options: OSCPortOptions;
  private readonly sock: Socket;

  constructor(options: OSCPortOptions = {}) {
    super();
    this.options = options;
    this.sock = createSocket('udp4');

    this.handlePacket = this.handlePacket.bind(this);
  }

  async open(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.sock.once('error', reject);

      this.sock.bind(this.options.localPort ?? 0, this.options.localAddress ?? '0.0.0.0', () => {
        this.sock.off('error', reject);
        resolve();
      });
    });

    if (this.options.broadcast) {
      this.sock.setBroadcast(true);
    }

    this.sock.on('error', (err) => this.emit('error', err));
    this.sock.on('message', this.handlePacket);
  }

  async send(address: string, args?: OSCArgument[], peer?: OSCPeer): Promise<void> {
    await this.sendPacket(encodeMessage(address, args), peer);
  }

  async sendBundle(elements: OSCBundleElement[], timetag?: bigint, peer?: OSCPeer): Promise<void> {
    await this.sendPacket(encodeBundle(elements, timetag), peer);
  }

  private async sendPacket(packet: Buffer, peer?: OSCPeer): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.sock.send(packet, peer?.port ?? this.options.remotePort, peer?.ip ?? this.options.remoteAddress, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  private handlePacket(packet: Buffer, info: RemoteInfo): void {
    const peer: OSCPeer = {
      ip: info.address,
      port: info.port,
    };

    this.emit(...(decode(packet) as [any, any]), peer);
  }
}

export interface OSCPort extends EventEmitter {
  emit(event: 'error', err: any): boolean;
  emit(event: 'message', message: OSCMessage, peer: OSCPeer): boolean;
  emit(event: 'bundle', bundle: OSCBundle, peer: OSCPeer): boolean;

  on(event: 'error', listener: (err: any) => void): this;
  on(event: 'message', listener: (message: OSCMessage, peer: OSCPeer) => void): this;
  on(event: 'bundle', listener: (bundle: OSCBundle, peer: OSCPeer) => void): this;

  once(event: 'error', listener: (err: any) => void): this;
  once(event: 'message', listener: (message: OSCMessage, peer: OSCPeer) => void): this;
  once(event: 'bundle', listener: (bundle: OSCBundle, peer: OSCPeer) => void): this;

  off(event: 'error', listener: (err: any) => void): this;
  off(event: 'message', listener: (message: OSCMessage, peer: OSCPeer) => void): this;
  off(event: 'bundle', listener: (bundle: OSCBundle, peer: OSCPeer) => void): this;
}
