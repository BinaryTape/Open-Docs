---
title: kaptコンパイラープラグイン
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
kapt はメンテナンスモードです。最新の Kotlin および Java のリリースに合わせて更新を続けていますが、
新機能を実装する予定はありません。アノテーション処理には、[Kotlin Symbol Processing API (KSP)](ksp-overview) を使用してください。
[KSP でサポートされているライブラリのリストを参照してください](ksp-overview#supported-libraries)。

アノテーション・プロセッサー（[JSR 269](https://jcp.org/en/jsr/detail?id=269)を参照）は、_kapt_ コンパイラープラグインによって Kotlin でサポートされています。

簡単に言うと、Kotlin プロジェクトで [Dagger](https://google.github.io/dagger/) や
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) などのライブラリを使用できます。

*kapt* プラグインを Gradle/Maven ビルドに適用する方法については、以下をお読みください。

## Gradle での使用

次の手順に従います。
1. `kotlin-kapt` Gradle プラグインを適用します。

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   plugins {
       kotlin("kapt") version "2.1.20"
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "2.1.20"
   }
   ```

   </TabItem>
   </Tabs>

2. `dependencies` ブロックで `kapt` 構成を使用して、それぞれの依存関係を追加します。

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </TabItem>
   </Tabs>

3. 以前にアノテーション・プロセッサーの [Android サポート](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)を使用していた場合は、`annotationProcessor` 構成の使用箇所を `kapt` に置き換えます。
   プロジェクトに Java クラスが含まれている場合、`kapt` はそれらも処理します。

   `androidTest` または `test` ソースのアノテーション・プロセッサーを使用している場合、それぞれの `kapt` 構成の名前は
   `kaptAndroidTest` および `kaptTest` になります。`kaptAndroidTest` と `kaptTest` は `kapt` を拡張するため、`kapt` 依存関係を提供するだけで、
   本番ソースとテストの両方で使用できることに注意してください。

## Kotlin K2 コンパイラーを試す

kapt コンパイラープラグインでの K2 のサポートは、[試験的](components-stability)です。オプトインが必要です（詳細は下記参照）。
評価目的でのみ使用してください。

Kotlin 1.9.20 以降では、[K2 コンパイラー](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/)で kapt コンパイラープラグインを使用できます。
これにより、パフォーマンスが向上し、他の多くの利点が得られます。Gradle プロジェクトで K2 コンパイラーを使用するには、次の
オプションを `gradle.properties` ファイルに追加します。

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

Maven プロジェクトで kapt プラグインを有効にするには、[](#use-in-maven)を参照してください。

:::

K2 コンパイラーで kapt を使用する際に問題が発生した場合は、
[課題追跡システム](http://kotl.in/issue)にご報告ください。

## アノテーション・プロセッサー引数

アノテーション・プロセッサーに引数を渡すには、`arguments {}` ブロックを使用します。

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle ビルドキャッシュのサポート

kapt アノテーション処理タスクは、デフォルトで [Gradle にキャッシュされます](https://guides.gradle.org/using-build-cache/)。
ただし、アノテーション・プロセッサーは、必ずしもタスク入力を出力に変換するとは限らない任意のコードを実行し、
Gradle で追跡されないファイルにアクセスして変更する可能性があります。ビルドで使用されているアノテーション・プロセッサーを
適切にキャッシュできない場合は、kapt タスクの誤検出キャッシュヒットを回避するために、次の行をビルドスクリプトに追加して、kapt のキャッシュを完全に無効にすることができます。

```groovy
kapt {
    useBuildCache = false
}
```

## kapt を使用するビルドの速度を向上させる

### kapt タスクを並行して実行する

kapt を使用するビルドの速度を向上させるには、kapt タスクに対して [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)を有効にすることができます。
Worker API を使用すると、Gradle は単一のプロジェクトから独立したアノテーション処理タスクを並行して実行できます。
場合によっては、実行時間が大幅に短縮されます。

Kotlin Gradle プラグインで [カスタム JDK ホーム](gradle-configure-project#gradle-java-toolchains-support)機能を使用すると、
kapt タスクワーカーは [プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)のみを使用します。
`kapt.workers.isolation` プロパティは無視されることに注意してください。

kapt ワーカープロセスに追加の JVM 引数を提供する場合は、`KaptWithoutKotlincTask` の入力 `kaptProcessJvmArgs` を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</TabItem>
</Tabs>

### アノテーション・プロセッサーのクラスローダーのキャッシュ

:::caution
kapt のアノテーション・プロセッサーのクラスローダーのキャッシュは [試験的](components-stability)です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) でフィードバックをお寄せください。

:::

アノテーション・プロセッサーのクラスローダーのキャッシュは、多くの Gradle タスクを連続して実行する場合に、kapt のパフォーマンス向上に役立ちます。

この機能を有効にするには、`gradle.properties` ファイルで次のプロパティを使用します。

```none
# 正の値を設定するとキャッシュが有効になります
# kapt を使用するモジュールの数と同じ値を使用します
kapt.classloaders.cache.size=5

# キャッシュを機能させるために無効にします
kapt.include.compile.classpath=false
```

アノテーション・プロセッサーのキャッシュで問題が発生した場合は、アノテーション・プロセッサーのキャッシュを無効にします。

```none
# キャッシュを無効にするアノテーション・プロセッサーの完全な名前を指定します
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### アノテーション・プロセッサーのパフォーマンスを測定する

`-Kapt-show-processor-timings` プラグインオプションを使用して、アノテーション・プロセッサーの実行に関するパフォーマンス統計を取得します。
出力例:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

プラグインオプション（[`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280)）を使用して、このレポートをファイルにダンプできます。
次のコマンドは、kapt を実行し、統計を `ap-perf-report.file` ファイルにダンプします。

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

### アノテーション・プロセッサーで生成されたファイルの数を測定する

`kotlin-kapt` Gradle プラグインは、各アノテーション・プロセッサーで生成されたファイルの数に関する統計を報告できます。

これは、ビルドの一部として未使用のアノテーション・プロセッサーがあるかどうかを追跡するのに役立ちます。
生成されたレポートを使用して、不要なアノテーション・プロセッサーをトリガーするモジュールを見つけ、モジュールを更新してそれを防ぐことができます。

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

> [コマンドラインオプション `verbose`](#use-in-cli)を使用して、詳細出力を有効にすることもできます。
>
> 

統計は、`info` レベルのログに表示されます。`Annotation processor stats:` という行が表示され、その後に
各アノテーション・プロセッサーの実行時間に関する統計が表示されます。これらの行の後に、`Generated files report:` という行が表示され、その後に
各アノテーション・プロセッサーで生成されたファイルの数に関する統計が表示されます。例：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kapt のコンパイル回避

kapt を使用したインクリメンタルビルドの時間を改善するために、Gradle [コンパイル回避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)を使用できます。
コンパイル回避を有効にすると、Gradle はプロジェクトを再構築するときにアノテーション処理をスキップできます。特に、アノテーション
処理は、次の場合にスキップされます。

* プロジェクトのソースファイルが変更されていない。
* 依存関係の変更が [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 互換である。
   たとえば、変更がメソッド本体のみである。

ただし、コンパイルクラスパスで検出されたアノテーション・プロセッサーでは、コンパイル回避を使用できません。
それらの _変更_ はすべて、アノテーション処理タスクの実行を必要とするためです。

コンパイル回避で kapt を実行するには：
* [上記](#use-in-gradle)で説明したように、アノテーション・プロセッサーの依存関係を `kapt*` 構成に手動で追加します。
* `gradle.properties` ファイルに次の行を追加して、コンパイルクラスパスでのアノテーション・プロセッサーの検出をオフにします。

```none
kapt.include.compile.classpath=false
```

## インクリメンタルアノテーション処理

kapt は、デフォルトで有効になっているインクリメンタルアノテーション処理をサポートしています。
現在、使用されているすべてのアノテーション・プロセッサーがインクリメンタルの場合にのみ、アノテーション処理をインクリメンタルにできます。

インクリメンタルアノテーション処理を無効にするには、`gradle.properties` ファイルに次の行を追加します。

```none
kapt.incremental.apt=false
```

インクリメンタルアノテーション処理では、[インクリメンタルコンパイル](gradle-compilation-and-caches#incremental-compilation)
も有効にする必要があることに注意してください。

## スーパー構成からアノテーション・プロセッサーを継承する

個別の Gradle 構成で共通のアノテーション・プロセッサーのセットを
スーパー構成として定義し、サブプロジェクトの kapt 固有の構成でさらに拡張できます。

例として、[Dagger](https://dagger.dev/) を使用するサブプロジェクトの場合、`build.gradle(.kts)` ファイルで、次の構成を使用します。

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle 構成は、すべてプロジェクトで使用するアノテーション処理の共通のスーパー構成です。
[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
メソッドを使用して、`commonAnnotationProcessors` をスーパー構成として追加します。kapt は、`commonAnnotationProcessors`
Gradle 構成が Dagger アノテーション・プロセッサーに依存していることを認識します。したがって、kapt は Dagger アノテーション・プロセッサーを
アノテーション処理の構成に含めます。
 
## Java コンパイラーオプション

kapt は Java コンパイラーを使用してアノテーション・プロセッサーを実行します。
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

一部のアノテーション・プロセッサー（`AutoFactory` など）は、宣言署名の正確な型に依存しています。
デフォルトでは、kapt は不明な型（生成されたクラスの型を含む）をすべて `NonExistentClass` に置き換えますが、
この動作を変更できます。`build.gradle(.kts)` ファイルにオプションを追加して、スタブのエラー型の推論を有効にします。

```groovy
kapt {
    correctErrorTypes = true
}
```

## Maven での使用

`compile` の前に、kotlin-maven-plugin からの `kapt` ゴールの実行を追加します。

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- You can skip the <goals> element 
        if you enable extensions for the plugin -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

アノテーション処理のレベルを構成するには、`<configuration>` ブロックで次のいずれかを `aptMode` として設定します。

   * `stubs` – アノテーション処理に必要なスタブのみを生成します。
   * `apt` – アノテーション処理のみを実行します。
   * `stubsAndApt` – （デフォルト）スタブを生成し、アノテーション処理を実行します。

例：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

K2 コンパイラーで kapt プラグインを有効にするには、`-Xuse-k2-kapt` コンパイラーオプションを追加します。

```xml
<configuration>
   ...
   <args>
      <arg>-Xuse-k2-kapt</arg>
   </args>
</configuration>
```

## IntelliJ ビルドシステムでの使用

kapt は、IntelliJ IDEA 独自のビルドシステムではサポートされていません。「Maven プロジェクト」
ツールバーからビルドを起動して、アノテーション処理を再実行してください。

## CLI での使用

kapt コンパイラープラグインは、Kotlin コンパイラーのバイナリ配布で利用できます。

`Xplugin` kotlinc オプションを使用して、その JAR ファイルへのパスを指定することで、プラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

利用可能なオプションのリストを次に示します。

* `sources` (*必須*): 生成されたファイルの出力パス。
* `classes` (*必須*): 生成されたクラスファイルとリソースの出力パス。
* `stubs` (*必須*): スタブファイルの出力パス。つまり、一時ディレクトリです。
* `incrementalData`: バイナリスタブの出力パス。
* `apclasspath` (*繰り返し可能*): アノテーション・プロセッサー JAR へのパス。JAR の数だけ多くの `apclasspath` オプションを渡します。
* `apoptions`: アノテーション・プロセッサーオプションの Base64 エンコードされたリスト。詳細については、[AP/javac オプションのエンコード](#ap-javac-options-encoding)を参照してください。
* `javacArguments`: javac に渡されるオプションの Base64 エンコードされたリスト。詳細については、[AP/javac オプションのエンコード](#ap-javac-options-encoding)を参照してください。
* `processors`: アノテーション・プロセッサーの完全修飾クラス名のカンマ区切りリスト。指定した場合、kapt は `apclasspath` でアノテーション・プロセッサーを検索しようとしません。
* `verbose`: 詳細出力を有効にします。
* `aptMode` (*必須*)
    * `stubs` – アノテーション処理に必要なスタブのみを生成します。
    * `apt` – アノテーション処理のみを実行します。
    * `stubsAndApt` – スタブを生成し、アノテーション処理を実行します。
* `correctErrorTypes`: 詳細については、[存在しない型の修正](#non-existent-type-correction)を参照してください。デフォルトでは無効になっています。
* `dumpFileReadHistory`: アノテーション処理中に使用されるクラスのリストをファイルごとにダンプする出力パス。

プラグインオプションの形式は、`-P plugin:<plugin id>:<key>=<value>` です。オプションは繰り返すことができます。

例：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Kotlin ソースを生成する

kapt は Kotlin ソースを生成できます。生成された Kotlin ソースファイルを `processingEnv.options["kapt.kotlin.generated"]` で指定されたディレクトリに書き込むだけで、
これらのファイルはメインソースとともにコンパイルされます。

kapt は、生成された Kotlin ファイルの複数ラウンドをサポートしていないことに注意してください。

## AP/Javac オプションのエンコード

`apoptions` および `javacArguments` CLI オプションは、エンコードされたオプションのマップを受け入れます。
オプションを自分でエンコードする方法を次に示します。

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

## Java コンパイラーのアノテーション・プロセッサーを保持する

デフォルトでは、kapt はすべてのアノテーション・プロセッサーを実行し、javac によるアノテーション処理を無効にします。
ただし、javac の一部のアノテーション・プロセッサーが動作している必要がある場合があります（たとえば、[Lombok](https://projectlombok.org/)）。

Gradle ビルドファイルで、オプション `keepJavacAnnotationProcessors` を使用します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Maven を使用する場合は、具体的なプラグイン設定を指定する必要があります。
[Lombok コンパイラープラグインの設定例](lombok#using-with-kapt)を参照してください。

  ```