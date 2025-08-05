[//]: # (title: 最終的なネイティブバイナリをビルドする)

デフォルトでは、Kotlin/Nativeターゲットは `*.klib` ライブラリアーティファクトにコンパイルされます。これはKotlin/Native自体が依存関係として利用できますが、実行したりネイティブライブラリとして使用したりすることはできません。

実行可能ファイルや共有ライブラリといった最終的なネイティブバイナリを宣言するには、ネイティブターゲットの `binaries` プロパティを使用します。このプロパティは、デフォルトの `*.klib` アーティファクトに加えて、このターゲット用にビルドされるネイティブバイナリのコレクションを表し、それらを宣言および構成するための一連のメソッドを提供します。

> `kotlin-multiplatform` プラグインは、デフォルトではプロダクションバイナリを作成しません。デフォルトで利用可能な唯一のバイナリは、`test` コンパイルから単体テストを実行できるデバッグテスト実行可能ファイルです。
>
{style="note"}

Kotlin/Nativeコンパイラによって生成されるバイナリには、サードパーティのコード、データ、または派生著作物が含まれる場合があります。
これは、Kotlin/Nativeでコンパイルされた最終バイナリを配布する場合、
必要な[ライセンスファイル](https://kotlinlang.org/docs/native-binary-licenses.html)を常にバイナリ配布物に含める必要があることを意味します。

## バイナリを宣言する

`binaries` コレクションの要素を宣言するには、以下のファクトリーメソッドを使用します。

| ファクトリーメソッド | バイナリの種類          | 対象                                           |
|------------------|---------------------|------------------------------------------------|
| `executable`     | プロダクト実行可能ファイル    | すべてのネイティブターゲット                         |
| `test`           | テスト実行可能ファイル        | すべてのネイティブターゲット                         |
| `sharedLib`      | 共有ネイティブライブラリ    | すべてのネイティブターゲット                         |
| `staticLib`      | 静的ネイティブライブラリ    | すべてのネイティブターゲット                         |
| `framework`      | Objective-Cフレームワーク | macOS、iOS、watchOS、およびtvOSターゲットのみ |

最もシンプルなバージョンでは追加のパラメータは不要で、各ビルドタイプに対して1つのバイナリを作成します。現在、2つのビルドタイプが利用可能です。

* `DEBUG` – [デバッガーツール](https://kotlinlang.org/docs/native-debugging.html)での作業に役立つ追加のメタデータを持つ、最適化されていないバイナリを生成します
* `RELEASE` – デバッグ情報を持たない、最適化されたバイナリを生成します

以下のスニペットは、デバッグとリリースという2つの実行可能バイナリを作成します。

```kotlin
kotlin {
    linuxX64 { // Define your target instead.
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

[追加設定](multiplatform-dsl-reference.md#native-targets)が不要な場合は、ラムダを省略できます。

```kotlin
binaries {
    executable()
}
```

バイナリを作成するビルドタイプを指定できます。次の例では、`debug` 実行可能ファイルのみが作成されます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

カスタム名でバイナリを宣言することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types
    // (in this case, all the available build types will be used).
    executable("bar") {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types
    // (in this case, all the available build types will be used).
    executable('bar') {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

最初の引数は名前プレフィックスを設定し、これがバイナリファイルのデフォルト名になります。例えば、Windowsの場合、このコードは `foo.exe` と `bar.exe` というファイルを生成します。この名前プレフィックスは、[ビルドスクリプトでバイナリにアクセスする](#access-binaries)ためにも使用できます。

## バイナリにアクセスする

バイナリにアクセスして、それらを[構成したり](multiplatform-dsl-reference.md#native-targets)、プロパティ（例えば、出力ファイルのパス）を取得したりできます。

バイナリは一意の名前で取得できます。この名前は、名前プレフィックス（指定されている場合）、ビルドタイプ、およびバイナリの種類に基づいており、`<optional-name-prefix><build-type><binary-kind>` というパターンに従います。例えば、`releaseFramework` や `testDebugExecutable` などです。

> 静的ライブラリと共有ライブラリには、それぞれ `static` と `shared` のサフィックスが付きます。例えば、`fooDebugStatic` や `barReleaseShared` などです。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// Returns null if there is no such binary.
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// Returns null if there is no such binary.
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

または、名前プレフィックスとビルドタイプを使用して、型付きゲッターでバイナリにアクセスすることもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable("bar", "DEBUG") // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable("foo", DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable('bar', 'DEBUG') // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable('foo', DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
</tabs>

## 依存関係をバイナリにエクスポートする

Objective-Cフレームワークやネイティブライブラリ（共有または静的）をビルドする際、現在のプロジェクトのクラスだけでなく、その依存関係のクラスもパッケージ化する必要がある場合があります。`export` メソッドを使用して、どの依存関係をバイナリにエクスポートするかを指定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // Will not be exported.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // Will not be exported.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

例えば、Kotlinで複数のモジュールを実装し、それらをSwiftからアクセスしたいとします。Swiftアプリケーションで複数のKotlin/Nativeフレームワークを使用することは制限されていますが、アンブレラフレームワークを作成し、これらすべてのモジュールをそこにエクスポートできます。

> 対応するソースセットの[`api` 依存関係](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)のみをエクスポートできます。
>
{style="note"}

依存関係をエクスポートすると、そのAPI全体がフレームワークのAPIに含まれます。
たとえそのごく一部しか使用していなくても、コンパイラはこの依存関係のコードをフレームワークに追加します。
これにより、エクスポートされた依存関係（およびある程度その依存関係）のデッドコードエリミネーションが無効になります。

デフォルトでは、エクスポートは非推移的に機能します。これは、ライブラリ `foo` がライブラリ `bar` に依存している場合に `foo` をエクスポートしても、`foo` のメソッドのみが出力フレームワークに追加されることを意味します。

この動作は `transitiveExport` オプションを使用して変更できます。`true` に設定すると、ライブラリ `bar` の宣言もエクスポートされます。

> `transitiveExport` の使用は推奨されません。エクスポートされた依存関係のすべての推移的な依存関係をフレームワークに追加するため、
> コンパイル時間とバイナリサイズの両方が増加する可能性があります。
>
> ほとんどの場合、これらすべての依存関係をフレームワークAPIに追加する必要はありません。
> SwiftまたはObjective-Cコードから直接アクセスする必要がある依存関係については、`export` を明示的に使用してください。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // Export transitively.
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // Export transitively.
        transitiveExport = true
    }
}
```

</tab>
</tabs>

## ユニバーサルフレームワークをビルドする

デフォルトでは、Kotlin/Nativeによって生成されるObjective-Cフレームワークは1つのプラットフォームのみをサポートします。しかし、[`lipo` ツール](https://llvm.org/docs/CommandGuide/llvm-lipo.html)を使用して、そのようなフレームワークを単一のユニバーサル（ファット）バイナリに結合できます。この操作は、特に32ビットおよび64ビットのiOSフレームワークで意味があります。この場合、結果として得られるユニバーサルフレームワークを32ビットおよび64ビットの両方のデバイスで使用できます。

> ファットフレームワークは、初期フレームワークと同じベース名を持つ必要があります。そうでない場合、エラーが発生します。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "MyFramework"
        }
    }
    // Create a task to build a fat framework.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "MyFramework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // Specify the frameworks to be merged.
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "MyFramework"
            }
        }
    }
    // Create a task building a fat framework.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "MyFramework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // Specify the frameworks to be merged.
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## XCFrameworksをビルドする

すべてのKotlin Multiplatformプロジェクトは、XCFrameworksを出力として使用して、すべてのターゲットプラットフォームとアーキテクチャのロジックを単一のバンドルにまとめることができます。[ユニバーサル（ファット）フレームワーク](#build-universal-frameworks)とは異なり、アプリケーションをApp Storeに公開する前に不要なアーキテクチャをすべて削除する必要はありません。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
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

</tab>
</tabs>

XCFrameworksを宣言すると、Kotlin GradleプラグインはいくつかのGradleタスクを登録します。

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

プロジェクトで[CocoaPods連携](multiplatform-cocoapods-overview.md)を使用している場合、Kotlin CocoaPods GradleプラグインでXCFrameworksをビルドできます。これには、登録されているすべてのターゲットでXCFrameworksをビルドし、podspecファイルを生成する以下のタスクが含まれています。

* `podPublishReleaseXCFramework`: リリースXCFrameworkとpodspecファイルを生成します。
* `podPublishDebugXCFramework`: デバッグXCFrameworkとpodspecファイルを生成します。
* `podPublishXCFramework`: デバッグとリリース両方のXCFrameworksとpodspecファイルを生成します。

これにより、プロジェクトの共有部分をCocoaPodsを介してモバイルアプリとは別に配布するのに役立ちます。また、XCFrameworksをプライベートまたはパブリックのpodspecリポジトリに公開するためにも使用できます。

> 異なるバージョンのKotlin用にビルドされたKotlinフレームワークを公開リポジトリに公開することは推奨されません。そうすると、エンドユーザーのプロジェクトで競合を引き起こす可能性があります。
>
{style="warning"}

## Info.plistファイルをカスタマイズする

フレームワークを生成する際、Kotlin/Nativeコンパイラは情報プロパティリストファイル `Info.plist` を生成します。
対応するバイナリオプションを使用して、そのプロパティをカスタマイズできます。

| プロパティ                     | バイナリオプション         |
|------------------------------|--------------------------|
| `CFBundleIdentifier`         | `bundleId`               |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`          |

この機能を有効にするには、`-Xbinary=$option=$value` コンパイラフラグを渡すか、特定のフレームワークに対して `binaryOption("option", "value")` Gradle DSLを設定します。

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```