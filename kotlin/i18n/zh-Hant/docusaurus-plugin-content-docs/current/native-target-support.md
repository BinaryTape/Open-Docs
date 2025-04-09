---
title: "Kotlin/Native 目標平台支援"
---
Kotlin/Native 編譯器支援大量的不同目標，儘管很難為所有目標提供相同等級的支援。本文檔描述了 Kotlin/Native 支援哪些目標，並根據編譯器對它們的支援程度將其分為幾個層級（tiers）。

:::note
我們可以根據情況調整層級數量、支援目標的列表及其特性。

請注意層級表格中使用的以下術語：

* **Gradle 目標名稱（Gradle target name）**是用於 Kotlin Multiplatform Gradle 外掛程式中啟用目標的[目標名稱（target name）](multiplatform-dsl-reference#targets)。
* **目標三元組（Target triple）**是根據 `<architecture>-<vendor>-<system>-<abi>` 結構的目標名稱，通常被[編譯器](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)使用。
* **執行測試（Running tests）**表示對在 Gradle 和 IDE 中執行測試的開箱即用支援。

    這僅適用於特定目標的原生主機。例如，您只能在 macOS x86-64 主機上執行 `macosX64` 和 `iosX64` 測試。

## 層級 1 （Tier 1）

* 目標在 CI 上定期測試，以確保能夠編譯和執行。
* 我們在編譯器版本之間提供原始碼和[二進位制相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標名稱（Gradle target name）      | 目標三元組（Target triple）                 | 執行測試（Running tests） | 描述（Description）                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| 僅限 Apple macOS 主機： |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | x86_64 平台上的 Apple macOS                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Silicon 平台上的 Apple macOS         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Silicon 平台上的 Apple iOS 模擬器 |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | x86-64 平台上的 Apple iOS 模擬器        |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64 平台上的 Apple iOS 和 iPadOS        |

## 層級 2 （Tier 2）

* 目標在 CI 上定期測試，以確保能夠編譯，但可能不會自動測試其執行能力。
* 我們盡最大努力在編譯器版本之間提供原始碼和[二進位制相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標名稱（Gradle target name）      | 目標三元組（Target triple）                     | 執行測試（Running tests） | 描述（Description）                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64 平台上的 Linux                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64 平台上的 Linux                           |
| 僅限 Apple macOS 主機： |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Silicon 平台上的 Apple watchOS 模擬器 |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64 平台上 Apple watchOS 64 位元模擬器 |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32 平台上的 Apple watchOS                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | 具有 ILP32 的 ARM64 平台上的 Apple watchOS        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Silicon 平台上的 Apple tvOS 模擬器    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64 平台上的 Apple tvOS 模擬器           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64 平台上的 Apple tvOS                      |

## 層級 3 （Tier 3）

* 不保證目標會在 CI 上進行測試。
* 我們無法保證不同編譯器版本之間的原始碼和二進位制相容性，儘管這些目標的此類變更非常罕見。

| Gradle 目標名稱（Gradle target name）      | 目標三元組（Target triple）                   | 執行測試（Running tests） | 描述（Description）                                                                             |
|-------------------------|---------------------------------|---------------|-----------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | ARM32 平台上的 [Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | ARM64 平台上的 [Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | x86 平台上的 [Android NDK](https://developer.android.com/ndk)                       |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | x86_64 平台上的 [Android NDK](https://developer.android.com/ndk)                    |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 使用 [MinGW](https://www.mingw-w64.org) 相容層的 64 位元 Windows 7 及更高版本 |
| 僅限 Apple macOS 主機： |                                 |               |                                                                                         |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | ARM64 平台上的 Apple watchOS                                                        |

`linuxArm32Hfp` 目標已棄用，並將在未來的版本中移除。

:::

## 對於程式庫作者

我們不建議程式庫作者測試比 Kotlin/Native 編譯器更多的目標或提供更嚴格的保證。在考慮對原生目標的支援時，您可以使用以下方法：

* 支援來自層級 1、2 和 3 的所有目標。
* 定期測試來自層級 1 和 2 的支援開箱即用執行測試的目標。

Kotlin 團隊在官方 Kotlin 程式庫中使用此方法，例如 [kotlinx.coroutines](coroutines-guide) 和 [kotlinx.serialization](serialization)。