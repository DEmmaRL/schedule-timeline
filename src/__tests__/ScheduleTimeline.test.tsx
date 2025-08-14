import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScheduleTimeline } from '../ScheduleTimeline';
import { Event } from '../types';

describe('ScheduleTimeline', () => {
  // Test new event format
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Opening Ceremony',
      startTime: '09:00',
      endTime: '10:00',
      date: '2024-03-21',
      type: 'opening',
    },
    {
      id: 2,
      title: 'Workshop',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-03-21',
      type: 'workshop',
    },
    {
      id: 3,
      title: 'Competition',
      startTime: '09:00',
      endTime: '11:00',
      date: '2024-03-22',
      type: 'contest',
    },
  ];

  // Test legacy de schedule
  const mockSchedule = [
    {
      date: '2024-03-21',
      day: '21',
      dayName: 'Thursday',
      activities: [
        {
          time: '9:00 - 10:00',
          title: 'Opening Ceremony',
          type: 'opening',
        },
        {
          time: '10:00 - 12:00',
          title: 'Workshop',
          type: 'workshop',
        },
      ],
    },
    {
      date: '2024-03-22',
      day: '22',
      dayName: 'Friday',
      activities: [
        {
          time: '9:00 - 11:00',
          title: 'Competition',
          type: 'contest',
        },
      ],
    },
  ];

  it('renders without crashing with events', () => {
    render(<ScheduleTimeline events={mockEvents} />);
    expect(screen.getByText('Wednesday 20')).toBeInTheDocument();
    expect(screen.getByText('Thursday 21')).toBeInTheDocument();
  });

  it('renders without crashing with schedule (legacy)', () => {
    render(<ScheduleTimeline schedule={mockSchedule} />);
    expect(screen.getByText('Thursday 21')).toBeInTheDocument();
    expect(screen.getByText('Friday 22')).toBeInTheDocument();
  });

  it('displays activities correctly with events', () => {
    render(<ScheduleTimeline events={mockEvents} />);
    expect(screen.getByText('Opening Ceremony')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();
  });

  it('displays activities correctly with schedule (legacy)', () => {
    render(<ScheduleTimeline schedule={mockSchedule} />);
    expect(screen.getByText('Opening Ceremony')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();
  });

  it('displays time markers when enabled', () => {
    render(
      <ScheduleTimeline 
        events={mockEvents}
        config={{ showTimeMarkers: true, startHour: 9, endHour: 12 }}
      />
    );
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('hides header when showHeader is false', () => {
    render(<ScheduleTimeline events={mockEvents} showHeader={false} />);
    expect(screen.queryByText('Thursday 21')).not.toBeInTheDocument();
  });

  it('handles empty events array', () => {
    render(<ScheduleTimeline events={[]} />);
    // Should render without crashing - check for the time column
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('handles missing events and schedule props', () => {
    render(<ScheduleTimeline />);
    // Should render without crashing - check for the time column
    expect(screen.getByText('Time')).toBeInTheDocument();
  });
});
