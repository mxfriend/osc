import type { Event } from '@mxfriend/events';
import { WebSocket } from 'ws';

import { AbstractOSCPort } from '../abstractPort';
import type { BufferInterface } from '../buffer';
import { WsOSCEvent } from './events';

export class WsOSCPort<TEvents extends Event = never> extends AbstractOSCPort<
  WebSocket,
  WsOSCEvent.Close | TEvents
> {
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
      this.emit(new WsOSCEvent.Close(client));
    });
  }

  isPeer(value?: unknown): value is WebSocket {
    return !!value && value instanceof WebSocket;
  }

  protected async sendPacket(packet: BufferInterface, to: WebSocket | undefined): Promise<void> {
    const recipients = to ? [to] : [...this.clients];

    await Promise.all(
      recipients.map(
        (sock) =>
          new Promise<void>((resolve, reject) => {
            sock.send(packet, (err) => (err ? reject(err) : resolve()));
          }),
      ),
    );
  }
}
