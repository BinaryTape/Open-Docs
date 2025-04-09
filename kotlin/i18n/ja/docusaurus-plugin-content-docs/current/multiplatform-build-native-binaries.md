---
title: 最終的なネイティブバイナリをビルドする
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

デフォルトでは、Kotlin/Native ターゲットは `*.klib` ライブラリ成果物にコンパイルされます。これは、Kotlin/Native
自体で依存関係として使用できますが、実行したり、ネイティブライブラリとして使用したりすることはできません。

実行可能ファイルや共有ライブラリなどの最終的なネイティブバイナリを宣言するには、ネイティブターゲットの `binaries` プロパティを使用します。
このプロパティは、デフォルトの `*.klib` 成果物に加えて、このターゲット用にビルドされたネイティブバイナリのコレクションを表し、
それらを宣言および構成するための一連のメソッドを提供します。

:::note
`kotlin-multiplatform` プラグインは、デフォルトでは本番バイナリを作成しません。デフォルトで使用できる唯一のバイナリは、
`test` コンパイルからユニットテストを実行できるデバッグテスト実行可能ファイルです。

:::

Kotlin/Native コンパイラによって生成されたバイナリには、サードパーティのコード、データ、または派生物を含めることができます。
これは、Kotlin/Native でコンパイルされた最終的なバイナリを配布する場合は、
必要な [ライセンスファイル](native-binary-licenses) をバイナリ配布物に必ず含める必要があることを意味します。

## バイナリの宣言

`binaries` コレクションの要素を宣言するには、次のファクトリメソッドを使用します。

| ファクトリメソッド | バイナリの種類           | 使用可能なターゲット                                |
|----------------|-----------------------|----------------------------------------------|
| `executable`   | 製品実行可能ファイル    | すべてのネイティブターゲット                           |
| `test`         | テスト実行可能ファイル       | すべてのネイティブターゲット                           |
| `sharedLib`    | 共有ネイティブライブラリ | `WebAssembly` を除くすべてのネイティブターゲット |
| `staticLib`    | 静的ネイティブライブラリ | `WebAssembly` を除くすべてのネイティブターゲット |
| `framework`    | Objective-C framework | macOS、iOS、watchOS、および tvOS ターゲットのみ   |

最もシンプルなバージョンでは追加のパラメータは不要で、ビルドタイプごとに 1 つのバイナリが作成されます。現在、
次の 2 つのビルドタイプを使用できます。

* `DEBUG` – デバッグ情報を含む非最適化バイナリを生成します
* `RELEASE` – デバッグ情報を含まない最適化バイナリを生成します

次のスニペットは、デバッグおよびリリースの 2 つの実行可能バイナリを作成します。

```kotlin
kotlin {
    linuxX64 { // ターゲットを代わりに定義します。
        binaries {
            executable {
                // バイナリの構成。
            }
        }
    }
}
```

[追加の構成](multiplatform-dsl-reference#native-targets) が不要な場合は、ラムダを削除できます。

```kotlin
binaries {
    executable()
}
```

バイナリを作成するビルドタイプを指定できます。次の例では、`debug` 実行可能ファイルのみが作成されます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // バイナリの構成。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable([DEBUG]) {
        // バイナリの構成。
    }
}
```

</TabItem>
</Tabs>

カスタム名でバイナリを宣言することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // バイナリの構成。
    }

    // ビルドタイプのリストを削除できます
    // (この場合、使用可能なすべてのビルドタイプが使用されます)。
    executable("bar") {
        // バイナリの構成。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // バイナリの構成。
    }

    // ビルドタイプのリストを削除できます
    // (この場合、使用可能なすべてのビルドタイプが使用されます)。
    executable('bar') {
        // バイナリの構成。
    }
}
```

</TabItem>
</Tabs>

最初の引数は、バイナリファイルのデフォルト名である名前のプレフィックスを設定します。たとえば、Windows の場合、コードは
ファイル `foo.exe` と `bar.exe` を生成します。名前のプレフィックスを使用して、[ビルドスクリプトでバイナリにアクセス](#access-binaries) することもできます。

## バイナリへのアクセス

バイナリにアクセスして、[構成](multiplatform-dsl-reference#native-targets) したり、プロパティ (たとえば、出力ファイルへのパス) を取得したりできます。

バイナリは、一意の名前で取得できます。この名前は、名前のプレフィックス (指定されている場合)、ビルドタイプ、および
バイナリの種類に基づいており、パターン `<optional-name-prefix><build-type><binary-kind>` (たとえば、`releaseFramework` や
`testDebugExecutable`) に従います。

:::note
静的ライブラリと共有ライブラリには、それぞれ static と shared のサフィックスが付きます (例: `fooDebugStatic` や `barReleaseShared`)。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// そのようなバイナリがない場合、失敗します。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// そのようなバイナリがない場合、null を返します。
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// そのようなバイナリがない場合、失敗します。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// そのようなバイナリがない場合、null を返します。
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

または、型付きゲッターを使用して、名前のプレフィックスとビルドタイプでバイナリにアクセスすることもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// そのようなバイナリがない場合、失敗します。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 名前プレフィックスが設定されていない場合は、最初の引数をスキップします。
binaries.getExecutable("bar", "DEBUG") // ビルドタイプに文字列を使用することもできます。

// 同様のゲッターは、他のバイナリの種類でも使用できます。
// getFramework、getStaticLib、および getSharedLib。

// そのようなバイナリがない場合、null を返します。
binaries.findExecutable("foo", DEBUG)

// 同様のゲッターは、他のバイナリの種類でも使用できます。
// findFramework、findStaticLib、および findSharedLib。
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// そのようなバイナリがない場合、失敗します。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 名前プレフィックスが設定されていない場合は、最初の引数をスキップします。
binaries.getExecutable('bar', 'DEBUG') // ビルドタイプに文字列を使用することもできます。

// 同様のゲッターは、他のバイナリの種類でも使用できます。
// getFramework、getStaticLib、および getSharedLib。

// そのようなバイナリがない場合、null を返します。
binaries.findExecutable('foo', DEBUG)

// 同様のゲッターは、他のバイナリの種類でも使用できます。
// findFramework、findStaticLib、および findSharedLib。
```

</TabItem>
</Tabs>

## バイナリへの依存関係のエクスポート

Objective-C framework またはネイティブライブラリ (共有または静的) をビルドする場合、現在のプロジェクトのクラスだけでなく、
その依存関係のクラスもパッケージ化する必要がある場合があります。`export` メソッドを使用して、バイナリにエクスポートする依存関係を指定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // エクスポートされます。
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // エクスポートされません。
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // さまざまなバイナリに異なる依存関係のセットをエクスポートできます。
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // エクスポートされます。
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // エクスポートされません。
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // さまざまなバイナリに異なる依存関係のセットをエクスポートできます。
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

たとえば、Kotlin でいくつかのモジュールを実装し、Swift からそれらにアクセスするとします。Swift アプリケーションでの
複数の Kotlin/Native framework の使用は制限されていますが、アンブレラ framework を作成し、
これらのすべてのモジュールをそれにエクスポートできます。

:::note
対応するソースセットの [`api` 依存関係](gradle-configure-project#dependency-types) のみをエクスポートできます。

:::

依存関係をエクスポートすると、その API がすべて framework API に含まれます。
コンパイラは、その依存関係のコードのほんの一部しか使用しない場合でも、この依存関係のコードを framework に追加します。
これにより、エクスポートされた依存関係 (およびその依存関係) に対して、デッドコードの削除が無効になります (ある程度)。

デフォルトでは、エクスポートは非推移的に機能します。これは、ライブラリ `bar` に依存するライブラリ `foo` をエクスポートする場合、
`foo` のメソッドのみが出力 framework に追加されることを意味します。

この動作は、`transitiveExport` オプションを使用して変更できます。`true` に設定すると、ライブラリ `bar` の宣言も
エクスポートされます。

:::caution
`transitiveExport` を使用することはお勧めしません。エクスポートされた依存関係のすべての推移的な依存関係が framework に追加されるためです。
これにより、コンパイル時間とバイナリサイズの両方が増加する可能性があります。

ほとんどの場合、これらの依存関係をすべて framework API に追加する必要はありません。
Swift または Objective-C コードから直接アクセスする必要がある依存関係に対して、`export` を明示的に使用してください。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 推移的にエクスポートします。
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    framework {
        export project(':dependency')
        // 推移的にエクスポートします。
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## ユニバーサル framework のビルド

デフォルトでは、Kotlin/Native によって生成された Objective-C framework は、1 つのプラットフォームのみをサポートします。ただし、[`lipo` ツール](https://llvm.org/docs/CommandGuide/llvm-lipo.html) を使用して、このような
framework を 1 つのユニバーサル (fat) バイナリにマージできます。
この操作は、特に 32 ビットおよび 64 ビットの iOS framework に適しています。この場合、結果のユニバーサル
framework を 32 ビットと 64 ビットの両方のデバイスで使用できます。

:::caution
fat framework は、最初の framework と同じベース名である必要があります。そうでない場合、エラーが発生します。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // ターゲットを作成して構成します。
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // fat framework をビルドするタスクを作成します。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // fat framework は、最初の framework と同じベース名である必要があります。
        baseName = "my_framework"
        // デフォルトの宛先ディレクトリは "<build directory>/fat-framework" です。
        destinationDir = buildDir.resolve("fat-framework/debug")
        // マージする framework を指定します。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // ターゲットを作成して構成します。
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // fat framework をビルドするタスクを作成します。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // fat framework は、最初の framework と同じベース名である必要があります。
        baseName = "my_framework"
        // デフォルトの宛先ディレクトリは "<build directory>/fat-framework" です。
        destinationDir = file("$buildDir/fat-framework/debug")
        // マージする framework を指定します。
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
</Tabs>

## XCFramework のビルド

すべての Kotlin Multiplatform プロジェクトは、すべてのターゲットプラットフォームとアーキテクチャのロジックを 1 つのバンドルに集めるための出力として XCFramework を使用できます。
[ユニバーサル (fat) framework](#build-universal-frameworks) とは異なり、アプリケーションを App Store に公開する前に、不要なアーキテクチャをすべて削除する必要はありません。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "2.1.20"
}

kotlin {
    val xcf = XCFramework()
    val iosTargets = listOf(iosX64(), iosArm64(), iosSimulatorArm64())
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)
    def iosTargets = [iosX64(), iosArm64(), iosSimulatorArm64()]
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = 'shared'
            xcf.add(it)
        }
    }
}
```

</TabItem>
</Tabs>

XCFramework を宣言すると、Kotlin Gradle プラグインはいくつかの Gradle タスクを登録します。

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

プロジェクトで [CocoaPods 統合](native-cocoapods) を使用している場合は、Kotlin
CocoaPods Gradle プラグインを使用して XCFramework をビルドできます。これには、登録されているすべてのターゲットで XCFramework をビルドし、
podspec ファイルを生成する次のタスクが含まれています。

* `podPublishReleaseXCFramework`: リリース XCFramework と podspec ファイルを生成します。
* `podPublishDebugXCFramework`: デバッグ XCFramework と podspec ファイルを生成します。
* `podPublishXCFramework`: デバッグとリリースの両方の XCFramework と podspec ファイルを生成します。

これは、モバイルアプリから分離してプロジェクトの共有部分を CocoaPods 経由で配布するのに役立ちます。XCFramework を
プライベートまたはパブリックの podspec リポジトリに公開するために使用することもできます。

:::caution
Kotlin の異なるバージョン用にビルドされた framework をパブリックリポジトリに公開することはお勧めしません。
そうすると、エンドユーザーのプロジェクトで競合が発生する可能性があります。

:::

## Info.plist ファイルのカスタマイズ

framework を生成する場合、Kotlin/Native コンパイラは情報プロパティリストファイル `Info.plist` を生成します。
対応するバイナリオプションを使用して、そのプロパティをカスタマイズできます。

| プロパティ                     | バイナリオプション              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

この機能を有効にするには、`-Xbinary=$option=$value` コンパイラフラグを渡すか、特定の framework に対して
`binaryOption("option", "value")` Gradle DSL を設定します。

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```