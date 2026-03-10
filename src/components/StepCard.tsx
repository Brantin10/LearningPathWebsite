'use client';

import React from 'react';
import { LearningStep } from '../types';

interface Props {
  step: LearningStep;
  completed: boolean;
  onToggle: () => void;
}

export default function StepCard({ step, completed, onToggle }: Props) {
  const youtube = step.resources?.youtube || [];

  return (
    <div className="flex mb-3">
      {/* Timeline */}
      <div className="flex flex-col items-center w-11 mr-3">
        <button
          onClick={onToggle}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            transition-colors border
            ${completed
              ? 'bg-primary-muted border-[rgba(39,174,96,0.4)]'
              : 'glass-card-elevated'
            }
          `}
        >
          {completed ? (
            <span className="text-primary font-bold text-[15px]">&#10003;</span>
          ) : (
            <span className="text-text-secondary font-bold text-[13px]">{step.step_number}</span>
          )}
        </button>
        <div className="flex-1 w-px bg-border my-1" />
      </div>

      {/* Card */}
      <div
        className={`
          flex-1 rounded-2xl p-4 glass-card transition-colors
          ${completed ? 'border-[rgba(39,174,96,0.4)] bg-primary-muted' : ''}
        `}
      >
        <h3
          className={`
            text-[15px] font-semibold mb-1
            ${completed ? 'line-through text-text-secondary' : 'text-text-primary'}
          `}
        >
          {step.title}
        </h3>
        {step.explanation && (
          <p className="text-[13px] text-text-secondary leading-5 mb-2">
            {step.explanation}
          </p>
        )}
        <div className="flex items-center">
          <span className="bg-primary-muted text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {step.time_estimate_weeks} week{step.time_estimate_weeks !== 1 ? 's' : ''}
          </span>
        </div>

        {youtube.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            {youtube.slice(0, 3).map((vid, i) => (
              <a
                key={i}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-1 text-accent hover:underline"
              >
                <span className="text-[10px]">&#9654;</span>
                <span className="text-[13px] truncate">{vid.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
