---
title: "From 17 Issues to 194: Watching an AI Agent Team Scale Up in Production"
description: "Two weeks ago, operum.ai had 17 issues and 10 PRs. Now the dashboard shows 194 issues, 166 PRs, and agents self-coordinating across marketing, PM, and engineering."
pubDate: 'Feb 12 2026'
tags: ['ai', 'agents', 'orchestration', 'operum', 'production', 'scaling']
heroImage: '/images/operum-mission-control.png'
---

Two weeks ago, I [introduced operum.ai](/blog/introducing-operum-ai-agent-orchestrator) with some early numbers: 17 issues triaged, 10 PRs created, 254K tokens of autonomous work. It was an experiment -- structured AI agents working as a team instead of a single assistant.

Here's what the dashboard looks like now:

![Operum Mission Control dashboard showing 3 agents working, 194 issues, 166 PRs, and agents self-coordinating](/images/operum-mission-control.png)

**194 issues. 166 PRs. 63 activities. 3 agents actively working.**

That's roughly 10x growth in two weeks, without me becoming the bottleneck.

## What Changed

The early version required constant oversight. I was still the router -- pointing agents at tasks, reviewing every handoff, keeping context in my head. The numbers were low because the system depended on me.

What shifted was agent-to-agent coordination.

Look at the screenshot closely. The PM agent isn't waiting for me to tell it what to do. It's actively triaging marketing issues -- Hacker News launch draft, Twitter/X thread, Reddit strategy, Dev.to article -- and asking whether to route them to the Marketing agent. The Marketing agent is reporting back that tasks were completed in previous sessions, confirming the fix is already on the remote branch.

This is the behavior I described in [Closing the Delegation Gap](/blog/closing-delegation-gap): agents that coordinate through structured protocols, not through me.

## The Numbers Tell the Story

| Metric | Jan 30 (intro post) | Feb 12 (today) | Change |
|--------|---------------------|-----------------|--------|
| Issues | 17 | 194 | 11x |
| PRs | 10 | 166 | 16x |
| Activities | -- | 63 | -- |
| Autonomous work | -- | 2.1 hours | -- |

The PR-to-issue ratio is interesting: 166 PRs for 194 issues means nearly every issue that gets created eventually gets a PR. The agents aren't just triaging -- they're executing.

## What Self-Coordination Looks Like

The screenshot captures a specific moment that's worth breaking down:

1. **Marketing agent** reports a task was completed in a prior session -- it's aware of work done across sessions and is updating status proactively
2. **PM agent** scans beyond Engineering's 4 active issues and finds 5 marketing issues that need routing, plus a process improvement issue and a launch coordination task
3. **PM asks me** whether to route the marketing issues or reprioritize -- it's making the judgment call about what needs human input and what doesn't

This is the orchestrator-workers pattern from Anthropic's [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) guide, but running in production rather than a demo. The PM acts as orchestrator, the specialized agents act as workers, and I act as the approver.

## What I've Learned So Far

**Agents need clear boundaries, not detailed instructions.** The PM doesn't need me to say "check for marketing issues." It needs to know that marketing issues exist in its scope and that it should surface routing decisions.

**Cross-session memory matters more than single-session intelligence.** The Marketing agent knowing that "this task was completed in previous sessions" is more valuable than a smarter model that starts fresh every time.

**10x throughput doesn't mean 10x my time.** The dashboard went from 17 to 194 issues while my daily involvement stayed roughly the same -- maybe 30 minutes of reviewing and approving. The agents absorbed the increase.

**The bottleneck shifted.** Early on, the constraint was agent capability. Now it's my review bandwidth. I'm the slowest part of the system, which is exactly where a human should be -- at the approval gate, not in the execution loop.

## What's Next

The agents are now preparing for operum.ai's public launch. That means the Marketing agent is drafting launch content, the PM is coordinating the rollout, and the Engineer is building the features needed for public alpha. The system is building its own launch.

If you're a solo founder or small team that wants AI agents working alongside you -- not just answering questions but actually executing -- [download operum.ai](https://operum.ai/download). Available now for macOS and Linux.

I'll keep sharing real numbers as they come in. No cherry-picked demos. Just what actually happens when you let AI agents run in production.

---

*Previous in series: [Introducing operum.ai: AI Agent Orchestration for Builders](/blog/introducing-operum-ai-agent-orchestrator)*

*Building with AI agents? Follow the journey on [LinkedIn](https://www.linkedin.com/in/alexander-primak/) or [Twitter](https://twitter.com/alprimak).*
