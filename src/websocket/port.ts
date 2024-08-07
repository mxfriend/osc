import type { Event as MXEvent } from '@mxfriend/events';

import { AbstractOSCPort } from '../abstractPort';
import type { BufferInterface } from '../buffer';
import { $Buffer } from '../buffer';
import { WebsocketOSCEvent } from './events';

export class WebsocketOSCPort<TEvents extends MXEvent = never> extends AbstractOSCPort<
  WebSocket,
  WebsocketOSCEvent.Error | TEvents
> {
  private readonly url: string;
  private sock?: Promise<WebSocket>;

  constructor(url: string) {
    super();
    this.url = url;
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async open(): Promise<void> {
    await this.connect();
  }

  async close(): Promise<void> {
    const sock = this.sock && (await this.sock);
    sock && sock.close();
  }

  isPeer(value?: unknown): value is WebSocket {
    return !!value && value instanceof WebSocket;
  }

  protected async sendPacket(packet: BufferInterface, peer?: WebSocket): Promise<void> {
    const sock = peer ?? (await this.connect());
    sock.send(packet.buffer);
  }

  private async connect(): Promise<WebSocket> {
    if (this.sock) {
      return this.sock;
    }

    return (this.sock = new Promise((resolve, reject) => {
      const sock = new WebSocket(this.url);
      sock.binaryType = 'arraybuffer';

      attachListeners(sock, {
        open: () => {
          attachListeners(
            sock,
            {
              message: this.handleMessage,
              close: this.handleClose,
              error: this.handleError,
            },
            ['message'],
          );

          resolve(sock);
        },
        error: reject,
      });
    }));
  }

  private handleMessage(evt: MessageEvent, sock?: WebSocket): void {
    if (evt.data instanceof ArrayBuffer) {
      this.receive(new $Buffer(evt.data), sock);
    }
  }

  private handleClose(): void {
    this.sock = undefined;
  }

  private handleError(err: Event): void {
    this.emit(new WebsocketOSCEvent.Error(err));
  }
}

type ListenerMap = {
  [Event in keyof WebSocketEventMap]?: (evt: WebSocketEventMap[Event]) => void;
};

function attachListeners(ws: WebSocket, events: ListenerMap, ignored?: (keyof ListenerMap)[]): void;
function attachListeners(
  ws: WebSocket,
  events: Record<string, (...args: any[]) => void>,
  ignored: string[] = [],
): void {
  const cleanup = () => {
    for (const [event, listener] of Object.entries(events)) {
      ws.removeEventListener(event as any, listener);
    }
  };

  for (const [event, listener] of Object.entries(events)) {
    if (ignored.includes(event)) {
      ws.addEventListener(event as any, listener);
    } else {
      ws.addEventListener(
        event as any,
        (events[event] = (...args: any[]) => {
          cleanup();
          listener(...args);
        }),
      );
    }
  }
}
