[//]: # (title: 最終的なネイティブバイナリをビルドする)

デフォルトでは、Kotlin/Nativeターゲットは`*.klib`ライブラリアーティファクトにコンパイルされます。これはKotlin/Native自体によって依存関係として消費されますが、実行したりネイティブライブラリとして使用したりすることはできません。

実行可能ファイルや共有ライブラリなどの最終的なネイティブバイナリを宣言するには、ネイティブターゲットの`binaries`プロパティを使用します。このプロパティは、デフォルトの`*.klib`アーティファクトに加えて、このターゲット用にビルドされるネイティブバイナリのコレクションを表し、それらを宣言および構成するための一連のメソッドを提供します。

> `kotlin-multiplatform`プラグインは、デフォルトではプロダクションバイナリを作成しません。デフォルトで利用できる唯一のバイナリはデバッグテスト実行可能ファイルであり、これにより`test`コンパイルから単体テストを実行できます。
> {style="note"}

Kotlin/Nativeコンパイラによって生成されるバイナリには、サードパーティのコード、データ、または派生作業が含まれる場合があります。
これは、Kotlin/Nativeでコンパイルされた最終バイナリを配布する場合、必要な[ライセンスファイル](https://kotlinlang.org/docs/native-binary-licenses.html)を常にバイナリ配布に含める必要があることを意味します。

## バイナリを宣言する

`binaries`コレクションの要素を宣言するには、以下のファクトリメソッドを使用します。

| ファクトリメソッド | バイナリの種類           | 利用可能なターゲット                              |
|----------------|-----------------------|--------------------------------------------|
| `executable`   | プロダクト実行可能ファイル    | すべてのネイティブターゲット                         |
| `test`         | テスト実行可能ファイル       | すべてのネイティブターゲット                         |
| `sharedLib`    | 共有ネイティブライブラリ | すべてのネイティブターゲット                         |
| `staticLib`    | 静的ネイティブライブラリ | すべてのネイティブターゲット                         |
| `framework`    | Objective-Cフレームワーク | macOS、iOS、watchOS、およびtvOSターゲットのみ |

最もシンプルなバージョンでは、追加のパラメータは不要で、各ビルドタイプにつき1つのバイナリを作成します。現在、2つのビルドタイプが利用可能です。

*   `DEBUG` – [デバッガーツール](https://kotlinlang.org/docs/native-debugging.html)を使用する際に役立つ追加のメタデータを含む非最適化バイナリを生成します
*   `RELEASE` – デバッグ情報を含まない最適化バイナリを生成します

次のスニペットは、デバッグとリリースの2つの実行可能バイナリを作成します。

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

[追加の構成](multiplatform-dsl-reference.md#native-targets)が不要な場合は、ラムダを省略できます。

```kotlin
binaries {
    executable()
}
```

どのビルドタイプでバイナリを作成するかを指定できます。次の例では、`debug`実行可能ファイルのみが作成されます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // Binary configuration.
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // Binary configuration.
    }
}
```

</TabItem>
</Tabs>

カスタム名でバイナリを宣言することもできます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

最初の引数は名前のプレフィックスを設定します。これはバイナリファイルのデフォルト名になります。たとえば、Windowsの場合、このコードは`foo.exe`と`bar.exe`というファイルを生成します。名前のプレフィックスを使用して、[ビルドスクリプトでバイナリにアクセス](#access-binaries)することもできます。

## バイナリにアクセスする

バイナリにアクセスして[構成](multiplatform-dsl-reference.md#native-targets)したり、そのプロパティ（出力ファイルのパスなど）を取得したりできます。

バイナリは、その一意の名前で取得できます。この名前は、名前のプレフィックス（指定されている場合）、ビルドタイプ、およびバイナリの種類に基づいており、`<optional-name-prefix><build-type><binary-kind>`のパターンに従います。例えば、`releaseFramework`や`testDebugExecutable`などです。

> 静的ライブラリと共有ライブラリは、それぞれ`static`と`shared`のサフィックスを持ちます。例えば、`fooDebugStatic`や`barReleaseShared`などです。
> {style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// Returns null if there is no such binary.
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// Returns null if there is no such binary.
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

あるいは、名前のプレフィックスとビルドタイプを使用して型付きゲッターでバイナリにアクセスすることもできます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## 依存関係をバイナリにエクスポートする

Objective-Cフレームワークやネイティブライブラリ（共有または静的）をビルドする際、現在のプロジェクトのクラスだけでなく、その依存関係のクラスもパッケージ化する必要がある場合があります。`export`メソッドを使用して、どの依存関係をバイナリにエクスポートするかを指定します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

例えば、Kotlinで複数のモジュールを実装し、それらをSwiftからアクセスしたい場合を考えます。Swiftアプリケーションでの複数のKotlin/Nativeフレームワークの使用は制限されていますが、アンブレラフレームワークを作成し、これらのモジュールすべてをそれにエクスポートできます。

> 対応するソースセットの[`api`依存関係](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)のみをエクスポートできます。
> {style="note"}

依存関係をエクスポートすると、そのAPIすべてがフレームワークAPIに含まれます。コンパイラはこの依存関係のコードをフレームワークに追加します。たとえそのごく一部しか使用しない場合でもです。これにより、エクスポートされた依存関係（およびその依存関係に対してある程度）のデッドコード削除が無効になります。

デフォルトでは、エクスポートは非推移的に機能します。これは、ライブラリ`bar`に依存するライブラリ`foo`をエクスポートした場合、`foo`のメソッドのみが出力フレームワークに追加されることを意味します。

`transitiveExport`オプションを使用して、この動作を変更できます。`true`に設定すると、ライブラリ`bar`の宣言もエクスポートされます。

> `transitiveExport`の使用は推奨されません。これにより、エクスポートされた依存関係のすべての推移的な依存関係がフレームワークに追加されます。これは、コンパイル時間とバイナリサイズの両方を増加させる可能性があります。
>
> ほとんどの場合、これらの依存関係すべてをフレームワークAPIに追加する必要はありません。SwiftまたはObjective-Cコードから直接アクセスする必要がある依存関係に対して`export`を明示的に使用してください。
> {style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // Export transitively.
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // Export transitively.
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## ユニバーサルフレームワークをビルドする

デフォルトでは、Kotlin/Nativeによって生成されるObjective-Cフレームワークは1つのプラットフォームのみをサポートします。しかし、[`lipo`ツール](https://llvm.org/docs/CommandGuide/llvm-lipo.html)を使用して、そのようなフレームワークを単一のユニバーサル（ファット）バイナリにマージすることができます。この操作は特に32ビットおよび64ビットのiOSフレームワークに有効です。この場合、結果として得られるユニバーサルフレームワークを32ビットおよび64ビットの両方のデバイスで使用できます。

> ファットフレームワークは、元のフレームワークと同じベース名を持つ必要があります。そうでない場合、エラーが発生します。
> {style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## XCFrameworksをビルドする

すべてのKotlin Multiplatformプロジェクトは、XCFrameworksを出力として使用して、すべてのターゲットプラットフォームとアーキテクチャのロジックを単一のバンドルにまとめることができます。[ユニバーサル（ファット）フレームワーク](#build-universal-frameworks)とは異なり、App Storeにアプリケーションを公開する前に不要なアーキテクチャをすべて削除する必要はありません。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

XCFrameworksを宣言すると、Kotlin GradleプラグインはいくつかのGradleタスクを登録します。

*   `assembleXCFramework`
*   `assemble<Framework name>DebugXCFramework`
*   `assemble<Framework name>ReleaseXCFramework`

undefined

プロジェクトで[CocoaPods連携](multiplatform-cocoapods-overview.md)を使用している場合、Kotlin CocoaPods GradleプラグインでXCFrameworksをビルドできます。これには、登録されたすべてのターゲットでXCFrameworksをビルドし、podspecファイルを生成する次のタスクが含まれています。

*   `podPublishReleaseXCFramework` は、リリースXCFrameworkとpodspecファイルを生成します。
*   `podPublishDebugXCFramework` は、デバッグXCFrameworkとpodspecファイルを生成します。
*   `podPublishXCFramework` は、デバッグとリリースの両方のXCFrameworkとpodspecファイルを生成します。

これは、CocoaPodsを介して、プロジェクトの共有部分をモバイルアプリとは別に配布するのに役立ちます。XCFrameworksをプライベートまたはパブリックのpodspecリポジトリへの公開にも使用できます。

> 異なるバージョンのKotlin用にビルドされたKotlinフレームワークをパブリックリポジトリに公開することは推奨されません。これにより、エンドユーザーのプロジェクトで競合を引き起こす可能性があります。
> {style="warning"}

## Info.plistファイルをカスタマイズする

フレームワークを生成する際、Kotlin/Nativeコンパイラは情報プロパティリストファイル`Info.plist`を生成します。対応するバイナリオプションでそのプロパティをカスタマイズできます。

| プロパティ                     | バイナリオプション           |
|------------------------------|--------------------------|
| `CFBundleIdentifier`         | `bundleId`               |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`          |

この機能を有効にするには、`-Xbinary=$option=$value`コンパイラフラグを渡すか、特定のフレームワークに対して`binaryOption("option", "value")` Gradle DSLを設定します。

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}