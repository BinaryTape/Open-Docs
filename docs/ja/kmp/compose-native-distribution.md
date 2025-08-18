[//]: # (title: ネイティブディストリビューション)

ここでは、ネイティブディストリビューションについて学習します。サポートされているすべてのシステム向けにインストーラーやパッケージを作成する方法、およびディストリビューションと同じ設定でアプリケーションをローカルで実行する方法を学びます。

以下のトピックの詳細については、引き続きお読みください。

*   [Compose Multiplatform Gradleプラグインとは](#gradle-plugin)
*   アプリケーションをローカルで実行するなどの[基本的なタスク](#basic-tasks)と、ミニファイや難読化などの[高度なタスク](#minification-and-obfuscation)に関する詳細。
*   [JDKモジュールを含める方法](#including-jdk-modules)と`ClassNotFoundException`への対処法。
*   [ディストリビューションのプロパティを指定する方法](#specifying-distribution-properties): パッケージバージョン、JDKバージョン、出力ディレクトリ、ランチャーのプロパティ、およびメタデータ。
*   リソースライブラリ、JVMリソースのロード、またはパックされたアプリケーションへのファイルの追加を使用した[リソースの管理方法](#managing-resources)。
*   Gradleソースセット、Kotlin JVMターゲット、または手動での[ソースセットのカスタマイズ方法](#custom-source-sets)。
*   OSごとに[アプリケーションアイコンを指定する方法](#application-icon)。
*   Linux上のパッケージメンテナーのメールアドレスやmacOS上のApple App Storeのアプリカテゴリなど、[プラットフォーム固有のオプション](#platform-specific-options)。
*   [macOS固有の構成](#macos-specific-configuration): 署名、公証、および`Info.plist`。

## Gradleプラグイン

このガイドは、Compose Multiplatform Gradleプラグインを使用したComposeアプリケーションのパッケージ化に主に焦点を当てています。`org.jetbrains.compose`プラグインは、基本的なパッケージ化、難読化、macOSのコード署名のためのタスクを提供します。

このプラグインを使用すると、`jpackage`を使用してアプリケーションをネイティブディストリビューションにパッケージ化したり、アプリケーションをローカルで実行したりするプロセスが簡素化されます。配布可能なアプリケーションは自己完結型でインストール可能なバイナリであり、必要なすべてのJavaランタイムコンポーネントを含んでいるため、ターゲットシステムにJDKがインストールされている必要はありません。

パッケージサイズを最小限に抑えるため、Gradleプラグインは[jlink](https://openjdk.org/jeps/282)ツールを使用し、配布可能なパッケージに必要なJavaモジュールのみがバンドルされるようにします。ただし、必要なモジュールを指定するには、Gradleプラグインを構成する必要があります。詳細については、[未定義](#including-jdk-modules)のセクションを参照してください。

代替として、JetBrainsが開発していない外部ツールである[Conveyor](https://www.hydraulic.software)を使用することもできます。Conveyorはオンラインアップデート、クロスビルド、その他様々な機能をサポートしていますが、オープンソース以外のプロジェクトでは[ライセンス](https://hydraulic.software/pricing.html)が必要です。詳細については、[Conveyorドキュメント](https://conveyor.hydraulic.dev/latest/tutorial/hare/jvm)を参照してください。

## 基本的なタスク

Compose Multiplatform Gradleプラグインの基本的な設定可能な単位は`application`です（これは[Gradleアプリケーション](https://docs.gradle.org/current/userguide/application_plugin.html)プラグインと混同しないようにしてください。こちらは非推奨です）。

`application` DSLメソッドは、一連の最終バイナリに対する共有構成を定義します。つまり、ファイルのコレクションとJDKディストリビューションを、様々な形式の圧縮されたバイナリインストーラーのセットにパッケージ化できます。

サポートされているオペレーティングシステムで利用可能な形式は次のとおりです。

*   **macOS**: `.dmg` (`TargetFormat.Dmg`)、`.pkg` (`TargetFormat.Pkg`)
*   **Windows**: `.exe` (`TargetFormat.Exe`)、`.msi` (`TargetFormat.Msi`)
*   **Linux**: `.deb` (`TargetFormat.Deb`)、`.rpm` (`TargetFormat.Rpm`)

基本的なデスクトップ構成を持つ`build.gradle.kts`ファイルの例を次に示します。

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

プロジェクトをビルドすると、プラグインは次のタスクを作成します。

<table>

<tr>
<td>Gradleタスク</td>
        <td>説明</td>
</tr>

    
<tr>
<td><code>package&lt;FormatName&gt;</code></td> 
        <td>アプリケーションを対応する<code>FormatName</code>バイナリにパッケージ化します。現時点ではクロスコンパイルはサポートされていません。つまり、対応する互換性のあるOSを使用してのみ特定の形式をビルドできます。たとえば、<code>.dmg</code>バイナリをビルドするには、macOSで<code>packageDmg</code>タスクを実行する必要があります。タスクが現在のOSと互換性がない場合、それらはデフォルトでスキップされます。</td>
</tr>

    
<tr>
<td><code>packageDistributionForCurrentOS</code></td>
        <td>アプリケーションのすべてのパッケージタスクを集約します。これは<a href="https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:task_categories">ライフサイクルタスク</a>です。</td>
</tr>

    
<tr>
<td><code>packageUberJarForCurrentOS</code></td>
        <td>現在のオペレーティングシステム用のすべての依存関係を含む単一のjarファイルを作成します。このタスクは、<code>compose.desktop.currentOS</code>が<code>compile</code>、<code>implementation</code>、または<code>runtime</code>依存関係として使用されることを想定しています。</td>
</tr>

    
<tr>
<td><code>run</code></td>
        <td><code>mainClass</code>で指定されたエントリポイントからアプリケーションをローカルで実行します。<code>run</code>タスクは、完全なランタイムを持つ非パッケージのJVMアプリケーションを開始します。このアプローチは、ミニファイされたランタイムでコンパクトなバイナリイメージを作成するよりも高速でデバッグが容易です。最終バイナリイメージを実行するには、代わりに<code>runDistributable</code>タスクを使用してください。</td>
</tr>

    
<tr>
<td><code>createDistributable</code></td>
        <td>インストーラーを作成せずに最終アプリケーションイメージを作成します。</td>
</tr>

    
<tr>
<td><code>runDistributable</code></td>
        <td>プリパッケージされたアプリケーションイメージを実行します。</td>
</tr>

</table>

利用可能なすべてのタスクは、Gradleツールウィンドウにリストされています。タスクを実行すると、Gradleは`${project.buildDir}/compose/binaries`ディレクトリに出力バイナリを生成します。

## JDKモジュールの含め方

配布可能ファイルのサイズを削減するために、Gradleプラグインは[jlink](https://openjdk.org/jeps/282)を使用しており、必要なJDKモジュールのみをバンドルするのに役立ちます。

現在、Gradleプラグインは必要なJDKモジュールを自動的に判断しません。これはコンパイルの問題を引き起こすことはありませんが、必要なモジュールを提供しないと、実行時に`ClassNotFoundException`が発生する可能性があります。

パッケージ化されたアプリケーションや`runDistributable`タスクの実行時に`ClassNotFoundException`が発生した場合は、`modules` DSLメソッドを使用して追加のJDKモジュールを含めることができます。

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

必要なモジュールは手動で指定するか、`suggestModules`を実行できます。`suggestModules`タスクは、[jdeps](https://docs.oracle.com/javase/9/tools/jdeps.htm)静的解析ツールを使用して、不足している可能性のあるモジュールを特定します。このツールの出力は不完全であったり、不要なモジュールをリストしたりする可能性があることに注意してください。

配布可能ファイルのサイズが重要な要因ではなく、無視できる場合は、`includeAllModules` DSLプロパティを使用してすべてのランタイムモジュールを含めることもできます。

## ディストリビューションプロパティの指定

### パッケージバージョン

ネイティブディストリビューションパッケージには、特定のパッケージバージョンが必要です。
パッケージバージョンを指定するには、次のDSLプロパティを優先度の高い順に低い順に使用します。

*   `nativeDistributions.<os>.<packageFormat>PackageVersion`は、単一のパッケージ形式のバージョンを指定します。
*   `nativeDistributions.<os>.packageVersion`は、単一のターゲットOSのバージョンを指定します。
*   `nativeDistributions.packageVersion`は、すべてのパッケージのバージョンを指定します。

macOSでは、ビルドバージョンを次のDSLプロパティ（これも優先度の高い順に低い順）を使用して指定することもできます。

*   `nativeDistributions.macOS.<packageFormat>PackageBuildVersion`は、単一のパッケージ形式のビルドバージョンを指定します。
*   `nativeDistributions.macOS.packageBuildVersion`は、すべてのmacOSパッケージのビルドバージョンを指定します。

ビルドバージョンを指定しない場合、Gradleは代わりにパッケージバージョンを使用します。macOSでのバージョン管理の詳細については、[`CFBundleShortVersionString`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)および[`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion)ドキュメントを参照してください。

パッケージバージョンを優先順位で指定するためのテンプレートを次に示します。

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

パッケージバージョンを定義するには、次の規則に従ってください。

<table>
    
<tr>
<td>ファイルタイプ</td>
        <td>バージョン形式</td>
        <td>詳細</td>
</tr>

    
<tr>
<td><code>dmg</code>, <code>pkg</code></td>
        <td><code>MAJOR[.MINOR][.PATCH]</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>は0より大きい整数</li>
                <li><code>MINOR</code>はオプションの非負整数</li>
                <li><code>PATCH</code>はオプションの非負整数</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>msi</code>, <code>exe</code></td>
        <td><code>MAJOR.MINOR.BUILD</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>は最大値255の非負整数</li>
                <li><code>MINOR</code>は最大値255の非負整数</li>
                <li><code>BUILD</code>は最大値65535の非負整数</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>deb</code></td>
        <td><code>[EPOCH:]UPSTREAM_VERSION[-DEBIAN_REVISION]</code></td>
        <td>
            <ul>
                <li><code>EPOCH</code>はオプションの非負整数</li>
                <li><code>UPSTREAM_VERSION</code>:
                    <ul>
                        <li>英数字および<code>.</code>、<code>+</code>、<code>-</code>、<code>~</code>文字のみを含めることができます</li>
                        <li>数字で始まる必要があります</li>
                    </ul>
                </li>
                <li><code>DEBIAN_REVISION</code>:
                    <ul>
                        <li>オプション</li>
                        <li>英数字および<code>.</code>、<code>+</code>、<code>~</code>文字のみを含めることができます</li>
                    </ul>
                </li>
            </ul>
            詳細については、<a href="https://www.debian.org/doc/debian-policy/ch-controlfields.html#version">Debianドキュメント</a>を参照してください。
        </td>
</tr>

    
<tr>
<td><code>rpm</code></td>
        <td>任意の形式</td>
        <td>バージョンに<code>-</code> (ダッシュ) 文字を含めることはできません。</td>
</tr>

</table>

### JDKバージョン

このプラグインは`jpackage`を使用しますが、これは[JDK 17](https://openjdk.java.net/projects/jdk/17/)以上のJDKバージョンを必要とします。JDKバージョンを指定する際は、以下のいずれかの要件を満たしていることを確認してください。

*   `JAVA_HOME`環境変数が互換性のあるJDKバージョンを指している。
*   `javaHome`プロパティがDSL経由で設定されている。

  ```kotlin
  compose.desktop {
      application {
          javaHome = System.getenv("JDK_17")
      }
  }
  ```

### 出力ディレクトリ

ネイティブディストリビューションにカスタムの出力ディレクトリを使用するには、次のように`outputBaseDir`プロパティを構成します。

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

アプリケーションの起動プロセスを調整するために、以下のプロパティをカスタマイズできます。

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

設定例を次に示します。

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
    <td>アプリケーションの名前。</td>
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

設定例を次に示します。

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

リソースをパッケージ化してロードするには、Compose Multiplatformリソースライブラリ、JVMリソースのロード、またはパッケージ化されたアプリケーションへのファイルの追加を使用できます。

### リソースライブラリ

プロジェクトのリソースを設定する最も簡単な方法は、リソースライブラリを使用することです。
リソースライブラリを使用すると、サポートされているすべてのプラットフォームで共通コード内のリソースにアクセスできます。
詳細については、[マルチプラットフォームリソース](compose-multiplatform-resources.md)を参照してください。

### JVMリソースのロード

Compose Multiplatform for desktopはJVMプラットフォーム上で動作します。これは、`java.lang.Class` APIを使用して`.jar`ファイルからリソースをロードできることを意味します。`src/main/resources`ディレクトリ内のファイルには、[`Class::getResource`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResource(java.lang.String))または[`Class::getResourceAsStream`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResourceAsStream(java.lang.String))を介してアクセスできます。

### パッケージ化されたアプリケーションへのファイルの追加

`.jar`ファイルからリソースをロードすることが実用的でないシナリオもあります。たとえば、ターゲット固有のアセットがあり、macOSパッケージにはファイルを含めるが、Windowsパッケージには含めない場合などです。

このような場合、Gradleプラグインを構成して、追加のリソースファイルをインストールディレクトリに含めることができます。
次のようにDSLを使用してルートリソースディレクトリを指定します。

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

Gradleプラグインは、リソースのサブディレクトリからファイルを次のように含めます。

1.  **共通リソース:**
    `<RESOURCES_ROOT_DIR>/common`にあるファイルは、ターゲットOSやアーキテクチャに関係なく、すべてのパッケージに含まれます。

2.  **OS固有のリソース:**
    `<RESOURCES_ROOT_DIR>/<OS_NAME>`にあるファイルは、特定のオペレーティングシステム用にビルドされたパッケージにのみ含まれます。
    `<OS_NAME>`の有効な値は、`windows`、`macos`、`linux`です。

3.  **OSおよびアーキテクチャ固有のリソース:**
    `<RESOURCES_ROOT_DIR>/<OS_NAME>-<ARCH_NAME>`にあるファイルは、特定のオペレーティングシステムとCPUアーキテクチャの組み合わせ用にビルドされたパッケージにのみ含まれます。
    `<ARCH_NAME>`の有効な値は、`x64`および`arm64`です。
    たとえば、`<RESOURCES_ROOT_DIR>/macos-arm64`にあるファイルは、Apple Silicon Mac向けパッケージにのみ含まれます。

`compose.application.resources.dir`システムプロパティを使用して、含まれるリソースにアクセスできます。

```kotlin
import java.io.File

val resourcesDir = File(System.getProperty("compose.application.resources.dir"))

fun main() {
    println(resourcesDir.resolve("resource.txt").readText())
}
```

## カスタムソースセット

`org.jetbrains.kotlin.jvm`または`org.jetbrains.kotlin.multiplatform`プラグインを使用している場合は、デフォルト構成に依存できます。

*   `org.jetbrains.kotlin.jvm`を使用した構成には、`main`[ソースセット](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)の内容が含まれます。
*   `org.jetbrains.kotlin.multiplatform`を使用した構成には、単一の[JVMターゲット](multiplatform-dsl-reference.md#targets)の内容が含まれます。
    複数のJVMターゲットを定義すると、デフォルト構成は無効になります。この場合、プラグインを手動で構成するか、単一のターゲットを指定する必要があります（以下を参照）。

デフォルト設定があいまいまたは不十分な場合は、いくつかの方法でカスタマイズできます。

Gradle [ソースセット](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)を使用する:

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

Kotlin [JVMターゲット](multiplatform-dsl-reference.md#targets)を使用する:

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

手動で:

*   `disableDefaultConfiguration`を使用してデフォルト設定を無効にします。
*   `fromFiles`を使用して含めるファイルを指定します。
*   `mainJar`ファイルプロパティに、メインクラスを含む`.jar`ファイルを指定します。
*   `dependsOn`を使用して、すべてのプラグインタスクにタスク依存関係を追加します。
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

アプリのアイコンが、次のOS固有の形式で利用可能であることを確認してください。

*   macOSの場合は`.icns`
*   Windowsの場合は`.ico`
*   Linuxの場合は`.png`

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

次の表は、サポートされているすべてのプラットフォーム固有のオプションを示しています。文書化されていないプロパティの使用は**推奨されません**。

<table>
    
<tr>
<td>プラットフォーム</td>
        <td>オプション</td>
        <td width="500">説明</td>
</tr>

    
<tr>
<td rowspan="3">すべてのプラットフォーム</td>
        <td><code>iconFile.set(File("PATH_TO_ICON"))</code></td>
        <td>アプリケーションのプラットフォーム固有のアイコンへのパスを指定します。詳細については、<a href="#application-icon">アプリケーションアイコン</a>セクションを参照してください。</td>
</tr>

    
<tr>
<td><code>packageVersion = "1.0.0"</code></td>
        <td>プラットフォーム固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。</td>
</tr>

    
<tr>
<td><code>installationPath = "PATH_TO_INST_DIR"</code></td>
        <td>デフォルトのインストールディレクトリへの絶対パスまたは相対パスを指定します。
            Windowsでは、インストール時にパスをカスタマイズできるように<code>dirChooser = true</code>も使用できます。</td>
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
        <td>rpmパッケージのリリースの値、またはdebパッケージのリビジョンの値を設定します。</td>
</tr>

    
<tr>
<td><code>appCategory = "CATEGORY"</code></td>
        <td>rpmパッケージのグループ値、またはdebパッケージのセクション値を割り当てます。</td>
</tr>

    
<tr>
<td><code>rpmLicenseType = "TYPE_OF_LICENSE"</code></td>
        <td>rpmパッケージのライセンスのタイプを示します。</td>
</tr>

    
<tr>
<td><code>debPackageVersion = "DEB_VERSION"</code></td>
        <td>deb固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。</td>
</tr>

    
<tr>
<td><code>rpmPackageVersion = "RPM_VERSION"</code></td>
        <td>rpm固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。</td>
</tr>

    
<tr>
<td rowspan="15">macOS</td>
        <td><code>bundleID</code></td>
        <td>
            一意のアプリケーション識別子を指定します。これには、英数字
            (<code>A-Z</code>、<code>a-z</code>、<code>0-9</code>)、ハイフン (<code>-</code>)、
            およびピリオド (<code>.</code>) のみを含めることができます。リバースDNS表記
            (<code>com.mycompany.myapp</code>) を使用することをお勧めします。
        </td>
</tr>

    
<tr>
<td><code>packageName</code></td>
        <td>アプリケーションの名前。</td>
</tr>

    
<tr>
<td><code>dockName</code></td>
        <td>
            メニューバー、「&lt;App&gt;について」メニュー項目、
            およびDockに表示されるアプリケーションの名前。デフォルト値は<code>packageName</code>です。
        </td>
</tr>

    
<tr>
<td><code>minimumSystemVersion</code></td>
        <td>
            アプリケーションを実行するために必要な最小macOSバージョン。詳細については、
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsminimumsystemversion">
                <code>LSMinimumSystemVersion</code></a>を参照してください。
        </td>
</tr>

    
<tr>
<td><code>signing</code>, <code>notarization</code>, <code>provisioningProfile</code>, <code>runtimeProvisioningProfile</code></td>
        <td>
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>チュートリアルを参照してください。
        </td>
</tr>

    
<tr>
<td><code>appStore = true</code></td>
        <td>Apple App Store向けにアプリをビルドおよび署名するかどうかを指定します。JDK 17以上が必要です。</td>
</tr>

    
<tr>
<td><code>appCategory</code></td>
        <td>
            Apple App Store向けアプリのカテゴリ。App Store向けにビルドする場合のデフォルト値は
            <code>public.app-category.utilities</code>、それ以外の場合は<code>Unknown</code>です。
            有効なカテゴリのリストについては、
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype">
                <code>LSApplicationCategoryType</code>
            </a>を参照してください。
        </td>
</tr>

    
<tr>
<td><code>entitlementsFile.set(File("PATH_ENT"))</code></td>
        <td>
            署名時に使用されるエンタイトルメントを含むファイルへのパスを指定します。カスタムファイルを提供する場合、
            Javaアプリケーションに必要なエンタイトルメントを追加してください。App Store向けにビルドする際に使用されるデフォルトファイルについては、
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>を参照してください。このデフォルトファイルはJDKのバージョンによって異なる場合があります。
            ファイルが指定されていない場合、プラグインは<code>jpackage</code>が提供するデフォルトのエンタイトルメントを使用します。
            詳細については、<a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>チュートリアルを参照してください。
        </td>
</tr>

    
<tr>
<td><code>runtimeEntitlementsFile.set(File("PATH_R_ENT"))</code></td>
        <td>
            JVMランタイムの署名時に使用されるエンタイトルメントを含むファイルへのパスを指定します。カスタムファイルを提供する場合、
            Javaアプリケーションに必要なエンタイトルメントを追加してください。App Store向けにビルドする際に使用されるデフォルトファイルについては、
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>を参照してください。このデフォルトファイルはJDKのバージョンによって異なる場合があります。
            ファイルが指定されていない場合、プラグインは<code>jpackage</code>が提供するデフォルトのエンタイトルメントを使用します。
            詳細については、<a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS向けディストリビューションの署名と公証</a>チュートリアルを参照してください。
        </td>
</tr>

    
<tr>
<td><code>dmgPackageVersion = "DMG_VERSION"</code></td>
        <td>
            DMG固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。
        </td>
</tr>

    
<tr>
<td><code>pkgPackageVersion = "PKG_VERSION"</code></td>
        <td>
            PKG固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。
        </td>
</tr>

    
<tr>
<td><code>packageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            パッケージのビルドバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。
        </td>
</tr>

    
<tr>
<td><code>dmgPackageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            DMG固有のパッケージビルドバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。
        </td>
</tr>

    
<tr>
<td><code>pkgPackageBuildVersion = "PKG_VERSION"</code></td>
        <td>
            PKG固有のパッケージビルドバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。
        </td>
</tr>

    
<tr>
<td><code>infoPlist</code></td>
        <td><a href="#information-property-list-on-macos">macOS上の<code>Info.plist</code></a>セクションを参照してください。</td>
</tr>

        
<tr>
<td rowspan="7">Windows</td>
            <td><code>console = true</code></td>
            <td>アプリケーションのコンソールランチャーを追加します。</td>
</tr>

        
<tr>
<td><code>dirChooser = true</code></td>
            <td>インストール時にインストールパスをカスタマイズできるようにします。</td>
</tr>

        
<tr>
<td><code>perUserInstall = true</code></td>
            <td>アプリケーションをユーザーごとにインストールできるようにします。</td>
</tr>

        
<tr>
<td><code>menuGroup = "start-menu-group"</code></td>
            <td>アプリケーションを指定されたスタートメニューグループに追加します。</td>
</tr>

        
<tr>
<td><code>upgradeUuid = "UUID"</code></td>
            <td>インストールされているバージョンよりも新しいバージョンがある場合に、ユーザーがインストーラー経由でアプリケーションを更新できるようにする一意のIDを指定します。この値は単一のアプリケーションに対して一定である必要があります。詳細については、<a href="https://wixtoolset.org/documentation/manual/v3/howtos/general/generate_guids.html">How To: GUIDを生成する</a>を参照してください。</td>
</tr>

        
<tr>
<td><code>msiPackageVersion = "MSI_VERSION"</code></td>
            <td>MSI固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。</td>
</tr>

        
<tr>
<td><code>exePackageVersion = "EXE_VERSION"</code></td>
            <td>EXE固有のパッケージバージョンを設定します。詳細については、<a href="#package-version">パッケージバージョン</a>セクションを参照してください。</td>
</tr>

</table>

## macOS固有の構成

### macOSでの署名と公証

最新のmacOSバージョンでは、インターネットからダウンロードされた署名されていないアプリケーションの実行が許可されていません。そのようなアプリケーションを実行しようとすると、次のエラーが発生します。「YourApp is damaged and can't be open. You should eject the disk image」（YourAppは破損しており開けません。ディスクイメージを取り出す必要があります）。

アプリケーションに署名して公証する方法については、[チュートリアル](https://github.com/JetBrains/compose-multiplatform/blob/master/tutorials/Signing_and_notarization_on_macOS/README.md)を参照してください。

### macOS上のInformation Property List

DSLは基本的なプラットフォーム固有のカスタマイズをサポートしていますが、提供された機能を超えるケースも存在します。DSLに表現されていない`Info.plist`の値を指定する必要がある場合は、生のXMLスニペットを回避策として含めることができます。このXMLはアプリケーションの`Info.plist`に追加されます。

#### 例: ディープリンク

1.  `build.gradle.kts`ファイルでカスタムURLスキームを定義します。

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

2.  `src/main/main.kt`ファイルで`java.awt.Desktop`クラスを使用してURIハンドラーを設定します。

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

3.  `runDistributable`タスクを実行します: `./gradlew runDistributable`。

結果として、`compose://foo/bar`のようなリンクがブラウザからアプリケーションにリダイレクトされるようになります。

## ミニファイと難読化

Compose Multiplatform Gradleプラグインには、[ProGuard](https://www.guardsquare.com/proguard)の組み込みサポートが含まれています。ProGuardは、コードのミニファイと難読化のための[オープンソースツール](https://github.com/Guardsquare/proguard)です。

各*デフォルト*（ProGuardなし）パッケージングタスクには、Gradleプラグインが*リリース*タスク（ProGuardあり）を提供します。

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
    <td>JDKとリソースをバンドルしたアプリケーションイメージを作成します。</td>
</tr>

  
<tr>
<td>
        <p>デフォルト: <code>runDistributable</code></p>
        <p>リリース: <code>runReleaseDistributable</code></p>
    </td>
    <td>JDKとリソースをバンドルしたアプリケーションイメージを実行します。</td>
</tr>

  
<tr>
<td>
        <p>デフォルト: <code>run</code></p>
        <p>リリース: <code>runRelease</code></p>
    </td>
    <td>Gradle JDKを使用して非パッケージ化アプリケーション<code>.jar</code>を実行します。</td>
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
    <td>アプリケーションイメージを現在のOSと互換性のある形式にパッケージ化します。</td>
</tr>

  
<tr>
<td>
        <p>デフォルト: <code>packageUberJarForCurrentOS</code></p>
        <p>リリース: <code>packageReleaseUberJarForCurrentOS</code></p>
    </td>
    <td>アプリケーションイメージをUber (fat) <code>.jar</code>にパッケージ化します。</td>
</tr>

  
<tr>
<td>
        <p>デフォルト: <code>notarize&lt;FORMAT_NAME&gt;</code></p>
        <p>リリース: <code>notarizeRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td><code>&lt;FORMAT_NAME&gt;</code>アプリケーションイメージを公証のためにアップロードします (macOSのみ)。</td>
</tr>

  
<tr>
<td>
        <p>デフォルト: <code>checkNotarizationStatus</code></p>
        <p>リリース: <code>checkReleaseNotarizationStatus</code></p>
    </td>
    <td>公証が成功したかどうかを確認します (macOSのみ)。</td>
</tr>

</table>

デフォルト構成では、いくつかの事前定義されたProGuardルールが有効になっています。

*   アプリケーションイメージはミニファイされ、未使用のクラスが削除されます。
*   `compose.desktop.application.mainClass`がエントリポイントとして使用されます。
*   Composeランタイムが機能し続けるように、いくつかの`keep`ルールが含まれています。

ほとんどの場合、ミニファイされたアプリケーションを取得するために追加の構成は必要ありません。ただし、ProGuardは、たとえばクラスがリフレクションを介して使用される場合など、バイトコード内の特定の用途を追跡しないことがあります。ProGuard処理後にのみ発生する問題に遭遇した場合は、カスタムルールを追加する必要があるかもしれません。

カスタム構成ファイルを指定するには、次のようにDSLを使用します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            configurationFiles.from(project.file("compose-desktop.pro"))
        }
    }
}
```

ProGuardのルールと構成オプションの詳細については、Guardsquareの[マニュアル](https://www.guardsquare.com/manual/configuration/usage)を参照してください。

難読化はデフォルトで無効になっています。有効にするには、Gradle DSL経由で次のプロパティを設定します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            obfuscate.set(true)
        }
    }
}
```

ProGuardの最適化はデフォルトで有効になっています。無効にするには、Gradle DSL経由で次のプロパティを設定します。

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            optimize.set(false)
        }
    }
}
```

Uber JARの生成はデフォルトで無効になっており、ProGuardは入力されたすべての`.jar`に対して対応する`.jar`ファイルを生成します。有効にするには、Gradle DSL経由で次のプロパティを設定します。

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

[デスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを探索してください。