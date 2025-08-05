[//]: # (title: Kotlin/Native 目标支持)

Kotlin/Native 编译器支持大量不同的目标，但很难为所有目标提供同等水平的支持。本文档描述了 Kotlin/Native 支持哪些目标，并根据编译器对它们的支持程度将它们分为几个等级。

> 我们可以根据需要调整等级数量、支持目标列表及其特性。
> 
{style="tip"}

请注意等级表格中使用的以下术语：

*   **Gradle target name** 是在 Kotlin Multiplatform Gradle 插件中用于启用目标的[目标名称](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。
*   **Target triple** 是遵循 `<architecture>-<vendor>-<system>-<abi>` 结构的[目标名称](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)，编译器常用此结构。
*   **Running tests** 表示在 Gradle 和 IDE 中开箱即用支持运行测试。
  
    这仅适用于特定目标的原生主机。例如，你只能在 macOS x86-64 主机上运行 `macosX64` 和 `iosX64` 测试。

## 等级 1

*   该目标会在 CI 上定期测试，以确保能够编译和运行。
*   我们提供编译器版本之间的源代码和[二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle target name      | Target triple                 | Running tests | Description                            |
|-------------------------|-------------------------------|---------------|----------------------------------------|
| 仅限 Apple macOS 主机:    |                               |               |                                        |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | 运行于 x86_64 平台上的 Apple macOS         |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | 运行于 Apple Silicon 平台上的 Apple macOS |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | 运行于 Apple Silicon 平台上的 Apple iOS 模拟器 |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | 运行于 x86-64 平台上的 Apple iOS 模拟器  |
| `iosArm64`              | `aarch64-apple-ios`           |               | 运行于 ARM64 平台上的 Apple iOS 和 iPadOS  |

## 等级 2

*   该目标会在 CI 上定期测试以确保能够编译，但可能不会自动测试其运行能力。
*   我们正尽力在编译器版本之间提供源代码和[二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle target name      | Target triple                     | Running tests | Description                            |
|-------------------------|-----------------------------------|---------------|----------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | 运行于 x86_64 平台上的 Linux           |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | 运行于 ARM64 平台上的 Linux            |
| 仅限 Apple macOS 主机:    |                                   |               |                                        |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | 运行于 Apple Silicon 平台上的 Apple watchOS 模拟器 |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | 运行于 x86_64 平台上的 Apple watchOS 64 位模拟器 |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | 运行于 ARM32 平台上的 Apple watchOS      |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | 运行于带有 ILP32 的 ARM64 平台上的 Apple watchOS |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | 运行于 Apple Silicon 平台上的 Apple tvOS 模拟器 |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | 运行于 x86_64 平台上的 Apple tvOS 模拟器  |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | 运行于 ARM64 平台上的 Apple tvOS         |

## 等级 3

*   不保证该目标会在 CI 上进行测试。
*   我们无法保证不同编译器版本之间的源代码和二进制兼容性，尽管这些目标的此类变更相当罕见。

| Gradle target name      | Target triple                   | Running tests | Description                                    |
|-------------------------|---------------------------------|---------------|------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | 运行于 ARM32 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | 运行于 ARM64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | 运行于 x86 平台上的 [Android NDK](https://developer.android.com/ndk)  |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | 运行于 x86_64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 使用 [MinGW](https://www.mingw-w64.org) 兼容层运行于 64 位 Windows 10 及更高版本 |
| 仅限 Apple macOS 主机:    |                                 |               |                                                |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | 运行于 ARM64 平台上的 Apple watchOS            |

> `linuxArm32Hfp` 目标已被弃用，并将在未来版本中移除。
> 
{style="note"}

## 对于库作者

我们不建议库作者测试比 Kotlin/Native 编译器所支持的更多目标，或提供更严格的保证。考虑对原生目标提供支持时，可以采用以下方法：

*   支持所有等级 1、2 和 3 中的目标。
*   定期测试等级 1 和 2 中支持开箱即用运行测试的目标。

Kotlin 团队在官方 Kotlin 库中采用此方法，例如 [kotlinx.coroutines](coroutines-guide.md) 和 [kotlinx.serialization](serialization.md)。