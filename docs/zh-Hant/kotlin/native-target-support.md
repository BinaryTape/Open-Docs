[//]: # (title: Kotlin/Native 目標平台支援)

Kotlin/Native 編譯器支援多種不同的目標平台，儘管難以對所有平台提供相同程度的支援。本文檔描述了 Kotlin/Native 支援哪些目標平台，並根據編譯器對它們的支援程度，將它們分為幾個層級。

> 我們可以視情況調整層級數量、支援的目標平台列表及其功能。
> 
{style="tip"}

請注意層級表格中使用的以下術語：

*   **Gradle 目標平台名稱** 是用於 Kotlin 多平台 Gradle 外掛程式以啟用該目標平台的 [目標平台名稱](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。
*   **目標三元組 (Target triple)** 是依照 `<architecture>-<vendor>-<system>-<abi>` 結構的目標平台名稱，編譯器常用此格式。
*   **執行測試** 表示 Gradle 和 IDE 中開箱即用的測試執行支援。
  
    這僅在特定目標平台的原生主機上可用。例如，您只能在 macOS x86-64 主機上執行 `macosX64` 和 `iosX64` 測試。

## Tier 1 (第一級)

*   該目標平台定期在 CI 上進行測試，以確保能夠編譯和執行。
*   我們提供編譯器版本之間的原始碼和 [二進位相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標平台名稱     | 目標三元組 (Target triple)    | 執行測試 | 描述                                     |
|-------------------------|-------------------------------|----------|------------------------------------------|
| 僅限 Apple macOS 主機：   |                               |          |                                          |
| `macosX64`              | `x86_64-apple-macos`          | ✅        | 基於 x86_64 平台的 Apple macOS           |
| `macosArm64`            | `aarch64-apple-macos`         | ✅        | 基於 Apple Silicon 平台的 Apple macOS    |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅        | 基於 Apple Silicon 平台的 Apple iOS 模擬器 |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅        | 基於 x86-64 平台的 Apple iOS 模擬器      |
| `iosArm64`              | `aarch64-apple-ios`           |          | 基於 ARM64 平台的 Apple iOS 和 iPadOS    |

## Tier 2 (第二級)

*   該目標平台定期在 CI 上進行測試以確保能夠編譯，但可能不會自動測試其執行能力。
*   我們盡力提供編譯器版本之間的原始碼和 [二進位相容性](https://youtrack.jetbrains.com/issue/KT-42293)。

| Gradle 目標平台名稱     | 目標三元組 (Target triple)        | 執行測試 | 描述                                       |
|-------------------------|-----------------------------------|----------|--------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅        | 基於 x86_64 平台的 Linux                   |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |          | 基於 ARM64 平台的 Linux                    |
| 僅限 Apple macOS 主機：   |                                   |          |                                            |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅        | 基於 Apple Silicon 平台的 Apple watchOS 模擬器 |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅        | 基於 x86_64 平台的 Apple watchOS 64 位元模擬器 |
| `watchosArm32`          | `armv7k-apple-watchos`            |          | 基於 ARM32 平台的 Apple watchOS            |
| `watchosArm64`          | `arm64_32-apple-watchos`          |          | 基於 ILP32 的 ARM64 平台上的 Apple watchOS |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅        | 基於 Apple Silicon 平台的 Apple tvOS 模擬器 |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅        | 基於 x86_64 平台的 Apple tvOS 模擬器       |
| `tvosArm64`             | `aarch64-apple-tvos`              |          | 基於 ARM64 平台的 Apple tvOS               |

## Tier 3 (第三級)

*   不保證該目標平台在 CI 上進行測試。
*   我們無法保證不同編譯器版本之間的原始碼和二進位相容性，儘管這些目標平台的此類變更非常罕見。

| Gradle 目標平台名稱     | 目標三元組 (Target triple)      | 執行測試 | 描述                                                                          |
|-------------------------|---------------------------------|----------|-------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |          | 基於 ARM32 平台的 [Android NDK](https://developer.android.com/ndk)            |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |          | 基於 ARM64 平台的 [Android NDK](https://developer.android.com/ndk)            |
| `androidNativeX86`      | `i686-unknown-linux-android`    |          | 基於 x86 平台的 [Android NDK](https://developer.android.com/ndk)              |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |          | 基於 x86_64 平台的 [Android NDK](https://developer.android.com/ndk)           |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅        | 使用 [MinGW](https://www.mingw-w64.org) 相容層的 64 位元 Windows 7 及更高版本 |
| 僅限 Apple macOS 主機：   |                                 |          |                                                                               |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |          | 基於 ARM64 平台的 Apple watchOS                                               |

> `linuxArm32Hfp` 目標平台已棄用，並將在未來版本中移除。
> 
{style="note"}

## 針對函式庫作者

我們不建議函式庫作者測試比 Kotlin/Native 編譯器支援更多或提供更嚴格保證的目標平台。在考慮原生目標平台支援時，您可以採用以下方法：

*   支援 Tier 1、2 和 3 中的所有目標平台。
*   定期測試 Tier 1 和 2 中支援開箱即用測試執行的目標平台。

Kotlin 團隊在官方 Kotlin 函式庫中採用此方法，例如 [kotlinx.coroutines](coroutines-guide.md) 和 [kotlinx.serialization](serialization.md)。