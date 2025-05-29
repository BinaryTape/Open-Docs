[//]: # (title: kapt コンパイラプラグイン)

> kapt はメンテナンスモードです。最新の Kotlin および Java リリースに対応するよう維持されていますが、
> 新機能の実装予定はありません。アノテーション処理には、[Kotlin Symbol Processing API (KSP)](ksp-overview.md) を使用してください。
> [KSP がサポートするライブラリのリストについてはこちら](ksp-overview.md#supported-libraries)を参照してください。
>
{style="warning"}

アノテーションプロセッサ ([JSR 269](https://jcp.org/en/jsr/detail?id=269) を参照) は、Kotlin で _kapt_ コンパイラプラグインを使用してサポートされています。

要するに、[Dagger](https://google.github.io/dagger/) や
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) といったライブラリを Kotlin プロジェクトで使用できます。

*kapt* プラグインを Gradle/Maven ビルドに適用する方法については、以下をお読みください。

## Gradle での使用

以下の手順に従います。
1. `kotlin-kapt` Gradle プラグインを適用します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }
   ```

   </tab>
   </tabs>

2. `dependencies` ブロックで `kapt` 設定を使用して、それぞれの依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </tab>
   </tabs>

3. 以前にアノテーションプロセッサに [Android サポート](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config) を使用していた場合は、`annotationProcessor` 設定の使用箇所を `kapt` に置き換えてください。
   プロジェクトに Java クラスが含まれている場合でも、`kapt` がそれらの処理も行います。

   `androidTest` または `test` ソースにアノテーションプロセッサを使用する場合、それぞれの `kapt` 設定は `kaptAndroidTest` および `kaptTest` と名付けられます。
   `kaptAndroidTest` と `kaptTest` は `kapt` を拡張するため、`kapt` 依存関係を指定するだけで、本番ソースとテストの両方で利用可能になります。

## Kotlin K2 コンパイラを試す

> kapt コンパイラプラグインの K2 サポートは [試験的](components-stability.md) です。オプトインが必要です (詳細については以下を参照)。
> 評価目的でのみ使用してください。
>
{style="warning"}

Kotlin 1.9.20 以降では、パフォーマンスの向上やその他の多くの利点をもたらす [K2 コンパイラ](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/) で kapt コンパイラプラグインを試すことができます。
Gradle プロジェクトで K2 コンパイラを使用するには、`gradle.properties` ファイルに以下のオプションを追加します。

```kotlin
kapt.use.k2=true
```

Maven ビルドシステムを使用する場合は、`pom.xml` ファイルを更新します。

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

> Maven プロジェクトで kapt プラグインを有効にするには、[](#use-in-maven) を参照してください。
>
{style="tip"}

K2 コンパイラで kapt の使用中に問題が発生した場合は、[issue tracker](http://kotl.in/issue) に報告してください。

## アノテーションプロセッサの引数

`arguments {}` ブロックを使用して、アノテーションプロセッサに引数を渡します。

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle ビルドキャッシュのサポート

kapt アノテーション処理タスクは、デフォルトで [Gradle にキャッシュされます](https://guides.gradle.org/using-build-cache/)。
ただし、アノテーションプロセッサは、必ずしもタスク入力を出力に変換するとは限らず、Gradle によって追跡されていないファイルにアクセスしたり変更したりする可能性のある任意のコードを実行します。
ビルドで使用されるアノテーションプロセッサを適切にキャッシュできない場合は、kapt タスクで誤ったキャッシュヒットを避けるために、ビルドスクリプトに以下の行を追加して kapt のキャッシュを完全に無効にすることが可能です。

```groovy
kapt {
    useBuildCache = false
}
```

## kapt を使用するビルドの速度を向上させる

### kapt タスクを並列で実行する

kapt を使用するビルドの速度を向上させるには、kapt タスクで [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/) を有効にできます。
Worker API を使用すると、Gradle は単一プロジェクト内の独立したアノテーション処理タスクを並列で実行でき、場合によっては実行時間を大幅に短縮できます。

Kotlin Gradle プラグインで [カスタム JDK ホーム](gradle-configure-project.md#gradle-java-toolchains-support) 機能を使用する場合、kapt タスクワーカーは [プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode) のみを使用します。
`kapt.workers.isolation` プロパティは無視されることに注意してください。

kapt ワーカープロセスに追加の JVM 引数を提供したい場合は、`KaptWithoutKotlincTask` の入力 `kaptProcessJvmArgs` を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### アノテーションプロセッサのクラスローダのキャッシュ

> kapt でのアノテーションプロセッサのクラスローダのキャッシュは [試験的](components-stability.md) です。
> これはいつでも廃止または変更される可能性があります。評価目的でのみ使用してください。
> これに関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) までお寄せください。
>
{style="warning"}

アノテーションプロセッサのクラスローダのキャッシュは、多くの Gradle タスクを連続して実行する場合に kapt のパフォーマンスを向上させます。

この機能を有効にするには、`gradle.properties` ファイルで以下のプロパティを使用します。

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

アノテーションプロセッサのキャッシュで問題が発生した場合は、それらのキャッシュを無効にしてください。

```none
# specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### アノテーションプロセッサのパフォーマンスを測定する

`-Kapt-show-processor-timings` プラグインオプションを使用して、アノテーションプロセッサの実行に関するパフォーマンス統計を取得します。
出力例:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

このレポートは、プラグインオプション [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) を使用してファイルにダンプできます。
以下のコマンドは kapt を実行し、統計を `ap-perf-report.file` ファイルにダンプします。

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### アノテーションプロセッサで生成されたファイルの数を測定する

`kotlin-kapt` Gradle プラグインは、各アノテーションプロセッサが生成したファイルの数に関する統計をレポートできます。

これは、ビルドの一部として未使用のアノテーションプロセッサがあるかどうかを追跡するのに役立ちます。
生成されたレポートを使用して、不要なアノテーションプロセッサをトリガーするモジュールを見つけ、それを防ぐためにモジュールを更新できます。

統計を有効にするには、次の 2 つの手順を実行します。
* `build.gradle(.kts)` で `showProcessorStats` フラグを `true` に設定します。

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* `gradle.properties` で `kapt.verbose` Gradle プロパティを `true` に設定します。

  ```none
  kapt.verbose=true
  ```

> コマンドラインオプション `verbose` を介して詳細出力を有効にすることもできます ([詳細はこちら](#use-in-cli))。
>
> {style="note"}

統計は `info` レベルでログに表示されます。
`Annotation processor stats:` の行に続いて、各アノテーションプロセッサの実行時間に関する統計が表示されます。
これらの行の後には `Generated files report:` の行が続き、各アノテーションプロセッサの生成ファイル数に関する統計が表示されます。
例:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt のコンパイル回避

kapt を使用したインクリメンタルビルドの時間を改善するために、Gradle の [コンパイル回避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance) を利用できます。
コンパイル回避が有効になっている場合、Gradle はプロジェクトを再ビルドする際にアノテーション処理をスキップできます。特に、アノテーション処理は次の場合にスキップされます。

* プロジェクトのソースファイルが変更されていない。
* 依存関係の変更が [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 互換である。
   例えば、変更がメソッド本体のみの場合など。

ただし、コンパイルクラスパスで検出されたアノテーションプロセッサにはコンパイル回避を使用できません。これは、それらの *いかなる変更* もアノテーション処理タスクの実行を必要とするためです。

kapt をコンパイル回避とともに実行するには:
* 上記の [Gradle での使用](#use-in-gradle) の説明に従って、アノテーションプロセッサの依存関係を `kapt*` 設定に手動で追加します。
* `gradle.properties` ファイルにこの行を追加して、コンパイルクラスパスでのアノテーションプロセッサの検出をオフにします。

```none
kapt.include.compile.classpath=false
```

## インクリメンタルアノテーション処理

kapt は、デフォルトで有効になっているインクリメンタルアノテーション処理をサポートしています。
現在、アノテーション処理は、使用されているすべてのアノテーションプロセッサがインクリメンタルである場合にのみインクリメンタルになります。

インクリメンタルアノテーション処理を無効にするには、`gradle.properties` ファイルにこの行を追加します。

```none
kapt.incremental.apt=false
```

インクリメンタルアノテーション処理には、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation) も有効になっている必要があることに注意してください。

## スーパ設定からのアノテーションプロセッサの継承

個別の Gradle 設定をスーパ設定として定義し、それをサブプロジェクトの kapt 固有の設定でさらに拡張して、アノテーションプロセッサの共通セットを定義できます。

例として、[Dagger](https://dagger.dev/) を使用するサブプロジェクトの場合、`build.gradle(.kts)` ファイルで以下の設定を使用します。

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle 設定は、すべてのプロジェクトで使用したい共通のアノテーション処理用スーパ設定です。
[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) メソッドを使用して `commonAnnotationProcessors` をスーパ設定として追加します。
kapt は `commonAnnotationProcessors` Gradle 設定が Dagger アノテーションプロセッサへの依存関係を持っていることを認識します。
したがって、kapt は Dagger アノテーションプロセッサをアノテーション処理用の設定に含めます。

## Java コンパイラオプション

kapt は Java コンパイラを使用してアノテーションプロセッサを実行します。
javac に任意のオプションを渡す方法は次のとおりです。

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## 存在しない型の修正

一部のアノテーションプロセッサ (`AutoFactory` など) は、宣言シグネチャにおける正確な型に依存しています。
デフォルトでは、kapt はすべての不明な型 (生成されたクラスの型を含む) を `NonExistentClass` に置き換えますが、この動作を変更できます。
スタブでのエラー型の推論を有効にするには、`build.gradle(.kts)` ファイルにオプションを追加します。

```groovy
kapt {
    correctErrorTypes = true
}
```

## Maven での使用

`kotlin-maven-plugin` の `kapt` ゴールの実行を `compile` の前に追加します。

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- プラグインの拡張機能を有効にしている場合、<goals> 要素はスキップできます -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- ここにアノテーションプロセッサを指定します -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

アノテーション処理のレベルを設定するには、`<configuration>` ブロックで以下のいずれかを `aptMode` として設定します。

   * `stubs` – アノテーション処理に必要なスタブのみを生成します。
   * `apt` – アノテーション処理のみを実行します。
   * `stubsAndApt` – (デフォルト) スタブを生成し、アノテーション処理を実行します。

例:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

K2 コンパイラで kapt プラグインを有効にするには、`-Xuse-k2-kapt` コンパイラオプションを追加します。

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## IntelliJ ビルドシステムでの使用

kapt は IntelliJ IDEA 独自のビルドシステムではサポートされていません。
アノテーション処理を再実行したい場合は、「Maven Projects」ツールバーからビルドを起動してください。

## CLI での使用

kapt コンパイラプラグインは、Kotlin コンパイラのバイナリ配布に含まれています。

`Xplugin` kotlinc オプションを使用して、JAR ファイルへのパスを指定することでプラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

利用可能なオプションのリストは次のとおりです。

* `sources` (*必須*): 生成されたファイルの出力パス。
* `classes` (*必須*): 生成されたクラスファイルとリソースの出力パス。
* `stubs` (*必須*): スタブファイルの出力パス。言い換えれば、一時ディレクトリ。
* `incrementalData`: バイナリスタブの出力パス。
* `apclasspath` (*繰り返し可能*): アノテーションプロセッサ JAR へのパス。必要な JAR の数だけ `apclasspath` オプションを渡します。
* `apoptions`: base64 エンコードされたアノテーションプロセッサオプションのリスト。詳細については、[AP/javac オプションのエンコード](#ap-javac-options-encoding) を参照してください。
* `javacArguments`: base64 エンコードされた javac に渡されるオプションのリスト。詳細については、[AP/javac オプションのエンコード](#ap-javac-options-encoding) を参照してください。
* `processors`: コンマ区切りのアノテーションプロセッサの完全修飾クラス名のリスト。指定されている場合、kapt は `apclasspath` でアノテーションプロセッサを検索しません。
* `verbose`: 詳細出力を有効にします。
* `aptMode` (*必須*)
    * `stubs` – アノテーション処理に必要なスタブのみを生成します。
    * `apt` – アノテーション処理のみを実行します。
    * `stubsAndApt` – スタブを生成し、アノテーション処理を実行します。
* `correctErrorTypes`: 詳細については、[存在しない型の修正](#non-existent-type-correction) を参照してください。デフォルトで無効になっています。
* `dumpFileReadHistory`: 各ファイルについて、アノテーション処理中に使用されたクラスのリストをダンプする出力パス。

プラグインオプションの形式は `-P plugin:<plugin id>:<key>=<value>` です。オプションは繰り返すことができます。

例:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Kotlin ソースの生成

kapt は Kotlin ソースを生成できます。生成された Kotlin ソースファイルを `processingEnv.options["kapt.kotlin.generated"]` で指定されたディレクトリに書き込むだけで、これらのファイルはメインソースとともにコンパイルされます。

kapt は、生成された Kotlin ファイルに対する複数ラウンドをサポートしていないことに注意してください。

## AP/Javac オプションのエンコード

`apoptions` および `javacArguments` CLI オプションは、エンコードされたオプションのマップを受け入れます。
オプションを自分でエンコードする方法は次のとおりです。

```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```

## Java コンパイラのアノテーションプロセッサを保持する

デフォルトでは、kapt はすべてのアノテーションプロセッサを実行し、javac によるアノテーション処理を無効にします。
ただし、javac のアノテーションプロセッサの一部 (例えば [Lombok](https://projectlombok.org/)) を機能させる必要がある場合があります。

Gradle ビルドファイルでは、`keepJavacAnnotationProcessors` オプションを使用します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven を使用する場合は、具体的なプラグイン設定を指定する必要があります。
[Lombok コンパイラプラグインの設定例](lombok.md#using-with-kapt) を参照してください。