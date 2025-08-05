[//]: # (title: Kotlin/Native 目標平台支援)

Kotlin/Native 編譯器支援大量不同的目標平台，儘管難以對所有這些平台提供相同程度的支援。本文件描述了 Kotlin/Native 支援哪些目標平台，並根據編譯器對其的支援程度將其劃分為數個層級。

> 我們可以隨著進展調整層級數量、支援的目標平台清單及其功能。
> 
{style="tip"}

請注意以下用於層級表格的術語：

* **Gradle 目標名稱** 是用於 Kotlin 多平台 Gradle 外掛程式中以啟用目標平台的 [目標名稱](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。
* **目標三元組** 是根據 `<architecture>-<vendor>-<system>-<abi>` 結構定義的目標名稱，常被 [編譯器](https://clang.llvm.org/docs/CrossCompilation.html#target-triple) 使用。
* **執行測試** 表示在 Gradle 和 IDE 中執行測試的開箱即用支援。
  
    這僅適用於特定目標平台的原生主機。例如，您只能在 macOS x86-64 主機上執行 `macosX64` 和 `iosX64` 測試。

## 層級 1

* 該目標平台在 CI 上定期測試，以確保能夠編譯和執行。
* 我們提供 [編譯器版本之間](https://youtrack.jetbrains.com/issue/KT-42293) 的原始碼和二進位相容性。

| Gradle 目標名稱      | 目標三元組                 | 執行測試 | 描述                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| 僅限 Apple macOS 主機： |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | 在 x86_64 平台上的 Apple macOS                 |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | 在 Apple Silicon 平台上的 Apple macOS          |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | 在 Apple Silicon 平台上的 Apple iOS 模擬器     |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | 在 x86-64 平台上的 Apple iOS 模擬器            |
| `iosArm64`              | `aarch64-apple-ios`           |               | 在 ARM64 平台上的 Apple iOS 和 iPadOS          |

## 層級 2

* 該目標平台在 CI 上定期測試以確保能夠編譯，但可能不會自動測試其執行能力。
* 我們盡力提供 [編譯器版本之間](https://youtrack.jetbrains.com/issue/KT-42293) 的原始碼和二進位相容性。

| Gradle 目標名稱      | 目標三元組                     | 執行測試 | 描述                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | 在 x86_64 平台上的 Linux                           |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | 在 ARM64 平台上的 Linux                            |
| 僅限 Apple macOS 主機： |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | 在 Apple Silicon 平台上的 Apple watchOS 模擬器     |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | 在 x86_64 平台上的 Apple watchOS 64 位元模擬器     |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | 在 ARM32 平台上的 Apple watchOS                    |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | 在帶有 ILP32 的 ARM64 平台上的 Apple watchOS       |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | 在 Apple Silicon 平台上的 Apple tvOS 模擬器        |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | 在 x86_64 平台上的 Apple tvOS 模擬器               |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | 在 ARM64 平台上的 Apple tvOS                       |

## 層級 3

* 該目標平台不保證在 CI 上進行測試。
* 我們無法承諾不同編譯器版本之間的原始碼和二進位相容性，儘管這些目標平台的此類變更相當罕見。

| Gradle 目標名稱      | 目標三元組                   | 執行測試 | 描述                                                                              |
|-------------------------|---------------------------------|---------------|------------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | 在 ARM32 平台上的 [Android NDK](https://developer.android.com/ndk)                      |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | 在 ARM64 平台上的 [Android NDK](https://developer.android.com/ndk)                      |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | 在 x86 平台上的 [Android NDK](https://developer.android.com/ndk)                        |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | 在 x86_64 平台上的 [Android NDK](https://developer.android.com/ndk)                     |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 適用於使用 [MinGW](https://www.mingw-w64.org) 相容層的 64 位元 Windows 10 及更高版本 |
| 僅限 Apple macOS 主機： |                                 |               |                                                                                          |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | 在 ARM64 平台上的 Apple watchOS                                                          |

> `linuxArm32Hfp` 目標平台已棄用，並將在未來版本中移除。
> 
{style="note"}

## 針對函式庫作者

我們不建議函式庫作者測試比 Kotlin/Native 編譯器更多元的目標平台，或提供更嚴格的保證。在考慮支援原生目標平台時，您可以採用以下方法：

* 支援層級 1、2 和 3 的所有目標平台。
* 定期測試層級 1 和 2 中支援開箱即用執行測試的目標平台。

Kotlin 團隊在官方 Kotlin 函式庫中採用此方法，例如 [kotlinx.coroutines](coroutines-guide.md) 和 [kotlinx.serialization](serialization.md)。