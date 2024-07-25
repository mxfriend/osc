import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import type { OSCMessage } from '../src';
import { assertDeeplyEqual } from './lib/helpers';
import { TestOSCPort, TestEvent } from './lib/testPort';
import { messages } from './types';

describe('OSC Port', () => {
  it('dispatches message events when OSC messages are received', () => {
    const port = new TestOSCPort();
    const expected: OSCMessage[] = [];
    const received: OSCMessage[] = [];

    port.on(TestEvent.Message, (evt) => {
      received.push(evt.message);
    });

    for (const [packet, message] of messages) {
      expected.push(message);
      port.injectReceivedPacket(packet);
    }

    assertDeeplyEqual(received, expected);
  });

  it('dispatches subscriptions and message events only for subscribed addresses', () => {
    const subscribedAddress = '/test05';
    const port = new TestOSCPort();
    const expected: OSCMessage[] = [];
    const receivedViaSubscription: OSCMessage[] = [];
    const receivedViaEvent: OSCMessage[] = [];

    port.subscribe(subscribedAddress, (message) => {
      receivedViaSubscription.push(message);
    });

    port.on(TestEvent.Message, (evt) => {
      receivedViaEvent.push(evt.message);
    });

    for (const [packet, message] of messages) {
      if (message.address === subscribedAddress) {
        expected.push(message);
      }

      port.injectReceivedPacket(packet);
    }

    assertDeeplyEqual(receivedViaSubscription, expected);
    assertDeeplyEqual(receivedViaEvent, expected);
  });

  it('allows typed subscriptions', () => {
    type TestCase = { address: string; types: string; shouldMatch: boolean };
    const cases: TestCase[] = [
      { address: '/test05', types: 's[ifBb]s', shouldMatch: true },
      { address: '/test05', types: 'ssfi', shouldMatch: false },
    ];

    const port = new TestOSCPort();
    const resultMap: Map<TestCase, OSCMessage[]> = new Map();

    for (const test of cases) {
      const results: OSCMessage[] = [];
      resultMap.set(test, results);

      port.subscribe(test.address, test.types, (message) => {
        results.push(message);
      });
    }

    for (const [packet] of messages) {
      port.injectReceivedPacket(packet);
    }

    for (const [test, results] of resultMap) {
      assert.ok(results.length === (test.shouldMatch ? 1 : 0));
    }
  });
});
