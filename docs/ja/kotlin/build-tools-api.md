[//]: # (title: Build tools API)

<primary-label ref="experimental-general"/>

<tldr>現在、BTAはKotlin/JVMのみをサポートしています。</tldr>

Kotlinには、ビルドシステムとKotlinコンパイラの統合を簡素化する、実験的なBuild tools API (BTA) が用意されています。

ビルドシステムに完全なKotlinサポート（インクリメンタルコンパイル、Kotlinコンパイラプラグイン、デーモン、Kotlinマルチプラットフォームなど）を追加するには、多大な労力が必要でした。BTAは、ビルドシステムとKotlinコンパイラのエコシステム間に統一されたAPIを提供することで、この複雑さを軽減することを目指しています。

BTAは、ビルドシステムが実装可能な単一のエントリポイントを定義します。これにより、コンパイラの内部詳細に深く統合する必要がなくなります。

> BTA自体は、独自のビルドツール統合で直接使用するためにまだ一般公開されていません。
> プロポーザルに関心がある場合やフィードバックを共有したい場合は、[KEEP](https://github.com/Kotlin/KEEP/issues/421)を参照してください。
> 実装のステータスは[YouTrack](https://youtrack.jetbrains.com/issue/KT-76255)で追跡できます。
> 
{style="warning"}

## Gradleとの統合

Kotlin Gradleプラグイン (KGP) はBTAを実験的にサポートしています。KGPはデフォルトでKotlin/JVMコンパイルにBTAを使用します。

> KGPでの使用体験に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-56574)でお待ちしております。
> 
{style="note"}

### 異なるコンパイラバージョンの構成

BTAを使用すると、KGPで使用されているバージョンとは異なるKotlinコンパイラバージョンを使用できるようになります。これは以下のような場合に便利です：

* 新しいKotlin機能を試したいが、ビルドスクリプトをまだ更新していない場合。
* 最新のプラグインの修正が必要だが、現在は古いコンパイラバージョンを使い続けたい場合。

`build.gradle.kts` ファイルでの設定例は以下の通りです：

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.1.21") // <-- 2.2.0とは異なるバージョン
}
```

#### 互換性のあるKotlinコンパイラおよびKGPバージョン

BTAは以下をサポートしています：

* 前の3つのメジャーKotlinコンパイラバージョン。
* 1つ先のメジャーバージョン。

例えば、KGP 2.2.0において、サポートされるKotlinコンパイラバージョンは以下の通りです：

* 1.9.25
* 2.0.x
* 2.1.x
* 2.2.x
* 2.3.x

#### 制限事項

異なるコンパイラバージョンをコンパイラプラグインと一緒に使用すると、Kotlinコンパイラの例外が発生する可能性があります。Kotlinチームは将来のリリースでこれに対処する予定です。

### 「in-process」戦略でのインクリメンタルコンパイルの有効化

KGPは3つの[コンパイラ実行戦略](compiler-execution-strategy.md)をサポートしています。
通常、「in-process」戦略（Gradleデーモン内でコンパイラを実行する）はインクリメンタルコンパイルをサポートしていません。

BTAを使用すると、「in-process」戦略でインクリメンタルコンパイルがサポートされるようになります。有効にするには、`gradle.properties` ファイルに以下のプロパティを追加します：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Mavenとの統合

BTAにより、[`kotlin-maven-plugin`](maven.md) が [Kotlinデーモン](kotlin-daemon.md) をサポートできるようになります。これはデフォルトの [コンパイラ実行戦略](maven-kotlin-compiler.md#choose-execution-strategy) です。`kotlin-maven-plugin` はデフォルトでBTAを使用するため、設定の必要はありません。

BTAにより、将来的に [インクリメンタルコンパイルの安定化](https://youtrack.jetbrains.com/issue/KT-77086) などのより多くの機能を提供することが可能になります。