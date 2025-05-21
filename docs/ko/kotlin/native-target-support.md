---
title: "Kotlin/Native 대상 지원"
---
Kotlin/Native 컴파일러는 매우 다양한 대상을 지원하지만, 모든 대상에 대해 동일한 수준의 지원을 제공하기는 어렵습니다. 이 문서는 Kotlin/Native가 지원하는 대상을 설명하고 컴파일러 지원 수준에 따라 여러 계층으로 나눕니다.

:::note
지원되는 대상 목록, 기능 및 계층 수는 변경될 수 있습니다.

계층 테이블에 사용된 용어는 다음과 같습니다.

* **Gradle target name**은 대상을 활성화하기 위해 Kotlin Multiplatform Gradle 플러그인에서 사용되는 [target name](multiplatform-dsl-reference#targets)입니다.
* **Target triple**은 일반적으로 [컴파일러](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)에서 사용되는 `<architecture>-<vendor>-<system>-<abi>` 구조에 따른 대상 이름입니다.
* **Running tests**는 Gradle 및 IDE에서 즉시 테스트 실행을 지원하는지 여부를 나타냅니다.

    이는 특정 대상에 대한 네이티브 호스트에서만 사용할 수 있습니다. 예를 들어 `macosX64` 및 `iosX64` 테스트는 macOS x86-64 호스트에서만 실행할 수 있습니다.

## Tier 1

* 대상이 컴파일 및 실행 가능한지 정기적으로 CI에서 테스트합니다.
* 컴파일러 릴리스 간에 소스 및 [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293)를 제공합니다.

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | x86_64 플랫폼의 Apple macOS                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Silicon 플랫폼의 Apple macOS         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Silicon 플랫폼의 Apple iOS 시뮬레이터 |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | x86-64 플랫폼의 Apple iOS 시뮬레이터        |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64 플랫폼의 Apple iOS 및 iPadOS        |

## Tier 2

* 대상이 컴파일 가능한지 정기적으로 CI에서 테스트하지만, 실행 가능한지 자동으로 테스트하지 않을 수 있습니다.
* 컴파일러 릴리스 간에 소스 및 [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293)를 제공하기 위해 최선을 다하고 있습니다.

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64 플랫폼의 Linux                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64 플랫폼의 Linux                           |
| Apple macOS hosts only: |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Silicon 플랫폼의 Apple watchOS 시뮬레이터 |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64 플랫폼의 Apple watchOS 64비트 시뮬레이터 |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32 플랫폼의 Apple watchOS                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ILP32를 사용하는 ARM64 플랫폼의 Apple watchOS        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Silicon 플랫폼의 Apple tvOS 시뮬레이터    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64 플랫폼의 Apple tvOS 시뮬레이터           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64 플랫폼의 Apple tvOS                      |

## Tier 3

* 대상이 CI에서 테스트된다는 보장이 없습니다.
* 서로 다른 컴파일러 릴리스 간에 소스 및 바이너리 호환성을 보장할 수 없지만, 이러한 대상에 대한 변경 사항은 매우 드뭅니다.

| Gradle target name      | Target triple                   | Running tests | Description                                                                             |
|-------------------------|---------------------------------|---------------|-----------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | ARM32 플랫폼의 [Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | ARM64 플랫폼의 [Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | x86 플랫폼의 [Android NDK](https://developer.android.com/ndk)                       |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | x86_64 플랫폼의 [Android NDK](https://developer.android.com/ndk)                    |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | [MinGW](https://www.mingw-w64.org) 호환성 계층을 사용하는 64비트 Windows 7 이상 |
| Apple macOS hosts only: |                                 |               |                                                                                         |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | ARM64 플랫폼의 Apple watchOS                                                        |

`linuxArm32Hfp` 대상은 더 이상 사용되지 않으며 향후 릴리스에서 제거될 예정입니다.

:::

## For library authors

라이브러리 작성자는 Kotlin/Native 컴파일러보다 더 많은 대상을 테스트하거나 더 엄격한 보증을 제공하는 것을 권장하지 않습니다. 네이티브 대상에 대한 지원을 고려할 때 다음 접근 방식을 사용할 수 있습니다.

* 1, 2, 3 계층의 모든 대상을 지원합니다.
* 즉시 테스트 실행을 지원하는 1, 2 계층의 대상을 정기적으로 테스트합니다.

Kotlin 팀은 공식 Kotlin 라이브러리(예: [kotlinx.coroutines](coroutines-guide) 및 [kotlinx.serialization](serialization))에서 이 접근 방식을 사용합니다.