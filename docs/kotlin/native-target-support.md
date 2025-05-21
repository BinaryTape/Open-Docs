---
title: "Kotlin/Native 目标平台支持"
---
Kotlin/Native 编译器支持大量的不同目标平台，尽管很难为所有目标平台提供相同级别的支持。本文档描述了 Kotlin/Native 支持的目标平台，并根据编译器对它们的支持程度将其分为几个等级。

:::note
我们可以根据实际情况调整等级数量、支持的目标平台列表及其特性。

请注意等级表格中使用的以下术语：

* **Gradle target name** 是 Kotlin 多平台 Gradle 插件中用于启用目标平台的[目标名称](multiplatform-dsl-reference#targets)。
* **Target triple** 是一个目标名称，其结构符合 `<architecture>-<vendor>-<system>-<abi>` 规范，通常被[编译器](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)使用。
* **Running tests** 指示在 Gradle 和 IDE 中对运行测试的开箱即用支持。
  
    这仅在特定目标平台的原生主机上可用。 例如，您只能在 macOS x86-64 主机上运行 `macosX64` 和 `iosX64` 测试。

## Tier 1

* 该目标平台在 CI 上会定期进行编译和运行测试。
* 我们在编译器版本之间提供源代码和[二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | Apple macOS on x86_64 platforms                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple macOS on Apple Silicon platforms         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple iOS simulator on Apple Silicon platforms |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | Apple iOS simulator on x86-64 platforms        |
| `iosArm64`              | `aarch64-apple-ios`           |               | Apple iOS and iPadOS on ARM64 platforms        |

## Tier 2

* 该目标平台在 CI 上会定期进行编译测试，但可能不会自动测试其运行能力。
* 我们会尽最大努力在编译器版本之间提供源代码和[二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | Linux on x86_64 platforms                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | Linux on ARM64 platforms                           |
| Apple macOS hosts only: |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple watchOS simulator on Apple Silicon platforms |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | Apple watchOS 64-bit simulator on x86_64 platforms |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | Apple watchOS on ARM32 platforms                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | Apple watchOS on ARM64 platforms with ILP32        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple tvOS simulator on Apple Silicon platforms    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | Apple tvOS simulator on x86_64 platforms           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | Apple tvOS on ARM64 platforms                      |

## Tier 3

* 不保证该目标平台会在 CI 上进行测试。
* 我们不能保证不同编译器版本之间的源代码和二进制兼容性，尽管这些目标平台的此类更改非常罕见。

| Gradle target name      | Target triple                   | Running tests | Description                                                                             |
|-------------------------|---------------------------------|---------------|-----------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | [Android NDK](https://developer.android.com/ndk) on ARM32 platforms                     |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | [Android NDK](https://developer.android.com/ndk) on ARM64 platforms                     |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | [Android NDK](https://developer.android.com/ndk) on x86 platforms                       |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | [Android NDK](https://developer.android.com/ndk) on x86_64 platforms                    |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 64-bit Windows 7 and later using [MinGW](https://www.mingw-w64.org) compatibility layer |
| Apple macOS hosts only: |                                 |               |                                                                                         |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | Apple watchOS on ARM64 platforms                                                        |

`linuxArm32Hfp` 目标平台已被弃用，将在未来的版本中删除。

:::

## 对于库作者

我们不建议库作者测试比 Kotlin/Native 编译器更多的目标平台或提供更严格的保证。在考虑对原生目标平台的支持时，可以使用以下方法：

* 支持第 1、2 和 3 级中的所有目标平台。
* 定期测试第 1 级和第 2 级中支持开箱即用运行测试的目标平台。

Kotlin 团队在官方 Kotlin 库中使用了这种方法，例如 [kotlinx.coroutines](coroutines-guide) 和 [kotlinx.serialization](serialization)。