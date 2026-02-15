---
title: 'The Activation Energy Problem: Why AI PMs Matter More Than AI Coders'
description: "The hardest part of engineering isn't writing code — it's starting. Here's how an AI PM eliminates the cold-start problem and lets creativity unfold."
pubDate: 'Feb 15 2026'
tags: ['ai', 'agents', 'operum', 'productivity', 'workflows']
---

Every engineer knows the feeling. You sit down to work on a project you haven't touched in two days. You open the repo. You stare at the file tree. You try to remember where you left off.

What was I working on? What's the priority? Was there a bug I was supposed to fix first, or was I in the middle of that feature? Let me check the issues. Let me re-read my notes. Let me look at the last few commits.

Twenty minutes later, you've written zero lines of code.

## The Cold-Start Tax

In chemistry, activation energy is the minimum energy required to start a reaction. Below that threshold, nothing happens — no matter how much potential the reaction has.

Engineering has the same problem. The "reaction" is productive, creative work. The activation energy is the context-loading phase — rebuilding your mental model of what you were doing, what matters, and what's next.

This tax is invisible because it doesn't show up in any metric. No one tracks "time spent remembering what I was doing." But it's real, and it compounds:

| Scenario | Context reload time | Weekly cost (5 switches) |
|----------|-------------------|------------------------|
| Side project after day job | 20-30 min | 2+ hours |
| Returning after weekend | 15-25 min | 30 min |
| Switching between two projects | 10-20 min | 1-2 hours |
| After a meeting interruption | 10-15 min | 1+ hours |

For solo founders juggling multiple projects, this easily eats 4-6 hours per week. That's a full working day lost to *remembering*.

## What Happens When an AI PM Holds Context

I've been running [operum.ai](https://operum.ai) on my own projects for the past two months. The change I didn't expect wasn't faster code generation or automated PRs. It was how much easier it became to *start*.

Here's the old workflow:

1. Open project
2. Check GitHub issues
3. Re-read recent PRs and commits
4. Try to reconstruct what's in progress
5. Figure out priorities
6. Pick a task
7. Rebuild mental context for that task
8. Start coding

Here's what happens now:

1. Open project
2. PM agent summarizes current state: what shipped, what's in progress, what's blocked, what's next
3. Start coding

Steps 2-7 collapsed into a single interaction. The PM already knows the state of every issue, every PR, every decision. It doesn't just list them — it synthesizes. "The grid virtualization PR merged yesterday. The next priority is the scroll performance issue — here's the context from the architect's analysis."

I don't have to rebuild the mental model. It's handed to me.

## The Creativity Effect

Here's the part that surprised me. Lowering activation energy doesn't just save time — it changes the quality of what you produce.

When you spend 20 minutes grinding through context reload, you arrive at "ready to code" already slightly drained. Your working memory is occupied with logistics. The creative part of your brain — the part that sees elegant solutions, that notices patterns, that makes unexpected connections — hasn't fully engaged.

When you skip straight to the work, something different happens. You're fresh. The context is there but you didn't have to fight for it. And creativity starts to unfold gradually, almost without effort.

It's the difference between warming up a cold engine for 20 minutes versus stepping into a car that's already running. You just drive.

I noticed this most clearly on [AskTurret Grid](https://askturret.com). The grid has complex rendering logic — virtual scrolling, cell editing, column resizing — the kind of code where elegant solutions matter because brute-force approaches create performance cliffs. The sessions where the PM pre-loaded my context produced noticeably better architectural decisions than the sessions where I spent 20 minutes manually rebuilding state.

## This Isn't About AI Writing Code

The AI coding discourse is dominated by code generation. Can the model write a function? Can it fix a bug? Can it build an entire app from a prompt?

Those are the wrong questions for most real-world engineering.

The bottleneck for experienced engineers isn't typing speed or syntax knowledge. It's cognitive overhead. It's the friction between "I want to work on this" and "I'm actually making progress on this."

| What people think AI productivity looks like | What it actually looks like |
|---------------------------------------------|----------------------------|
| AI writes 80% of the code | AI eliminates 80% of the friction |
| Human reviews AI output | Human starts creating immediately |
| Faster typing | Faster thinking |
| More lines of code per hour | More hours in flow state per week |

The AI PM doesn't write code for me. It manages the cognitive infrastructure so I can write better code myself.

## The Activation Energy Stack

After running this workflow for two months, I've identified three layers that reduce activation energy:

### Layer 1: State Persistence

The PM maintains structured state across sessions. Not chat history — actual project state. What's done, what's in progress, what's blocked, what decisions were made and why.

This means no session starts cold. Every interaction picks up where the last one left off, even if that was three days ago.

### Layer 2: Context Synthesis

Raw state isn't enough. "Here are 47 open issues" doesn't help you start. The PM synthesizes: "Three things matter today. Here's why, in priority order."

This is the difference between a dashboard and a briefing. Dashboards show data. Briefings drive action.

### Layer 3: Gentle Momentum

The most subtle layer. The PM doesn't just inform — it nudges. "The architect flagged a concern about the caching approach in issue #42. Want to look at that before continuing with the feature?"

It's not commanding. It's not blocking. It's a gentle push into the most productive path. And that push is often enough to tip you past the activation energy threshold and into flow.

## The Compound Effect

The real impact isn't saving 20 minutes per session. It's what those 20 minutes become when they're redirected.

Over a week, that's 4-6 hours reclaimed. Over a month, it's a full extra work week. But the quality improvement matters more than the time savings — because those recovered hours are *flow state* hours, not grinding-through-context hours.

For solo founders and small teams, this is the difference between shipping and stalling. Not because of capability, but because of friction.

The AI PM doesn't make you a better engineer. It removes the barrier between you and the engineering you're already capable of.

---

*This is part of the operum.ai series. Previous: [From 17 Issues to 194: Watching an AI Agent Team Scale Up](/blog/operum-ai-agent-team-scales-up)*

*Building with AI? Follow the journey on [LinkedIn](https://www.linkedin.com/in/alexander-primak/) or [Twitter](https://twitter.com/alprimak).*
