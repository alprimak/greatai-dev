---
title: 'From SSH Sessions to Autonomous Agent Teams: Local Orchestration with Unix Primitives'
description: 'How I evolved from Tailscale + Termux remote access to running 6 autonomous AI agents using file-based IPC, systemd, and cron — no cloud APIs required.'
pubDate: 'Jan 20 2026'
tags: ['ai', 'agents', 'claude', 'unix', 'automation']
---

In my [previous post](/blog/claude-anywhere-tailscale-termux), I showed how Tailscale + Termux lets you pick up Claude sessions from anywhere. That was step one.

Here's step two: **running an autonomous team of 6 AI agents on your local machine** using nothing but Unix primitives — files, cron, and systemd.

No cloud APIs. No per-token costs. Just your Claude subscription and some elegant shell scripts.

## The Problem with API-Based Agents

Most AI agent frameworks are built around API calls:

```python
# Typical pattern
response = anthropic.messages.create(
    model="claude-3-opus",
    messages=[{"role": "user", "content": task}]
)
```

This works, but it has costs:
- **Per-token pricing** — $15/$75 per million tokens adds up fast with autonomous agents
- **Rate limits** — Hit a limit and your pipeline stalls
- **Network dependency** — API down? Agents down.

What if your agents could just... run locally, using your existing Claude subscription?

## The Architecture

```
local-agents/
├── pm/                     # PM/CEO agent
│   └── CLAUDE.md           # Agent instructions
├── architect/              # Software Architect
├── engineer/               # Implements features
├── tester/                 # QA testing
├── marketing/              # Growth & content
├── community/              # Support & community
├── shared/
│   ├── triggers/           # Task dispatch (file-based IPC)
│   │   ├── engineer.trigger
│   │   ├── tester.trigger
│   │   └── ...
│   ├── responses/          # Agent outputs
│   │   ├── engineer.response
│   │   └── ...
│   └── context/            # Shared state
│       ├── team-log.md
│       └── work-tracker.md
└── scripts/
    ├── telegram-poll.sh    # Remote control
    ├── trigger-agent.sh    # Dispatch tasks
    └── cron-morning.sh     # Scheduled checks
```

**The key insight:** Files are the universal IPC mechanism. Every Unix tool can read/write files.

## File-Based Inter-Process Communication

Agent coordination happens through simple files:

```bash
# PM delegates to Engineer
echo "TASK: Implement user preferences for issue #42" > shared/triggers/engineer.trigger

# Engineer reads, works, responds
cat shared/triggers/engineer.trigger  # Receive task
# ... does the work ...
echo "DONE: PR #15 created, ready for testing" > shared/responses/engineer.response

# PM reads response, delegates to Tester
cat shared/responses/engineer.response
echo "TASK: Test PR #15" > shared/triggers/tester.trigger
```

No message queues. No Redis. No WebSockets. Just files that any process can touch.

## Running Claude Code as an Agent

Each agent is a Claude Code session with a `CLAUDE.md` file defining its role. Two execution modes:

### Interactive Mode (tmux)

For agents that need ongoing context:

```bash
# Setup
tmux new -s agent-pm
cd local-agents/pm
claude  # Starts interactive session

# Agent reads CLAUDE.md automatically, knows its role
```

### One-Shot Mode (cron/systemd)

For scheduled tasks:

```bash
# Run a quick task
cd local-agents/pm && claude -p "Check GitHub for pending reviews"

# Perfect for cron jobs
# crontab -e
0 9 * * * cd ~/Projects/local-agents/pm && claude -p "Morning standup"
```

The `-p` flag sends a prompt directly and exits after completion.

## Systemd for Persistent Services

The Telegram bot needs to run continuously. Systemd user services handle this:

```ini
# ~/.config/systemd/user/telegram-poll.service
[Unit]
Description=Telegram Bot for Agent Control

[Service]
Type=simple
WorkingDirectory=/home/user/Projects/local-agents
ExecStart=/home/user/Projects/local-agents/scripts/telegram-poll.sh
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

```bash
systemctl --user enable --now telegram-poll
journalctl --user -u telegram-poll -f  # Watch logs
```

Now you can `/status` your agent team from your phone.

## The PM Agent: Single Point of Communication

Here's the elegant part: **only the PM talks to you**. Other agents report to the PM, who aggregates and filters.

From `pm/CLAUDE.md`:

```markdown
## COMMUNICATION HUB

You are the ONLY agent that communicates with the founder via Telegram.
All agents report to YOU. YOU aggregate and report to founder.

**Founder only needs to:**
- Approve marketing content
- Approve PRs (after QA passes)

Everything else is autonomous.
```

This means:
- Engineer finishes PR → Reports to PM → PM triggers Tester
- Tester passes QA → Reports to PM → PM notifies you
- You approve → PM tells Engineer to merge

You're not flooded with 6 agents pinging you. One aggregated report.

## Proactive Pipeline Management

The PM doesn't just relay messages. It actively manages the pipeline:

```markdown
## SELF-ASSESSMENT PROTOCOL

When idle, scan for:
- `DONE:` in responses → Push to next pipeline stage
- `REQUEST:` in responses → Agent needs a decision
- `ERROR:` in responses → Something failed
- Stale responses → Agent might be stuck

**Decision Matrix:**
| Situation | Action |
|-----------|--------|
| Engineer finished | Trigger Tester |
| Tester approved | Notify founder |
| Agent stuck >4 hours | Escalate |
```

The PM runs this check every 30 minutes via cron. Work flows through the pipeline without you pushing every step.

## Cron for Scheduled Intelligence

```bash
# Morning standup - PM checks all agents
0 9 * * * cd ~/local-agents && ./scripts/cron-morning.sh

# Hourly pipeline check
0 * * * * cd ~/local-agents && ./scripts/cron-hourly.sh

# Community check every 15 minutes
*/15 * * * * cd ~/local-agents/community && claude -p "Check for new discussions"
```

Your agents wake up, do their jobs, and go back to sleep. You check in when convenient.

## Cost Comparison

| Approach | Monthly Cost | Notes |
|----------|--------------|-------|
| Claude API | $50-200+ | Scales with token usage |
| Claude Pro | $20 | 5x usage vs free |
| Claude Max | $100-200 | Higher limits, priority |

For running 6 agents with scheduled tasks, a subscription beats API pricing significantly. My agent team runs on Claude Pro.

## The GitHub Integration

Agents coordinate through GitHub issues and PRs:

```bash
# PM creates task
gh issue create --repo myorg/myapp \
  --title "[Feature] User preferences" \
  --label "engineering,needs-architecture"

# Architect reviews, adds guidance
gh issue comment 42 --body "Recommended: IndexedDB for persistence..."

# Engineer creates PR
gh pr create --title "feat: user preferences" --body "Closes #42"

# Tester reports
gh pr comment 15 --body "QA PASSED: All tests green"
```

The `gh` CLI is perfect for agents — scriptable, authenticated, works everywhere.

## What's Next: Operum

This local orchestration pattern became the foundation for [Operum](https://operum.ai) — a desktop app that packages all of this into a clean UI with:

- Visual agent status dashboard
- Team templates (PM, Engineer, Tester, etc.)
- GitHub pipeline integration
- One-click agent deployment

But the core architecture remains: **files for IPC, systemd for services, cron for scheduling**. Unix primitives that have worked for 50 years.

## Try It Yourself

The pattern is simple:

1. **Create agent directories** with `CLAUDE.md` instructions
2. **Set up shared/triggers and shared/responses** for IPC
3. **Add a Telegram bot** for remote control (optional)
4. **Schedule with cron** for autonomous operation

You don't need a framework. You need files, shell scripts, and Claude Code.

---

*Building autonomous agent teams? I'm documenting the journey at [operum.ai](https://operum.ai). Find me on [LinkedIn](https://www.linkedin.com/in/alexander-primak/) or [Twitter](https://twitter.com/alprimak).*
