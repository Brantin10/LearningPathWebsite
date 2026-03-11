# Create Your First Claude Code Skill: Slash Commands From Scratch

## Beginner + Advanced Guide

---

# PART 1 — Beginner Guide

## What Is a Skill?

A skill is a folder containing a `SKILL.md` file that teaches Claude Code how to complete a specific task. When you type `/skill-name` in Claude Code, it loads the instructions from that file and follows them.

Think of it as a reusable prompt template that you can trigger on demand.

Skills replaced the older `.claude/commands/` system. Legacy command files still work, but skills are the standard going forward.

## Prerequisites

- Claude Code CLI installed and working
- A project directory with a `.claude/` folder (created automatically when you first use Claude Code in a project)
- Basic markdown knowledge

## Folder Structure

Skills live in `.claude/skills/` — either in your project or globally.

```
# Project-level skill (only this project)
your-project/
└── .claude/
    └── skills/
        └── my-skill/
            └── SKILL.md

# Personal skill (all your projects)
~/.claude/
└── skills/
    └── my-skill/
        └── SKILL.md
```

**Rule:** The folder name becomes the slash command. A folder named `review` creates the `/review` command.

## Creating Your First Skill

Let's build a `/review` skill that reviews code files.

### Step 1: Create the folder

```bash
mkdir -p .claude/skills/review
```

### Step 2: Create SKILL.md

Create `.claude/skills/review/SKILL.md`:

```markdown
---
name: review
description: Reviews code for bugs, security issues, and style violations. Use when asked to review code, check code quality, or audit a file.
argument-hint: "[file-path]"
---

# Code Review

Review the file or code at `$ARGUMENTS`.

## Review Checklist

Go through each item. Report only actual issues found.

1. **Bugs** — Logic errors, off-by-one, null/undefined risks, race conditions
2. **Security** — Injection, hardcoded secrets, unvalidated input, XSS
3. **Performance** — Unnecessary loops, missing memoization, N+1 queries
4. **Readability** — Unclear naming, missing types, complex nesting
5. **Edge Cases** — Empty inputs, large datasets, concurrent access

## Output Format

For each issue found:

- **File:** `filename:line`
- **Severity:** 🔴 High / 🟡 Medium / 🟢 Low
- **Issue:** One sentence description
- **Fix:** One sentence recommendation

End with a summary: total issues found, overall code quality rating (1-10).

If no issues found, say "No issues found" and give the rating.
```

### Step 3: Test It

Open Claude Code in your project and type:

```
/review src/app/layout.tsx
```

Claude loads the SKILL.md instructions and reviews that file following your exact checklist and output format.

You can also test auto-invocation by just asking naturally:

```
Can you review this file for bugs? src/utils/auth.ts
```

If your description is good, Claude will load the skill automatically.

## SKILL.md Anatomy

Every SKILL.md has two parts:

### 1. YAML Frontmatter (between `---`)

| Field | Required | What It Does |
|-------|----------|-------------|
| `name` | No | Slash command name. Defaults to folder name. Lowercase, hyphens, max 64 chars. |
| `description` | No | Tells Claude WHEN to use this skill. Critical for auto-invocation. Defaults to first paragraph. |
| `argument-hint` | No | Shows in autocomplete. Example: `[filename]` or `[issue-number]` |
| `disable-model-invocation` | No | Set `true` to prevent Claude from auto-triggering. Only you can invoke with `/name`. |
| `allowed-tools` | No | Tools Claude can use without asking permission. Example: `Read, Grep, Glob` |

### 2. Markdown Body

Your actual instructions. This is what Claude follows when the skill is invoked.

**Key variables you can use:**
- `$ARGUMENTS` — Everything typed after the slash command
- `$0`, `$1`, `$2` — Individual arguments by position

Example: `/deploy staging us-east-1`
- `$ARGUMENTS` = `staging us-east-1`
- `$0` = `staging`
- `$1` = `us-east-1`

## Example Skills

### /audit — Security Audit

`.claude/skills/audit/SKILL.md`:

```markdown
---
name: audit
description: Security audit of a file or directory. Use when asked to check for vulnerabilities, security issues, or hardcoded secrets.
argument-hint: "[path]"
allowed-tools: Read, Grep, Glob
---

# Security Audit

Audit `$ARGUMENTS` for security vulnerabilities.

## Scan For

1. **Hardcoded secrets** — API keys, passwords, tokens, connection strings
2. **Injection risks** — SQL injection, command injection, XSS
3. **Auth issues** — Missing auth checks, broken access control
4. **Data exposure** — Sensitive data in logs, URLs, error messages
5. **Dependencies** — Known vulnerable packages (check package.json)

## Output

List each finding:

- **Location:** `file:line`
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Type:** Category from the list above
- **Description:** What's wrong
- **Remediation:** How to fix it

End with: total findings by severity, and whether the code is safe to deploy (YES/NO).
```

### /readme — Generate README

`.claude/skills/readme/SKILL.md`:

```markdown
---
name: readme
description: Generates a README.md for the project or a specific directory. Use when asked to create documentation, write a readme, or document a project.
argument-hint: "[directory]"
allowed-tools: Read, Grep, Glob
---

# Generate README

Generate a README.md for the project at `$ARGUMENTS` (default: current directory).

## Steps

1. Read package.json, Cargo.toml, pyproject.toml, or equivalent to identify the project
2. Scan the directory structure to understand the architecture
3. Read key files to understand the purpose

## README Structure

Write exactly this structure:

```
# Project Name

One sentence description.

## Features

- Bullet list of key features

## Tech Stack

- List of technologies used

## Getting Started

### Prerequisites

What you need installed.

### Installation

Step-by-step commands to install and run.

## Project Structure

Brief folder structure with descriptions.

## License

License type.
```

Do not add sections that aren't listed. Do not add badges. Keep it clean and factual.
```

### /changelog — Generate Changelog

`.claude/skills/changelog/SKILL.md`:

```markdown
---
name: changelog
description: Generates a changelog from recent git commits. Use when asked to write release notes, summarize changes, or create a changelog.
argument-hint: "[version-or-range]"
disable-model-invocation: true
---

# Generate Changelog

Generate a changelog for version `$ARGUMENTS`.

## Steps

1. Run `git log --oneline` to get recent commits
2. If a version tag is provided, use `git log v$ARGUMENTS..HEAD --oneline`
3. Group commits by category

## Output Format

```
## [$ARGUMENTS] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Fixed
- Bug fixes

### Removed
- Removed features
```

Rules:
- One line per change
- Start each line with a verb (Add, Fix, Update, Remove)
- No commit hashes
- No author names
- Merge duplicate entries
- Skip commits that are just "fix typo" or "merge branch" unless meaningful
```

## Common Beginner Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| File named `skill.md` (lowercase) | Must be `SKILL.md` exactly | Rename to `SKILL.md` |
| Skill folder inside wrong directory | `.claude/skills/` not `.claude/skill/` or `.claude/commands/` | Use `.claude/skills/<name>/SKILL.md` |
| Vague description | Claude won't know when to auto-invoke | Write descriptions with specific trigger words |
| No output format specified | Claude decides its own format every time | Always define the exact output structure |
| Using `disable-model-invocation` on everything | Skills become useless unless you remember them | Only use it for dangerous actions (deploy, delete, send) |
| Giant SKILL.md (1000+ lines) | Eats your context window | Keep under 500 lines. Use supporting files for reference material |

## Folder Structure Recap

```
your-project/
├── .claude/
│   └── skills/
│       ├── review/
│       │   └── SKILL.md
│       ├── audit/
│       │   └── SKILL.md
│       ├── readme/
│       │   └── SKILL.md
│       └── changelog/
│           └── SKILL.md
├── src/
├── package.json
└── ...
```

That's it. Each skill is one folder with one `SKILL.md`. You now know enough to create any basic skill.

---

# PART 2 — Advanced Guide

## Why Basic Skills Produce Inconsistent Output

A basic SKILL.md says "review this code." Claude interprets that differently every time — sometimes it gives a table, sometimes bullet points, sometimes it rambles for 2000 words, sometimes it gives 3 lines.

The fix: treat SKILL.md like a contract, not a suggestion.

Every instruction must be:
- **Specific** — what exactly to do
- **Constrained** — what NOT to do
- **Formatted** — what the output looks like
- **Bounded** — how much output to produce

## Constraint-Based Instruction Writing

### Weak Instructions

```markdown
Review the code for issues.
Give me a summary.
Check for bugs.
```

Claude will produce different output every single time.

### Strong Instructions

```markdown
Review the code for exactly these 5 categories: bugs, security, performance, readability, edge cases.

For each issue found, output exactly:
- **File:** filename:line
- **Severity:** 🔴/🟡/🟢
- **Issue:** One sentence, max 20 words
- **Fix:** One sentence, max 20 words

Do not explain your reasoning. Do not add introductions. Do not add conclusions beyond the summary line. Do not suggest improvements that aren't bugs.

End with exactly one line: "X issues found. Quality: Y/10."
```

Same task. Wildly different consistency.

### The Constraint Formula

Every instruction block should answer:

1. **What** — Exactly what to do (enumerate the steps)
2. **How** — Exact format of the output
3. **Boundaries** — What NOT to do
4. **Limits** — Maximum length, number of items, depth

## Progressive Disclosure Architecture

Don't dump everything into SKILL.md. Claude loads the full content when the skill is invoked — every line costs context tokens.

Structure your skill with a lean SKILL.md that references supporting files:

```
my-advanced-skill/
├── SKILL.md              # Core instructions (< 200 lines)
├── EXAMPLES.md           # Good/bad output examples
├── TEMPLATES.md          # Output templates to fill in
├── REFERENCE.md          # API docs, conventions, standards
├── scripts/
│   ├── validate.sh       # Validation scripts
│   └── collect-data.py   # Data gathering scripts
└── templates/
    ├── report.md         # Report template
    └── summary.md        # Summary template
```

SKILL.md references these files:

```markdown
For output format, follow the template in [templates/report.md](templates/report.md).
For examples of correct output, see [EXAMPLES.md](EXAMPLES.md).
Run `scripts/validate.sh` to verify the output.
```

Claude loads supporting files only when it needs them — saving context for the actual work.

## Token-Awareness Strategy

Your context window is finite. Skills compete with your conversation, file contents, and tool outputs for space.

**Rules:**

1. SKILL.md should be under 200 lines for frequently-used skills
2. Move reference material to separate files
3. Use `context: fork` for heavy skills — they run in an isolated subagent with a fresh context
4. Don't repeat yourself across skills — create a shared reference skill
5. Check your context usage with `/context`

**Context budget for skill descriptions:** ~2% of context window (~16KB). If you have 50+ skills, some descriptions get excluded. Keep descriptions short.

## Why Scripts Don't Consume Tokens

Scripts in your `scripts/` directory are not loaded into context. They sit on disk until Claude executes them with a Bash tool call. Only the script's OUTPUT enters the context.

This means you can have a 500-line Python script that generates a report, and it costs zero tokens until Claude runs it — then only the output (maybe 50 lines) enters context.

Use this pattern for:
- Data collection (git stats, file analysis, dependency scanning)
- Validation (lint checks, test runs, format verification)
- Generation (HTML reports, visualizations, formatted output)

Example script at `scripts/collect-stats.sh`:

```bash
#!/bin/bash
echo "## Project Stats"
echo "- Files: $(find . -name '*.ts' -o -name '*.tsx' | wc -l)"
echo "- Lines: $(find . -name '*.ts' -o -name '*.tsx' -exec cat {} + | wc -l)"
echo "- Components: $(grep -r 'export default function' --include='*.tsx' -l | wc -l)"
echo "- Tests: $(find . -name '*.test.*' | wc -l)"
```

SKILL.md references it:

```markdown
First, collect project statistics:
Run `bash .claude/skills/my-skill/scripts/collect-stats.sh`
Use the output to inform your analysis.
```

Zero tokens for the script. Only the 4-line output enters context.

## Few-Shot Example Strategy

Claude performs dramatically better when you show it what good output looks like. Put examples in a separate `EXAMPLES.md` file.

### Bad: No examples

```markdown
Review the code and give feedback.
```

### Good: Show exact examples

`EXAMPLES.md`:

```markdown
# Examples

## Good Output ✅

- **File:** `src/auth/login.ts:45`
- **Severity:** 🔴 High
- **Issue:** Password compared with == instead of constant-time comparison
- **Fix:** Use `crypto.timingSafeEqual()` for password comparison

## Bad Output ❌

"The login.ts file has some issues with how passwords are being compared.
You should probably look into using a more secure comparison method.
The == operator isn't great for security-sensitive comparisons because
it might be vulnerable to timing attacks. Consider using the crypto
module's timingSafeEqual function instead."

Why it's bad: Too verbose, no structured format, no file/line reference, no severity.
```

Reference from SKILL.md:

```markdown
For examples of correct and incorrect output format, read [EXAMPLES.md](EXAMPLES.md) before producing output.
```

## Trigger-Rich Descriptions

The description field determines when Claude auto-invokes your skill. Pack it with the words users actually say.

### Weak Description

```yaml
description: Reviews code
```

Claude only triggers on "review code." That's it.

### Strong Description

```yaml
description: >
  Reviews code for bugs, security issues, performance problems, and style
  violations. Use when asked to review code, check code quality, audit a file,
  find bugs, look for issues, inspect code, or do a code review. Works on
  individual files or directories.
```

Now Claude triggers on: "review," "check," "audit," "find bugs," "look for issues," "inspect," "code quality" — all natural phrases a user might say.

## Template-Driven Output Enforcement

Create a markdown template that Claude fills in. This is the most reliable way to get consistent output.

`templates/review-report.md`:

```markdown
# Code Review Report

**File:** [FILENAME]
**Reviewed:** [DATE]
**Reviewer:** Claude

## Summary

[1-2 sentence summary of overall quality]

## Issues Found

| # | Severity | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 1 | [🔴/🟡/🟢] | [file:line] | [description] | [recommendation] |

## Metrics

- **Total Issues:** [N]
- **Critical:** [N]
- **Quality Score:** [N]/10

## Verdict

[PASS / FAIL / NEEDS WORK]
```

In SKILL.md:

```markdown
Read the template at [templates/review-report.md](templates/review-report.md).
Fill in every bracketed placeholder. Do not add or remove sections.
Output the completed template and nothing else.
```

## Dynamic Context Injection

Use the `` !`command` `` syntax to inject live data into skill content before Claude sees it. The command runs immediately and its output replaces the placeholder.

```markdown
---
name: pr-review
description: Review the current pull request for issues
context: fork
agent: Explore
---

# PR Review

## PR Diff
!`git diff main...HEAD`

## Changed Files
!`git diff main...HEAD --name-only`

## Recent Commits
!`git log main...HEAD --oneline`

## Instructions

Review the changes above. For each file changed:
1. Check for bugs
2. Check for security issues
3. Verify test coverage

Output a summary table of findings.
```

Claude never sees the `` !`command` `` syntax — it sees the actual git diff, file list, and commit log.

## Skill Chaining / Pipelines

Build skills that call other skills or work in sequence.

### Pattern: Orchestrator Skill

```markdown
---
name: release
description: Full release pipeline - audit, test, changelog, deploy
disable-model-invocation: true
argument-hint: "[version]"
---

# Release Pipeline for v$ARGUMENTS

Execute these steps in order. Stop if any step fails.

## Step 1: Security Audit
Run /audit on the entire `src/` directory.
If any CRITICAL findings exist, STOP and report them.

## Step 2: Run Tests
Execute `npm test`. All tests must pass.

## Step 3: Generate Changelog
Run /changelog $ARGUMENTS to generate release notes.
Save to CHANGELOG.md.

## Step 4: Deploy
Run /deploy production.

## Step 5: Report
Output a release summary:
- Version: $ARGUMENTS
- Audit: PASS/FAIL
- Tests: PASS/FAIL (X passed, Y failed)
- Deployed: YES/NO
```

### Pattern: Subagent Delegation

Use `context: fork` to run heavy analysis in isolation:

```yaml
---
name: deep-analysis
description: Deep codebase analysis with metrics and recommendations
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

Analyze the entire codebase. You have full read access.
Produce a structured report with metrics and recommendations.
```

The `Explore` agent gets its own context window and read-only tools. Results come back to your main session.

## Real Advanced Example: Full Project Analyzer

### Folder Structure

```
.claude/skills/analyze/
├── SKILL.md
├── EXAMPLES.md
├── templates/
│   └── analysis-report.md
└── scripts/
    └── collect-metrics.sh
```

### SKILL.md

```markdown
---
name: analyze
description: >
  Comprehensive project analysis with metrics, architecture review, and
  actionable recommendations. Use when asked to analyze a project, assess
  code quality, evaluate architecture, or provide a project health check.
argument-hint: "[directory]"
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

# Project Analysis

Analyze the project at `$ARGUMENTS` (default: current directory).

## Phase 1: Collect Metrics

Run `bash .claude/skills/analyze/scripts/collect-metrics.sh`

## Phase 2: Architecture Review

Read the top-level files and directory structure. Identify:
- Framework and language
- Architecture pattern (MVC, component-based, microservices, etc.)
- Entry points
- Data flow

## Phase 3: Code Quality Scan

Search for:
1. Files over 300 lines (candidates for splitting)
2. Functions over 50 lines (candidates for refactoring)
3. TODO/FIXME/HACK comments (technical debt)
4. Console.log / print statements (debug artifacts)
5. Hardcoded strings that should be constants
6. Duplicated code patterns

## Phase 4: Output

Read the template at [templates/analysis-report.md](templates/analysis-report.md).
Fill in every section using data from phases 1-3.

Rules:
- Every claim must reference a specific file
- Every recommendation must be actionable (not "consider improving")
- Maximum 3 recommendations per category
- Do not suggest adding tools, libraries, or dependencies
- Do not comment on business logic correctness

For output quality reference, read [EXAMPLES.md](EXAMPLES.md).
```

### scripts/collect-metrics.sh

```bash
#!/bin/bash
echo "=== Project Metrics ==="
echo ""
echo "Language breakdown:"
find . -name 'node_modules' -prune -o -name '.next' -prune -o -type f -print | \
  sed 's/.*\.//' | sort | uniq -c | sort -rn | head -15
echo ""
echo "File count by directory:"
find . -name 'node_modules' -prune -o -name '.next' -prune -o -name '.git' -prune -o -type f -print | \
  sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -15
echo ""
echo "Largest files (by lines):"
find . -name 'node_modules' -prune -o -name '.next' -prune -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' \) -print | \
  xargs wc -l 2>/dev/null | sort -rn | head -15
echo ""
echo "TODO/FIXME count:"
grep -r "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" -c . 2>/dev/null | grep -v ":0$" | sort -t: -k2 -rn
echo ""
echo "Dependencies:"
if [ -f package.json ]; then
  node -e "const p=require('./package.json'); console.log('Production:', Object.keys(p.dependencies||{}).length); console.log('Dev:', Object.keys(p.devDependencies||{}).length);"
fi
```

### templates/analysis-report.md

```markdown
# Project Analysis Report

**Project:** [NAME]
**Analyzed:** [DATE]
**Directory:** [PATH]

## Overview

[2-3 sentence summary of what this project is and its current state]

## Metrics

| Metric | Value |
|--------|-------|
| Total Files | [N] |
| Total Lines | [N] |
| Languages | [list] |
| Dependencies | [N prod / N dev] |
| TODOs/FIXMEs | [N] |

## Architecture

**Pattern:** [pattern name]
**Framework:** [framework + version]
**Key directories:**

| Directory | Purpose |
|-----------|---------|
| [dir] | [purpose] |

## Code Quality

### Large Files (> 300 lines)

| File | Lines | Recommendation |
|------|-------|----------------|
| [file] | [N] | [action] |

### Technical Debt

| Location | Type | Description |
|----------|------|-------------|
| [file:line] | [TODO/FIXME/HACK] | [description] |

## Top 3 Recommendations

1. **[Title]** — [One paragraph with specific files and actions]
2. **[Title]** — [One paragraph with specific files and actions]
3. **[Title]** — [One paragraph with specific files and actions]

## Health Score

**[N]/10** — [One sentence justification]
```

### EXAMPLES.md

```markdown
# Output Examples

## Good Recommendation ✅

**Extract Auth Logic** — `src/app/layout.tsx` (342 lines) contains both layout
rendering and authentication logic. Extract the auth check at lines 45-120 into
a dedicated `src/lib/auth.ts` module. This reduces the file to ~220 lines and
makes auth logic reusable across routes.

## Bad Recommendation ❌

"The layout file is pretty long. You might want to think about breaking it up
into smaller pieces. Maybe consider using a different architecture pattern."

Why it's bad: No specific files, no line numbers, no concrete action, vague language.

## Good Metric Table ✅

| Metric | Value |
|--------|-------|
| Total Files | 47 |
| Total Lines | 8,234 |
| Languages | TypeScript, CSS, JSON |
| Dependencies | 23 prod / 12 dev |
| TODOs/FIXMEs | 8 |

## Bad Metric Table ❌

"The project has quite a few files and a moderate number of dependencies.
There are some TODOs scattered around."

Why it's bad: No actual numbers, no structure, useless information.
```

---

## Production Checklist

Before shipping a skill, verify:

- [ ] `SKILL.md` is under 200 lines
- [ ] Description contains 5+ trigger words/phrases users would actually say
- [ ] Output format is explicitly defined (template or exact structure)
- [ ] Constraints say what NOT to do (not just what to do)
- [ ] `$ARGUMENTS` is used if the skill needs input
- [ ] `disable-model-invocation: true` is set for dangerous actions
- [ ] `allowed-tools` is set if the skill needs specific tool access
- [ ] `context: fork` is set for heavy/isolated analysis tasks
- [ ] Supporting files (examples, templates) are in separate files, not inline
- [ ] Scripts are tested independently before referencing from SKILL.md
- [ ] Tested with explicit invocation (`/skill-name args`)
- [ ] Tested with natural language (auto-invocation)
- [ ] Output is consistent across 3+ invocations

## Progression Roadmap

```
Level 1 — Basic
├── Single SKILL.md file
├── Simple instructions
├── No frontmatter beyond name/description
└── Manual invocation only

Level 2 — Structured
├── Defined output format
├── Constraint-based instructions
├── argument-hint for user guidance
├── allowed-tools for permission control
└── Auto-invocation via good descriptions

Level 3 — Modular
├── Supporting files (EXAMPLES.md, TEMPLATES.md)
├── Template-driven output
├── Scripts for data collection
├── Few-shot examples
└── Progressive disclosure architecture

Level 4 — Production
├── context: fork for isolation
├── Dynamic context injection (!`commands`)
├── Skill chaining / pipelines
├── Token-awareness strategy
├── Consistent output across invocations
└── Full test coverage (manual + auto-invoke)

Level 5 — Expert
├── Orchestrator skills that chain other skills
├── Custom subagent delegation
├── Hook integration for lifecycle events
├── Shared reference skills across team
├── Monorepo skill distribution
└── CI/CD integration via skill scripts
```

---

*Built for Claude Code 2.x. Skills follow the Agent Skills open standard (agentskills.io).*
