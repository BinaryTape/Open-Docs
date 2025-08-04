[//]: # (title: Kotlin/Native 대상 지원)

Kotlin/Native 컴파일러는 다양한 대상을 지원하지만, 모든 대상에 동일한 수준의 지원을 제공하기는 어렵습니다. 이 문서에서는 Kotlin/Native가 지원하는 대상을 설명하고, 컴파일러의 지원 수준에 따라 여러 계층으로 분류합니다.

> 진행하면서 계층의 수, 지원 대상 목록, 그리고 해당 기능을 조정할 수 있습니다.
> 
{style="tip"}

계층 테이블에 사용된 다음 용어에 유의하십시오:

*   **Gradle 대상 이름**은 Kotlin Multiplatform Gradle 플러그인에서 대상을 활성화하는 데 사용되는 [대상 이름](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)입니다.
*   **Target triple**은 [컴파일러](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)에서 일반적으로 사용되는 `<architecture>-<vendor>-<system>-<abi>` 구조에 따른 대상 이름입니다.
*   **테스트 실행**은 Gradle 및 IDE에서 테스트를 즉시 실행할 수 있는 지원을 의미합니다.
  
    이는 특정 대상의 네이티브 호스트에서만 사용할 수 있습니다. 예를 들어, `macosX64` 및 `iosX64` 테스트는 macOS x86-64 호스트에서만 실행할 수 있습니다.

## 계층 1

*   CI에서 컴파일 및 실행 가능 여부가 정기적으로 테스트되는 대상입니다.
*   컴파일러 릴리스 간의 소스 및 [바이너리 호환성](https://youtrack.jetbrains.com/issue/KT-42293)을 제공합니다.

| Gradle 대상 이름      | Target triple                 | 테스트 실행 | 설명                                       |
|-----------------------|-------------------------------|-------------|--------------------------------------------|
| Apple macOS 호스트 전용: |                               |             |                                            |
| `macosX64`            | `x86_64-apple-macos`          | ✅           | x86_64 플랫폼의 Apple macOS                |
| `macosArm64`          | `aarch64-apple-macos`         | ✅           | Apple Silicon 플랫폼의 Apple macOS         |
| `iosSimulatorArm64`   | `aarch64-apple-ios-simulator` | ✅           | Apple Silicon 플랫폼의 Apple iOS 시뮬레이터 |
| `iosX64`             | `x86_64-apple-ios-simulator`  | ✅           | x86-64 플랫폼의 Apple iOS 시뮬레이터       |
| `iosArm64`            | `aarch64-apple-ios`           |             | ARM64 플랫폼의 Apple iOS 및 iPadOS         |

## 계층 2

*   CI에서 컴파일 가능 여부는 정기적으로 테스트되지만, 실행 가능 여부는 자동으로 테스트되지 않을 수 있는 대상입니다.
*   컴파일러 릴리스 간의 소스 및 [바이너리 호환성](https://youtrack.jetbrains.com/issue/KT-42293)을 제공하기 위해 최선을 다하고 있습니다.

| Gradle 대상 이름      | Target triple                     | 테스트 실행 | 설명                                           |
|-----------------------|-----------------------------------|-------------|------------------------------------------------|
| `linuxX64`            | `x86_64-unknown-linux-gnu`        | ✅           | x86_64 플랫폼의 Linux                          |
| `linuxArm64`          | `aarch64-unknown-linux-gnu`       |             | ARM64 플랫폼의 Linux                           |
| Apple macOS 호스트 전용: |                                   |             |                                                |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅           | Apple Silicon 플랫폼의 Apple watchOS 시뮬레이터 |
| `watchosX64`          | `x86_64-apple-watchos-simulator`  | ✅           | x86_64 플랫폼의 Apple watchOS 64비트 시뮬레이터 |
| `watchosArm32`        | `armv7k-apple-watchos`            |             | ARM32 플랫폼의 Apple watchOS                   |
| `watchosArm64`        | `arm64_32-apple-watchos`          |             | ILP32를 사용하는 ARM64 플랫폼의 Apple watchOS  |
| `tvosSimulatorArm64`  | `aarch64-apple-tvos-simulator`    | ✅           | Apple Silicon 플랫폼의 Apple tvOS 시뮬레이터   |
| `tvosX64`             | `x86_64-apple-tvos-simulator`     | ✅           | x86_64 플랫폼의 Apple tvOS 시뮬레이터          |
| `tvosArm64`           | `aarch64-apple-tvos`              |             | ARM64 플랫폼의 Apple tvOS                      |

## 계층 3

*   CI에서 테스트가 보장되지 않는 대상입니다.
*   컴파일러 릴리스 간의 소스 및 바이너리 호환성을 보장할 수는 없지만, 이러한 대상에 대한 변경 사항은 매우 드뭅니다.

| Gradle 대상 이름      | Target triple                   | 테스트 실행 | 설명                                                             |
|-----------------------|---------------------------------|-------------|------------------------------------------------------------------|
| `androidNativeArm32`  | `arm-unknown-linux-androideabi` |             | ARM32 플랫폼의 [Android NDK](https://developer.android.com/ndk)  |
| `androidNativeArm64`  | `aarch64-unknown-linux-android` |             | ARM64 플랫폼의 [Android NDK](https://developer.android.com/ndk)  |
| `androidNativeX86`    | `i686-unknown-linux-android`    |             | x86 플랫폼의 [Android NDK](https://developer.android.com/ndk)    |
| `androidNativeX64`    | `x86_64-unknown-linux-android`  |             | x86_64 플랫폼의 [Android NDK](https://developer.android.com/ndk) |
| `mingwX64`            | `x86_64-pc-windows-gnu`         | ✅           | [MinGW](https://www.mingw-w64.org) 호환성 레이어를 사용하는 64비트 Windows 10 이상 |
| Apple macOS 호스트 전용: |                                 |             |                                                                  |
| `watchosDeviceArm64`  | `aarch64-apple-watchos`         |             | ARM64 플랫폼의 Apple watchOS                                     |

> `linuxArm32Hfp` 대상은 더 이상 사용되지 않으며 향후 릴리스에서 제거될 예정입니다.
> 
{style="note"}

## 라이브러리 개발자를 위한 정보

라이브러리 개발자가 Kotlin/Native 컴파일러보다 더 많은 대상을 테스트하거나 더 엄격한 보증을 제공하는 것은 권장하지 않습니다. 네이티브 대상 지원을 고려할 때 다음 접근 방식을 사용할 수 있습니다:

*   계층 1, 2, 3의 모든 대상을 지원합니다.
*   즉시 테스트 실행을 지원하는 계층 1 및 2의 대상을 정기적으로 테스트합니다.

Kotlin 팀은 예를 들어 [kotlinx.coroutines](coroutines-guide.md) 및 [kotlinx.serialization](serialization.md)과 같은 공식 Kotlin 라이브러리에서 이 접근 방식을 사용합니다.