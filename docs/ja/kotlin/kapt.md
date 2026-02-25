[//]: # (title: kapt コンパイラプラグイン)

> kaptはメンテナンスモードです。最新のKotlinおよびJavaリリースへの対応は継続していますが、新機能の実装予定はありません。アノテーション処理には[Kotlin Symbol Processing API (KSP)](ksp-overview.md)を使用してください。
> [KSPがサポートしているライブラリの一覧はこちら](ksp-overview.md#supported-libraries)をご覧ください。
>
{style="warning"}

アノテーションプロセッサ（[JSR 269](https://jcp.org/en/jsr/detail?id=269)参照）は、*kapt*コンパイラプラグインによってKotlinでサポートされています。

簡単に言うと、kaptはJavaベースのアノテーション処理を有効にすることで、[Dagger](https://google.github.io/dagger/)や[データバインディング](https://developer.android.com/topic/libraries/data-binding/index.html)などのライブラリをKotlinプロジェクトで使用できるようにします。

## Gradleでの使用

Gradleでkaptを使用するには、以下の手順に従ってください：

1. ビルドスクリプトファイル `build.gradle(.kts)` に `kapt` Gradleプラグインを適用します：

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

2. `dependencies {}` ブロックで `kapt` 構成を使用して、それぞれの依存関係を追加します：

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

3. 以前にアノテーションプロセッサに[Androidサポート](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)を使用していた場合は、`annotationProcessor` 構成の使用を `kapt` に置き換えてください。プロジェクトにJavaクラスが含まれている場合、`kapt` はそれらも処理します。

   `androidTest` または `test` ソースに対してアノテーションプロセッサを使用する場合、それぞれの `kapt` 構成は `kaptAndroidTest` および `kaptTest` という名前になります。`kaptAndroidTest` と `kaptTest` は `kapt` を継承しているため、`kapt` 依存関係を提供すれば、本番ソースとテストの両方で利用可能になります。

## アノテーションプロセッサの引数

ビルドスクリプトファイル `build.gradle(.kts)` の `arguments {}` ブロックを使用して、アノテーションプロセッサに引数を渡します：

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradleビルドキャッシュのサポート

kaptのアノテーション処理タスクは、デフォルトで[Gradleでキャッシュ](https://guides.gradle.org/using-build-cache/)されます。
しかし、アノテーションプロセッサは任意のコードを実行できるため、タスクの入力を出力に確実に変換できない場合や、Gradleが追跡していないファイルにアクセスして変更する場合があります。
ビルドで使用されるアノテーションプロセッサを適切にキャッシュできない場合は、ビルドスクリプトで `useBuildCache` プロパティを指定することで、kaptのキャッシュを完全に無効にできます。
これにより、kaptタスクに対する誤ったキャッシュヒット（false-positive cache hits）を防ぐことができます。

```groovy
kapt {
    useBuildCache = false
}
```

## kaptを使用するビルド速度の改善

### kaptタスクを並列で実行する

kaptを使用するビルドの速度を向上させるために、kaptタスクに対して [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/) を有効にできます。Worker APIを使用すると、Gradleは単一のプロジェクトから独立したアノテーション処理タスクを並列で実行でき、場合によっては実行時間を大幅に短縮できます。

Kotlin Gradleプラグインで[カスタムJDKホーム](gradle-configure-project.md#gradle-java-toolchains-support)機能を使用する場合、kaptタスクのワーカーは[プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)（process isolation mode）のみを使用します。`kapt.workers.isolation` プロパティは無視されることに注意してください。

kaptワーカープロセスに追加のJVM引数を提供したい場合は、`KaptWithoutKotlincTask` の入力 `kaptProcessJvmArgs` を使用します：

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

### アノテーションプロセッサのクラスローダーのキャッシュ

<primary-label ref="experimental-general"/>

アノテーションプロセッサのクラスローダーをキャッシュすることで、多くのGradleタスクを連続して実行する場合にkaptのパフォーマンスが向上します。

この機能を有効にするには、`gradle.properties` ファイルで以下のプロパティを使用します：

```none
# gradle.properties
#
# 正の値を指定するとキャッシュが有効になります
# kaptを使用するモジュール数と同じ値を使用してください
kapt.classloaders.cache.size=5

# キャッシュを機能させるためにfalseに設定します
kapt.include.compile.classpath=false
```

アノテーションプロセッサのキャッシュで問題が発生した場合は、それらのキャッシュを無効にしてください：

```none
# キャッシュを無効にするアノテーションプロセッサのフルネームを指定します
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> この機能に関する問題が発生した場合は、[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)までフィードバックをお寄せください。
> 
{style="note"}

### アノテーションプロセッサのパフォーマンス測定

アノテーションプロセッサの実行に関する統計情報を取得するには、`-Kapt-show-processor-timings` プラグインオプションを使用します。
出力例：

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

このレポートは、プラグインオプション [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280) を使用してファイルにダンプできます。
次のコマンドは、kaptを実行し、統計を `ap-perf-report.file` ファイルにダンプします：

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

### アノテーションプロセッサで生成されたファイル数の測定

`kapt` Gradleプラグインは、各アノテーションプロセッサによって生成されたファイル数に関する統計を報告できます。

これにより、未使用のアノテーションプロセッサがビルドに含まれていないかどうかを追跡できます。生成されたレポートを使用して、不要なアノテーションプロセッサをトリガーしているモジュールを見つけ、それを回避するようにモジュールを更新できます。

統計レポートを有効にするには：

1. `build.gradle(.kts)` で `showProcessorStats` プロパティの値を `true` に設定します：

   ```kotlin
   // build.gradle.kts
   kapt {
       showProcessorStats = true
   }
   ```

2. `gradle.properties` で `kapt.verbose` Gradleプロパティを `true` に設定します：

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

> [コマンドラインオプション `verbose`](#cliでの使用) を使用して詳細な出力を有効にすることもできます。
>
{style="note"}

統計は `info` レベルでログに表示されます。
`Annotation processor stats:` 行に続いて、各アノテーションプロセッサの実行時間に関する統計が表示されます。
それらの行の後に `Generated files report:` 行があり、各アノテーションプロセッサによって生成されたファイル数に関する統計が表示されます。例：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kaptのコンパイル回避

kaptを使用したインクリメンタルビルドの時間を短縮するために、Gradleの[コンパイル回避（compile avoidance）](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)を使用できます。
コンパイル回避が有効な場合、プロジェクトを再ビルドする際にGradleはアノテーション処理をスキップできます。特に、次の場合にアノテーション処理がスキップされます：

* プロジェクトのソースファイルが変更されていない場合。
* 依存関係の変更が [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 互換である場合（例：メソッドの本体のみが変更された場合）。

ただし、コンパイルクラスパスで見つかったアノテーションプロセッサに対してはコンパイル回避を使用できません。それらが「少しでも変更」されると、アノテーション処理タスクの実行が必要になるためです。

コンパイル回避を使用してkaptを実行するには：
* [アノテーションプロセッサの依存関係を `kapt*` 構成に手動で追加します](#gradleでの使用)。
* `gradle.properties` ファイルで、コンパイルクラスパスからのアノテーションプロセッサの検出をオフにします：

   ```none
   # gradle.properties
   kapt.include.compile.classpath=false
   ```

## インクリメンタルアノテーション処理

kaptはデフォルトでインクリメンタルアノテーション処理をサポートしています。
現在、アノテーション処理をインクリメンタルにできるのは、使用されているすべてのアノテーションプロセッサがインクリメンタルである場合のみです。

インクリメンタルアノテーション処理を無効にするには、`gradle.properties` ファイルに次の行を追加します：

```none
kapt.incremental.apt=false
```

インクリメンタルアノテーション処理には、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation)も有効になっている必要があることに注意してください。

## 親構成からのアノテーションプロセッサの継承

共通のアノテーションプロセッサのセットを別のGradle構成で親構成（superconfiguration）として定義し、それをサブプロジェクトのkapt固有の構成でさらに拡張できます。

例として、[Dagger](https://dagger.dev/)を使用するサブプロジェクトの場合、`build.gradle(.kts)` ファイルで次の構成を使用します：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle構成は、すべてのプロジェクトで使用したいアノテーション処理用の共通親構成です。[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) メソッドを使用して、`commonAnnotationProcessors` を親構成として追加します。kaptは、`commonAnnotationProcessors` Gradle構成がDaggerアノテーションプロセッサに依存していることを認識します。そのため、kaptはアノテーション処理のための自身の構成にDaggerアノテーションプロセッサを含めます。
 
## Javaコンパイラオプション

kaptはアノテーションプロセッサの実行にJavaコンパイラを使用します。
javacに任意のオプションを渡す方法は次のとおりです：

```groovy
kapt {
    javacOptions {
        // アノテーションプロセッサからのエラーの最大数を増やす。
        // デフォルトは100。
        option("-Xmaxerrs", 500)
    }
}
```

## 存在しない型の補正

一部のアノテーションプロセッサ（`AutoFactory` など）は、宣言シグネチャ内の正確な型に依存します。
デフォルトでは、kaptは未知の型（生成されたクラスの型を含む）をすべて `NonExistentClass` に置き換えますが、この動作を変更できます。スタブ内でのエラー型の推論を有効にするには、`build.gradle(.kts)` ファイルにオプションを追加します：

```groovy
kapt {
    correctErrorTypes = true
}
```

## Mavenでの使用

`compile` の前に kotlin-maven-plugin の `kapt` ゴールの実行を追加します：

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- プラグインの拡張を有効にしている場合は 
        <goals> 要素を省略できます -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- ここでアノテーションプロセッサを指定します -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

アノテーション処理のレベルを設定するには、`<configuration>` ブロックの `aptMode` として次のいずれかを設定します：

   * `stubs` – アノテーション処理に必要なスタブのみを生成します。
   * `apt` – アノテーション処理のみを実行します。
   * `stubsAndApt` – (デフォルト) スタブを生成し、アノテーション処理を実行します。

例：

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## IntelliJビルドシステムでの使用

kaptはIntelliJ IDEA独自のビルドシステムではサポートされていません。アノテーション処理を再実行したい場合は、いつでも「Maven Projects」ツールバーからビルドを起動してください。

## CLIでの使用

kaptコンパイラプラグインは、Kotlinコンパイラのバイナリ配布物に含まれています。

`Xplugin` kotlincオプションを使用してJARファイルへのパスを指定することで、プラグインをアタッチできます：

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

利用可能なオプションの一覧は次のとおりです：

* `sources` (*必須*): 生成されたファイルの出力パス。
* `classes` (*必須*): 生成されたクラスファイルとリソースの出力パス。
* `stubs` (*必須*): スタブファイルの出力パス。つまり、何らかの一時ディレクトリ。
* `incrementalData`: バイナリスタブの出力パス。
* `apclasspath` (*繰り返し可能*): アノテーションプロセッサJARへのパス。所有しているJARの数だけ `apclasspath` オプションを渡します。
* `apoptions`: アノテーションプロセッサオプションのbase64エンコードされたリスト。詳細は [AP/javacオプションのエンコーディング](#ap-javacオプションのエンコーディング) を参照してください。
* `javacArguments`: javacに渡されるオプションのbase64エンコードされたリスト。詳細は [AP/javacオプションのエンコーディング](#ap-javacオプションのエンコーディング) を参照してください。
* `processors`: アノテーションプロセッサの完全修飾クラス名のカンマ区切りリスト。指定された場合、kaptは `apclasspath` 内のアノテーションプロセッサを検索しません。
* `verbose`: 詳細な出力を有効にします。
* `aptMode` (*必須*)
    * `stubs` – アノテーション処理に必要なスタブのみを生成します。
    * `apt` – アノテーション処理のみを実行します。
    * `stubsAndApt` – スタブを生成し、アノテーション処理を実行します。
* `correctErrorTypes`: 詳細は [存在しない型の補正](#存在しない型の補正) を参照してください。デフォルトでは無効です。
* `dumpFileReadHistory`: アノテーション処理中に使用されたクラスのリストをファイルごとにダンプする出力パス。

プラグインオプションの形式は `-P plugin:<plugin id>:<key>=<value>` です。オプションは繰り返すことができます。

例：

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Kotlinソースの生成

kaptはKotlinソースを生成できます。生成されたKotlinソースファイルを `processingEnv.options["kapt.kotlin.generated"]` で指定されたディレクトリに書き込むだけで、これらのファイルはメインソースと一緒にコンパイルされます。

kaptは、生成されたKotlinファイルに対して複数ラウンドの処理をサポートしていないことに注意してください。

## AP/Javacオプションのエンコーディング

`apoptions` および `javacArguments` CLIオプションは、エンコードされたオプションのマップを受け取ります。
自分でオプションをエンコードする方法は次のとおりです：

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

## Javaコンパイラのアノテーションプロセッサを保持する

デフォルトでは、kaptはすべてのアノテーションプロセッサを実行し、javacによるアノテーション処理を無効にします。
しかし、javacのアノテーションプロセッサの一部を動作させる必要がある場合があります（例えば [Lombok](https://projectlombok.org/) など）。

Gradleビルドファイルで、`keepJavacAnnotationProcessors` オプションを使用します：

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Mavenを使用する場合は、具体的なプラグイン設定を指定する必要があります。
[Lombokコンパイラプラグインの設定例](lombok.md#using-with-kapt)を参照してください。