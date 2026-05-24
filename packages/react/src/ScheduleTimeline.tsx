import React, { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server.node';

import { renderTimeline } from '@demmarl/schedule-timeline-core';
import type { Activity, Event } from '@demmarl/schedule-timeline-core';

import type { ScheduleTimelineProps } from './types';

const renderNodeToMarkup = (node: React.ReactNode): string =>
  renderToStaticMarkup(React.createElement(React.Fragment, null, node));

type RendererStyle = Record<string, string | number>;

type TimelineBridgeProps = Parameters<typeof renderTimeline>[1] & {
  renderActivityMarkup?: (activity: Activity, style: RendererStyle) => string | null | undefined;
  renderEventMarkup?: (event: Event, style: RendererStyle) => string | null | undefined;
};

const createTimelineBridgeProps = (props: ScheduleTimelineProps): TimelineBridgeProps => {
  const activityRenderer = props.customActivityRenderer;
  const eventRenderer = props.customEventRenderer;

  return {
    ...props,
    renderActivityMarkup: activityRenderer
      ? (activity: Activity, style: RendererStyle) =>
          renderNodeToMarkup(activityRenderer(activity, style as React.CSSProperties))
      : undefined,
    renderEventMarkup: eventRenderer
      ? (event: Event, style: RendererStyle) =>
          renderNodeToMarkup(eventRenderer(event, style as React.CSSProperties))
      : undefined,
  };
};

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<typeof renderTimeline> | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    instanceRef.current = renderTimeline(container, createTimelineBridgeProps(props));

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.update(createTimelineBridgeProps(props));
  }, [
    props,
    props.activityClassName,
    props.className,
    props.colorTheme,
    props.config,
    props.customActivityRenderer,
    props.customEventRenderer,
    props.events,
    props.headerClassName,
    props.onActivityClick,
    props.onActivityHover,
    props.onEventClick,
    props.onEventHover,
    props.schedule,
    props.showHeader,
  ]);

  return <div ref={containerRef} />;
};

export default ScheduleTimeline;
