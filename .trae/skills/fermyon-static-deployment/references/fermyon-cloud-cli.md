# Fermyon Cloud CLI (Spin v3 + cloud plugin)

This reference captures **command-level evidence** from Fermyon’s official Cloud documentation, focusing on the `spin cloud` plugin used to deploy and operate apps on Fermyon Cloud.

Sources:
- https://developer.fermyon.com/cloud/cloud-command-reference

## Core commands (discovery-first)

Use local CLI help to confirm the installed version and subcommands:

```console
$ spin cloud --help
```

The official command reference documents `spin cloud` subcommands including:
- `spin cloud login`
- `spin cloud deploy`
- `spin cloud apps ...`
- `spin cloud logs`
- `spin cloud variables ...`
- `spin cloud key-value ...`
- `spin cloud sqlite ...`
- `spin cloud link ...`
- `spin cloud unlink ...`

## `spin cloud deploy` (options evidence)

The official command reference includes `spin cloud deploy --help` output showing options such as:

```text
    -f, --from <APP_MANIFEST_FILE>
            The application to deploy. This may be a manifest (spin.toml) file, or a directory
            containing a spin.toml file. If omitted, it defaults to "spin.toml"

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            ... Set it to 0 to skip waiting for readiness

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application ...

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store ...

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name ...
```

Operational implications for this portfolio:
- Use `--from` to deploy from a repo subdirectory when the manifest is not at repo root.
- Use `--readiness-timeout` as a release gate (static hosting should become ready quickly).
- Use `--variable` only after variables are declared in `spin.toml` (do not assume).
- Treat `--key-value` as a controlled change: only use if the app explicitly uses the default store.

## Variables management (cloud plugin)

The variables tutorial documents:
- Setting variables at deploy time via `--variable`
- Updating variables after deploy via `spin cloud variables set ... --app <name>`

Source:
- https://developer.fermyon.com/cloud/variables

Example excerpt:

```bash
$ spin cloud variables set password="456" --app "pw_checker"
```

## GitHub Actions (official actions)

The GitHub Actions guide documents official actions:
- `fermyon/actions/spin/setup`
- `fermyon/actions/spin/deploy`

Source:
- https://developer.fermyon.com/cloud/github-actions

Security implication:
- Use a GitHub repository secret such as `FERMYON_CLOUD_TOKEN`
- Never print secrets in logs or release reports

