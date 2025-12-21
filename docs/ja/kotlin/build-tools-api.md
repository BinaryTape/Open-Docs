[//]: # (title: ビルドツールAPI)

<primary-label ref="experimental-general"/>

<tldr>現在、BTAはKotlin/JVMのみをサポートしています。</tldr>

Kotlin 2.2.0 では、ビルドシステムがKotlinコンパイラと統合する方法を簡素化する、実験的なビルドツールAPI (BTA) が導入されました。

これまで、完全なKotlinサポート（インクリメンタルコンパイル、Kotlinコンパイラプラグイン、デーモン、Kotlinマルチプラットフォームなど）をビルドシステムに追加するには、多大な労力が必要でした。BTAは、ビルドシステムとKotlinコンパイラエコシステムの間で統一されたAPIを提供することで、この複雑さを軽減することを目的としています。

BTAは、ビルドシステムが実装できる単一のエントリポイントを定義します。これにより、コンパイラの内部詳細に深く統合する必要がなくなります。

> BTA自体は、独自のビルドツール統合で直接使用するためにまだ一般公開されていません。
> 提案に興味がある場合、またはフィードバックを共有したい場合は、[KEEP](https://github.com/Kotlin/KEEP/issues/421) を参照してください。
> その実装状況は [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255) で確認できます。
>
{style="warning"}

## Gradleとの統合

Kotlin Gradleプラグイン (KGP) はBTAの実験的サポートを提供しており、使用するにはオプトインが必要です。

> KGPの使用経験に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574) にいただけると幸いです。
>
{style="note"}

### 有効にする方法

`gradle.properties` ファイルに次のプロパティを追加します。

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```

### 異なるコンパイラバージョンの構成

BTAを使用すると、KGPが使用するバージョンとは異なるKotlinコンパイラバージョンを使用できるようになります。これは、次のような場合に役立ちます。

*   新しいKotlin機能を試したいが、まだビルドスクリプトを更新していない場合。
*   最新のプラグインの修正が必要だが、今のところ古いコンパイラバージョンに留まりたい場合。

`build.gradle.kts` ファイルでこれを構成する方法の例を次に示します。

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
    compilerVersion.set("2.1.21") // <-- different version than 2.2.0
}
```

#### 互換性のあるKotlinコンパイラとKGPのバージョン

BTAは以下をサポートしています。

*   過去3つのメジャーなKotlinコンパイラバージョン。
*   1つ先のメジャーバージョン。

たとえば、KGP 2.2.0では、サポートされるKotlinコンパイラバージョンは次のとおりです。

*   1.9.25
*   2.0.x
*   2.1.x
*   2.2.x
*   2.3.x

#### 制限事項

異なるコンパイラバージョンをコンパイラプラグインと組み合わせて使用すると、Kotlinコンパイラの例外が発生する可能性があります。Kotlinチームは、将来のKotlinリリースでこれに対処する予定です。

### "in process" 戦略でのインクリメンタルコンパイルの有効化

KGPは3つの[コンパイラ実行戦略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)をサポートしています。通常、"in-process" 戦略（Gradleデーモンでコンパイラを実行する戦略）は、インクリメンタルコンパイルをサポートしていません。

BTAを使用すると、"in-process" 戦略がインクリメンタルコンパイルをサポートするようになりました。これを有効にするには、`gradle.properties` ファイルに次のプロパティを追加します。

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Mavenとの統合

BTAは、[`kotlin-maven-plugin`](maven.md) が[Kotlinデーモン](kotlin-daemon.md) をサポートすることを可能にします。これはデフォルトの[コンパイラ実行戦略](maven-compile-package.md#choose-execution-strategy)です。`kotlin-maven-plugin` はBTAをデフォルトで使用するため、何も設定する必要はありません。

BTAは、将来的に[インクリメンタルコンパイルの安定化](https://youtrack.com/issue/KT-77086)などのさらなる機能を提供することを可能にします。