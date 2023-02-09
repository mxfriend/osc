import { WebSocket } from 'ws';
import { AbstractOSCPort, CommonOSCEvents } from './abstractPort';
import { BufferInterface } from './buffer';

export interface WsOSCEvents extends CommonOSCEvents<WebSocket> {
  close: [client: WebSocket];
}

export class WsOSCPort<
  TEvents extends WsOSCEvents = WsOSCEvents,
> extends AbstractOSCPort<WebSocket, TEvents> {
  private readonly clients: Set<WebSocket> = new Set();

  add(client: WebSocket): void {
    if (this.clients.has(client)) {
      return;
    }

    this.clients.add(client);

    const ping = setInterval(() => {
      client.send('ping');
    }, 5000);

    client.on('message', (message) => {
      const packets = Array.isArray(message) ? message : [message];

      for (const packet of packets) {
        this.receive(Buffer.isBuffer(packet) ? packet : Buffer.from(packet), client);
      }
    });

    client.on('close', () => {
      this.clients.delete(client);
      client.removeAllListeners();
      clearInterval(ping);
      this.emit('close', client);
    });
  }

  protected async sendPacket(packet: BufferInterface, to: WebSocket | undefined): Promise<void> {
    const recipients = to ? [to] : [...this.clients];

    await Promise.all(recipients.map((sock) => new Promise<void>((resolve, reject) => {
      sock.send(packet, (err) => err ? reject(err) : resolve());
    })));
  }
}
