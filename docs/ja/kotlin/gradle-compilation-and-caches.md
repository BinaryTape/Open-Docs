[//]: # (title: Kotlin Gradleプラグインにおけるコンパイルとキャッシュ)

このページでは、以下のトピックについて学習できます。
* [インクリメンタルコンパイル](#incremental-compilation)
* [Gradleビルドキャッシュのサポート](#gradle-build-cache-support)
* [Gradleコンフィグレーションキャッシュのサポート](#gradle-configuration-cache-support)
* [KotlinデーモンとGradleでの使用方法](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [以前のコンパイラへのロールバック](#rolling-back-to-the-previous-compiler)
* [Kotlinコンパイラ実行戦略の定義](#defining-kotlin-compiler-execution-strategy)
* [Kotlinコンパイラのフォールバック戦略](#kotlin-compiler-fallback-strategy)
* [最新の言語バージョンの試用](#trying-the-latest-language-version)
* [ビルドレポート](#build-reports)

## インクリメンタルコンパイル

Kotlin Gradleプラグインはインクリメンタルコンパイルをサポートしており、Kotlin/JVMおよびKotlin/JSプロジェクトではデフォルトで有効になっています。
インクリメンタルコンパイルは、ビルド間のクラスパス内のファイルの変更を追跡し、それらの変更によって影響を受けるファイルのみがコンパイルされるようにします。
このアプローチは[Gradleのビルドキャッシュ](#gradle-build-cache-support)と連携し、[コンパイル回避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)をサポートします。

Kotlin/JVMの場合、インクリメンタルコンパイルはクラスパススナップショットに依存しており、これはモジュールのAPI構造をキャプチャし、いつ再コンパイルが必要かを判断します。
全体的なパイプラインを最適化するため、Kotlinコンパイラは2種類のクラスパススナップショットを使用します。

*   **詳細スナップショット (Fine-grained snapshots)**: プロパティや関数などのクラスメンバーに関する詳細情報が含まれます。
    メンバーレベルの変更が検出されると、Kotlinコンパイラは変更されたメンバーに依存するクラスのみを再コンパイルします。
    パフォーマンスを維持するため、Kotlin GradleプラグインはGradleキャッシュ内の`.jar`ファイルに対して粗粒度スナップショットを作成します。
*   **粗粒度スナップショット (Coarse-grained snapshots)**: クラスの[ABI](https://en.wikipedia.org/wiki/Application_binary_interface)ハッシュのみが含まれます。
    ABIの一部が変更された場合、Kotlinコンパイラは変更されたクラスに依存するすべてのクラスを再コンパイルします。
    これは、外部ライブラリのように頻繁に変更されないクラスに役立ちます。

> Kotlin/JSプロジェクトは、履歴ファイルに基づいた異なるインクリメンタルコンパイルアプローチを使用します。
>
{style="note"}

インクリメンタルコンパイルを無効にする方法はいくつかあります。

*   Kotlin/JVMの場合、`kotlin.incremental=false`を設定します。
*   Kotlin/JSプロジェクトの場合、`kotlin.incremental.js=false`を設定します。
*   コマンドラインパラメータとして`-Pkotlin.incremental=false`または`-Pkotlin.incremental.js=false`を使用します。

    このパラメータは、それ以降の各ビルドに追加する必要があります。

インクリメンタルコンパイルを無効にすると、ビルド後にインクリメンタルキャッシュは無効になります。最初のビルドは常にインクリメンタルではありません。

> インクリメンタルコンパイルに関する問題は、問題が発生してから数回の実行後に明らかになることがあります。[ビルドレポート](#build-reports)を使用して、
> 変更履歴とコンパイル履歴を追跡してください。これにより、再現可能なバグレポートを提供できます。
>
{style="tip"}

現在のインクリメンタルコンパイルアプローチがどのように機能し、以前のものと比較してどう違うかについては、
[ブログ投稿](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)を参照してください。

## Gradleビルドキャッシュのサポート

Kotlinプラグインは[Gradleビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)を使用しており、これは
将来のビルドでの再利用のためにビルド出力を保存します。

すべてのKotlinタスクのキャッシュを無効にするには、システムプロパティ`kotlin.caching.enabled`を`false`に設定します
（引数`-Dkotlin.caching.enabled=false`を指定してビルドを実行します）。

## Gradleコンフィグレーションキャッシュのサポート

Kotlinプラグインは[Gradleコンフィグレーションキャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を使用しており、
これは以降のビルドのために設定フェーズの結果を再利用することで、ビルドプロセスを高速化します。

コンフィグレーションキャッシュを有効にする方法については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)を参照してください。この機能を有効にすると、Kotlin Gradleプラグインは自動的に使用を開始します。

## KotlinデーモンとGradleでの使用方法

[Kotlinデーモン](kotlin-daemon.md)は、以下の通りです。
*   プロジェクトをコンパイルするためにGradleデーモンとともに実行されます。
*   IntelliJ IDEA内蔵のビルドシステムでプロジェクトをコンパイルする場合、Gradleデーモンとは別に実行されます。

Kotlinデーモンは、Kotlinコンパイルタスクのいずれかがソースのコンパイルを開始したときに、Gradleの[実行ステージ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)で開始します。
Kotlinデーモンは、Gradleデーモンとともに停止するか、Kotlinコンパイルがない2時間のアイドル時間の後に停止します。

Kotlinデーモンは、Gradleデーモンが使用するのと同じJDKを使用します。

### KotlinデーモンのJVM引数の設定

以下の各引数設定方法は、それ以前の設定を上書きします。
*   [Gradleデーモン引数の継承](#gradle-daemon-arguments-inheritance)
*   [`kotlin.daemon.jvm.options`システムプロパティ](#kotlin-daemon-jvm-options-system-property)
*   [`kotlin.daemon.jvmargs`プロパティ](#kotlin-daemon-jvmargs-property)
*   [`kotlin`エクステンション](#kotlin-extension)
*   [特定のタスク定義](#specific-task-definition)

#### Gradleデーモン引数の継承

デフォルトでは、KotlinデーモンはGradleデーモンから特定の引数セットを継承しますが、Kotlinデーモンに直接指定されたJVM引数でそれらを上書きします。例えば、`gradle.properties`ファイルに以下のJVM引数を追加した場合：

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

これらの引数は、KotlinデーモンのJVM引数に追加されます。

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> KotlinデーモンのJVM引数に関するデフォルトの動作の詳細については、[KotlinデーモンのJVM引数に関する動作](#kotlin-daemon-s-behavior-with-jvm-arguments)を参照してください。
>
{style="note"}

#### kotlin.daemon.jvm.optionsシステムプロパティ

GradleデーモンのJVM引数に`kotlin.daemon.jvm.options`システムプロパティがある場合、`gradle.properties`ファイルでそれを使用します。

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
```

引数を渡す際は、以下のルールに従ってください。
*   `Xmx`、`XX:MaxMetaspaceSize`、`XX:ReservedCodeCacheSize`の引数の前に**のみ**マイナス記号`-`を使用します。
*   引数はスペース**なし**でカンマ (`,`) で区切ります。スペースの後に続く引数はKotlinデーモンではなく、Gradleデーモンで使用されます。

> 以下の条件がすべて満たされている場合、Gradleはこれらのプロパティを無視します。
> *   GradleがJDK 1.9以上を使用している。
> *   Gradleのバージョンが7.0以上7.1.1以下である。
> *   GradleがKotlin DSLスクリプトをコンパイルしている。
> *   Kotlinデーモンが実行されていない。
>
> これを回避するには、Gradleをバージョン7.2（またはそれ以降）にアップグレードするか、`kotlin.daemon.jvmargs`プロパティを使用してください — 次のセクションを参照してください。
>
{style="warning"}

#### kotlin.daemon.jvmargsプロパティ

`gradle.properties`ファイルに`kotlin.daemon.jvmargs`プロパティを追加できます。

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

ここでまたはGradleのJVM引数で`ReservedCodeCacheSize`引数を指定しない場合、Kotlin Gradleプラグインはデフォルト値の`320m`を適用することに注意してください。

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
```

#### kotlinエクステンション

`kotlin`エクステンションで引数を指定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### 特定のタスク定義

特定のタスクの引数を指定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon).configureEach { task ->
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
}
```

</tab>
</tabs>

> この場合、タスクの実行時に新しいKotlinデーモンインスタンスが開始される可能性があります。[KotlinデーモンのJVM引数に関する動作](#kotlin-daemon-s-behavior-with-jvm-arguments)について詳しく学習してください。
>
{style="note"}

### KotlinデーモンのJVM引数に関する動作

KotlinデーモンのJVM引数を設定する際、以下の点に注意してください。

*   異なるサブプロジェクトやタスクが異なるJVM引数セットを持つ場合、複数のKotlinデーモンインスタンスが同時に実行されることが想定されます。
*   新しいKotlinデーモンインスタンスは、Gradleが関連するコンパイルタスクを実行し、既存のKotlinデーモンが同じJVM引数セットを持っていない場合にのみ開始されます。
    プロジェクトに多くのサブプロジェクトがあると想像してください。それらのほとんどはKotlinデーモンに必要なヒープメモリを必要としますが、1つのモジュールは多くのヒープメモリを必要とします（ただし、滅多にコンパイルされません）。
    この場合、そのようなモジュールには異なるJVM引数セットを提供すべきです。そうすれば、より大きなヒープサイズを持つKotlinデーモンは、この特定のモジュールに手を加える開発者のみに対して起動します。
    > コンパイルリクエストを処理するのに十分なヒープサイズを持つKotlinデーモンが既に実行されている場合、他のJVM引数が異なっていても、新しいデーモンを開始する代わりにこのデーモンが再利用されます。
    >
    {style="note"}

以下の引数が指定されていない場合、KotlinデーモンはGradleデーモンからそれらを継承します。

*   `-Xmx`
*   `-XX:MaxMetaspaceSize`
*   `-XX:ReservedCodeCacheSize`。指定または継承されていない場合、デフォルト値は`320m`です。

Kotlinデーモンには以下のデフォルトJVM引数があります。
*   `-XX:UseParallelGC`。この引数は、他のガベージコレクタが指定されていない場合にのみ適用されます。
*   `-ea`
*   `-XX:+UseCodeCacheFlushing`
*   `-Djava.awt.headless=true`
*   `-D{java.servername.property}={localhostip}`
*   `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`。この引数は、JDKバージョン16以降にのみ適用されます。

> KotlinデーモンのデフォルトJVM引数のリストは、バージョン間で異なる場合があります。[VisualVM](https://visualvm.github.io/)のようなツールを使用して、Kotlinデーモンなどの実行中のJVMプロセスの実際の`設定を確認できます。
>
{style="note"}

## 以前のコンパイラへのロールバック

Kotlin 2.0.0以降、K2コンパイラがデフォルトで使用されます。

Kotlin 2.0.0以降で以前のコンパイラを使用するには、以下のいずれかを実行します。

*   `build.gradle.kts`ファイルで、[言語バージョンを設定](gradle-compiler-options.md#example-of-setting-languageversion)して`1.9`にします。

    または
*   以下のコンパイラオプションを使用します：`-language-version 1.9`。

K2コンパイラの利点の詳細については、[K2コンパイラ移行ガイド](k2-compiler-migration-guide.md)を参照してください。

## Kotlinコンパイラ実行戦略の定義

_Kotlinコンパイラ実行戦略_は、Kotlinコンパイラがどこで実行されるか、そして各ケースでインクリメンタルコンパイルがサポートされるかどうかを定義します。

コンパイラ実行戦略は3つあります。

| 戦略              | Kotlinコンパイラの実行場所 | インクリメンタルコンパイル | その他の特性と注意点                                                                                                                                                                                                                                                                           |
|-------------------|----------------------------|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Kotlinデーモン  | 独自のデーモンプロセス内     | あり                       | _デフォルトかつ最速の戦略_。異なるGradleデーモン間や複数の並行コンパイルで共有できます。                                                                                                                                                         |
| In process        | Gradleデーモンプロセス内     | なし                       | Gradleデーモンとヒープを共有する場合があります。「インプロセス」実行戦略は「デーモン」実行戦略よりも_低速_です。各[ワーカー](https://docs.gradle.org/current/userguide/worker_api.html)は、コンパイルごとに個別のKotlinコンパイラクラスローダーを作成します。 |
| Out of process    | コンパイルごとに別プロセス | なし                       | 最も低速な実行戦略です。「インプロセス」に似ていますが、さらに各コンパイルごとにGradleワーカー内に個別のJavaプロセスを作成します。                                                                                                                     |

Kotlinコンパイラ実行戦略を定義するには、以下のいずれかのプロパティを使用できます。
*   `kotlin.compiler.execution.strategy` Gradleプロパティ。
*   `compilerExecutionStrategy`コンパイルタスクプロパティ。

タスクプロパティ`compilerExecutionStrategy`は、Gradleプロパティ`kotlin.compiler.execution.strategy`よりも優先されます。

`kotlin.compiler.execution.strategy`プロパティに使用できる値は以下の通りです。
1.  `daemon` (デフォルト)
2.  `in-process`
3.  `out-of-process`

`gradle.properties`でGradleプロパティ`kotlin.compiler.execution.strategy`を使用します。

```none
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy`タスクプロパティに使用できる値は以下の通りです。
1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (デフォルト)
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

ビルドスクリプトでタスクプロパティ`compilerExecutionStrategy`を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
    }
```

</tab>
</tabs>

## Kotlinコンパイラのフォールバック戦略

Kotlinコンパイラのフォールバック戦略は、デーモンが何らかの形で失敗した場合に、Kotlinデーモン外でコンパイルを実行することです。
Gradleデーモンがオンの場合、コンパイラは[「In process」戦略](#defining-kotlin-compiler-execution-strategy)を使用します。
Gradleデーモンがオフの場合、コンパイラは「Out of process」戦略を使用します。

このフォールバックが発生した場合、Gradleのビルド出力に以下の警告行が表示されます。

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

しかし、別の戦略へのサイレントフォールバックは、多くのシステムリソースを消費したり、非決定的なビルドにつながる可能性があります。
これについては、この[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)で詳しく読むことができます。
これを回避するため、Gradleプロパティ`kotlin.daemon.useFallbackStrategy`があり、そのデフォルト値は`true`です。
値が`false`の場合、デーモンの起動または通信に問題があるビルドは失敗します。このプロパティを`gradle.properties`で宣言します。

```none
kotlin.daemon.useFallbackStrategy=false
```

Kotlinコンパイルタスクには`useDaemonFallbackStrategy`プロパティもあり、両方を使用する場合はGradleプロパティよりも優先されます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</tab>
</tabs>

コンパイルを実行するためのメモリが不足している場合、ログにその旨のメッセージが表示されます。

## 最新の言語バージョンの試用

Kotlin 2.0.0以降、最新の言語バージョンを試すには、`gradle.properties`ファイルで`kotlin.experimental.tryNext`プロパティを設定します。
このプロパティを使用すると、Kotlin Gradleプラグインは、使用しているKotlinバージョンのデフォルト値よりも1つ高い言語バージョンに引き上げます。
例えば、Kotlin 2.0.0ではデフォルトの言語バージョンは2.0ですが、このプロパティは言語バージョン2.1を設定します。

または、以下のコマンドを実行できます。

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

[ビルドレポート](#build-reports)では、各タスクのコンパイルに使用された言語バージョンを確認できます。

## ビルドレポート

ビルドレポートには、異なるコンパイルフェーズの所要時間と、コンパイルがインクリメンタルでなかった理由が含まれています。
ビルドレポートを使用して、コンパイル時間が長すぎる場合や、同じプロジェクトでも時間が異なる場合に、パフォーマンスの問題を調査してください。

Kotlinビルドレポートは、単一のGradleタスクを粒度単位とする[Gradleビルドスキャン](https://scans.gradle.com/)よりも効率的にビルドパフォーマンスの問題を調査するのに役立ちます。

ビルドレポートを分析することで解決できる、時間がかかるコンパイルに関する一般的なケースが2つあります。
*   ビルドがインクリメンタルではなかった。原因を分析し、根本的な問題を修正してください。
*   ビルドはインクリメンタルだったが、時間がかかりすぎた。ソースファイルを再編成してみてください — 大きなファイルを分割する、別々のクラスを異なるファイルに保存する、大きなクラスをリファクタリングする、トップレベル関数を異なるファイルで宣言するなど。

ビルドレポートには、プロジェクトで使用されているKotlinバージョンも表示されます。さらに、Kotlin 1.9.0以降では、
[Gradleビルドスキャン](https://scans.gradle.com/)で、コードのコンパイルにどのコンパイラが使用されたかを確認できます。

[ビルドレポートの読み方](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)と、[JetBrainsがビルドレポートをどのように使用しているか](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains)について詳しく学習してください。

### ビルドレポートの有効化

ビルドレポートを有効にするには、`gradle.properties`でビルドレポートの出力先を宣言します。

```none
kotlin.build.report.output=file
```

出力には、以下の値とその組み合わせが使用できます。

| オプション        | 説明                                                                                                                                                                                                       |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`            | ビルドレポートを人間が判読可能な形式でローカルファイルに保存します。デフォルトは`${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`です。                                                    |
| `single_file`     | ビルドレポートをオブジェクト形式で指定されたローカルファイルに保存します。                                                                                                                                          |
| `build_scan`      | ビルドレポートを[ビルドスキャン](https://scans.gradle.com/)の`custom values`セクションに保存します。Gradle Enterpriseプラグインはカスタム値の数とその長さを制限することに注意してください。大規模なプロジェクトでは、一部の値が失われる可能性があります。 |
| `http`            | HTTP(S)を使用してビルドレポートをPOSTします。POSTメソッドはJSON形式でメトリクスを送信します。送信されるデータの現在のバージョンは[Kotlinリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)で確認できます。HTTPエンドポイントのサンプルは[このブログ投稿](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports)で確認できます。 |
| `json`            | ビルドレポートをJSON形式でローカルファイルに保存します。ビルドレポートの場所は`kotlin.build.report.json.directory`で設定します（以下参照）。デフォルトでは、名前は`${project_name}-build-<date-time>-<index>.json`です。 |

`kotlin.build.report`で利用可能なオプションのリストを以下に示します。

```none
# 必須の出力先。任意の組み合わせが可能です
kotlin.build.report.output=file,single_file,http,build_scan,json

# single_file出力を使用する場合、必須です。レポートの保存先
# 非推奨の`kotlin.internal.single.build.metrics.file`プロパティの代わりに使用してください
kotlin.build.report.single_file=some_filename

# json出力を使用する場合、必須です。レポートの保存先
kotlin.build.report.json.directory=my/directory/path

# オプション。ファイルベースレポートの出力ディレクトリ。デフォルト：build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# オプション。ビルドレポートにマークを付けるためのラベル（例：デバッグパラメータ）
kotlin.build.report.label=some_label
```

HTTPにのみ適用されるオプション：

```none
# 必須。HTTP(S)ベースのレポートを投稿する場所
kotlin.build.report.http.url=http://127.0.0.1:8080

# オプション。HTTPエンドポイントが認証を必要とする場合のユーザー名とパスワード
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# オプション。ビルドのGitブランチ名をビルドレポートに追加します
kotlin.build.report.http.include_git_branch.name=true|false

# オプション。コンパイラ引数をビルドレポートに追加します
# プロジェクトに多くのモジュールが含まれている場合、レポート内のコンパイラ引数は非常に重くなり、あまり役に立たない場合があります
kotlin.build.report.include_compiler_arguments=true|false
```

### カスタム値の制限

ビルドスキャンの統計を収集するために、Kotlinビルドレポートは[Gradleのカスタム値](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/)を使用します。
あなたとさまざまなGradleプラグインはカスタム値にデータを書き込むことができます。カスタム値の数には制限があります。
現在の最大カスタム値数は、[Build scan plugin docs](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values)で確認してください。

大規模なプロジェクトでは、そのようなカスタム値の数が非常に多くなる場合があります。この数が制限を超えると、ログに以下のメッセージが表示されます。

```text
Maximum number of custom values (1,000) exceeded
```

Kotlinプラグインが生成するカスタム値の数を減らすには、`gradle.properties`で以下のプロパティを使用します。

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### プロジェクトおよびシステムプロパティの収集をオフにする

HTTPビルド統計ログには、一部のプロジェクトおよびシステムプロパティが含まれる場合があります。これらのプロパティはビルドの動作を変更する可能性があるため、ビルド統計にログを記録することは有用です。
これらのプロパティは、パスワードやプロジェクトのフルパスなど、機密データを保存する可能性があります。

これらの統計の収集は、`kotlin.build.report.http.verbose_environment`プロパティを`gradle.properties`に追加することで無効にできます。

> JetBrainsはこれらの統計を収集しません。レポートの保存場所は[こちら](#enabling-build-reports)で選択できます。
>
{style="note"}

## 次のステップ

以下について詳しく学習してください。
*   [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
*   [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。