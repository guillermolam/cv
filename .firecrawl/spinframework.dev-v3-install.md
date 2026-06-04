# Install Spin

- [Installing Spin](https://spinframework.dev/v3/install#installing-spin)
- [Verifying the Release Signature](https://spinframework.dev/v3/install#verifying-the-release-signature)
- [Building Spin From Source](https://spinframework.dev/v3/install#building-spin-from-source)
- [Using Cargo to Install Spin](https://spinframework.dev/v3/install#using-cargo-to-install-spin)
- [Installing Templates and Plugins](https://spinframework.dev/v3/install#installing-templates-and-plugins)
  - [Templates](https://spinframework.dev/v3/install#templates)
  - [Plugins](https://spinframework.dev/v3/install#plugins)
- [Next Steps](https://spinframework.dev/v3/install#next-steps)

## Installing Spin

Spin runs on Linux (amd64 and arm64), macOS (Intel and Apple Silicon), and Windows (amd64):

- Linux
- macOS
- Windows

**Homebrew**

You can manage your Spin installation via [Homebrew](https://brew.sh/). Homebrew automatically installs Spin templates and Spin plugins, and on uninstall, will prompt you to delete the directory where the templates and plugins were downloaded:

Install the Fermyon tap, which Homebrew tracks, updates, and installs Spin from:

```bash
$ brew tap spinframework/tap
```

Install Spin:

```bash
$ brew install spinframework/tap/spin
```

> Note: `brew install spin` will **not** install Spin framework. Spin is accessed from the `spinframework` tap, as shown above.

**Installer script**

Another option (other than brew) is to use our installer script. The installer script installs Spin along with a starter set of language templates and plugins:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash
```

Once you have run the installer script, it is highly recommended to add Spin to a folder, which is on your path, e.g.:

```bash
$ sudo mv spin /usr/local/bin/
```

> If you have already installed Spin by building from source, and then install it via the installer, we recommend you remove the older source install by running `cargo uninstall spin-cli` Otherwise the Cargo path may take precedence over the “install from binary” path, and commands may get the “wrong” version of Spin. Use `spin --version` to confirm the version on the PATH is the one you intend, or `which spin` to confirm the path it is found on.

To install a specific version (`v1.2.3` is just an example), you can pass arguments to the install script this way:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash -s -- -v v1.2.3
```

To install the canary version of spin, you should pass the argument `-v canary`. The canary version is always the latest commit to the main branch of Spin:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash -s -- -v canary
```

**Homebrew**

You can manage your Spin installation via [Homebrew](https://brew.sh/). Homebrew automatically installs Spin templates and Spin plugins, and on uninstall, will prompt you to delete the directory where the templates and plugins were downloaded:

Install the Fermyon tap, which Homebrew tracks, updates, and installs Spin from:

```bash
$ brew tap spinframework/tap
```

Install Spin:

```bash
$ brew install spinframework/tap/spin
```

> Note: `brew install spin` will **not** install Spin framework. Spin is accessed from the `spinframework` tap, as shown above.

**Installer script**

Another option (other than brew) is to use our installer script. The installer script installs Spin along with a starter set of language templates and plugins:

The installer script also installs Spin along with a starter set of language templates and plugins:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash
```

Once you have run the installer script, it is highly recommended to add Spin to a folder, which is on your path, e.g.:

```bash
$ sudo mv spin /usr/local/bin/
```

> If you have already installed Spin by building from source, and then install it via the installer, we recommend you remove the older source install by running `cargo uninstall spin-cli` Otherwise the Cargo path may take precedence over the “install from binary” path, and commands may get the “wrong” version of Spin. Use `spin --version` to confirm the version on the PATH is the one you intend, or `which spin` to confirm the path it is found on.

To install a specific version (`v1.2.3` is just an example), you can pass arguments to the install script this way:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash -s -- -v v1.2.3
```

To install the canary version of spin, you should pass the argument `-v canary`. The canary version is always the latest commit to the main branch of Spin:

```bash
$ curl -fsSL https://spinframework.dev/downloads/install.sh | bash -s -- -v canary
```

If using Windows (PowerShell / cmd.exe), you can download [the Windows binary release of Spin](https://github.com/spinframework/spin/releases/latest).

Simply unzip the binary release and place the `spin.exe` in your system path.

This does not install any Spin templates or plugins. For a starter list, see the [Installing Templates and Plugins section](https://spinframework.dev/v3/install#installing-templates-and-plugins).

If you want to use WSL2 (Windows Subsystem for Linux 2), please follow the instructions for using Linux.

## Verifying the Release Signature

The Spin project [signs releases](https://github.com/spinframework/spin/blob/main/docs/content/sips/012-signing-spin-releases.md) using [Sigstore](https://docs.sigstore.dev/), a project that helps with signing software and _stores signatures in a tamper-resistant public log_. Consumers of Spin releases can validate the integrity of the package they downloaded by performing a validation of the artifact against the signature present in the public log. Specifically, users get two main guarantees by verifying the signature: 1) that the author of the artifact is indeed the one expected (i.e. the build infrastructure associated with the Spin project, at a given revision that can be inspected), and 2) that the content generated by the build infrastructure has not been tampered with.

To verify the release signature, first [configure Cosign v2.0.0+](https://docs.sigstore.dev/cosign/system_config/installation/). This is the CLI tool that we will use validate the signature.
The same directory where the installation script was run should also contain a signature of the Spin binary and the certificate used to perform the signature. The following command will perform the signature verification using the `cosign` CLI:

```bash
$ cosign verify-blob \
    --signature spin.sig \
    --certificate crt.pem \
    --certificate-identity https://github.com/spinframework/spin/.github/workflows/release.yml@refs/tags/<version> \
    --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    # --certificate-github-workflow-sha <optionally, pass the commit SHA associated with the tag> \
    ./spin
Verified OK
```

You can now move the Spin binary to the path knowing that it was indeed built by the infrastructure associated with the Spin project, and that it has not been tampered with since the build.

## Building Spin From Source

[Follow the contribution document](https://spinframework.dev/v3/contributing-spin) for a detailed guide on building Spin from source:

```bash
$ git clone https://github.com/spinframework/spin
$ cd spin && make build
$ ./target/release/spin --help
```

> Please note: On a fresh Linux installation, you will also need the standard build toolchain (`gcc`, `make`, etc.), the SSL library headers, and on some distributions you may need `pkg-config`. For example, on Debian-like distributions, including Ubuntu, you can install the standard build toolchain with this command:

```bash
$ sudo apt-get install build-essential libssl-dev pkg-config
```

This does not install any Spin templates or plugins. For a starter list, see the [Installing Templates and Plugins section](https://spinframework.dev/v3/install#installing-templates-and-plugins).

## Using Cargo to Install Spin

If you have [`cargo`](https://doc.rust-lang.org/cargo/getting-started/installation.html), you can clone the repo and install it to your path.

> Note: The `main` branch may have unstable or breaking changes. It is advised to check out the latest Spin release tag, which can be found by navigating to https://github.com/spinframework/spin/releases/latest.

```bash
$ git clone https://github.com/spinframework/spin
$ cd spin
$ # Check out the latest tagged release
$ # git checkout <latest release>
$ rustup target add wasm32-wasip1
$ rustup target add wasm32-unknown-unknown
$ cargo install --locked --path .
$ spin --help
```

> Please note: Installing Spin from source requires Rust 1.79 or newer. You can update Rust using the following command:

```bash
$ rustup update
```

Installing Spin from source does not install any Spin templates or plugins. For a starter list, see the [Installing Templates and Plugins section](https://spinframework.dev/v3/install#installing-templates-and-plugins).

## Installing Templates and Plugins

Spin has a variety of templates and plugins to make it easier to create Spin applications in your favorite programming language. [The install script](https://spinframework.dev/v3/install#installing-spin) automatically installs a starter set of templates and plugins, namely templates from the Spin repository and JavaScript and Python toolchain plugins and the Fermyon Cloud plugin.

If you used a different installation method, we recommend you install these templates and plugins manually, as follows.

### Templates

Rust, Go and miscellaneous other languages:

```bash
$ spin templates install --git https://github.com/spinframework/spin --upgrade
```

Python:

```bash
$ spin templates install --git https://github.com/spinframework/spin-python-sdk --upgrade
```

JavaScript and TypeScript:

```bash
$ spin templates install --git https://github.com/spinframework/spin-js-sdk --upgrade
```

To list installed templates, run:

```bash
$ spin templates list
```

For more information please read the [managing templates](https://spinframework.dev/v3/managing-templates) section of the documentation.

### Plugins

First update the local cache by running the `spin plugins update` command:

```bash
$ spin plugins update
```

Then install plugins by name.

Fermyon Cloud:

```bash
$ spin plugins install cloud --yes
```

To list available plugins, run:

```bash
$ spin plugins search
```

For more information, please visit the [managing plugins](https://spinframework.dev/v3/managing-plugins) section of the documentation.

## Next Steps

### [Checklist Sample App](https://spinframework.dev/hub/preview/sample_checklist)

A checklist app that persists data in a key value store

TypescriptHttpKv

### [Zola SSG Template](https://spinframework.dev/hub/preview/template_zola_ssg)

A template for using Zola framework to create a static webpage

rust

### [AI-assisted News Summarizer](https://spinframework.dev/hub/preview/sample_newsreader_ai)

Read an RSS newsfeed and have AI summarize it for you

TypescriptJavascriptAi