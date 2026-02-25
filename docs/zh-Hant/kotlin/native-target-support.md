[//]: # (title: Kotlin/Native 支援的目標與主機)

本文件說明 Kotlin/Native 編譯器支援哪些目標與主機。

> 我們可以隨時調整支援的目標與主機清單、層級數量及其特性。
>
{style="tip"}

## 目標層級

Kotlin/Native 編譯器支援多種不同的目標，但對這些目標的支援程度各不相同。
為了釐清這些程度，我們根據編譯器對目標的支援完善程度將其分為幾個層級。

層級表格包含以下欄位：

* **Gradle 目標名稱** 是用於 Kotlin 多平台 Gradle 外掛程式中以啟用該目標的 [目標名稱](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)。
* **目標三元組** 是根據 `<architecture>-<vendor>-<system>-<abi>` 結構定義的目標名稱，這是 [編譯器常用的命名方式](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)。
* **執行測試** 表示該目標是否允許使用者在 Gradle 和 IDE 中開箱即用地執行測試（請勿與為目標本身執行的 CI 測試混淆）。
  
  這僅在特定目標的原生主機上可用。例如，您只能在 macOS ARM64 主機上執行 `macosArm64` 和 `iosArm64` 測試。

### 第 1 層級

* 該目標在 CI 上定期進行測試，以確保能夠編譯與執行。
* 我們提供編譯器版本之間的原始碼與 [二進位相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標名稱 | 目標三元組 | 執行測試 | 說明 |
|-------------------------|-------------------------------|---------------|---------------------------------------------------------------|
| 僅限 Apple macOS 主機： | | | |
| `macosArm64` | `aarch64-apple-macos` | ✅ | Apple Silicon 平台上的 Apple macOS 11.0 及更高版本 |
| `iosSimulatorArm64` | `aarch64-apple-ios-simulator` | ✅ | Apple Silicon 平台上的 Apple iOS 模擬器 14.0 及更高版本 |
| `iosArm64` | `aarch64-apple-ios` | | ARM64 平台上的 Apple iOS 與 iPadOS 14.0 及更高版本 |

### 第 2 層級

* 該目標在 CI 上定期進行測試以確保能夠編譯，但可能不會自動測試其是否能夠執行。
* 我們盡力提供編譯器版本之間的原始碼與 [二進位相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標名稱 | 目標三元組 | 執行測試 | 說明 |
|-------------------------|-----------------------------------|---------------|------------------------------------------------------------------|
| `linuxX64` | `x86_64-unknown-linux-gnu` | ✅ | x86_64 平台上的 Linux |
| `linuxArm64` | `aarch64-unknown-linux-gnu` | | ARM64 平台上的 Linux |
| 僅限 Apple macOS 主機： | | | |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅ | Apple 晶片平台上的 Apple watchOS 模擬器 7.0 及更高版本 |
| `watchosArm32` | `armv7k-apple-watchos` | | ARM32 平台上的 Apple watchOS 7.0 及更高版本 |
| `watchosArm64` | `arm64_32-apple-watchos` | | 使用 ILP32 的 ARM64 平台上的 Apple watchOS 7.0 及更高版本 |
| `tvosSimulatorArm64` | `aarch64-apple-tvos-simulator` | ✅ | Apple 晶片平台上的 Apple tvOS 模擬器 14.0 及更高版本 |
| `tvosArm64` | `aarch64-apple-tvos` | | ARM64 平台上的 Apple tvOS 14.0 及更高版本 |

### 第 3 層級

* 不保證該目標會在 CI 上進行測試。
* 我們無法承諾不同編譯器版本之間的原始碼與二進位相容性，儘管這些目標的此類變更相當罕見。

> 第 3 層級目標並非處於活躍開發狀態，且可能包含破壞性問題。請謹慎使用。
> 
{style="warning"}

| Gradle 目標名稱 | 目標三元組 | 執行測試 | 說明 |
|-------------------------|----------------------------------|---------------|------------------------------------------------------------------------------------------|
| `androidNativeArm32` | `arm-unknown-linux-androideabi` | | ARM32 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeArm64` | `aarch64-unknown-linux-android` | | ARM64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeX86` | `i686-unknown-linux-android` | | x86 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeX64` | `x86_64-unknown-linux-android` | | x86_64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `mingwX64` | `x86_64-pc-windows-gnu` | ✅ | 使用 [MinGW](https://www.mingw-w64.org) 相容層的 64 位元 Windows 10 及更高版本 |
| 僅限 Apple macOS 主機： | | | |
| `watchosDeviceArm64` | `aarch64-apple-watchos` | | ARM64 平台上的 Apple watchOS 7.0 及更高版本 |
| `macosX64` | `x86_64-apple-macos` | ✅ | x86_64 平台上的 Apple macOS 11.0 及更高版本 |
| `iosX64` | `x86_64-apple-ios-simulator` | ✅ | x86-64 平台上的 Apple iOS 模擬器 14.0 及更高版本 |
| `watchosX64` | `x86_64-apple-watchos-simulator` | ✅ | x86_64 平台上的 Apple watchOS 7.0 及更高版本 64 位元模擬器 |
| `tvosX64` | `x86_64-apple-tvos-simulator` | ✅ | x86_64 平台上的 Apple tvOS 14.0 及更高版本模擬器 |

> `linuxArm32Hfp` 目標已棄用，並將在未來的版本中移除。
> 
{style="note"}

### 給程式庫作者

我們不建議程式庫作者測試比 Kotlin/Native 編譯器更多的目標或提供更嚴格的保證。考慮支援原生目標時，您可以採用以下方法：

* 支援所有來自第 1、2 和 3 層級的目標。
* 定期測試來自第 1 和 2 層級且支援開箱即用執行測試的目標。

Kotlin 團隊在官方 Kotlin 程式庫中也使用了此方法，例如 [kotlinx.coroutines](coroutines-guide.md) 和 [kotlinx.serialization](serialization.md)。

## 主機

Kotlin/Native 編譯器支援以下主機：

| 主機作業系統 | 建置最終執行檔 | 產生 `.klib` 構件 |
|----------------------------------------------------|------------------------------------------------|------------------------------------------------------------------------|
| Apple 晶片 (ARM64) 上的 macOS | 任何支援的目標 | 任何支援的目標 |
| Intel 晶片 (x86_64) 上的 macOS | 任何支援的目標 | 任何支援的目標 |
| x86_64 架構的 Linux | 除 Apple 目標外，任何支援的目標 | 任何支援的目標，Apple 目標僅限無 cinterop 相依性時 |
| x86_64 架構的 Windows (MinGW 工具鏈) | 除 Apple 目標外，任何支援的目標 | 任何支援的目標，Apple 目標僅限無 cinterop 相依性時 |

### 建置最終執行檔

若要產生最終執行檔，您只能在 *支援的主機* 上為 [支援的目標](#target-tiers) 進行編譯。例如，您無法在 FreeBSD 或執行 ARM64 架構的 Linux 電腦上進行編譯。

此外，也無法在 Linux 和 Windows 上為 Apple 目標建置最終執行檔。

### 產生 `.klib` 構件

通常，Kotlin/Native 允許任何 *支援的主機* 為支援的目標產生 `.klib` 構件。

然而，在 Linux 和 Windows 上為 Apple 目標產生構件仍有一些限制。如果您的專案使用 [cinterop 相依性](native-c-interop.md)（包括 [CocoaPods](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)），則必須使用 macOS 主機。

例如，只有在沒有 cinterop 相依性的情況下，您才能在執行 x86_64 架構的 Windows 電腦上為 `macosArm64` 目標產生 `.klib`。

## 接下來？

* [建置最終原生執行檔](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)
* [針對 Apple 目標進行編譯](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets)