[//]: # (title: Kotlin/Nativeのターゲットサポート)

Kotlin/Nativeコンパイラは多数の異なるターゲットをサポートしていますが、それらすべてに同じレベルのサポートを提供することは困難です。このドキュメントでは、Kotlin/Nativeがどのターゲットをサポートしているか、そしてコンパイラがそれらをどの程度サポートしているかに応じて、それらをいくつかの階層（ティア）に分類して説明します。

> ティアの数、サポートされるターゲットのリスト、およびそれらの機能は随時調整する可能性があります。
> 
{style="tip"}

階層（ティア）の表で使用される以下の用語に注意してください。

*   **Gradle target name** は、[Kotlin Multiplatform Gradleプラグイン](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)でターゲットを有効にするために使用される[ターゲット名](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)です。
*   **Target triple** は、[コンパイラ](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)で一般的に使用される`<architecture>-<vendor>-<system>-<abi>`構造に基づいたターゲット名です。
*   **Running tests** は、GradleおよびIDEでテストを実行するための標準でのサポートを示します。

    これは、特定のターゲットのネイティブホストでのみ利用可能です。たとえば、`macosX64`および`iosX64`のテストは、macOS x86-64ホストでのみ実行できます。

## Tier 1

*   このターゲットは、コンパイルと実行ができることをCIで定期的にテストされています。
*   コンパイラのリリース間でソースと[バイナリの互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供します。

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | x86_64プラットフォーム上のApple macOS          |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Siliconプラットフォーム上のApple macOS   |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Siliconプラットフォーム上のApple iOSシミュレータ |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | x86-64プラットフォーム上のApple iOSシミュレータ |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64プラットフォーム上のApple iOSおよびiPadOS |

## Tier 2

*   このターゲットは、コンパイルができることをCIで定期的にテストされますが、実行できることの自動テストは行われない場合があります。
*   コンパイラのリリース間でソースと[バイナリの互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供できるよう、最善を尽くしています。

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64プラットフォーム上のLinux                    |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64プラットフォーム上のLinux                     |
| Apple macOS hosts only: |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Siliconプラットフォーム上のApple watchOSシミュレータ |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64プラットフォーム上のApple watchOS 64-bitシミュレータ |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32プラットフォーム上のApple watchOS             |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ILP32を搭載したARM64プラットフォーム上のApple watchOS |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Siliconプラットフォーム上のApple tvOSシミュレータ |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64プラットフォーム上のApple tvOSシミュレータ   |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64プラットフォーム上のApple tvOS                |

## Tier 3

*   このターゲットはCIでテストされることが保証されていません。
*   異なるコンパイラリリース間でのソースとバイナリの互換性を約束することはできませんが、これらのターゲットに対するそのような変更は非常にまれです。

| Gradle target name      | Target triple                   | Running tests | Description                                                                             |
|-------------------------|---------------------------------|---------------|-----------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | ARM32プラットフォーム上の[Android NDK](https://developer.android.com/ndk)             |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | ARM64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)             |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | x86プラットフォーム上の[Android NDK](https://developer.android.com/ndk)               |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | x86_64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)            |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | [MinGW](https://www.mingw-w64.org)互換レイヤーを使用する64-bit Windows 7以降           |
| Apple macOS hosts only: |                                 |               |                                                                                         |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | ARM64プラットフォーム上のApple watchOS                                                    |

> `linuxArm32Hfp`ターゲットは非推奨であり、将来のリリースで削除される予定です。
> 
{style="note"}

## ライブラリ作者向け

ライブラリ作者がKotlin/Nativeコンパイラよりも多くのターゲットをテストしたり、より厳格な保証を提供したりすることはお勧めしません。ネイティブターゲットのサポートを検討する際は、以下の方法を使用できます。

*   Tier 1、2、および3のすべてのターゲットをサポートします。
*   標準でテスト実行をサポートしているTier 1および2のターゲットを定期的にテストします。

Kotlinチームは、公式のKotlinライブラリ（例：[kotlinx.coroutines](coroutines-guide.md)や[kotlinx.serialization](serialization.md)）でこのアプローチを使用しています。