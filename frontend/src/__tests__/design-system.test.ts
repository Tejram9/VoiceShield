import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  Heading,
  Text,
  Mono,
  DataLabel,
  MetricValue,
  Surface,
  Container,
  Divider,
  SectionHeader,
  Button,
  ButtonGroup,
  Input,
  Select,
  Textarea,
  Checkbox,
  Switch,
  FormField,
  RiskBadge,
  RiskScoreBar,
  StatusDot,
  SignalItem,
  SignalList,
  Timeline,
  TimelineEntry,
  ActionDialog,
  Skeleton,
  EmptyState,
  ErrorBanner,
  NavTabs,
  Breadcrumbs,
  HeaderBar,
} from "../components/ui";

const h = React.createElement;

describe("VoiceShield Phase 2A Design System", () => {
  describe("Typography System", () => {
    it("renders Heading with correct tag and classes", () => {
      const html = renderToString(h(Heading, { level: 1 }, "VoiceShield Platform"));
      expect(html).toContain("<h1");
      expect(html).toContain("text-2xl font-semibold");
      expect(html).toContain("VoiceShield Platform");
    });

    it("renders Text with semantic variants", () => {
      const html = renderToString(h(Text, { variant: "danger" }, "Critical alert"));
      expect(html).toContain("text-risk-critical");
      expect(html).toContain("Critical alert");
    });

    it("renders Mono with code tag", () => {
      const html = renderToString(h(Mono, null, "ecapa_tdnn_9401"));
      expect(html).toContain("<code");
      expect(html).toContain("font-mono");
      expect(html).toContain("ecapa_tdnn_9401");
    });

    it("renders DataLabel and MetricValue", () => {
      const html = renderToString(
        h(
          "div",
          null,
          h(DataLabel, null, "Active Trunk"),
          h(MetricValue, { value: 94, unit: "ms", subtext: "Inference latency" })
        )
      );
      expect(html).toContain("Active Trunk");
      expect(html).toContain("94");
      expect(html).toContain("ms");
      expect(html).toContain("Inference latency");
    });
  });

  describe("Surface & Layout System", () => {
    it("renders Surface with specified variant and borders", () => {
      const html = renderToString(
        h(Surface, { variant: "surface-2", border: "default", padding: "md" }, "Content")
      );
      expect(html).toContain("bg-surface-2");
      expect(html).toContain("border-border-default");
      expect(html).toContain("p-4");
    });

    it("renders Container and Divider", () => {
      const html = renderToString(
        h(Container, { size: "lg" }, h(Divider, { orientation: "horizontal" }))
      );
      expect(html).toContain("max-w-7xl");
      expect(html).toContain('role="separator"');
    });

    it("renders SectionHeader with title and subtitle", () => {
      const html = renderToString(
        h(SectionHeader, { title: "Biometric Telemetry", subtitle: "Real-time acoustic analysis" })
      );
      expect(html).toContain("Biometric Telemetry");
      expect(html).toContain("Real-time acoustic analysis");
    });
  });

  describe("Button & Action System", () => {
    it("renders Button with primary variant", () => {
      const html = renderToString(h(Button, { variant: "primary" }, "Authenticate"));
      expect(html).toContain("bg-content-primary");
      expect(html).toContain("Authenticate");
    });

    it("renders Button with destructive variant for emergency actions", () => {
      const html = renderToString(h(Button, { variant: "destructive" }, "Freeze Wire"));
      expect(html).toContain("bg-risk-critical");
      expect(html).toContain("Freeze Wire");
    });

    it("renders Button with loading state", () => {
      const html = renderToString(h(Button, { isLoading: true }, "Processing"));
      expect(html).toContain('aria-busy="true"');
      expect(html).toContain("animate-spin");
    });

    it("renders ButtonGroup", () => {
      const html = renderToString(
        h(ButtonGroup, { attached: true }, h(Button, null, "Left"), h(Button, null, "Right"))
      );
      expect(html).toContain('role="group"');
    });
  });

  describe("Form Control System", () => {
    it("renders Input with error state", () => {
      const html = renderToString(h(Input, { placeholder: "Enter safe word", error: true }));
      expect(html).toContain("border-risk-critical");
      expect(html).toContain("Enter safe word");
    });

    it("renders Select and Textarea", () => {
      const html = renderToString(
        h(
          "div",
          null,
          h(
            Select,
            { defaultValue: "out_of_band" },
            h("option", { value: "out_of_band" }, "Out-of-band Callback")
          ),
          h(Textarea, { placeholder: "Operator notes..." })
        )
      );
      expect(html).toContain("<select");
      expect(html).toContain("<textarea");
      expect(html).toContain("Out-of-band Callback");
    });

    it("renders Checkbox and Switch", () => {
      const html = renderToString(
        h(
          "div",
          null,
          h(Checkbox, { label: "Enable Policy 4.1" }),
          h(Switch, { checked: true, onCheckedChange: () => {}, label: "Acoustic Stream" })
        )
      );
      expect(html).toContain("Enable Policy 4.1");
      expect(html).toContain("Acoustic Stream");
      expect(html).toContain('role="switch"');
    });

    it("renders FormField with label and helper text", () => {
      const html = renderToString(
        h(
          FormField,
          { label: "Trunk Carrier", helperText: "SIP carrier origin" },
          h(Input, null)
        )
      );
      expect(html).toContain("Trunk Carrier");
      expect(html).toContain("SIP carrier origin");
    });
  });

  describe("Risk & Status System", () => {
    it("renders RiskBadge for LOW risk", () => {
      const html = renderToString(h(RiskBadge, { level: "LOW" }));
      expect(html).toContain("LOW RISK");
      expect(html).toContain("text-risk-safe");
    });

    it("renders RiskBadge for CRITICAL risk", () => {
      const html = renderToString(h(RiskBadge, { level: "CRITICAL" }));
      expect(html).toContain("CRITICAL SPOOF");
      expect(html).toContain("text-red-400");
    });

    it("renders RiskBadge for ELEVATED and CONTAINED states", () => {
      const elevatedHtml = renderToString(h(RiskBadge, { level: "ELEVATED" }));
      expect(elevatedHtml).toContain("ELEVATED");
      expect(elevatedHtml).toContain("text-amber-400");

      const containedHtml = renderToString(h(RiskBadge, { level: "CONTAINED" }));
      expect(containedHtml).toContain("CONTAINED");
      expect(containedHtml).toContain("text-indigo-400");
    });

    it("renders RiskScoreBar with calculated score fill", () => {
      const html = renderToString(h(RiskScoreBar, { score: 94 }));
      expect(html).toContain("94");
      expect(html).toContain("bg-risk-critical");
      expect(html).toContain("width:94%");
    });

    it("renders StatusDot", () => {
      const html = renderToString(h(StatusDot, { status: "live", label: "Live Intercept Active" }));
      expect(html).toContain("Live Intercept Active");
      expect(html).toContain("bg-risk-safe");
    });
  });

  describe("Signal & Timeline Systems", () => {
    it("renders SignalItem with parameters", () => {
      const html = renderToString(
        h(
          SignalList,
          null,
          h(SignalItem, {
            label: "Voice Authenticity",
            score: 84,
            weight: 0.35,
            riskLevel: "CRITICAL",
            confidenceLabel: "96% CONFIDENCE",
            description: "Phase artifact detection",
            textInterpretation: "Neural vocoder signature matched.",
            technicalDetails: ["Acoustic phase coherence: 0.22", "Model: Diffusion-TTS"],
          })
        )
      );
      expect(html).toContain("Voice Authenticity");
      expect(html).toContain("wt: 35%");
      expect(html).toContain("96% CONFIDENCE");
      expect(html).toContain("Neural vocoder signature matched.");
      expect(html).toContain("Model: Diffusion-TTS");
    });

    it("renders Timeline with entries", () => {
      const html = renderToString(
        h(
          Timeline,
          null,
          h(TimelineEntry, {
            time: "00:21",
            title: "Inbound Trunk Connected",
            severity: "normal",
            description: "SIP connection established",
          }),
          h(TimelineEntry, {
            time: "01:42",
            title: "Synthetic Clone Confirmed",
            severity: "critical",
            description: "Phase boundary mismatch",
            actionTaken: "Wire transfer frozen",
            isLast: true,
          })
        )
      );
      expect(html).toContain("Inbound Trunk Connected");
      expect(html).toContain("Synthetic Clone Confirmed");
      expect(html).toContain("Wire transfer frozen");
    });
  });

  describe("Action Dialog, States & Navigation", () => {
    it("renders ActionDialog when open", () => {
      const html = renderToString(
        h(ActionDialog, {
          isOpen: true,
          onClose: () => {},
          onConfirm: () => {},
          title: "Confirm Emergency Wire Freeze",
          description: "Enforce Policy 4.1 against active session",
          variant: "destructive",
        })
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain("Confirm Emergency Wire Freeze");
      expect(html).toContain("Enforce Policy 4.1 against active session");
    });

    it("does not render ActionDialog when closed", () => {
      const html = renderToString(
        h(ActionDialog, {
          isOpen: false,
          onClose: () => {},
          onConfirm: () => {},
          title: "Hidden Dialog",
        })
      );
      expect(html).toBe("");
    });

    it("renders Skeleton, EmptyState, and ErrorBanner", () => {
      const skeletonHtml = renderToString(h(Skeleton, { width: "100px", height: "20px" }));
      expect(skeletonHtml).toContain("animate-pulse");

      const emptyHtml = renderToString(
        h(EmptyState, { title: "No Security Incidents", description: "Trunks currently clear" })
      );
      expect(emptyHtml).toContain("No Security Incidents");

      const errorHtml = renderToString(
        h(ErrorBanner, { message: "WebSocket connection lost", code: "ERR_WS_DISCONNECT" })
      );
      expect(errorHtml).toContain("WebSocket connection lost");
      expect(errorHtml).toContain("ERR_WS_DISCONNECT");
    });

    it("renders NavTabs, Breadcrumbs, and HeaderBar", () => {
      const navHtml = renderToString(
        h(NavTabs, {
          activeId: "monitor",
          onChange: () => {},
          tabs: [
            { id: "overview", label: "Overview" },
            { id: "monitor", label: "Live Protection", count: 1 },
          ],
        })
      );
      expect(navHtml).toContain('role="tablist"');
      expect(navHtml).toContain("Live Protection");

      const breadcrumbHtml = renderToString(
        h(Breadcrumbs, {
          items: [
            { label: "Console", href: "/" },
            { label: "Forensics" },
          ],
        })
      );
      expect(breadcrumbHtml).toContain('aria-label="Breadcrumb"');
      expect(breadcrumbHtml).toContain("Console");
      expect(breadcrumbHtml).toContain("Forensics");

      const headerHtml = renderToString(
        h(HeaderBar, { title: "VoiceShield Security Engine", subtitle: "Active Monitoring" })
      );
      expect(headerHtml).toContain("VoiceShield Security Engine");
      expect(headerHtml).toContain("Active Monitoring");
    });
  });
});
