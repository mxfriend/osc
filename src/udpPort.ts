import { Socket, RemoteInfo, createSocket } from 'dgram';
import { AbstractOSCPort, CommonOSCEvents } from './abstractPort';

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

interface UdpOSCEvents extends CommonOSCEvents<UdpOSCPeer> {
  error: [error: any];
}

export class UdpOSCPort<
  TEvents extends UdpOSCEvents = UdpOSCEvents,
> extends AbstractOSCPort<UdpOSCPeer, TEvents> {
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

    this.sock.on('error', (err) => this.emit('error', err));
    this.sock.on('message', this.handlePacket);
  }

  async close(): Promise<void> {
    this.sock.removeAllListeners();
    this.off();

    if (!this.opened) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.sock.close(resolve)
    });
  }

  protected async sendPacket(packet: Buffer, to?: UdpOSCPeer): Promise<void> {
    if (!this.opened) {
      throw new Error('Socket is not opened, call socket.open() first');
    }

    await new Promise<void>((resolve, reject) => {
      this.sock.send(packet, to?.port ?? this.options.remotePort, to?.ip ?? this.options.remoteAddress, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  private handlePacket(packet: Buffer, info: RemoteInfo): void {
    this.receive(packet, {
      ip: info.address,
      port: info.port,
    });
  }
}
