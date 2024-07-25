import type { Event } from '@mxfriend/events';
import type { RemoteInfo, Socket } from 'dgram';
import { createSocket } from 'dgram';

import { AbstractOSCPort } from '../abstractPort';
import { UdpOSCEvent } from './events';

export type UdpOSCPortOptions = {
  localAddress?: string;
  localPort?: number;
  remoteAddress?: string;
  remotePort?: number;
  broadcast?: boolean;
};

export type UdpOSCPeer = {
  ip: string;
  port: number;
};

export class UdpOSCPort<TEvents extends Event = never> extends AbstractOSCPort<
  UdpOSCPeer,
  UdpOSCEvent.Error | TEvents
> {
  private readonly options: UdpOSCPortOptions;
  private readonly sock: Socket;
  private opened: boolean;

  constructor(options: UdpOSCPortOptions = {}) {
    super();
    this.options = options;
    this.sock = createSocket('udp4');
    this.opened = false;
    this.handlePacket = this.handlePacket.bind(this);
  }

  async open(): Promise<void> {
    if (this.opened) {
      throw new Error('Port is already opened');
    }

    this.opened = true;

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

    this.sock.on('error', (err) => this.emit(new UdpOSCEvent.Error(err)));
    this.sock.on('message', this.handlePacket);
  }

  async close(): Promise<void> {
    this.sock.removeAllListeners();
    this.off();

    if (!this.opened) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.sock.close(resolve);
    });
  }

  isPeer(value?: unknown): value is UdpOSCPeer {
    return (
      !!value &&
      typeof value === 'object' &&
      'ip' in value &&
      typeof value.ip === 'string' &&
      'port' in value &&
      typeof value.port === 'number'
    );
  }

  protected async sendPacket(packet: Buffer, to?: UdpOSCPeer): Promise<void> {
    if (!this.opened) {
      throw new Error('Socket is not opened, call socket.open() first');
    }

    await new Promise<void>((resolve, reject) => {
      this.sock.send(
        packet,
        to?.port ?? this.options.remotePort,
        to?.ip ?? this.options.remoteAddress,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  private handlePacket(packet: Buffer, info: RemoteInfo): void {
    this.receive(packet, {
      ip: info.address,
      port: info.port,
    });
  }
}
