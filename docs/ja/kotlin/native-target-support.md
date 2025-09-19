[//]: # (title: Kotlin/Nativeのターゲットサポート)

Kotlin/Nativeコンパイラは非常に多くの異なるターゲットをサポートしていますが、それらすべてに対して同じレベルのサポートを提供することは困難です。このドキュメントでは、Kotlin/Nativeがサポートするターゲットと、コンパイラによるサポートの度合いに応じてそれらをいくつかのティアに分類する方法について説明します。

> ティアの数、サポートされるターゲットのリスト、およびその機能は、必要に応じて調整される可能性があります。
>
{style="tip"}

以下のティアテーブルで使用される用語にご注意ください。

*   **Gradleターゲット名**は、Kotlin Multiplatform Gradleプラグインでターゲットを有効にするために使用される[ターゲット名](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)です。
*   **ターゲットトリプル**は、[コンパイラ](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)で一般的に使用される`<architecture>-<vendor>-<system>-<abi>`構造に基づくターゲット名です。
*   **テストの実行**は、GradleおよびIDEでのテスト実行の「すぐに使える（out-of-the-box）」サポートを示します。
  
    これは、特定のターゲットに対するネイティブホストでのみ利用可能です。例えば、`macosX64`および`iosX64`のテストは、macOS x86-64ホスト上でのみ実行できます。

## ティア1

*   ターゲットは、コンパイルおよび実行可能であるかCIで定期的にテストされます。
*   コンパイラのリリース間でのソースおよび[バイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供します。

| Gradleターゲット名      | ターゲットトリプル                 | テストの実行 | 説明                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOSホストのみ: |                               |               |                                                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Siliconプラットフォーム上のApple macOS   |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Siliconプラットフォーム上のApple iOSシミュレーター |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64プラットフォーム上のApple iOSおよびiPadOS  |

## ティア2

*   ターゲットは、コンパイル可能であるかCIで定期的にテストされますが、実行可能であるかの自動テストは行われない場合があります。
*   コンパイラのリリース間でのソースおよび[バイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供するよう最善を尽くしています。

| Gradleターゲット名      | ターゲットトリプル                     | テストの実行 | 説明                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64プラットフォーム上のLinux                    |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64プラットフォーム上のLinux                     |
| Apple macOSホストのみ: |                                   |               |                                                    |
| `macosX64`              | `x86_64-apple-macos`              | ✅             | x86_64プラットフォーム上のApple macOS          |
| `iosX64`                | `x86_64-apple-ios-simulator`      | ✅             | x86-64プラットフォーム上のApple iOSシミュレーター        |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Siliconプラットフォーム上のApple watchOSシミュレーター |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64プラットフォーム上のApple watchOS 64ビットシミュレーター |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32プラットフォーム上のApple watchOS             |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ILP32を持つARM64プラットフォーム上のApple watchOS        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Siliconプラットフォーム上のApple tvOSシミュレーター    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64プラットフォーム上のApple tvOSシミュレーター       |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64プラットフォーム上のApple tvOS                |

## ティア3

*   ターゲットはCIでテストされることを保証しません。
*   これらのターゲットに対する変更は非常にまれですが、異なるコンパイラのリリース間でのソースおよびバイナリ互換性を約束することはできません。

| Gradleターゲット名      | ターゲットトリプル                   | テストの実行 | 説明                                                                              |
|-------------------------|---------------------------------|---------------|------------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | ARM32プラットフォーム上の[Android NDK](https://developer.android.com/ndk)              |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | ARM64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)              |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | x86プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | x86_64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)             |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | [MinGW](https://www.mingw-w64.org)互換性レイヤーを使用する64ビットWindows 10以降 |
| Apple macOSホストのみ: |                                 |               |                                                                                          |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | ARM64プラットフォーム上のApple watchOS                                                     |

> `linuxArm32Hfp`ターゲットは非推奨であり、将来のリリースで削除される予定です。
>
{style="note"}

## ライブラリ作者向け

ライブラリ作者がKotlin/Nativeコンパイラよりも多くのターゲットをテストしたり、より厳格な保証を提供したりすることはお勧めしません。ネイティブターゲットのサポートを検討する際には、以下のアプローチを使用できます。

*   ティア1、2、3のすべてのターゲットをサポートします。
*   ティア1および2で、すぐにテスト実行をサポートするターゲットを定期的にテストします。

Kotlinチームは、公式のKotlinライブラリ（例: [kotlinx.coroutines](coroutines-guide.md)や[kotlinx.serialization](serialization.md)）でこのアプローチを使用しています。