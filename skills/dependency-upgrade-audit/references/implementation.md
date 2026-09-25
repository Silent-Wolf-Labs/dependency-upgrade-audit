# Implementation and verification

## Implement the Minimal Migration

1. Update the manifest and resolve or regenerate the lockfile with normal
   ecosystem tooling.
2. Make only researched, required code, configuration, and test changes.
3. Follow repository conventions and preserve unrelated behavior.
4. Do not silence warnings or weaken security controls to make the upgrade pass.
5. Record unresolved compatibility or security concerns instead of concealing
   them.

## Verify from Narrow to Broad

Choose commands that match the ecosystem and repository conventions. Run the
smallest meaningful checks first, then broaden validation when practical:

1. Dependency resolution and lockfile consistency.
2. Compile, build, or type check.
3. Focused tests covering affected behavior.
4. Affected integration tests.
5. Full test suite.
6. Lint or static analysis.
7. Available dependency or security scan.

Do not claim a check passed unless it ran successfully. State checks that could
not run, why, and the remaining risk, including unavailable credentials,
external services, tools, or platform requirements. An upgrade is complete only
after applicable implementation and verification work has been performed, or the
report explicitly identifies what remains.
