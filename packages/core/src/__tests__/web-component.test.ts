import '../web-component';
import { registerScheduleTimelineElement } from '../web-component';

registerScheduleTimelineElement();

describe('ScheduleTimelineElement', () => {
  it('renders from the events attribute', () => {
    const element = document.createElement('schedule-timeline') as HTMLElement;

    element.setAttribute(
      'events',
      JSON.stringify([
        {
          title: 'Opening Ceremony',
          startTime: '09:00',
          endTime: '10:00',
          date: '2026-06-01',
          type: 'opening',
        },
      ])
    );

    document.body.appendChild(element);

    expect(element.textContent).toContain('Opening Ceremony');
    expect(element.textContent).toContain('Time');
  });
});