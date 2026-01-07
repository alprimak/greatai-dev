---
title: 'Claude Anywhere: My Tailscale + Termux Setup for 24/7 AI Collaboration'
description: 'How I set up Tailscale and Termux to SSH into my workstation from my phone, enabling continuous Claude Code sessions from anywhere.'
pubDate: 'Jan 07 2025'
tags: ['ai', 'productivity', 'claude', 'mobile']
---

Boris Cherny's Claude Code workflow went viral recently — 5 parallel Claude sessions, slash commands, subagents. Impressive stuff.

But here's what most setups miss: **what happens when you leave your desk?**

I run 3-6 Claude sessions simultaneously too. The difference is I can pick up any session from my phone, anywhere, anytime. Here's exactly how.

## The Architecture

```
┌─────────────────┐     Tailscale VPN      ┌──────────────────┐
│  Android Phone  │ ◄──────────────────────► │   Workstation    │
│    (Termux)     │     Encrypted Mesh      │  (Claude Code)   │
└─────────────────┘                         └──────────────────┘
```

**Components:**
- **Tailscale** — Zero-config mesh VPN. Your devices get stable IPs on a private network.
- **Termux** — Full Linux terminal on Android. Runs SSH, tmux, everything.
- **tmux** — Terminal multiplexer on the workstation. Sessions persist when you disconnect.

## Step 1: Install Tailscale on Your Workstation

```bash
# Arch Linux
sudo pacman -S tailscale
sudo systemctl enable --now tailscaled
tailscale up

# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

After authentication, your machine gets a Tailscale IP (like `100.x.x.x`) and a MagicDNS name (like `workstation.tailnet-name.ts.net`).

## Step 2: Set Up Termux on Android

Install Termux from F-Droid (not Play Store — that version is outdated).

```bash
# Update packages
pkg update && pkg upgrade

# Install essentials
pkg install openssh tmux

# Install Tailscale
pkg install tailscale
tailscaled &
tailscale up
```

## Step 3: Configure SSH

On your workstation, ensure SSH is running:

```bash
sudo systemctl enable --now sshd
```

On Termux, create an SSH config for quick access:

```bash
mkdir -p ~/.ssh
cat >> ~/.ssh/config << 'EOF'
Host workstation
    HostName workstation.tailnet-name.ts.net
    User your-username
    IdentityFile ~/.ssh/id_ed25519
EOF
```

Generate a key if you don't have one:

```bash
ssh-keygen -t ed25519
ssh-copy-id workstation
```

Now you can connect with just:

```bash
ssh workstation
```

## Step 4: tmux for Persistent Sessions

The key to continuity is **tmux**. Your Claude sessions live in tmux on the workstation, so they persist even when you disconnect.

On your workstation, start Claude in a tmux session:

```bash
tmux new -s claude1
claude
```

Create multiple sessions:

```bash
tmux new -s claude2
tmux new -s claude3
```

From your phone, attach to any session:

```bash
ssh workstation -t "tmux attach -t claude1"
```

Or list all sessions and pick one:

```bash
ssh workstation -t "tmux ls"
```

## My Daily Workflow

**Morning at desk:**
- Start 3-4 Claude sessions in tmux windows
- Each focused on different tasks (feature work, refactoring, tests, docs)

**Throughout the day (mobile):**
- SSH in from phone during commute, lunch, waiting rooms
- Check on long-running tasks
- Quick code reviews
- Brainstorm architecture decisions

**Evening:**
- Pick up where I left off on desktop
- Sessions maintained full context from earlier

## Pro Tips

### 1. Termux Widget for One-Tap Access

Install Termux:Widget and create a shortcut script:

```bash
mkdir -p ~/.shortcuts
cat > ~/.shortcuts/claude1 << 'EOF'
#!/bin/bash
ssh workstation -t "tmux attach -t claude1"
EOF
chmod +x ~/.shortcuts/claude1
```

Now you have a home screen widget that drops you directly into Claude.

### 2. Mosh for Flaky Connections

If you're on spotty mobile data, use Mosh instead of SSH:

```bash
# Workstation
sudo pacman -S mosh  # or apt install mosh

# Termux
pkg install mosh

# Connect
mosh workstation -- tmux attach -t claude1
```

Mosh handles connection drops gracefully — you won't lose your session.

### 3. tmux Status Bar

Add this to `~/.tmux.conf` to see which session you're in:

```bash
set -g status-right '#S | %H:%M'
```

### 4. Quick Session Switcher

Create a script to list and attach to Claude sessions:

```bash
#!/bin/bash
# ~/.local/bin/claude-attach
SESSION=$(tmux ls -F "#{session_name}" | grep claude | fzf)
[ -n "$SESSION" ] && tmux attach -t "$SESSION"
```

## Why This Matters

The bottleneck in AI-assisted development isn't the AI — it's availability. Ideas don't wait for business hours.

With this setup:
- **Continuity** — Same context whether you're on desktop or mobile
- **Availability** — Ship from anywhere
- **Parallel work** — Multiple Claude sessions, multiple contexts

The developers who'll win in 2025+ aren't optimizing for the most powerful desk setup. They're optimizing for **always-on availability**.

---

*Questions or improvements? Find me on [LinkedIn](https://www.linkedin.com/in/alexander-primak/) or [Twitter](https://twitter.com/alprimak).*
