[//]: # (title: ネイティブディストリビューション)

ここでは、ネイティブディストリビューションについて学習します。サポートされているすべてのシステム向けにインストーラーやパッケージを作成する方法、そしてディストリビューションと同じ設定でアプリケーションをローカルで実行する方法を学習します。

以下のトピックについて詳細を読み進めてください。

* [Compose Multiplatform Gradle プラグインとは](#gradle-plugin)？
* アプリケーションのローカル実行などの[基本的なタスク](#basic-tasks)と、ミニファイや難読化などの[高度なタスク](#minification-and-obfuscation)の詳細。
* [JDKモジュールを含める方法](#including-jdk-modules)と`ClassNotFoundException`の対処法。
* [ディストリビューションのプロパティを指定する方法](#specifying-distribution-properties)：パッケージバージョン、JDKバージョン、出力ディレクトリ、ランチャープロパティ、メタデータ。
* リソースライブラリ、JVMリソースローディング、またはパッケージ化されたアプリケーションへのファイル追加による[リソースの管理方法](#managing-resources)。
* Gradleソースセット、Kotlin JVMターゲット、または手動による[ソースセットのカスタマイズ方法](#custom-source-sets)。
* 各OS向けに[アプリケーションアイコンを指定する方法](#application-icon)。
* Linuxにおけるパッケージメンテナーのメールアドレスや、macOSにおけるApple App Storeのアプリカテゴリなど、[プラットフォーム固有のオプション](#platform-specific-options)。
* [macOS固有の設定](#macos-specific-configuration)：署名、公証、および`Info.plist`。

## Gradleプラグイン

このガイドは主に、Compose Multiplatform Gradleプラグインを使用したComposeアプリケーションのパッケージ化に焦点を当てています。
`org.jetbrains.compose`プラグインは、基本的なパッケージ化、難読化、macOSのコード署名のためのタスクを提供します。

このプラグインは、`jpackage`を使用してアプリケーションをネイティブディストリビューションにパッケージ化し、アプリケーションをローカルで実行するプロセスを簡素化します。
配布可能なアプリケーションは自己完結型であり、必要なJavaランタイムコンポーネントをすべて含んだインストール可能なバイナリであり、ターゲットシステムにJDKをインストールする必要はありません。

パッケージサイズを最小限に抑えるため、Gradleプラグインは[jlink](https://openjdk.org/jeps/282)ツールを使用します。これにより、必要なJavaモジュールのみが配布可能なパッケージにバンドルされるようになります。
ただし、どのモジュールが必要かを指定するために、Gradleプラグインを設定する必要があります。詳細については、[](#including-jdk-modules)セクションを参照してください。

代替案として、JetBrainsが開発していない外部ツールである[Conveyor](https://www.hydraulic.software)を使用することもできます。
Conveyorはオンラインアップデート、クロスビルド、その他さまざまな機能をサポートしていますが、オープンソースではないプロジェクトには[ライセンス](https://hydraulic.software/pricing.html)が必要です。
詳細については、[Conveyorのドキュメント](https://conveyor.hydraulic.dev/latest/tutorial/hare/jvm)を参照してください。

## 基本的なタスク

Compose Multiplatform Gradleプラグインにおける基本的な設定可能単位は、`application`です（これは非推奨の[Gradle application](https://docs.gradle.org/current/userguide/application_plugin.html)プラグインと混同しないようにしてください）。

`application` DSLメソッドは、最終的なバイナリ群に対する共有設定を定義します。これにより、ファイルコレクションとJDKディストリビューションを、さまざまな形式の圧縮されたバイナリインストーラーのセットとしてパッケージ化できます。

サポートされているオペレーティングシステムでは、以下のフォーマットが利用可能です。

* **macOS**: `.dmg` (`TargetFormat.Dmg`)、`.pkg` (`TargetFormat.Pkg`)
* **Windows**: `.exe` (`TargetFormat.Exe`)、`.msi` (`TargetFormat.Msi`)
* **Linux**: `.deb` (`TargetFormat.Deb`)、`.rpm` (`TargetFormat.Rpm`)

以下は、基本的なデスクトップ構成を持つ`build.gradle.kts`ファイルの例です。

```kotlin
import org.jetbrains.compose.desktop.application.dsl.TargetFormat

plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}

dependencies {
    implementation(compose.desktop.currentOs)
}

compose.desktop {
    application {
        mainClass = "example.MainKt"

        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Exe)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { mainClass = "}

プロジェクトをビルドすると、プラグインは以下のタスクを作成します。

<table>
    <tr>
        <td>Gradleタスク</td>
        <td>説明</td>
    </tr>
    <tr>
        <td><code>package&lt;FormatName&gt;</code></td> 
        <td>アプリケーションを対応する<code>FormatName</code>バイナリにパッケージ化します。現在、クロスコンパイルはサポートされていません。つまり、対応する互換性のあるOSを使用してのみ、特定のフォーマットをビルドできます。例えば、<code>.dmg</code>バイナリをビルドするには、macOSで<code>packageDmg</code>タスクを実行する必要があります。現在のOSと互換性のないタスクは、デフォルトでスキップされます。</td>
    </tr>
    <tr>
        <td><code>packageDistributionForCurrentOS</code></td>
        <td>アプリケーションのすべてのパッケージタスクを集約します。<a href="https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:task_categories">ライフサイクルタスク</a>です。</td>
    </tr>
    <tr>
        <td><code>packageUberJarForCurrentOS</code></td>
        <td>現在のオペレーティングシステム用のすべての依存関係を含む単一のjarファイルを作成します。このタスクは、<code>compose.desktop.currentOS</code>が<code>compile</code>、<code>implementation</code>、または<code>runtime</code>の依存関係として使用されることを想定しています。</td>
    </tr>
    <tr>
        <td><code>run</code></td>
        <td><code>mainClass</code>で指定されたエントリポイントからアプリケーションをローカルで実行します。<code>run</code>タスクは、フルランタイムを持つ非パッケージJVMアプリケーションを開始します。このアプローチは、ミニファイされたランタイムを持つコンパクトなバイナリイメージを作成するよりも高速でデバッグが容易です。最終的なバイナリイメージを実行するには、代わりに<code>runDistributable</code>タスクを使用してください。</td>
    </tr>
    <tr>
        <td><code>createDistributable</code></td>
        <td>インストーラーを作成せずに、最終的なアプリケーションイメージを作成します。</td>
    </tr>
    <tr>
        <td><code>runDistributable</code></td>
        <td>事前パッケージ化されたアプリケーションイメージを実行します。</td>
    </tr>
</table>

利用可能なすべてのタスクは、Gradleツールウィンドウに一覧表示されます。タスクを実行すると、Gradleは`${project.buildDir}/compose/binaries`ディレクトリに出力バイナリを生成します。

## JDKモジュールの含め方

配布可能なサイズの削減のため、Gradleプラグインは[jlink](https://openjdk.org/jeps/282)を使用し、必要なJDKモジュールのみをバンドルします。

現状では、Gradleプラグインは必要なJDKモジュールを自動的に判別しません。これはコンパイルの問題を引き起こすことはありませんが、必要なモジュールを提供しないと実行時に`ClassNotFoundException`が発生する可能性があります。

パッケージ化されたアプリケーションまたは`runDistributable`タスクを実行する際に`ClassNotFoundException`に遭遇した場合、`modules` DSLメソッドを使用して追加のJDKモジュールを含めることができます。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("java.sql")
            // Alternatively: includeAllModules = true
        }
    }
}
```

必要なモジュールは手動で指定することも、`suggestModules`を実行することもできます。`suggestModules`タスクは、[jdeps](https://docs.oracle.com/javase/9/tools/jdeps.htm)静的分析ツールを使用して、不足している可能性のあるモジュールを特定します。このツールの出力は不完全であったり、不要なモジュールをリストしたりする可能性があることに注意してください。

配布可能なファイルのサイズが重要な要素ではなく無視できる場合、`includeAllModules` DSLプロパティを使用してすべてのランタイムモジュールを含めることもできます。

## ディストリビューションプロパティの指定

### パッケージバージョン

ネイティブディストリビューションパッケージには特定のパッケージバージョンが必要です。パッケージバージョンを指定するには、優先度の高い順に以下のDSLプロパティを使用できます。

* `nativeDistributions.<os>.<packageFormat>PackageVersion`は、単一のパッケージフォーマットのバージョンを指定します。
* `nativeDistributions.<os>.packageVersion`は、単一のターゲットOSのバージョンを指定します。
* `nativeDistributions.packageVersion`は、すべてのパッケージのバージョンを指定します。

macOSでは、再度優先度の高い順に、以下のDSLプロパティを使用してビルドバージョンも指定できます。

* `nativeDistributions.macOS.<packageFormat>PackageBuildVersion`は、単一のパッケージフォーマットのビルドバージョンを指定します。
* `nativeDistributions.macOS.packageBuildVersion`は、すべてのmacOSパッケージのビルドバージョンを指定します。

ビルドバージョンを指定しない場合、Gradleは代わりにパッケージバージョンを使用します。macOSでのバージョン管理の詳細については、[`CFBundleShortVersionString`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)および[`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion)のドキュメントを参照してください。

以下は、優先順位に従ってパッケージバージョンを指定するためのテンプレートです。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            // Version for all packages
            packageVersion = "..." 
          
            macOS {
              // Version for all macOS packages
              packageVersion = "..."
              // Version for the dmg package only
              dmgPackageVersion = "..." 
              // Version for the pkg package only
              pkgPackageVersion = "..." 
              
              // Build version for all macOS packages
              packageBuildVersion = "..."
              // Build version for the dmg package only
              dmgPackageBuildVersion = "..." 
              // Build version for the pkg package only
              pkgPackageBuildVersion = "..." 
            }
            windows {
              // Version for all Windows packages
              packageVersion = "..."  
              // Version for the msi package only
              msiPackageVersion = "..."
              // Version for the exe package only
              exePackageVersion = "..." 
            }
            linux {
              // Version for all Linux packages
              packageVersion = "..."
              // Version for the deb package only
              debPackageVersion = "..."
              // Version for the rpm package only
              rpmPackageVersion = "..."
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { nativeDistributions { packageVersion ="}

パッケージバージョンを定義するには、以下のルールに従ってください。

<table>
    <tr>
        <td>ファイルタイプ</td>
        <td>バージョン形式</td>
        <td>詳細</td>
    </tr>
    <tr>
        <td><code>dmg</code>、<code>pkg</code></td>
        <td><code>MAJOR[.MINOR][.PATCH]</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>は0より大きい整数です。</li>
                <li><code>MINOR</code>はオプションの非負整数です。</li>
                <li><code>PATCH</code>はオプションの非負整数です。</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>msi</code>、<code>exe</code></td>
        <td><code>MAJOR.MINOR.BUILD</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>は最大値255の非負整数です。</li>
                <li><code>MINOR</code>は最大値255の非負整数です。</li>
                <li><code>BUILD</code>は最大値65535の非負整数です。</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>deb</code></td>
        <td><code>[EPOCH:]UPSTREAM_VERSION[-DEBIAN_REVISION]</code></td>
        <td>
            <ul>
                <li><code>EPOCH</code>はオプションの非負整数です。</li>
                <li><code>UPSTREAM_VERSION</code>:
                    <ul>
                        <li>英数字と<code>.</code>、<code>+</code>、<code>-</code>、<code>~</code>文字のみを含めることができます。</li>
                        <li>数字で開始する必要があります。</li>
                    </ul>
                </li>
                <li><code>DEBIAN_REVISION</code>:
                    <ul>
                        <li>オプションです。</li>
                        <li>英数字と<code>.</code>、<code>+</code>、<code>~</code>文字のみを含めることができます。</li>
                    </ul>
                </li>
            </ul>
            詳細については、<a href="https://www.debian.org/doc/debian-policy/ch-controlfields.html#version">Debianドキュメント</a>を参照してください。
        </td>
    </tr>
    <tr>
        <td><code>rpm</code></td>
        <td>任意の形式</td>
        <td>バージョンに<code>-</code>（ダッシュ）文字を含めてはいけません。</td>
    </tr>
</table>

### JDKバージョン

このプラグインは`jpackage`を使用しており、[JDK 17](https://openjdk.java.net/projects/jdk/17/)以上のJDKバージョンが必要です。
JDKバージョンを指定する際は、以下の要件の少なくとも1つを満たしていることを確認してください。

* `JAVA_HOME`環境変数が互換性のあるJDKバージョンを指していること。
* `javaHome`プロパティがDSL経由で設定されていること。

  ```kotlin
  compose.desktop {
      application {
          javaHome = System.getenv("JDK_17")
      }
  }
  ```

### 出力ディレクトリ

ネイティブディストリビューションにカスタム出力ディレクトリを使用するには、以下に示すように`outputBaseDir`プロパティを設定します。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            outputBaseDir.set(project.layout.buildDirectory.dir("customOutputDir"))
        }
    }
}
```

### ランチャープロパティ

アプリケーションの起動プロセスをカスタマイズするには、以下のプロパティを設定できます。

<table>
  <tr>
    <td>プロパティ</td>
    <td>説明</td>
  </tr>
  <tr>
    <td><code>mainClass</code></td>
    <td><code>main</code>メソッドを含むクラスの完全修飾名。</td>
  </tr>
  <tr>
    <td><code>args</code></td>
    <td>アプリケーションの<code>main</code>メソッドへの引数。</td>
  </tr>
  <tr>
    <td><code>jvmArgs</code></td>
    <td>アプリケーションのJVMへの引数。</td>
  </tr>
</table>

設定例は以下の通りです。

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        args += listOf("-customArgument")
        jvmArgs += listOf("-Xmx2G")
    }
}
```

### メタデータ

`nativeDistributions` DSLブロック内で、以下のプロパティを設定できます。

<table>
  <tr>
    <td>プロパティ</td>
    <td>説明</td>
    <td>デフォルト値</td>
  </tr>
  <tr>
    <td><code>packageName</code></td>
    <td>アプリケーション名。</td>
    <td>Gradleプロジェクトの<a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getName--">名前</a></td>
  </tr>
  <tr>
    <td><code>packageVersion</code></td>
    <td>アプリケーションのバージョン。</td>
    <td>Gradleプロジェクトの<a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getVersion--">バージョン</a></td>
  </tr>
  <tr>
    <td><code>description</code></td>
    <td>アプリケーションの説明。</td>
    <td>なし</td>
  </tr>
  <tr>
    <td><code>copyright</code></td>
    <td>アプリケーションの著作権情報。</td>
    <td>なし</td>
  </tr>
  <tr>
    <td><code>vendor</code></td>
    <td>アプリケーションのベンダー。</td>
    <td>なし</td>
  </tr>
  <tr>
    <td><code>licenseFile</code></td>
    <td>アプリケーションのライセンスファイル。</td>
    <td>なし</td>
  </tr>
</table> 

設定例は以下の通りです。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            packageName = "ExampleApp"
            packageVersion = "0.1-SNAPSHOT"
            description = "Compose Multiplatform App"
            copyright = "© 2024 My Name. All rights reserved."
            vendor = "Example vendor"
            licenseFile.set(project.file("LICENSE.txt"))
        }
    }
}
```

## リソースの管理

リソースをパッケージ化してロードするには、Compose Multiplatformリソースライブラリ、JVMリソースローディング、またはパッケージ化されたアプリケーションへのファイルの追加を使用できます。

### リソースライブラリ

プロジェクトのリソースを設定する最も簡単な方法は、リソースライブラリを使用することです。
リソースライブラリを使用すると、サポートされているすべてのプラットフォームで共通コード内のリソースにアクセスできます。
詳細については、[マルチプラットフォームリソース](compose-multiplatform-resources.md)を参照してください。

### JVMリソースの読み込み

デスクトップ版Compose MultiplatformはJVMプラットフォーム上で動作します。つまり、`java.lang.Class` APIを使用して`.jar`ファイルからリソースをロードできます。`src/main/resources`ディレクトリ内のファイルには、[`Class::getResource`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResource(java.lang.String))または[`Class::getResourceAsStream`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResourceAsStream(java.lang.String))を介してアクセスできます。

### パッケージ化されたアプリケーションへのファイルの追加

`.jar`ファイルからリソースをロードするのが現実的ではないシナリオもあります。例えば、ターゲット固有のアセットがあり、macOSパッケージには含めるがWindowsパッケージには含めない必要がある場合などです。

これらの場合、追加のリソースファイルをインストールディレクトリに含めるようにGradleプラグインを設定できます。
以下のようにDSLを使用してルートリソースディレクトリを指定します。

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Deb)
            packageVersion = "1.0.0"

            appResourcesRootDir.set(project.layout.projectDirectory.dir("resources"))
        }
    }
}
```

上記の例では、ルートリソースディレクトリは`<PROJECT_DIR>/resources`として定義されています。

Gradleプラグインは、リソースのサブディレクトリからファイルを以下のように含めます。

1. **共通リソース:**
`<RESOURCES_ROOT_DIR>/common`にあるファイルは、ターゲットOSやアーキテクチャに関係なく、すべてのパッケージに含まれます。

2. **OS固有のリソース:**
`<RESOURCES_ROOT_DIR>/<OS_NAME>`にあるファイルは、特定のオペレーティングシステム用にビルドされたパッケージにのみ含まれます。`<OS_NAME>`の有効な値は、`windows`、`macos`、`linux`です。

3. **OSおよびアーキテクチャ固有のリソース:**
`<RESOURCES_ROOT_DIR>/<OS_NAME>-<ARCH_NAME>`にあるファイルは、特定のオペレーティングシステムとCPUアーキテクチャの組み合わせ用にビルドされたパッケージにのみ含まれます。`<ARCH_NAME>`の有効な値は、`x64`と`arm64`です。
例えば、`<RESOURCES_ROOT_DIR>/macos-arm64`のファイルは、Apple Silicon Mac向けパッケージにのみ含まれます。

組み込まれたリソースには、`compose.application.resources.dir`システムプロパティを使用してアクセスできます。

```kotlin
import java.io.File

val resourcesDir = File(System.getProperty("compose.application.resources.dir"))

fun main() {
    println(resourcesDir.resolve("resource.txt").readText())
}
```

## カスタムソースセット

`org.jetbrains.kotlin.jvm`または`org.jetbrains.kotlin.multiplatform`プラグインを使用している場合、デフォルト設定に依存できます。

* `org.jetbrains.kotlin.jvm`を使用した構成では、`main` [ソースセット](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)のコンテンツが含まれます。
* `org.jetbrains.kotlin.multiplatform`を使用した構成では、単一の[JVMターゲット](multiplatform-dsl-reference.md#targets)のコンテンツが含まれます。
  複数のJVMターゲットを定義した場合、デフォルト設定は無効になります。この場合、プラグインを手動で設定するか、単一のターゲットを指定する必要があります（以下参照）。

デフォルト設定が曖昧または不十分な場合は、いくつかの方法でカスタマイズできます。

Gradle [ソースセット](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)を使用する場合：

``` kotlin
plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}
val customSourceSet = sourceSets.create("customSourceSet")
compose.desktop {
    application {
        from(customSourceSet)
    }
}
``` 

Kotlin [JVMターゲット](multiplatform-dsl-reference.md#targets)を使用する場合：

``` kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
} 
kotlin {
    jvm("customJvmTarget") {}
}
compose.desktop {
    application {
        from(kotlin.targets["customJvmTarget"])
    }
}
```

手動の場合：

* `disableDefaultConfiguration`を使用してデフォルト設定を無効にします。
* `fromFiles`を使用して含めるファイルを指定します。
* `mainJar`ファイルプロパティを指定して、メインクラスを含む`.jar`ファイルを指します。
* `dependsOn`を使用して、すべてのプラグインタスクにタスク依存関係を追加します。
``` kotlin
compose.desktop {
    application {
        disableDefaultConfiguration()
        fromFiles(project.fileTree("libs/") { include("**/*.jar") })
        mainJar.set(project.file("main.jar"))
        dependsOn("mainJarTask")
    }
}
```

## アプリケーションアイコン

アプリケーションアイコンが、以下のOS固有の形式で利用可能であることを確認してください。

* macOS向けに`.icns`
* Windows向けに`.ico`
* Linux向けに`.png`

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                iconFile.set(project.file("icon.icns"))
            }
            windows {
                iconFile.set(project.file("icon.ico"))
            }
            linux {
                iconFile.set(project.file("icon.png"))
            }
        }
    }
}
```

## プラットフォーム固有のオプション

プラットフォーム固有の設定は、対応するDSLブロックを使用して構成できます。

``` kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                // Options for macOS
            }
            windows {
                // Options for Windows
            }
            linux {
                // Options for Linux
            }
        }
    }
}
```

以下の表は、サポートされているすべてのプラットフォーム固有のオプションを説明しています。ドキュメント化されていないプロパティの使用は**推奨されません**。

<table>
    <tr>
        <td>プラットフォーム</td>
        <td>オプション</td>
        <td width="500">説明</td>
    </tr>
    <tr>
        <td rowspan="3">すべてのプラットフォーム</td>
        <td><code>iconFile.set(File("PATH_TO_ICON"))</code></td>
        <td>アプリケーションのプラットフォーム固有のアイコンへのパスを指定します。詳細は「<a anchor="application-icon">アプリケーションアイコン</a>」セクションを参照してください。</td>
    </tr>
    <tr>
        <td><code>packageVersion = "1.0.0"</code></td>
        <td>プラットフォーム固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。</td>
    </tr>
    <tr>
        <td><code>installationPath = "PATH_TO_INST_DIR"</code></td>
        <td>デフォルトのインストールディレクトリへの絶対パスまたは相対パスを指定します。
            Windowsでは、<code>dirChooser = true</code>を使用してインストール中にパスをカスタマイズできるようにすることもできます。</td>
    </tr>
    <tr>
        <td rowspan="8">Linux</td>
        <td><code>packageName = "custom-package-name"</code></td>
        <td>デフォルトのアプリケーション名を上書きします。</td>
    </tr>
    <tr>
        <td><code>debMaintainer = "maintainer@example.com"</code></td>
        <td>パッケージメンテナーのメールアドレスを指定します。</td>
    </tr>
    <tr>
        <td><code>menuGroup = "my-example-menu-group"</code></td>
        <td>アプリケーションのメニューグループを定義します。</td>
    </tr>
    <tr>
        <td><code>appRelease = "1"</code></td>
        <td>rpmパッケージのリリース値、またはdebパッケージのリビジョン値を設定します。</td>
    </tr>
    <tr>
        <td><code>appCategory = "CATEGORY"</code></td>
        <td>rpmパッケージのグループ値、またはdebパッケージのセクション値を割り当てます。</td>
    </tr>
    <tr>
        <td><code>rpmLicenseType = "TYPE_OF_LICENSE"</code></td>
        <td>rpmパッケージのライセンスタイプを示します。</td>
    </tr>
    <tr>
        <td><code>debPackageVersion = "DEB_VERSION"</code></td>
        <td>deb固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。</td>
    </tr>
    <tr>
        <td><code>rpmPackageVersion = "RPM_VERSION"</code></td>
        <td>rpm固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。</td>
    </tr>
    <tr>
        <td rowspan="15">macOS</td>
        <td><code>bundleID</code></td>
        <td>
            一意のアプリケーション識別子を指定します。これには英数字
            (<code>A-Z</code>、<code>a-z</code>、<code>0-9</code>)、ハイフン (<code>-</code>)、および
            ピリオド (<code>.</code>) のみを含めることができます。リバースDNS表記（<code>com.mycompany.myapp</code>）を使用することをお勧めします。
        </td>
    </tr>
    <tr>
        <td><code>packageName</code></td>
        <td>アプリケーション名。</td>
    </tr>
    <tr>
        <td><code>dockName</code></td>
        <td>
            メニューバー、「&lt;App&gt;について」メニュー項目、およびドックに表示されるアプリケーション名。デフォルト値は<code>packageName</code>です。
        </td>
    </tr>
    <tr>
        <td><code>minimumSystemVersion</code></td>
        <td>
            アプリケーションの実行に必要な最小macOSバージョン。詳細は
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsminimumsystemversion">
                <code>LSMinimumSystemVersion</code></a>を参照してください。
        </td>
    </tr>
    <tr>
        <td><code>signing</code>、<code>notarization</code>、<code>provisioningProfile</code>、<code>runtimeProvisioningProfile</code></td>
        <td>
            「
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>」チュートリアルを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>appStore = true</code></td>
        <td>Apple App Store向けにアプリをビルドして署名するかどうかを指定します。JDK 17以上が必要です。</td>
    </tr>
    <tr>
        <td><code>appCategory</code></td>
        <td>
            Apple App Store向けアプリのカテゴリ。App Store向けにビルドする場合のデフォルト値は
            <code>public.app-category.utilities</code>、それ以外の場合は<code>Unknown</code>です。
            有効なカテゴリのリストは
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype">
                <code>LSApplicationCategoryType</code>
            </a>を参照してください。
        </td>
    </tr>
    <tr>
        <td><code>entitlementsFile.set(File("PATH_ENT"))</code></td>
        <td>
            署名時に使用されるエンタイトルメントを含むファイルへのパスを指定します。カスタムファイルを提供する場合、
            Javaアプリケーションに必要なエンタイトルメントを追加していることを確認してください。App Store向けにビルドする際に使用されるデフォルトファイルについては、
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>を参照してください。このデフォルトファイルはJDKバージョンによって異なる場合があります。
            ファイルが指定されていない場合、プラグインは<code>jpackage</code>によって提供されるデフォルトのエンタイトルメントを使用します。
            詳細は「
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>」チュートリアルを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>runtimeEntitlementsFile.set(File("PATH_R_ENT"))</code></td>
        <td>
            JVMランタイムに署名するときに使用されるエンタイトルメントを含むファイルへのパスを指定します。カスタムファイルを提供する場合、
            Javaアプリケーションに必要なエンタイトルメントを追加していることを確認してください。App Store向けにビルドする際に使用されるデフォルトファイルについては、
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>を参照してください。このデフォルトファイルはJDKバージョンによって異なる場合があります。
            ファイルが指定されていない場合、プラグインは<code>jpackage</code>によって提供されるデフォルトのエンタイトルメントを使用します。
            詳細は「
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>」チュートリアルを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>dmgPackageVersion = "DMG_VERSION"</code></td>
        <td>
            DMG固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>pkgPackageVersion = "PKG_VERSION"</code></td>
        <td>
            PKG固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>packageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            パッケージビルドバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>dmgPackageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            DMG固有のパッケージビルドバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>pkgPackageBuildVersion = "PKG_VERSION"</code></td>
        <td>
            PKG固有のパッケージビルドバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。
        </td>
    </tr>
    <tr>
        <td><code>infoPlist</code></td>
        <td>「<a anchor="information-property-list-on-macos">macOS上の<code>Info.plist</code></a>」セクションを参照してください。</td>
    </tr>
        <tr>
            <td rowspan="7">Windows</td>
            <td><code>console = true</code></td>
            <td>アプリケーションのコンソールランチャーを追加します。</td>
        </tr>
        <tr>
            <td><code>dirChooser = true</code></td>
            <td>インストール中にインストールパスをカスタマイズできるようにします。</td>
        </tr>
        <tr>
            <td><code>perUserInstall = true</code></td>
            <td>ユーザーごとのアプリケーションインストールを有効にします。</td>
        </tr>
        <tr>
            <td><code>menuGroup = "start-menu-group"</code></td>
            <td>アプリケーションを指定されたスタートメニューグループに追加します。</td>
        </tr>
        <tr>
            <td><code>upgradeUuid = "UUID"</code></td>
            <td>インストール済みバージョンよりも新しいバージョンがある場合に、インストーラーを介してユーザーがアプリケーションを更新できるようにする一意のIDを指定します。この値は単一のアプリケーションに対して一定である必要があります。詳細は<a href="https://wixtoolset.org/documentation/manual/v3/howtos/general/generate_guids.html">How To: Generate a GUID</a>を参照してください。</td>
        </tr>
        <tr>
            <td><code>msiPackageVersion = "MSI_VERSION"</code></td>
            <td>MSI固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。</td>
        </tr>
        <tr>
            <td><code>exePackageVersion = "EXE_VERSION"</code></td>
            <td>EXE固有のパッケージバージョンを設定します。詳細は「<a anchor="package-version">パッケージバージョン</a>」セクションを参照してください。</td>
        </tr>
</table>

## macOS固有の設定

### macOSでの署名と公証

最新のmacOSバージョンでは、インターネットからダウンロードされた未署名のアプリケーションの実行は許可されていません。そのようなアプリケーションを実行しようとすると、以下のエラーに遭遇します：「YourAppは破損しているため開けません。ディスクイメージを取り出す必要があります。」

アプリケーションの署名と公証の方法については、こちらの[チュートリアル](https://github.com/JetBrains/compose-multiplatform/blob/master/tutorials/Signing_and_notarization_on_macOS/README.md)を参照してください。

### macOS上の情報プロパティリスト

DSLは基本的なプラットフォーム固有のカスタマイズをサポートしていますが、提供されている機能を超えるケースも存在します。
DSLで表現されていない`Info.plist`の値を指定する必要がある場合は、回避策として生のXMLスニペットを含めることができます。このXMLはアプリケーションの`Info.plist`に追加されます。

#### 例：ディープリンク

1. `build.gradle.kts`ファイルでカスタムURLスキームを定義します。

  ``` kotlin
  compose.desktop {
      application {
          mainClass = "MainKt"
          nativeDistributions {
              targetFormats(TargetFormat.Dmg)
              packageName = "Deep Linking Example App"
              macOS {
                  bundleID = "org.jetbrains.compose.examples.deeplinking"
                  infoPlist {
                      extraKeysRawXml = macExtraPlistKeys
                  }
              }
          }
      }
  }
  
  val macExtraPlistKeys: String
      get() = """
        <key>CFBundleURLTypes</key>
        <array>
          <dict>
            <key>CFBundleURLName</key>
            <string>Example deep link</string>
            <key>CFBundleURLSchemes</key>
            <array>
              <string>compose</string>
            </array>
          </dict>
        </array>
      """
  ```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="infoPlist { extraKeysRawXml = macExtraPlistKeys"}

2. `src/main/main.kt`ファイルで`java.awt.Desktop`クラスを使用してURIハンドラーを設定します。

  ``` kotlin 
  import androidx.compose.material.MaterialTheme
  import androidx.compose.material.Text
  import androidx.compose.runtime.getValue
  import androidx.compose.runtime.mutableStateOf
  import androidx.compose.runtime.setValue
  import androidx.compose.ui.window.singleWindowApplication
  import java.awt.Desktop
  
  fun main() {
      var text by mutableStateOf("Hello, World!")
  
      try {
          Desktop.getDesktop().setOpenURIHandler { event ->
              text = "Open URI: " + event.uri
          }
      } catch (e: UnsupportedOperationException) {
          println("setOpenURIHandler is unsupported")
      }
  
      singleWindowApplication {
          MaterialTheme {
              Text(text)
          }
      }
  }
  ```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Desktop.getDesktop().setOpenURIHandler { event ->"}

3. `runDistributable`タスクを実行します：`./gradlew runDistributable`。

その結果、`compose://foo/bar`のようなリンクをブラウザからアプリケーションにリダイレクトできるようになります。

## ミニファイと難読化

Compose Multiplatform Gradleプラグインには、[ProGuard](https://www.guardsquare.com/proguard)の組み込みサポートが含まれています。
ProGuardは、コードのミニファイと難読化のための[オープンソースツール](https://github.com/Guardsquare/proguard)です。

各*デフォルト*（ProGuardなし）パッケージングタスクに対し、Gradleプラグインは*リリース*タスク（ProGuardあり）を提供します。

<table>
  <tr>
    <td width="400">Gradleタスク</td>
    <td>説明</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>createDistributable</code></p>
        <p>リリース: <code>createReleaseDistributable</code></p>
    </td>
    <td>JDKとリソースがバンドルされたアプリケーションイメージを作成します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>runDistributable</code></p>
        <p>リリース: <code>runReleaseDistributable</code></p>
    </td>
    <td>JDKとリソースがバンドルされたアプリケーションイメージを実行します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>run</code></p>
        <p>リリース: <code>runRelease</code></p>
    </td>
    <td>Gradle JDKを使用して、非パッケージアプリケーションの<code>.jar</code>を実行します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>package&lt;FORMAT_NAME&gt;</code></p>
        <p>リリース: <code>packageRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>アプリケーションイメージを<code>&lt;FORMAT_NAME&gt;</code>ファイルにパッケージ化します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>packageDistributionForCurrentOS</code></p>
        <p>リリース: <code>packageReleaseDistributionForCurrentOS</code></p>
    </td>
    <td>現在のOSと互換性のある形式でアプリケーションイメージをパッケージ化します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>packageUberJarForCurrentOS</code></p>
        <p>リリース: <code>packageReleaseUberJarForCurrentOS</code></p>
    </td>
    <td>アプリケーションイメージをuber（fat）`.jar`にパッケージ化します。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>notarize&lt;FORMAT_NAME&gt;</code></p>
        <p>リリース: <code>notarizeRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>公証のために<code>&lt;FORMAT_NAME&gt;</code>アプリケーションイメージをアップロードします（macOSのみ）。</td>
  </tr>
  <tr>
    <td>
        <p>デフォルト: <code>checkNotarizationStatus</code></p>
        <p>リリース: <code>checkReleaseNotarizationStatus</code></p>
    </td>
    <td>公証が成功したかどうかを確認します（macOSのみ）。</td>
  </tr>
</table>

デフォルト設定では、いくつかの事前定義されたProGuardルールが有効になっています。

* アプリケーションイメージはミニファイされ、未使用のクラスが削除されます。
* `compose.desktop.application.mainClass`がエントリポイントとして使用されます。
* Composeランタイムが機能し続けるように、いくつかの`keep`ルールが含まれています。

ほとんどの場合、ミニファイされたアプリケーションを得るために追加の設定は必要ありません。
ただし、ProGuardはバイトコード内の特定の利用方法（例えば、リフレクションを介してクラスが使用される場合など）を追跡できない場合があります。
ProGuard処理後にのみ発生する問題に遭遇した場合、カスタムルールを追加する必要があるかもしれません。

カスタム設定ファイルを指定するには、以下のようにDSLを使用します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            configurationFiles.from(project.file("compose-desktop.pro"))
        }
    }
}
```

ProGuardのルールと設定オプションの詳細については、Guardsquareの[マニュアル](https://www.guardsquare.com/manual/configuration/usage)を参照してください。

難読化はデフォルトで無効になっています。有効にするには、Gradle DSLを介して以下のプロパティを設定します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            obfuscate.set(true)
        }
    }
}
```

ProGuardの最適化はデフォルトで有効になっています。これらを無効にするには、Gradle DSLを介して以下のプロパティを設定します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            optimize.set(false)
        }
    }
}
```

uber JARの生成はデフォルトで無効になっており、ProGuardは入力された`.jar`ごとに対応する`.jar`ファイルを生成します。有効にするには、Gradle DSLを介して以下のプロパティを設定します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            joinOutputJars.set(true)
        }
    }
}
```

## 次のステップ

[デスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを参照してください。