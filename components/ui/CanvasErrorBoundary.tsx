"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ROAM] 3D canvas error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full min-h-[300px] border border-primary bg-surface">
          <div className="text-center px-8">
            <div className="font-mono text-xs text-primary mb-4 tracking-widest">
              [ RENDERER ERROR ]
            </div>
            <p className="font-mono text-sm text-muted">
              3D renderer unavailable — try a modern browser.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
