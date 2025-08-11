import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScheduleTimeline } from '../ScheduleTimeline';
import { createDaySchedule, createActivity } from '../index';

describe('ScheduleTimeline', () => {
  const mockSchedule = [
    createDaySchedule('21', 'Thursday', [
      createActivity('9:00 - 10:00', 'Opening Ceremony', 'opening'),
      createActivity('10:00 - 12:00', 'Workshop', 'workshop'),
    ]),
    createDaySchedule('22', 'Friday', [
      createActivity('9:00 - 11:00', 'Competition', 'contest'),
    ]),
  ];

  it('renders without crashing', () => {
    render(<ScheduleTimeline schedule={mockSchedule} />);
    expect(screen.getByText('Thursday 21')).toBeInTheDocument();
    expect(screen.getByText('Friday 22')).toBeInTheDocument();
  });

  it('displays activities correctly', () => {
    render(<ScheduleTimeline schedule={mockSchedule} />);
    expect(screen.getByText('Opening Ceremony')).toBeInTheDocument();
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    expect(screen.getByText('Competition')).toBeInTheDocument();
  });

  it('displays time markers when enabled', () => {
    render(
      <ScheduleTimeline 
        schedule={mockSchedule} 
        config={{ showTimeMarkers: true, startHour: 9, endHour: 12 }}
      />
    );
    expect(screen.getByText('9:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('hides header when showHeader is false', () => {
    render(<ScheduleTimeline schedule={mockSchedule} showHeader={false} />);
    expect(screen.queryByText('Thursday 21')).not.toBeInTheDocument();
  });
});
