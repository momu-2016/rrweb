import { expect } from 'chai';
import { getLastSession } from '../src/replay/machine';
import { sampleEvents } from './utils';
import { EventType } from '../src/types';

const events = sampleEvents.filter(
  (e) => ![EventType.DomContentLoaded, EventType.Load].includes(e.type),
);
const nextEvents = events.map((e) => ({
  ...e,
  timestamp: e.timestamp + 1000,
}));
const nextNextEvents = nextEvents.map((e) => ({
  ...e,
  timestamp: e.timestamp + 1000,
}));

describe('get last session', () => {
  it('will return all the events when there is only one session', () => {
    expect(getLastSession(events, events[0].timestamp)).to.deep.equal(events);
  });

  it('will return last session when there is more than one in the events', () => {
    const multiple = events.concat(nextEvents).concat(nextNextEvents);
    expect(
      getLastSession(
        multiple,
        nextNextEvents[nextNextEvents.length - 1].timestamp,
      ),
    ).to.deep.equal(nextNextEvents);
  });

  it('will return last session when baseline time is future time', () => {
    const multiple = events.concat(nextEvents).concat(nextNextEvents);
    expect(
      getLastSession(
        multiple,
        nextNextEvents[nextNextEvents.length - 1].timestamp + 1000,
      ),
    ).to.deep.equal(nextNextEvents);
  });

  it('will return first session when baseline time is previous time', () => {
    expect(getLastSession(events, events[0].timestamp - 1000)).to.deep.equal(
      events,
    );
  });
});
