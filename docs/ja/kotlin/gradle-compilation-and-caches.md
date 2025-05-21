---
title: "Kotlin Gradle プラグインにおけるコンパイルとキャッシュ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

このページでは、以下のトピックについて学ぶことができます。
* [Incremental compilation (インクリメンタルコンパイル)](#incremental-compilation)
* [Gradle build cache support (Gradleビルドキャッシュのサポート)](#gradle-build-cache-support)
* [Gradle configuration cache support (Gradle構成キャッシュのサポート)](#gradle-configuration-cache-support)
* [The Kotlin daemon and how to use it with Gradle (KotlinデーモンとGradleでの使用方法)](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [Rolling back to the previous compiler (以前のコンパイラへのロールバック)](#rolling-back-to-the-previous-compiler)
* [Defining Kotlin compiler execution strategy (Kotlinコンパイラの実行戦略の定義)](#defining-kotlin-compiler-execution-strategy)
* [Kotlin compiler fallback strategy (Kotlinコンパイラのフォールバック戦略)](#kotlin-compiler-fallback-strategy)
* [Trying the latest language version (最新の言語バージョンの試用)](#trying-the-latest-language-version)
* [Build reports (ビルドレポート)](#build-reports)

## Incremental compilation (インクリメンタルコンパイル)

Kotlin Gradle plugin (Kotlin Gradleプラグイン) は、インクリメンタルコンパイルをサポートしており、Kotlin/JVMおよびKotlin/JSプロジェクトでデフォルトで有効になっています。
インクリメンタルコンパイルは、ビルド間のクラスパス内のファイルの変更を追跡し、これらの変更の影響を受けるファイルのみをコンパイルします。
このアプローチは、[Gradle's build cache (Gradleのビルドキャッシュ)](#gradle-build-cache-support) で動作し、[compilation avoidance (コンパイル回避)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance) をサポートします。

Kotlin/JVMの場合、インクリメンタルコンパイルはクラスパススナップショットに依存しており、
モジュールのAPI構造をキャプチャして、再コンパイルが必要かどうかを判断します。
パイプライン全体を最適化するために、Kotlinコンパイラは2種類のクラスパススナップショットを使用します。

* **Fine-grained snapshots (詳細なスナップショット):** プロパティや関数などのクラスメンバーに関する詳細情報が含まれます。
メンバーレベルの変更が検出されると、Kotlinコンパイラは変更されたメンバーに依存するクラスのみを再コンパイルします。
パフォーマンスを維持するために、Kotlin Gradle plugin (Kotlin Gradleプラグイン) はGradleキャッシュ内の `.jar` ファイルに対して粗いスナップショットを作成します。
* **Coarse-grained snapshots (粗いスナップショット):** クラスの [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) ハッシュのみが含まれています。
ABIの一部が変更されると、Kotlinコンパイラは変更されたクラスに依存するすべてのクラスを再コンパイルします。
これは、外部ライブラリなど、変更頻度の低いクラスに役立ちます。

:::note
Kotlin/JSプロジェクトは、履歴ファイルに基づいた異なるインクリメンタルコンパイルアプローチを使用します。

:::

インクリメンタルコンパイルを無効にするには、いくつかの方法があります。

* Kotlin/JVMの場合は `kotlin.incremental=false` を設定します。
* Kotlin/JSプロジェクトの場合は `kotlin.incremental.js=false` を設定します。
* コマンドラインパラメータとして `-Pkotlin.incremental=false` または `-Pkotlin.incremental.js=false` を使用します。

  パラメータは、後続の各ビルドに追加する必要があります。

インクリメンタルコンパイルを無効にすると、インクリメンタルキャッシュはビルド後に無効になります。最初のビルドはインクリメンタルではありません。

:::note
インクリメンタルコンパイルの問題は、失敗が発生してから数ラウンド後に顕在化することがあります。 [build reports (ビルドレポート)](#build-reports) を使用して、
変更とコンパイルの履歴を追跡します。これにより、再現可能なバグレポートを提供することができます。

現在のインクリメンタルコンパイルのアプローチがどのように機能し、以前のアプローチと比較してどうであるかについて詳しくは、
[ブログ記事](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/) を参照してください。

## Gradle build cache support (Gradleビルドキャッシュのサポート)

Kotlin plugin (Kotlinプラグイン) は、[Gradle build cache (Gradleビルドキャッシュ)](https://docs.gradle.org/current/userguide/build_cache.html) を使用します。これは、
将来のビルドで再利用するためにビルド出力を保存します。

すべてのKotlinタスクのキャッシュを無効にするには、システムプロパティ `kotlin.caching.enabled` を `false` に設定します
(引数 `-Dkotlin.caching.enabled=false` を指定してビルドを実行します)。

## Gradle configuration cache support (Gradle構成キャッシュのサポート)

Kotlin plugin (Kotlinプラグイン) は、[Gradle configuration cache (Gradle構成キャッシュ)](https://docs.gradle.org/current/userguide/configuration_cache.html) を使用します。これは、
後続のビルドのために構成フェーズの結果を再利用することにより、ビルドプロセスを高速化します。

構成キャッシュを有効にする方法については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) を参照してください。
この機能を有効にすると、Kotlin Gradle plugin (Kotlin Gradleプラグイン) は自動的に使用を開始します。

## The Kotlin daemon and how to use it with Gradle (KotlinデーモンとGradleでの使用方法)

Kotlin daemon (Kotlinデーモン):
* Gradle daemon (Gradleデーモン) と共に実行してプロジェクトをコンパイルします。
* IntelliJ IDEA組み込みのビルドシステムでプロジェクトをコンパイルする場合は、Gradle daemon (Gradleデーモン) とは別に実行されます。

Kotlin daemon (Kotlinデーモン) は、Kotlinコンパイルタスクのいずれかがソースのコンパイルを開始すると、Gradleの [execution stage (実行段階)](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases) で開始されます。
Kotlin daemon (Kotlinデーモン) は、Gradle daemon (Gradleデーモン) と共に停止するか、Kotlinコンパイルがない状態で2時間アイドル状態が続くと停止します。

Kotlin daemon (Kotlinデーモン) は、Gradle daemon (Gradleデーモン) と同じJDKを使用します。

### Setting Kotlin daemon's JVM arguments (KotlinデーモンのJVM引数の設定)

引数を設定する次の各方法は、その前に来たものをオーバーライドします。
* [Gradle daemon arguments inheritance (Gradleデーモンの引数の継承)](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` system property (`kotlin.daemon.jvm.options` システムプロパティ)](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` property (`kotlin.daemon.jvmargs` プロパティ)](#kotlin-daemon-jvmargs-property)
* [`kotlin` extension (`kotlin` 拡張)](#kotlin-extension)
* [Specific task definition (特定のタスク定義)](#specific-task-definition)

#### Gradle daemon arguments inheritance (Gradleデーモンの引数の継承)

デフォルトでは、Kotlin daemon (Kotlinデーモン) はGradle daemon (Gradleデーモン) から特定の引数のセットを継承しますが、Kotlin daemon (Kotlinデーモン) に直接指定されたJVM引数でそれらを上書きします。たとえば、 `gradle.properties` ファイルに次のJVM引数を追加するとします。

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

これらの引数は、Kotlin daemon (Kotlinデーモン) のJVM引数に追加されます。

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

Kotlin daemon (Kotlinデーモン) のJVM引数に関するデフォルトの動作について詳しくは、[Kotlin daemon's behavior with JVM arguments (JVM引数に関するKotlinデーモンの動作)](#kotlin-daemon-s-behavior-with-jvm-arguments) を参照してください。

:::

#### kotlin.daemon.jvm.options system property (`kotlin.daemon.jvm.options` システムプロパティ)

Gradle daemon (Gradleデーモン) のJVM引数に `kotlin.daemon.jvm.options` システムプロパティがある場合は、 `gradle.properties` ファイルで使用します。

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

引数を渡す場合は、次のルールに従ってください。
* マイナス記号 `-` は、引数 `Xmx`、`XX:MaxMetaspaceSize`、および `XX:ReservedCodeCacheSize` **のみ** の前に使用します。
* 引数は、スペース _なし_ でコンマ (`,`) で区切ります。スペースの後の引数は、Kotlin daemon (Kotlinデーモン) ではなく、Gradle daemon (Gradleデーモン) に使用されます。

:::note
次の条件がすべて満たされる場合、Gradleはこれらのプロパティを無視します。
* GradleがJDK 1.9以降を使用している。
* Gradleのバージョンが7.0から7.1.1までの間である。
* GradleがKotlin DSLスクリプトをコンパイルしている。
* Kotlin daemon (Kotlinデーモン) が実行されていない。

これを克服するには、Gradleをバージョン7.2以降にアップグレードするか、 `kotlin.daemon.jvmargs` プロパティを使用します (次のセクションを参照)。

#### kotlin.daemon.jvmargs property (`kotlin.daemon.jvmargs` プロパティ)

`gradle.properties` ファイルに `kotlin.daemon.jvmargs` プロパティを追加できます。

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

ここで、またはGradleのJVM引数で `ReservedCodeCacheSize` 引数を指定しない場合、Kotlin Gradle plugin (Kotlin Gradleプラグイン) はデフォルト値 `320m` を適用することに注意してください。

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlin extension (`kotlin` 拡張)

`kotlin` 拡張で引数を指定できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</TabItem>
</Tabs>

#### Specific task definition (特定のタスク定義)

特定のタスクの引数を指定できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task `->`
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</TabItem>
</Tabs>

この場合、タスクの実行時に新しいKotlin daemon (Kotlinデーモン) インスタンスが開始される可能性があります。 [Kotlin daemon's behavior with JVM arguments (JVM引数に関するKotlinデーモンの動作)](#kotlin-daemon-s-behavior-with-jvm-arguments) について詳しくは、こちらをご覧ください。

:::

### Kotlin daemon's behavior with JVM arguments (JVM引数に関するKotlinデーモンの動作)

Kotlin daemon (Kotlinデーモン) のJVM引数を構成する場合は、次の点に注意してください。

* 異なるサブプロジェクトまたはタスクが異なるJVM引数のセットを持っている場合、Kotlin daemon (Kotlinデーモン) の複数のインスタンスが同時に実行されることが予想されます。
* 新しいKotlin daemon (Kotlinデーモン) インスタンスは、Gradleが関連するコンパイルタスクを実行し、既存のKotlin daemon (Kotlinデーモン) が同じJVM引数のセットを持っていない場合にのみ開始されます。
  プロジェクトに多くのサブプロジェクトがあると想像してください。それらのほとんどはKotlin daemon (Kotlinデーモン) 用にいくつかのヒープメモリを必要としますが、1つのモジュールは（めったにコンパイルされませんが）多くのメモリを必要とします。
  この場合、そのようなモジュールには異なるJVM引数のセットを提供する必要があるため、より大きなヒープサイズのKotlin daemon (Kotlinデーモン) は、この特定のモジュールに触れる開発者に対してのみ開始されます。
  > コンパイル要求を処理するのに十分なヒープサイズを持つKotlin daemon (Kotlinデーモン) をすでに実行している場合、
  > 他の要求されたJVM引数が異なっていても、新しいデーモンを開始する代わりに、このデーモンが再利用されます。
  >
  

次の引数が指定されていない場合、Kotlin daemon (Kotlinデーモン) はGradle daemon (Gradleデーモン) からそれらを継承します。

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`。指定または継承されていない場合、デフォルト値は `320m` です。

Kotlin daemon (Kotlinデーモン) には、次のデフォルトのJVM引数があります。
* `-XX:UseParallelGC`。この引数は、他のガベージコレクターが指定されていない場合にのみ適用されます。
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。この引数は、JDKバージョン16以降でのみ適用されます。

:::note
Kotlin daemon (Kotlinデーモン) のデフォルトのJVM引数のリストは、バージョンによって異なる場合があります。 [VisualVM](https://visualvm.github.io/) などのツールを使用して、Kotlin daemon (Kotlinデーモン) などの実行中のJVMプロセスの実際の設定を確認できます。

:::

## Rolling back to the previous compiler (以前のコンパイラへのロールバック)

Kotlin 2.0.0以降では、K2コンパイラがデフォルトで使用されます。

Kotlin 2.0.0以降で以前のコンパイラを使用するには、次のいずれかを行います。

* `build.gradle.kts` ファイルで、[言語バージョンを設定します](gradle-compiler-options#example-of-setting-languageversion) を `1.9` に設定します。

  または
* 次のコンパイラオプションを使用します: `-language-version 1.9`。

K2コンパイラの利点について詳しくは、[K2コンパイラ移行ガイド](k2-compiler-migration-guide) を参照してください。

## Defining Kotlin compiler execution strategy (Kotlinコンパイラの実行戦略の定義)

_Kotlin compiler execution strategy (Kotlinコンパイラの実行戦略)_ は、Kotlinコンパイラがどこで実行されるか、および各ケースでインクリメンタルコンパイルがサポートされるかどうかを定義します。

コンパイラの実行戦略は3つあります。

| Strategy (戦略)       | Where Kotlin compiler is executed (Kotlinコンパイラの実行場所)          | Incremental compilation (インクリメンタルコンパイル) | Other characteristics and notes (その他の特性と注意事項)                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Daemon (デーモン)         | Inside its own daemon process (独自のデーモンプロセス内)              | Yes (はい)                     | _The default and fastest strategy (デフォルトで最速の戦略)_. Can be shared between different Gradle daemons and multiple parallel compilations (異なるGradleデーモンと複数の並列コンパイル間で共有できます)。                                                                                                                                                         |
| In process (インプロセス)     | Inside the Gradle daemon process (Gradleデーモンプロセス内)           | No (いいえ)                      | May share the heap with the Gradle daemon (Gradleデーモンとヒープを共有する場合があります)。 The "In process" execution strategy is _slower_ than the "Daemon" execution strategy ("インプロセス" の実行戦略は、"デーモン" の実行戦略よりも _遅い_ です)。 Each [worker](https://docs.gradle.org/current/userguide/worker_api.html) creates a separate Kotlin compiler classloader for each compilation (各 [ワーカー](https://docs.gradle.org/current/userguide/worker_api.html) は、コンパイルごとに個別のKotlinコンパイラクラスローダーを作成します)。 |
| Out of process (アウトオブプロセス) | In a separate process for each compilation (コンパイルごとに個別のプロセス内) | No (いいえ)                      | The slowest execution strategy (最も遅い実行戦略)。 Similar to the "In process", but additionally creates a separate Java process within a Gradle worker for each compilation ("インプロセス" と同様ですが、コンパイルごとにGradleワーカー内に個別のJavaプロセスも作成します)。                                                                                                                     |

Kotlinコンパイラの実行戦略を定義するには、次のプロパティのいずれかを使用できます。
* `kotlin.compiler.execution.strategy` Gradle property (Gradleプロパティ)。
* `compilerExecutionStrategy` compile task property (コンパイルタスクプロパティ)。

タスクプロパティ `compilerExecutionStrategy` は、Gradleプロパティ `kotlin.compiler.execution.strategy` よりも優先されます。

`kotlin.compiler.execution.strategy` プロパティで使用できる値は次のとおりです。
1. `daemon` (default (デフォルト))
2. `in-process`
3. `out-of-process`

`gradle.properties` でGradleプロパティ `kotlin.compiler.execution.strategy` を使用します。

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` タスクプロパティで使用できる値は次のとおりです。
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (default (デフォルト))
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

ビルドスクリプトでタスクプロパティ `compilerExecutionStrategy` を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</TabItem>
</Tabs>

## Kotlin compiler fallback strategy (Kotlinコンパイラのフォールバック戦略)

Kotlinコンパイラのフォールバック戦略は、デーモンが何らかの理由で失敗した場合に、Kotlin daemon (Kotlinデーモン) の外でコンパイルを実行することです。
Gradle daemon (Gradleデーモン) がオンの場合、コンパイラは [「インプロセス」戦略](#defining-kotlin-compiler-execution-strategy) を使用します。
Gradle daemon (Gradleデーモン) がオフの場合、コンパイラは 「アウトオブプロセス」 戦略を使用します。

このフォールバックが発生すると、Gradleのビルド出力に次の警告行が表示されます。

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

ただし、別の戦略へのサイレントフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながる可能性があります。
これについて詳しくは、[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) を参照してください。
これを回避するために、Gradleプロパティ `kotlin.daemon.useFallbackStrategy` があり、デフォルト値は `true` です。
値が `false` の場合、デーモンの起動または通信に関する問題でビルドが失敗します。このプロパティを
`gradle.properties` で宣言します。

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlinコンパイルタスクには `useDaemonFallbackStrategy` プロパティもあり、両方を使用する場合はGradleプロパティよりも優先されます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</TabItem>
</Tabs>

コンパイルを実行するのに十分なメモリがない場合は、ログにその旨のメッセージが表示されます。

## Trying the latest language version (最新の言語バージョンの試用)

Kotlin 2.0.0以降では、最新の言語バージョンを試すには、 `gradle.properties`
ファイルで `kotlin.experimental.tryNext` プロパティを設定します。このプロパティを使用すると、Kotlin Gradle plugin (Kotlin Gradleプラグイン) は、言語バージョンをKotlinバージョンのデフォルト値よりも1つ上に増やします。
たとえば、Kotlin 2.0.0では、デフォルトの言語バージョンは2.0であるため、プロパティは
言語バージョン2.1を構成します。

または、次のコマンドを実行することもできます。

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

[build reports (ビルドレポート)](#build-reports) では、各タスクのコンパイルに使用された言語バージョンを確認できます。

## Build reports (ビルドレポート)

build reports (ビルドレポート) には、さまざまなコンパイルフェーズの期間と、コンパイルをインクリメンタルにできなかった理由が含まれています。
コンパイル時間が長すぎる場合、または同じ
プロジェクトで異なる場合は、build reports (ビルドレポート) を使用してパフォーマンスの問題を調査します。

Kotlin build reports (Kotlinビルドレポート) は、粒度の単位として単一のGradleタスクを持つ [Gradle build scans (Gradleビルドスキャン)](https://scans.gradle.com/) よりも効率的に、ビルドパフォーマンスの問題を調査するのに役立ちます。

実行時間の長いコンパイルのbuild reports (ビルドレポート) を分析することで解決できる2つの一般的なケースがあります。
* ビルドはインクリメンタルではありませんでした。理由を分析し、根本的な問題を修正します。
* ビルドはインクリメンタルでしたが、時間がかかりすぎました。ソースファイルを再編成してみてください — 大きなファイルを分割し、
  別々のクラスを別のファイルに保存し、大きなクラスをリファクタリングし、トップレベルの関数を別のファイルで宣言するなどします。

build reports (ビルドレポート) には、プロジェクトで使用されているKotlinバージョンも表示されます。さらに、Kotlin 1.9.0以降では、
[Gradle build scans (Gradleビルドスキャン)](https://scans.gradle.com/) でコードのコンパイルに使用されたコンパイラを確認できます。

[build reports (ビルドレポート) の読み方](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports) 
および [JetBrainsがbuild reports (ビルドレポート) をどのように使用しているか](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains) について学びます。

### Enabling build reports (ビルドレポートの有効化)

build reports (ビルドレポート) を有効にするには、build reports (ビルドレポート) 出力の保存場所を `gradle.properties` で宣言します。

```none
kotlin.build.report.output=file
```

次の値とその組み合わせを、出力に使用できます。

| Option (オプション) | Description (説明) |
|---|---|
| `file` | Saves build reports (ビルドレポート) in a human-readable format to a local file (人間が読める形式で、ビルドレポートをローカルファイルに保存します)。 By default, it's `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` (デフォルトでは、`${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` になります) |
| `single_file` | Saves build reports (ビルドレポート) in a format of an object to a specified local file (オブジェクト形式で、ビルドレポートを指定されたローカルファイルに保存します)。 |
| `build_scan` | Saves build reports (ビルドレポート) in the `custom values` section of the [build scan](https://scans.gradle.com/) ( [ビルドスキャン](https://scans.gradle.com/) の `custom values` セクションにビルドレポートを保存します)。 Note that the Gradle Enterprise plugin limits the number of custom values and their length (Gradle Enterpriseプラグインは、カスタム値の数とその長さを制限することに注意してください)。 In big projects, some values could be lost (大規模なプロジェクトでは、一部の値が失われる可能性があります)。 |
| `http` | Posts build reports (ビルドレポート) using HTTP(S) (HTTP(S)を使用してビルドレポートを送信します)。 The POST method sends metrics in JSON format (POSTメソッドは、JSON形式でメトリックを送信します)。 You can see the current version of the sent data in the [Kotlin repository](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) (送信されたデータの現在のバージョンは、 [Kotlinリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) で確認できます)。 You can find samples of HTTP endpoints in [this blog post](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) (HTTPエンドポイントのサンプルは、 [このブログ記事](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) で確認できます) |
| `json` | Saves build reports (ビルドレポート) in JSON format to a local file (JSON形式でビルドレポートをローカルファイルに保存します)。 Set the location for your build reports in `kotlin.build.report.json.directory` (see below) (ビルドレポートの場所を `kotlin.build.report.json.directory` で設定します (下記参照))。 By default, it's name is `${project_name}-build-<date-time>-<index>.json` (デフォルトでは、名前は `${project_name}-build-<date-time>-<index>.json` です)。 |

`kotlin.build.report` で使用可能なオプションのリストを次に示します。

```none
# Required outputs. Any combination is allowed (必須の出力。任意の組み合わせが許可されます)
kotlin.build.report.output=file,single_file,http,build_scan,json

# Mandatory if single_file output is used. Where to put reports (single_file出力を使用する場合に必須。レポートの配置場所)
# Use instead of the deprecated `kotlin.internal.single.build.metrics.file` property (非推奨の `kotlin.internal.single.build.metrics.file` プロパティの代わりに使用します)
kotlin.build.report.single_file=some_filename

# Mandatory if json output is used. Where to put reports (json出力を使用する場合に必須。レポートの配置場所)
kotlin.build.report.json.directory=my/directory/path

# Optional. Output directory for file-based reports. Default: build/reports/kotlin-build/ (オプション。ファイルベースのレポートの出力ディレクトリ。デフォルト: build/reports/kotlin-build/)
kotlin.build.report.file.output_dir=kotlin-reports

# Optional. Label for marking your build report (for example, debug parameters) (オプション。ビルドレポートをマークするためのラベル (デバッグパラメータなど))
kotlin.build.report.label=some_label
```

HTTPにのみ適用可能なオプション:

```none
# Mandatory. Where to post HTTP(S)-based reports (必須。HTTP(S)ベースのレポートの送信場所)
kotlin.build.report.http.url=http://127.0.0.1:8080

# Optional. User and password if the HTTP endpoint requires authentication (オプション。HTTPエンドポイントが認証を必要とする場合のユーザーとパスワード)
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# Optional. Add a Git branch name of a build to a build report (オプション。ビルドのGitブランチ名をビルドレポートに追加します)
kotlin.build.report.http.include_git_branch.name=true|false

# Optional. Add compiler arguments to a build report (オプション。コンパイラ引数をビルドレポートに追加します)
# If a project contains many modules, its compiler arguments in the report can be very heavy and not that helpful (プロジェクトに多くのモジュールが含まれている場合、レポート内のコンパイラ引数は非常に重く、役に立たない可能性があります)
kotlin.build.report.include_compiler_arguments=true|false
```

### Limit of custom values (カスタム値の制限)

build scans (ビルドスキャン) の統計を収集するために、Kotlin build reports (Kotlinビルドレポート) は [Gradle's custom values (Gradleのカスタム値)](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/) を使用します。
あなたとさまざまなGradleプラグインの両方が、カスタム値にデータを書き込むことができます。カスタム値の数には制限があります。
現在のカスタム値の最大数は、[Build scan plugin docs (ビルドスキャンプラグインのドキュメント)](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values) を参照してください。

大規模なプロジェクトの場合、このようなカスタム値の数はかなり大きくなる可能性があります。この数が制限を超えると、
ログに次のメッセージが表示されることがあります。

```text
Maximum number of custom values (1,000) exceeded
```

Kotlinプラグインが生成するカスタム値の数を減らすには、 `gradle.properties` で次のプロパティを使用できます。

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### Switching off collecting project and system properties (プロジェクトおよびシステムプロパティの収集をオフにする)

HTTPビルド統計ログには、一部のプロジェクトおよびシステムプロパティが含まれる場合があります。これらのプロパティはビルドの動作を変更する可能性があるため、
ビルド統計にログを記録すると便利です。
これらのプロパティは、パスワードやプロジェクトのフルパスなどの機密データを保存できます。

`kotlin.build.report.http.verbose_environment` プロパティを
`gradle.properties` に追加することで、これらの統計の収集を無効にできます。

:::note
JetBrainsはこれらの統計を収集しません。 [レポートの保存場所を選択します](#enabling-build-reports)。

:::

## What's next? (次はどうする？)

以下について詳しくは、こちらをご覧ください。
* [Gradle basics and specifics (Gradleの基本と詳細)](https://docs.gradle.org/current/userguide/userguide.html)。
* [Support for Gradle plugin variants (Gradleプラグインバリアントのサポート)](gradle-plugin-variants)。

  ```