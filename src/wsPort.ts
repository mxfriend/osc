import { WebSocket } from 'ws';
import { AbstractOSCPort } from './abstractPort';
import { PacketInterface } from './buffer';

export class WsOSCPort extends AbstractOSCPort<WebSocket> {
  private readonly sock: WebSocket;

  constructor(sock: WebSocket) {
    super();
    this.sock = sock;

    const ping = setInterval(() => {
      sock.send('ping');
    }, 5000);

    sock.on('message', (message) => {
      const packets = Array.isArray(message) ? message : [message];

      for (const packet of packets) {
        this.receive(Buffer.isBuffer(packet) ? packet : Buffer.from(packet), sock);
      }
    });

    sock.on('close', () => {
      sock.removeAllListeners();
      clearInterval(ping);
    });
  }

  protected async sendPacket(packet: PacketInterface, to: WebSocket | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = to ?? this.sock;
      client.send(packet, (err) => err ? reject(err) : resolve());
    });
  }
}
