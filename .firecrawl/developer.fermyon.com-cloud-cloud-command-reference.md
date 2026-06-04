# Cloud Command Reference

- [Spin Cloud Command](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-command)
- [spin cloud](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud)
- [spin cloud apps](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-apps)
- [spin cloud apps delete](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-apps-delete)
- [spin cloud apps info](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-apps-info)
- [spin cloud apps list](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-apps-list)
- [spin cloud deploy](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-deploy)
- [spin cloud help](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-help)
- [spin cloud key-value](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value)
- [spin cloud key-value create](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value-create)
- [spin cloud key-value delete](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value-delete)
- [spin cloud key-value list](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value-list)
- [spin cloud key-value rename](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value-rename)
- [spin cloud key-value set](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-key-value-set)
- [spin cloud link](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-link)
- [spin cloud link key-value](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-link-key-value)
- [spin cloud link sqlite](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-link-sqlite)
- [spin cloud login](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-login)
- [spin cloud logout](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-logout)
- [spin cloud logs](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-logs)
- [spin cloud sqlite](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite)
- [spin cloud sqlite create](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-create)
- [spin cloud sqlite delete](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-delete)
- [spin cloud sqlite execute](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-execute)
- [spin cloud sqlite help](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-help)
- [spin cloud sqlite list](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-list)
- [spin cloud sqlite rename](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-sqlite-rename)
- [spin cloud unlink](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-unlink)
- [spin cloud unlink key-value](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-unlink-key-value)
- [spin cloud unlink sqlite](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-unlink-sqlite)
- [spin cloud variables](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-variables)
- [spin cloud variables delete](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-variables-delete)
- [spin cloud variables help](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-variables-help)
- [spin cloud variables list](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-variables-list)
- [spin cloud variables set](https://developer.fermyon.com/cloud/cloud-command-reference#spin-cloud-variables-set)
- [Subcommand Stability Table](https://developer.fermyon.com/cloud/cloud-command-reference#subcommand-stability-table)

## Spin Cloud Command

Fermyon provides a [`cloud` plugin](https://github.com/fermyon/cloud-plugin) for the [Spin CLI](https://spinframework.dev/) for you to manage Spin applications in Fermyon Cloud. This page documents the `spin cloud` command. Specifically, all of the available options and subcommands. For more information on subcommand stability, see the [subcommands stability table](https://developer.fermyon.com/cloud/cloud-command-reference#subcommand-stability-table). You can reproduce the Spin Cloud command documentation on your machine by using the `--help` flag. For example:

## spin cloud

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Login to Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud --help
Fermyon Engineering <engineering@fermyon.com>

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Log into Fermyon Cloud
    logout       Log out of Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin todo --help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    key-value    Manage Fermyon Cloud key value stores
    link         Link apps to resources
    login        Log into Fermyon Cloud
    logout       Log out of Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

## spin cloud apps

- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help

spin-cloud-apps 0.2.0 (df0e822 2023-09-13)
Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    list      List all the apps deployed in Fermyon Cloud
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help

Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    info      Get details about a deployed app in Fermyon Cloud
    list      List all the apps deployed in Fermyon Cloud
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help

Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    info      Get details about a deployed app in Fermyon Cloud
    list      List all the apps deployed in Fermyon Cloud
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help

Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    info      Get details about a deployed app in Fermyon Cloud
    list      List all the apps deployed in Fermyon Cloud
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help
Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    info      Get details about a deployed app in Fermyon Cloud
    list      List all the apps deployed in Fermyon Cloud
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps --help

Manage applications deployed to Fermyon Cloud

USAGE:
    spin cloud apps <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete an app deployed in Fermyon Cloud
    help      Print this message or the help of the given subcommand(s)
    info      Get details about a deployed app in Fermyon Cloud
    list      List all the apps deployed in Fermyon Cloud
```

## spin cloud apps delete

- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help

spin-cloud-apps-delete 0.2.0 (df0e822 2023-09-13)
Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help

Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help

Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help

Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help
Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps delete --help

Delete an app deployed in Fermyon Cloud

USAGE:
    spin cloud apps delete <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud apps info

- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps info --help
Get details about a deployed app in Fermyon Cloud

USAGE:
    spin cloud apps info [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps info --help
Get details about a deployed app in Fermyon Cloud

USAGE:
    spin cloud apps info [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps info --help
Get details about a deployed app in Fermyon Cloud

USAGE:
    spin cloud apps info [OPTIONS] <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps info --help
Get details about a deployed app in Fermyon Cloud

USAGE:
    spin cloud apps info <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps info --help

Get details about a deployed app in Fermyon Cloud

USAGE:
    spin cloud apps info <APP>

ARGS:
    <APP>    Name of Spin app

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud apps list

- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help

List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help

List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help

List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help

List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help
List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud apps list --help

List all the apps deployed in Fermyon Cloud

USAGE:
    spin cloud apps list

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud deploy

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    cloud deploy [OPTIONS]

OPTIONS:
        --buildinfo <BUILDINFO>
            Build metadata to append to the bindle version

    -d, --staging-dir <STAGING_DIR>
            Path to assemble the bindle before pushing (defaults to a temporary directory)

    -e, --deploy-existing-bindle
            Deploy existing bindle if it already exists on bindle server

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APP_MANIFEST_FILE>
            The application to deploy. This may be a manifest (spin.toml) file, or a directory
            containing a spin.toml file. If omitted, it defaults to "spin.toml" [default: spin.toml]

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --no-buildinfo
            Disable attaching buildinfo [env: SPIN_DEPLOY_NO_BUILDINFO=]

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable pair (variable=value) in the deployed application. Any existing value
            will be overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --buildinfo <BUILDINFO>
            Build metadata to append to the bindle version

    -d, --staging-dir <STAGING_DIR>
            Path to assemble the bindle before pushing (defaults to a temporary directory)

    -e, --deploy-existing-bindle
            Deploy existing bindle if it already exists on bindle server

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APP_MANIFEST_FILE>
            The application to deploy. This may be a manifest (spin.toml) file, or a directory
            containing a spin.toml file. If omitted, it defaults to "spin.toml" [default: spin.toml]

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --no-buildinfo
            Disable attaching buildinfo [env: SPIN_DEPLOY_NO_BUILDINFO=]

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --buildinfo <BUILDINFO>
            Build metadata to append to the bindle version

    -d, --staging-dir <STAGING_DIR>
            Path to assemble the bindle before pushing (defaults to a temporary directory)

    -e, --deploy-existing-bindle
            Deploy existing bindle if it already exists on bindle server

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APP_MANIFEST_FILE>
            The application to deploy. This may be a manifest (spin.toml) file, or a directory
            containing a spin.toml file. If omitted, it defaults to "spin.toml" [default: spin.toml]

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --no-buildinfo
            Disable attaching buildinfo [env: SPIN_DEPLOY_NO_BUILDINFO=]

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --build
            Specifies to perform `spin build` before deploying the application [env:\
            SPIN_ALWAYS_BUILD=]

        --buildinfo <BUILDINFO>
            Build metadata to append to the oci tag

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APP_MANIFEST_FILE>
            The application to deploy. This may be a manifest (spin.toml) file, or a directory
            containing a spin.toml file. If omitted, it defaults to "spin.toml" [default: spin.toml]

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --no-buildinfo
            Disable attaching buildinfo [env: SPIN_DEPLOY_NO_BUILDINFO=]

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --build
            For local apps, specifies to perform `spin build` before deploying the application [env:\
            SPIN_ALWAYS_BUILD=]

        --buildinfo <BUILDINFO>
            Build metadata to append to the oci tag

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APPLICATION>
            The application to deploy. This may be a manifest (spin.toml) file, a directory
            containing a spin.toml file, or a remote registry reference. If omitted, it defaults to
            "spin.toml"

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --no-buildinfo
            Disable attaching buildinfo [env: SPIN_DEPLOY_NO_BUILDINFO=]

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --build
            For local apps, specifies to perform `spin build` before deploying the application.

            This is ignored on remote applications, as they are already built.

            [env: SPIN_ALWAYS_BUILD=]

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance

            [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -f, --from <APPLICATION>
            The application to deploy. This may be a manifest (spin.toml) file, a directory
            containing a spin.toml file, or a remote registry reference. If omitted, it defaults to
            "spin.toml"

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness

            [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help
Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --build
            For local apps, specifies to perform `spin build` before deploying the application.

            This is ignored on remote applications, as they are already built.

            [env: SPIN_ALWAYS_BUILD=]

    -f, --from <APPLICATION>
            The application to deploy. This may be a manifest (spin.toml) file, a directory
            containing a spin.toml file, or a remote registry reference. If omitted, it defaults to
            "spin.toml"

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --link <LINKS>
            Specifies how application labels (such as SQLite databases) should be linked if they are
            not already linked. This is intended for non-interactive environments such as release
            pipelines; therefore, if any links are specified, all links must be specified.

            Links must be of the form 'sqlite:label=database'. Databases that do not exist will be
            created.

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness

            [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud deploy --help

Package and upload an application to the Fermyon Cloud

USAGE:
    spin cloud deploy [OPTIONS]

OPTIONS:
        --build
            For local apps, specifies to perform `spin build` before deploying the application.

            This is ignored on remote applications, as they are already built.

            [env: SPIN_ALWAYS_BUILD=]

    -f, --from <APPLICATION>
            The application to deploy. This may be a manifest (spin.toml) file, a directory
            containing a spin.toml file, or a remote registry reference. If omitted, it defaults to
            "spin.toml"

    -h, --help
            Print help information

        --key-value <KEY_VALUES>
            Set a key/value pair (key=value) in the deployed application's default store. Any
            existing value will be overwritten. Can be used multiple times

        --link <LINKS>
            Specifies how application labels (such as SQLite databases) should be linked if they are
            not already linked. This is intended for non-interactive environments such as release
            pipelines; therefore, if any links are specified, all links must be specified.

            Links must be of the form 'sqlite:label=database' or 'kv:label=store'. Databases or key
            value stores that do not exist will be created.

        --readiness-timeout <READINESS_TIMEOUT_SECS>
            How long in seconds to wait for a deployed HTTP application to become ready. The default
            is 60 seconds. Set it to 0 to skip waiting for readiness

            [default: 60]

    -V, --version
            Print version information

        --variable <VARIABLES>
            Set a variable (variable=value) in the deployed application. Any existing value will be
            overwritten. Can be used multiple times
```

## spin cloud help

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

```console
$ spin cloud help

USAGE:
    cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Login to Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help
Fermyon Engineering <engineering@fermyon.com>

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Log into Fermyon Cloud
    logout       Log out of Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud help

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    key-value    Manage Fermyon Cloud key value stores
    link         Link apps to resources
    login        Log into Fermyon Cloud
    logout       Log out of Fermyon Cloud
    logs         Fetch logs for an app from Fermyon Cloud
    sqlite       Manage Fermyon Cloud SQLite databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

## spin cloud key-value

Alias: `spin cloud kv`

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value --help

Manage Fermyon Cloud key value stores

USAGE:
    spin cloud key-value <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create    Create a new key value store
    delete    Delete a key value store
    help      Print this message or the help of the given subcommand(s)
    list      List key value stores
    rename    Rename a key value store. All existing links will automatically link to the
                  store's new name
    set       Set a key value pair in a store
```

## spin cloud key-value create

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value create --help

Create a new key value store

USAGE:
    spin cloud key-value create <NAME>

ARGS:
    <NAME>    The name of the key value store

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud key-value delete

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value delete --help

Delete a key value store

USAGE:
    spin cloud key-value delete [OPTIONS] <NAME>

ARGS:
    <NAME>    The name of the key value store

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
    -y, --yes        Skips prompt to confirm deletion of the key value store
```

## spin cloud key-value list

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value list --help

List key value stores

USAGE:
    spin cloud key-value list [OPTIONS]

OPTIONS:
    -a, --app <APP>              Filter list by an app
        --format <FORMAT>        Format of list [default: table] [possible values: table, json]
    -g, --group-by <GROUP_BY>    Grouping strategy of tabular list [default: app] [possible values:\
                                 app, store]
    -h, --help                   Print help information
    -s, --store <STORE>          Filter list by a key value store
    -V, --version                Print version information
```

## spin cloud key-value rename

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value rename --help

Rename a key value store. All existing links will automatically link to the store's new name

USAGE:
    spin cloud key-value rename <NAME> <NEW_NAME>

ARGS:
    <NAME>        Current name of key value store to rename
    <NEW_NAME>    New name for the key value store

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud key-value set

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud key-value set --help

Set a key value pair in a store

USAGE:
    spin cloud key-value set [OPTIONS] [KEY_VALUES]...

ARGS:
    <KEY_VALUES>...    A key/value pair (key=value) to set in the store. Any existing value will
                       be overwritten. Can be used multiple times

OPTIONS:
    -a, --app <APP>        App to which label relates
    -h, --help             Print help information
    -l, --label <LABEL>    Label of the key value store to set pairs in
    -s, --store <STORE>    The name of the key value store
    -V, --version          Print version information
```

## spin cloud link

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud link --help
Link apps to resources

USAGE:
    spin cloud <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    apps         Manage applications deployed to Fermyon Cloud
    deploy       Package and upload an application to the Fermyon Cloud
    help         Print this message or the help of the given subcommand(s)
    link         Link apps to resources
    login        Login to Fermyon Cloud
    sqlite       Manage Fermyon Cloud NoOps SQL databases
    unlink       Unlink apps from resources
    variables    Manage Spin application variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link --help
Link apps to resources

USAGE:
    spin cloud link <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help      Print this message or the help of the given subcommand(s)
    sqlite    Link an app to a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link --help
Link apps to resources

USAGE:
    spin cloud link <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help      Print this message or the help of the given subcommand(s)
    sqlite    Link an app to a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link --help

Link apps to resources

USAGE:
    spin cloud link <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help               Print this message or the help of the given subcommand(s)
    key-value          Link an app to a key value store
    sqlite             Link an app to a SQLite database
```

## spin cloud link key-value

Alias: `spin cloud link kv`

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud link key-value --help

USAGE:
    spin cloud link key-value --app <APP> --store <STORE> <LABEL>

ARGS:
    <LABEL>    The name by which the application will refer to the key value store

OPTIONS:
    -a, --app <APP>        The app that will be using the key value store
    -h, --help             Print help information
    -s, --store <STORE>    The key value store that the app will refer to by the label
    -V, --version          Print version information
```

## spin cloud link sqlite

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud link sqlite --help
Link an app to a NoOps SQL database

USAGE:
    spin cloud link sqlite [OPTIONS] --app <APP> --database <DATABASE> <LABEL>

ARGS:
    <LABEL>    The name by which the application will refer to the database

OPTIONS:
    -a, --app <APP>
            The app that will be using the database

    -d, --database <DATABASE>
            The database that the app will refer to by the label

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link sqlite --help
Link an app to a SQLite database

USAGE:
    spin cloud link sqlite [OPTIONS] --app <APP> --database <DATABASE> <LABEL>

ARGS:
    <LABEL>    The name by which the application will refer to the database

OPTIONS:
    -a, --app <APP>
            The app that will be using the database

    -d, --database <DATABASE>
            The database that the app will refer to by the label

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link sqlite --help
Link an app to a SQLite database

USAGE:
    spin cloud link sqlite --app <APP> --database <DATABASE> <LABEL>

ARGS:
    <LABEL>    The name by which the application will refer to the database

OPTIONS:
    -a, --app <APP>              The app that will be using the database
    -d, --database <DATABASE>    The database that the app will refer to by the label
    -h, --help                   Print help information
    -V, --version                Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud link sqlite --help

Link an app to a SQLite database

USAGE:
    spin cloud link sqlite --app <APP> --database <DATABASE> <LABEL>

ARGS:
    <LABEL>    The name by which the application will refer to the database

OPTIONS:
    -a, --app <APP>              The app that will be using the database
    -d, --database <DATABASE>    The database that the app will refer to by the label
    -h, --help                   Print help information
    -V, --version                Print version information
```

## spin cloud login

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

Login to Fermyon Cloud

USAGE:
    cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>
            [env: AUTH_METHOD=] [possible values: github, token]

        --environment-name <environment-name>
            Save the login details under the specified name instead of making them the default. Use
            named environments with `spin deploy --environment-name <name>` [env:\
            FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -k, --insecure
            Ignore server certificate errors

        --list
            List saved logins

        --status
            Display login status

        --token <TOKEN>
            Auth Token [env: SPIN_AUTH_TOKEN=]

        --url <CLOUD_SERVER_URL>
            URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default: https://cloud.fermyon.com/]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help
Log into Fermyon Cloud

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>    [env: AUTH_METHOD=] [possible values: github, token]
    -h, --help                         Print help information
    -k, --insecure                     Ignore server certificate errors
        --list                         List saved logins
        --status                       Display login status
        --token <TOKEN>                Auth Token [env: SPIN_AUTH_TOKEN=]
        --url <CLOUD_SERVER_URL>       URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default:\
                                       https://cloud.fermyon.com/]
    -V, --version                      Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud login --help

Log into Fermyon Cloud

USAGE:
    spin cloud login [OPTIONS]

OPTIONS:
        --auth-method <auth-method>    [env: AUTH_METHOD=] [possible values: github, token]
    -h, --help                         Print help information
    -k, --insecure                     Ignore server certificate errors
        --list                         List saved logins
        --status                       Display login status
        --token <TOKEN>                Auth Token [env: SPIN_AUTH_TOKEN=]
        --url <CLOUD_SERVER_URL>       URL of Fermyon Cloud Instance [env: CLOUD_URL=] [default:\
                                       https://cloud.fermyon.com/]
    -V, --version                      Print version information
```

## spin cloud logout

- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud logout --help
Log out of Fermyon Cloud

USAGE:
    spin cloud logout

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud logout --help

Log out of Fermyon Cloud

USAGE:
    spin cloud logout

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud logs

- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud logs --help

Logs fetches app logs from Fermyon Cloud

USAGE:
    spin cloud logs [OPTIONS] <APP>

ARGS:
    <APP>    App name

OPTIONS:
        --environment-name <environment-name>
            Use the Fermyon instance saved under the specified name. If omitted, Spin looks for app
            in default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

        --follow
            Follow logs output

    -h, --help
            Print help information

        --interval <interval>
            Interval in seconds to refresh logs from cloud [default: 2]

        --show-timestamps <show-timestamps>
            Show timestamps [default: true] [possible values: true, false]

        --since <since>
            Only return logs newer than a relative duration. The duration format is a number and a
            unit, where the unit is 's' for seconds, 'm' for minutes, 'h' for hours or 'd' for days
            (e.g. "30m" for 30 minutes ago).  The default it 7 days [default: 7d]

        --tail <tail>
            Number of lines to show from the end of the logs [default: 10]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud logs --help
Fetch logs for an app from Fermyon Cloud

USAGE:
    spin cloud logs [OPTIONS] <APP>

ARGS:
    <APP>    App name

OPTIONS:
        --follow
            Follow logs output

    -h, --help
            Print help information

        --interval <interval>
            Interval in seconds to refresh logs from cloud [default: 2]

        --show-timestamps <show-timestamps>
            Show timestamps [default: true] [possible values: true, false]

        --since <since>
            Only return logs newer than a relative duration. The duration format is a number and a
            unit, where the unit is 's' for seconds, 'm' for minutes, 'h' for hours or 'd' for days
            (e.g. "30m" for 30 minutes ago).  The default it 7 days [default: 7d]

        --tail <tail>
            Number of lines to show from the end of the logs [default: 10]

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud logs --help

Fetch logs for an app from Fermyon Cloud

USAGE:
    spin cloud logs [OPTIONS] <APP>

ARGS:
    <APP>    App name

OPTIONS:
        --follow
            Follow logs output

    -h, --help
            Print help information

        --interval <interval>
            Interval in seconds to refresh logs from cloud [default: 2]

        --show-timestamps <show-timestamps>
            Show timestamps [default: true] [possible values: true, false]

        --since <since>
            Only return logs newer than a relative duration. The duration format is a number and a
            unit, where the unit is 's' for seconds, 'm' for minutes, 'h' for hours or 'd' for days
            (e.g. "30m" for 30 minutes ago).  The default it 7 days [default: 7d]

        --tail <tail>
            Number of lines to show from the end of the logs [default: 10]

    -V, --version
            Print version information
```

## spin cloud sqlite

- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a SQLite database
    execute    Execute SQL against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all SQLite databases of a user
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
```

Spin compatibility: \`>= v1.3\`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud NoOps SQL databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud NoOps SQL databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a NoOps SQL database
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
    rename     Rename a NoOps SQL database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud NoOps SQL databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help
Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite --help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database. All existing links will automatically link to the
                   database's new name
```

## spin cloud sqlite create

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite create --help

Create a NoOps SQL database

USAGE:
    spin cloud sqlite create [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to create

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite create --help

Create a SQLite database

USAGE:
    spin cloud sqlite create [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to create

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite create --help
Create a SQLite database

USAGE:
    spin cloud sqlite create <NAME>

ARGS:
    <NAME>    Name of database to create

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite create --help

Create a SQLite database

USAGE:
    spin cloud sqlite create <NAME>

ARGS:
    <NAME>    Name of database to create

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud sqlite delete

- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a SQLite database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information

    -y, --yes
            Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a SQLite database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information

    -y, --yes
            Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a NoOps SQL database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information

    -y, --yes
            Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a NoOps SQL database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information

    -y, --yes
            Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a SQLite database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information

    -y, --yes
            Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help
Delete a SQLite database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
    -y, --yes        Skips prompt to confirm deletion of database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite delete --help

Delete a SQLite database

USAGE:
    spin cloud sqlite delete [OPTIONS] <NAME>

ARGS:
    <NAME>    Name of database to delete

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
    -y, --yes        Skips prompt to confirm deletion of database
```

## spin cloud sqlite execute

- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQL against a SQLite database

USAGE:
    spin cloud sqlite execute [OPTIONS] <NAME> <STATEMENT>

ARGS:
    <NAME>         Name of database to execute against
    <STATEMENT>    Statement to execute

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQL against a SQLite database

USAGE:
    spin cloud sqlite execute [OPTIONS] <NAME> <STATEMENT>

ARGS:
    <NAME>         Name of database to execute against
    <STATEMENT>    Statement to execute

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQLite statements against a NoOps SQL database

USAGE:
    spin cloud sqlite execute [OPTIONS] <NAME> <STATEMENT>

ARGS:
    <NAME>         Name of database to execute against
    <STATEMENT>    Statement to execute

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQLite statements against a NoOps SQL database

USAGE:
    spin cloud sqlite execute [OPTIONS] <NAME> <STATEMENT>

ARGS:
    <NAME>         Name of database to execute against
    <STATEMENT>    Statement to execute

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQL statements against a SQLite database

USAGE:
    spin cloud sqlite execute [OPTIONS] <STATEMENT>

ARGS:
    <STATEMENT>    Statement to execute

OPTIONS:
    -a, --app <APP>
            App to which label relates

    -d, --database <DATABASE>
            Name of database to execute against

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -l, --label <LABEL>
            Label of database to execute against

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help
Execute SQL statements against a SQLite database

USAGE:
    spin cloud sqlite execute [OPTIONS] <STATEMENT>

ARGS:
    <STATEMENT>    Statement to execute

OPTIONS:
    -a, --app <APP>              App to which label relates
    -d, --database <DATABASE>    Name of database to execute against
    -h, --help                   Print help information
    -l, --label <LABEL>          Label of database to execute against
    -V, --version                Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite execute --help

Execute SQL statements against a SQLite database

USAGE:
    spin cloud sqlite execute [OPTIONS] <STATEMENT>

ARGS:
    <STATEMENT>    Statement to execute

OPTIONS:
    -a, --app <APP>              App to which label relates
    -d, --database <DATABASE>    Name of database to execute against
    -h, --help                   Print help information
    -l, --label <LABEL>          Label of database to execute against
    -V, --version                Print version information
```

## spin cloud sqlite help

- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a SQLite database
    execute    Execute SQL against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all SQLite databases of a user
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud NoOps SQL databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud NoOps SQL databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a NoOps SQL database
    delete     Delete a NoOps SQL database
    execute    Execute SQLite statements against a NoOps SQL database
    help       Print this message or the help of the given subcommand(s)
    list       List all NoOps SQL databases of a user
    rename     Rename a NoOps SQL database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help
Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite help

Manage Fermyon Cloud SQLite databases

USAGE:
    spin cloud sqlite <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    create     Create a SQLite database
    delete     Delete a SQLite database
    execute    Execute SQL statements against a SQLite database
    help       Print this message or the help of the given subcommand(s)
    list       List all your SQLite databases
    rename     Rename a SQLite database. All existing links will automatically link to the
                   database's new name
```

## spin cloud sqlite list

- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help

List all SQLite databases of a user

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help

List all SQLite databases of a user

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help

List all NoOps SQL databases of a user

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help

List all NoOps SQL databases of a user

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
    -a, --app <APP>
            Filter list by an app

    -d, --database <DATABASE>
            Filter list by a database

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

        --format <FORMAT>
            Format of list [default: table] [possible values: table, json]

    -g, --group-by <GROUP_BY>
            Grouping strategy of tabular list [default: app] [possible values: app, database]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help
List all your SQLite databases

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
    -a, --app <APP>
            Filter list by an app

    -d, --database <DATABASE>
            Filter list by a database

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

        --format <FORMAT>
            Format of list [default: table] [possible values: table, json]

    -g, --group-by <GROUP_BY>
            Grouping strategy of tabular list [default: app] [possible values: app, database]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help
List all your SQLite databases

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
    -a, --app <APP>              Filter list by an app
    -d, --database <DATABASE>    Filter list by a database
        --format <FORMAT>        Format of list [default: table] [possible values: table, json]
    -g, --group-by <GROUP_BY>    Grouping strategy of tabular list [default: app] [possible values:\
                                 app, database]
    -h, --help                   Print help information
    -V, --version                Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite list --help

List all your SQLite databases

USAGE:
    spin cloud sqlite list [OPTIONS]

OPTIONS:
    -a, --app <APP>              Filter list by an app
    -d, --database <DATABASE>    Filter list by a database
        --format <FORMAT>        Format of list [default: table] [possible values: table, json]
    -g, --group-by <GROUP_BY>    Grouping strategy of tabular list [default: app] [possible values:\
                                 app, database]
    -h, --help                   Print help information
    -V, --version                Print version information
```

## spin cloud sqlite rename

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite rename --help

Rename a NoOps SQL database

USAGE:
    spin cloud sqlite rename [OPTIONS] <NAME> <NEW_NAME>

ARGS:
    <NAME>        Current name of database to rename
    <NEW_NAME>    New name for the database

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite rename --help

Rename a SQLite database

USAGE:
    spin cloud sqlite rename [OPTIONS] <NAME> <NEW_NAME>

ARGS:
    <NAME>        Current name of database to rename
    <NEW_NAME>    New name for the database

OPTIONS:
        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite rename --help
Rename a SQLite database

USAGE:
    spin cloud sqlite rename <NAME> <NEW_NAME>

ARGS:
    <NAME>        Current name of database to rename
    <NEW_NAME>    New name for the database

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud sqlite rename --help

Rename a SQLite database. All existing links will automatically link to the database's new name

USAGE:
    spin cloud sqlite rename <NAME> <NEW_NAME>

ARGS:
    <NAME>        Current name of database to rename
    <NEW_NAME>    New name for the database

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## spin cloud unlink

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink --help
Unlink apps from resources

USAGE:
    spin cloud unlink <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help      Print this message or the help of the given subcommand(s)
    sqlite    Unlink an app from a NoOps SQL database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink --help
Unlink apps from resources

USAGE:
    spin cloud unlink <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help      Print this message or the help of the given subcommand(s)
    sqlite    Unlink an app from a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink --help
Unlink apps from resources

USAGE:
    spin cloud unlink <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help      Print this message or the help of the given subcommand(s)
    sqlite    Unlink an app from a SQLite database
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink --help

Unlink apps from resources

USAGE:
    spin cloud unlink <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    help               Print this message or the help of the given subcommand(s)
    key-value          Unlink an app from a key value store
    sqlite             Unlink an app from a SQLite database
```

## spin cloud unlink key-value

- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink key-value --help
Unlink an app from a NoOps SQL database

USAGE:
    spin cloud unlink sqlite [OPTIONS] --app <APP> <LABEL>

ARGS:
    <LABEL>    The name by which the application refers to the database

OPTIONS:
    -a, --app <APP>
            The app that will be using the database

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

## spin cloud unlink sqlite

- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink sqlite --help
Unlink an app from a NoOps SQL database

USAGE:
    spin cloud unlink sqlite [OPTIONS] --app <APP> <LABEL>

ARGS:
    <LABEL>    The name by which the application refers to the database

OPTIONS:
    -a, --app <APP>
            The app that will be using the database

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink sqlite --help
Unlink an app from a SQLite database

USAGE:
    spin cloud unlink sqlite [OPTIONS] --app <APP> <LABEL>

ARGS:
    <LABEL>    The name by which the application refers to the database

OPTIONS:
    -a, --app <APP>
            The app that will be using the database

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink sqlite --help
Unlink an app from a SQLite database

USAGE:
    spin cloud unlink sqlite --app <APP> <LABEL>

ARGS:
    <LABEL>    The name by which the application refers to the database

OPTIONS:
    -a, --app <APP>    The app that will be using the database
    -h, --help         Print help information
    -V, --version      Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud unlink sqlite --help

Unlink an app from a SQLite database

USAGE:
    spin cloud unlink sqlite --app <APP> <LABEL>

ARGS:
    <LABEL>    The name by which the application refers to the database

OPTIONS:
    -a, --app <APP>    The app that will be using the database
    -h, --help         Print help information
    -V, --version      Print version information
```

## spin cloud variables

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variable pairs
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variable pairs
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help
Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables --help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

## spin cloud variables delete

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete [OPTIONS] --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help
Delete variables

USAGE:
    spin cloud variables delete --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables delete --help

Delete variables

USAGE:
    spin cloud variables delete --app <app> [VARIABLES_TO_DELETE]...

ARGS:
    <VARIABLES_TO_DELETE>...    Variable pair to set

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

## spin cloud variables help

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help
Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables help

Manage Spin application variables

USAGE:
    spin cloud variables <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information

SUBCOMMANDS:
    delete    Delete variables
    help      Print this message or the help of the given subcommand(s)
    list      List all variables of an application
    set       Set variables
```

## spin cloud variables list

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list [OPTIONS] --app <app>

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help
List all variables of an application

USAGE:
    spin cloud variables list --app <app>

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables list --help

List all variables of an application

USAGE:
    spin cloud variables list --app <app>

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

## spin cloud variables set

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set [OPTIONS] --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>
            Name of Spin app

        --environment-name <environment-name>
            Deploy to the Fermyon instance saved under the specified name. If omitted, Spin deploys
            to the default unnamed instance [env: FERMYON_DEPLOYMENT_ENVIRONMENT=]

    -h, --help
            Print help information

    -V, --version
            Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help
Set variables

USAGE:
    spin cloud variables set --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

Spin compatibility: `>= v1.3`

```console
$ spin cloud variables set --help

Set variables

USAGE:
    spin cloud variables set --app <app> [VARIABLES_TO_SET]...

ARGS:
    <VARIABLES_TO_SET>...    Variable pair to set

OPTIONS:
        --app <app>    Name of Spin app
    -h, --help         Print help information
    -V, --version      Print version information
```

## Subcommand Stability Table

CLI commands have four phases that indicate levels of stability:

- `Experimental`: These commands are experiments and may or may not be available in later versions of the CLI.
- `Stabilizing`: These commands have moved out of the `experimental` phase and we are now in the active process of stabilizing them. This includes updating flags, command output, errors, and more.
- `Stable`: These commands have moved out of the `stablizing` phase and will not change in backwards incompatible ways until the next major version release.
- `Deprecated`: Support for these commands will be removed in a future release.

- v0.1.1
- v0.1.2
- v0.2.0
- v0.3.0
- v0.4.0
- v0.5.0
- v0.6.0
- v0.7.0

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud deploy` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud deploy` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud link` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud unlink` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud link` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud logs` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud unlink` | Stabilizing |
| `cloud variables` | Stabilizing |

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud link` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud logout` | Stabilizing |
| `cloud logs` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud unlink` | Stabilizing |
| `cloud variables` | Stabilizing |

todo

Spin compatibility: `>= v1.3`

| Command | Stability |
| --- | --- |
| `cloud apps` | Stabilizing |
| `cloud deploy` | Stabilizing |
| `cloud key-value` | Stabilizing |
| `cloud link` | Stabilizing |
| `cloud login` | Stabilizing |
| `cloud logout` | Stabilizing |
| `cloud logs` | Stabilizing |
| `cloud sqlite` | Stabilizing |
| `cloud unlink` | Stabilizing |
| `cloud variables` | Stabilizing |

Did you find the answers you were looking for?

Hi! Could we please enable some additional services for **Analytics**? You can always change or withdraw your consent later.

[Let me choose](https://developer.fermyon.com/cloud/cloud-command-reference#)

I declineThat's ok