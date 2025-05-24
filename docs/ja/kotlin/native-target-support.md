---
title: "Kotlin/Native のターゲットサポート"
---
Kotlin/Nativeコンパイラーは、非常に多くの異なるターゲットをサポートしていますが、それらすべてに対して同じレベルのサポートを提供することは困難です。このドキュメントでは、Kotlin/Nativeがサポートするターゲットと、コンパイラーによるサポートのレベルに応じて、それらをいくつかの階層に分けて説明します。

:::note
階層の数、サポートされるターゲットのリスト、およびその機能は、必要に応じて調整できます。

階層の表で使用されている以下の用語に注意してください。

* **Gradle target name** は、ターゲットを有効にするためにKotlin Multiplatform Gradle pluginで使用される[target name](multiplatform-dsl-reference#targets)です。
* **Target triple** は、`<architecture>-<vendor>-<system>-<abi>` 構造に従ったターゲット名であり、一般的に[コンパイラー](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)で使用されます。
* **Running tests** は、GradleとIDEでテストを実行するための、すぐに使えるサポートを示します。
  
    これは、特定のターゲットのネイティブホストでのみ利用可能です。たとえば、`macosX64` および `iosX64` のテストは、macOS x86-64ホストでのみ実行できます。

## Tier 1

* このターゲットは、コンパイルと実行が可能かどうかを定期的にCIでテストされています。
* ソースと[コンパイラーのリリース間のバイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供します。

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | x86_64プラットフォーム上のApple macOS          |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Siliconプラットフォーム上のApple macOS   |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Siliconプラットフォーム上のApple iOSシミュレーター |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | x86-64プラットフォーム上のApple iOSシミュレーター        |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64プラットフォーム上のApple iOSおよびiPadOS       |

## Tier 2

* このターゲットは、コンパイルが可能かどうかを定期的にCIでテストされていますが、実行可能かどうかを自動的にテストされるとは限りません。
* ソースと[コンパイラーのリリース間のバイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供するために最善を尽くしています。

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64プラットフォーム上のLinux                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64プラットフォーム上のLinux                           |
| Apple macOS hosts only: |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Siliconプラットフォーム上のApple watchOSシミュレーター |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64プラットフォーム上のApple watchOS 64-bitシミュレーター |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32プラットフォーム上のApple watchOS                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ILP32を使用したARM64プラットフォーム上のApple watchOS        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Siliconプラットフォーム上のApple tvOSシミュレーター    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64プラットフォーム上のApple tvOSシミュレーター           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64プラットフォーム上のApple tvOS                      |

## Tier 3

* このターゲットは、CIでテストされることは保証されていません。
* 異なるコンパイラーリリース間のソースおよびバイナリ互換性は保証できませんが、これらのターゲットに対するそのような変更は非常にまれです。

| Gradle target name      | Target triple                   | Running tests | Description                                                                             |
|-------------------------|---------------------------------|---------------|-----------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | ARM32プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | ARM64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                     |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | x86プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                       |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | x86_64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                    |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | [MinGW](https://www.mingw-w64.org)互換レイヤーを使用した64-bit Windows 7以降 |
| Apple macOS hosts only: |                                 |               |                                                                                         |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | ARM64プラットフォーム上のApple watchOS                                                        |

`linuxArm32Hfp` ターゲットは非推奨であり、今後のリリースで削除されます。

:::

## For library authors

ライブラリの作成者は、Kotlin/Nativeコンパイラーよりも多くのターゲットをテストしたり、より厳密な保証を提供したりすることはお勧めしません。ネイティブターゲットのサポートを検討する際には、次のアプローチを使用できます。

* tier 1、2、および3のすべてのターゲットをサポートします。
* すぐにテストを実行できるtier 1および2のターゲットを定期的にテストします。

Kotlinチームは、公式のKotlinライブラリ（たとえば、[kotlinx.coroutines](coroutines-guide)や[kotlinx.serialization](serialization)）でこのアプローチを使用しています。