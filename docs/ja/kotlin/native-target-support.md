[//]: # (title: Kotlin/Nativeがサポートするターゲットとホスト)

このドキュメントでは、Kotlin/Nativeコンパイラがサポートするターゲットとホストについて説明します。

> サポートされるターゲットとホストのリスト、ティアの数、およびそれらの機能は、必要に応じて調整される可能性があります。
>
{style="tip"}

## ターゲットのティア

Kotlin/Nativeコンパイラは多数の異なるターゲットをサポートしていますが、それらに対するサポートレベルは様々です。
これらのレベルを明確にするため、コンパイラがどれだけ適切にサポートしているかに応じて、ターゲットをいくつかのティアに分類しました。

ティアの表で使用されている以下の用語にご注意ください。

*   **Gradleターゲット名**は、Kotlin Multiplatform Gradleプラグインでターゲットを有効にするために使用される[ターゲット名](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)です。
*   **ターゲットトリプル**は、[コンパイラ](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)で一般的に使用される`<architecture>-<vendor>-<system>-<abi>`構造に基づくターゲット名です。
*   **テストの実行**は、GradleおよびIDEでのテスト実行に対する「すぐに使える（out-of-the-box）」サポートを示します。
  
    これは、特定のターゲットに対するネイティブホストでのみ利用可能です。例えば、`macosArm64`および`iosArm64`のテストは、macOS ARM64ホスト上でのみ実行できます。

### ティア1

*   ターゲットは、コンパイルおよび実行可能であるかCIで定期的にテストされます。
*   コンパイラのリリース間でのソースおよび[バイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供します。

| Gradleターゲット名      | ターゲットトリプル                 | テストの実行 | 説明                                                   |
|-------------------------|-------------------------------|---------------|---------------------------------------------------------------|
| Apple macOSホストのみ: |                               |               |                                                               |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple Siliconプラットフォーム上のApple macOS 11.0以降         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple Siliconプラットフォーム上のApple iOSシミュレーター 14.0以降 |
| `iosArm64`              | `aarch64-apple-ios`           |               | ARM64プラットフォーム上のApple iOSおよびiPadOS 14.0以降        |

### ティア2

*   ターゲットは、コンパイル可能であるかCIで定期的にテストされますが、実行可能であるかの自動テストは行われない場合があります。
*   コンパイラのリリース間でのソースおよび[バイナリ互換性](https://youtrack.jetbrains.com/issue/KT-42293)を提供するよう最善を尽くしています。

| Gradleターゲット名      | ターゲットトリプル                     | テストの実行 | 説明                                                      |
|-------------------------|-----------------------------------|---------------|------------------------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | x86_64プラットフォーム上のLinux                                        |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64プラットフォーム上のLinux                                         |
| Apple macOSホストのみ: |                                   |               |                                                                  |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Siliconプラットフォーム上のApple watchOSシミュレーター 7.0以降 |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32プラットフォーム上のApple watchOS 7.0以降                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ILP32を持つARM64プラットフォーム上のApple watchOS 7.0以降        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Siliconプラットフォーム上のApple tvOSシミュレーター 14.0以降   |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64プラットフォーム上のApple tvOS 14.0以降                     |

### ティア3

*   ターゲットはCIでテストされることを保証しません。
*   これらのターゲットに対する変更は非常にまれですが、異なるコンパイラのリリース間でのソースおよびバイナリ互換性を約束することはできません。

| Gradleターゲット名      | ターゲットトリプル                    | テストの実行 | 説明                                                                              |
|-------------------------|----------------------------------|---------------|------------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi`  |               | ARM32プラットフォーム上の[Android NDK](https://developer.android.com/ndk)              |
| `androidNativeArm64`    | `aarch64-unknown-linux-android`  |               | ARM64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)              |
| `androidNativeX86`      | `i686-unknown-linux-android`     |               | x86プラットフォーム上の[Android NDK](https://developer.android.com/ndk)                |
| `androidNativeX64`      | `x86_64-unknown-linux-android`   |               | x86_64プラットフォーム上の[Android NDK](https://developer.android.com/ndk)             |
| `mingwX64`              | `x86_64-pc-windows-gnu`          | ✅             | [MinGW](https://www.mingw-w64.org)互換性レイヤーを使用する64ビットWindows 10以降 |
| Apple macOSホストのみ: |                                  |               |                                                                                          |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`          |               | ARM64プラットフォーム上のApple watchOS 7.0以降                                           |
| `macosX64`              | `x86_64-apple-macos`             | ✅             | x86_64プラットフォーム上のApple macOS 11.0以降                                           |
| `iosX64`                | `x86_64-apple-ios-simulator`     | ✅             | x86-64プラットフォーム上のApple iOSシミュレーター 14.0以降                                   |
| `watchosX64`            | `x86_64-apple-watchos-simulator` | ✅             | x86_64プラットフォーム上のApple watchOS 7.0以降 64ビットシミュレーター                         |
| `tvosX64`               | `x86_64-apple-tvos-simulator`    | ✅             | x86_64プラットフォーム上のApple tvOS 14.0以降シミュレーター                                  |

> `linuxArm32Hfp`ターゲットは非推奨であり、将来のリリースで削除される予定です。
> 
{style="note"}

### ライブラリ作者向け

ライブラリ作者がKotlin/Nativeコンパイラよりも多くのターゲットをテストしたり、より厳格な保証を提供したりすることはお勧めしません。ネイティブターゲットのサポートを検討する際には、以下のアプローチを使用できます。

*   ティア1、2、3のすべてのターゲットをサポートします。
*   ティア1および2で、すぐにテスト実行をサポートするターゲットを定期的にテストします。

Kotlinチームは、公式のKotlinライブラリ（例: [kotlinx.coroutines](coroutines-guide.md)や[kotlinx.serialization](serialization.md)）でこのアプローチを使用しています。

## ホスト

Kotlin/Nativeコンパイラは以下のホストをサポートしています。

| ホストOS                                         | 最終バイナリのビルド                 | `.klib`アーティファクトの生成                               |
|----------------------------------------------------|--------------------------------------|-----------------------------------------------------------------|
| Apple Silicon (ARM64)上のmacOS                     | すべてのサポートされるターゲット | すべてのサポートされるターゲット |
| Intelチップ (x86_64)上のmacOS                      | すべてのサポートされるターゲット | すべてのサポートされるターゲット |
| x86_64アーキテクチャのLinux                        | Appleターゲットを除くすべてのサポートされるターゲット | すべてのサポートされるターゲット（Appleターゲットはcinterop依存関係がない場合のみ） |
| x86_64アーキテクチャのWindows (MinGWツールチェーン) | Appleターゲットを除くすべてのサポートされるターゲット | すべてのサポートされるターゲット（Appleターゲットはcinterop依存関係がない場合のみ） |

### 最終バイナリのビルド

最終バイナリを生成するには、[サポートされるターゲット](#target-tiers)に対して、_サポートされるホスト_上でのみコンパイルできます。例えば、FreeBSDやARM64アーキテクチャで実行されているLinuxマシン上では実行できません。

LinuxおよびWindows上でのAppleターゲット用の最終バイナリのビルドも不可能です。

### `.klib`アーティファクトの生成

一般に、Kotlin/Nativeはどの_サポートされるホスト_でもサポートされるターゲット用の`.klib`アーティファクトを生成することを許可します。

ただし、Appleターゲットのアーティファクト生成には、LinuxとWindowsでいくつかの制限がまだあります。プロジェクトが[cinterop依存関係](native-c-interop.md)（[CocoaPods](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を含む）を使用している場合、macOSホストを使用する必要があります。

例えば、`macosArm64`ターゲット用の`.klib`をx86_64アーキテクチャで実行されているWindowsマシン上で生成できるのは、cinterop依存関係がない場合に限られます。

## 次のステップ

*   [最終的なネイティブバイナリのビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)
*   [Appleターゲットのコンパイル](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets)