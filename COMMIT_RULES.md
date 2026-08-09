# COMMIT RULES (mandatory, no exceptions)

## Core rule
NEVER `git add .` / `git add -A`. NEVER commit all changes in one commit.
Split every task into atomic commits: one commit = one logical change.

## Workflow (always in this order)
1. `git status` + `git diff` — inspect all changed/new files.
2. Group changed files by logical purpose (feature, fix, deps, docs, style, config).
3. For each group: `git add <specific files>` → `git commit -m "<msg>"`.
4. Repeat until all groups committed. Never skip grouping step even for small tasks.

## Grouping rule
Unrelated changes → separate commits. Example: bug fix + dependency bump + formatting
= 3 commits, 3 separate `git add` calls, not 1.

If a single feature needs multiple commits: one commit = `feat`, rest = `chore`/`refactor`/etc.

If unsure which group a file belongs to → ask user. Do not guess.

## Message format (Conventional Commits)
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```
- description: present tense, lowercase start, no trailing period.
- scope: optional, module/file/feature name in parentheses.
- BREAKING CHANGE: → footer `BREAKING CHANGE: <desc>` or `!` after type/scope.

## Types
| type     | use for                                              |
|----------|-------------------------------------------------------|
| feat     | new feature                                            |
| fix      | bug fix                                                |
| refactor | code restructure, no behavior change                   |
| perf     | performance improvement, no behavior change            |
| docs     | documentation only                                     |
| test     | add/update tests only                                  |
| style    | formatting only, no logic change                       |
| chore    | routine maintenance, non-source-affecting               |
| deps     | dependency/version bump (Android: build.gradle, libs.versions.toml) |
| build    | build system/config changes                            |
| ci       | CI pipeline changes                                     |
| revert   | revert a previous commit                                |

## Before every commit
- Confirm `git add` file list matches exactly one logical group.
- Confirm commit type matches the actual change (not "chore" for everything).
- If touching `build.gradle*`, `libs.versions.toml` → type is `deps` or `build`, never `feat`/`fix`.

## Forbidden
- `git add .` / `git add -A` in any form.
- One commit mixing feature + fix + deps + docs.
- Vague messages: "update", "changes", "wip", "fix stuff".
- Committing without prior `git status`/`git diff` check.