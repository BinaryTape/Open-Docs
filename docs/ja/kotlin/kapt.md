[//]: # (title: kaptコンパイラープラグイン)

> kaptはメンテナンスモードです。最新のKotlinおよびJavaリリースに対応するよう更新を続けていますが、
> 新機能の実装予定はありません。アノテーション処理には[Kotlin Symbol Processing API (KSP)](ksp-overview.md)を使用してください。
> [KSPがサポートするライブラリのリストはこちらを参照してください](ksp-overview.md#supported-libraries)。
>
{style="warning"}

アノテーションプロセッサー（[JSR 269](https://jcp.org/en/jsr/detail?id=269)参照）は、Kotlinでは_kapt_コンパイラープラグインでサポートされています。

要するに、kaptはJavaベースのアノテーション処理を有効にすることで、[Dagger](https://google.github.io/dagger/)や
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html)といったライブラリを
Kotlinプロジェクトで使用できるようにします。

## Gradleでの使用

Gradleでkaptを使用するには、次の手順に従います。

1.  ビルドスクリプトファイル`build.gradle(.kts)`に`kapt` Gradleプラグインを適用します。

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

2.  `dependencies {}`ブロックで`kapt`構成を使用して、それぞれの依存関係を追加します。

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

3.  以前にアノテーションプロセッサーの[Androidサポート](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)を
    使用していた場合、`annotationProcessor`構成の使用を`kapt`に置き換えてください。
    プロジェクトにJavaクラスが含まれている場合、`kapt`もそれらを処理します。

    `androidTest`または`test`ソースにアノテーションプロセッサーを使用する場合、それぞれの`kapt`構成は
    `kaptAndroidTest`と`kaptTest`と命名されます。`kaptAndroidTest`と`kaptTest`は`kapt`を拡張しているため、
    `kapt`依存関係を提供すれば、プロダクションソースとテストの両方で利用可能になります。

## アノテーションプロセッサーの引数

アノテーションプロセッサーに引数を渡すには、ビルドスクリプトファイル`build.gradle(.kts)`の`arguments {}`ブロックを使用します。

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradleビルドキャッシュのサポート

kaptのアノテーション処理タスクは、デフォルトで[Gradleにキャッシュされます](https://guides.gradle.org/using-build-cache/)。
しかし、アノテーションプロセッサーは任意のコードを実行できるため、タスクの入力を出力に確実に変換しない可能性や、
Gradleが追跡しないファイルにアクセスし、変更する可能性があります。
ビルドで使用されるアノテーションプロセッサーが適切にキャッシュできない場合、
ビルドスクリプトで`useBuildCache`プロパティを指定することにより、kaptのキャッシュを完全に無効にできます。
これにより、kaptタスクの誤ったキャッシュヒットを防ぐのに役立ちます。

```groovy
kapt {
    useBuildCache = false
}
```

## kaptを使用するビルドの速度向上

### kaptタスクを並行して実行

kaptを使用するビルドの速度を向上させるには、kaptタスクの[Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)を有効にできます。
Worker APIを使用すると、Gradleは単一プロジェクト内の独立したアノテーション処理タスクを並行して実行できるため、
場合によっては実行時間を大幅に短縮します。

Kotlin Gradleプラグインの[カスタムJDKホーム](gradle-configure-project.md#gradle-java-toolchains-support)機能を使用する場合、
kaptタスクワーカーは[プロセス分離モード](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)のみを使用します。
`kapt.workers.isolation`プロパティは無視されることに注意してください。

kaptワーカプロセスに追加のJVM引数を提供したい場合は、`KaptWithoutKotlincTask`の入力`kaptProcessJvmArgs`を使用してください。

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

### アノテーションプロセッサーのクラスローダーのキャッシュ

<primary-label ref="experimental-general"/>

アノテーションプロセッサーのクラスローダーのキャッシュは、多数のGradleタスクを連続して実行する場合に、kaptのパフォーマンス向上に役立ちます。

この機能を有効にするには、`gradle.properties`ファイルで次のプロパティを使用します。

```none
# gradle.properties
#
# 正の値を指定するとキャッシュが有効になります
# kaptを使用するモジュールの数と同じ値を使用します
kapt.classloaders.cache.size=5

# キャッシュを有効にするには無効にします
kapt.include.compile.classpath=false
```

アノテーションプロセッサーのキャッシュで何らかの問題に遭遇した場合は、それらのキャッシュを無効にしてください。

```none
# キャッシュを無効にするアノテーションプロセッサーの完全名を指定します
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> この機能で問題が発生した場合は、
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)でフィードバックをいただけると幸いです。
>
{style="note"}

### アノテーションプロセッサーのパフォーマンス測定

アノテーションプロセッサーの実行に関するパフォーマンス統計を取得するには、`-Kapt-show-processor-timings`プラグインオプションを使用します。
出力例:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

このレポートは、プラグインオプション[`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280)を使用してファイルにダンプできます。
次のコマンドはkaptを実行し、統計を`ap-perf-report.file`ファイルにダンプします。

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

### アノテーションプロセッサーによって生成されたファイルの数を測定

`kapt` Gradleプラグインは、各アノテーションプロセッサーについて生成されたファイルの数に関する統計を報告できます。

これにより、ビルドに不要なアノテーションプロセッサーが含まれていないかを追跡するのに役立ちます。
生成されたレポートを使用して、不要なアノテーションプロセッサーをトリガーするモジュールを見つけ、それらを回避するようにモジュールを更新できます。

統計レポートを有効にするには:

1.  `build.gradle.kts)`で`showProcessorStats`プロパティの値を`true`に設定します。

    ```kotlin
    // build.gradle.kts
    kapt {
        showProcessorStats = true
    }
    ```

2.  `gradle.properties`で`kapt.verbose` Gradleプロパティを`true`に設定します。

    ```none
    # gradle.properties
    kapt.verbose=true
    ```

> [コマンドラインオプション`verbose`](#use-in-cli)でも詳細出力を有効にできます。
>
{style="note"}

統計は`info`レベルでログに表示されます。
`Annotation processor stats:`の行に続き、各アノテーションプロセッサーの実行時間の統計が表示されます。
これらの行の後に`Generated files report:`の行があり、各アノテーションプロセッサーによって生成されたファイルの数に関する統計が表示されます。例:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## kaptのコンパイル回避

kaptによるインクリメンタルビルドの時間を改善するため、Gradleの[コンパイル回避](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)を使用できます。
コンパイル回避が有効になっている場合、Gradleはプロジェクトを再構築する際にアノテーション処理をスキップできます。特に、アノテーション処理は次の場合にスキップされます。

*   プロジェクトのソースファイルが変更されていない場合。
*   依存関係の変更が[ABI](https://en.wikipedia.org/wiki/Application_binary_interface)互換である場合。
    たとえば、変更がメソッド本体のみである場合などです。

ただし、コンパイルクラスパスで検出されたアノテーションプロセッサーにはコンパイル回避を使用できません。これは、
それらの_どのような変更_であってもアノテーション処理タスクの実行を必要とするためです。

コンパイル回避を使用してkaptを実行するには:
*   [アノテーションプロセッサーの依存関係を`kapt*`構成に手動で追加します](#use-in-gradle)。
*   `gradle.properties`ファイルで、コンパイルクラスパス内のアノテーションプロセッサーの検出をオフにします。

    ```none
    # gradle.properties
    kapt.include.compile.classpath=false
    ```

## インクリメンタルアノテーション処理

kaptはデフォルトでインクリメンタルアノテーション処理をサポートしています。
現在、アノテーション処理は、使用されているすべてのアノテーションプロセッサーがインクリメンタルである場合にのみインクリメンタルにできます。

インクリメンタルアノテーション処理を無効にするには、`gradle.properties`ファイルに次の行を追加します。

```none
kapt.incremental.apt=false
```

インクリメンタルアノテーション処理には、[インクリメンタルコンパイル](gradle-compilation-and-caches.md#incremental-compilation)も有効になっている必要があることに注意してください。

## スーパー構成からアノテーションプロセッサーを継承

アノテーションプロセッサーの共通セットを別のGradle構成でスーパー構成として定義し、
サブプロジェクトの`kapt`固有の構成でさらに拡張することができます。

例として、[Dagger](https://dagger.dev/)を使用するサブプロジェクトの場合、`build.gradle(.kts)`ファイルで次の構成を使用します。

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle構成は、すべてのプロジェクトで使用したいアノテーション処理の共通スーパー構成です。
[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)メソッドを使用して、
`commonAnnotationProcessors`をスーパー構成として追加しています。
kaptは`commonAnnotationProcessors` Gradle構成がDaggerアノテーションプロセッサーへの依存関係を持っていることを認識します。
したがって、kaptはそのアノテーション処理の構成にDaggerアノテーションプロセッサーを含めます。

## Javaコンパイラーオプション

kaptはアノテーションプロセッサーを実行するためにJavaコンパイラーを使用します。
`javac`に任意のオプションを渡す方法は次のとおりです。

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

一部のアノテーションプロセッサー（`AutoFactory`など）は、宣言シグネチャにおける正確な型に依存します。
デフォルトでは、kaptは未知の型（生成されたクラスの型を含む）をすべて`NonExistentClass`に置き換えますが、この動作を変更できます。
スタブでのエラー型推論を有効にするには、`build.gradle(.kts)`ファイルにオプションを追加します。

```groovy
kapt {
    correctErrorTypes = true
}
```

## Mavenでの使用

`compile`の前にkotlin-maven-pluginの`kapt`ゴールの実行を追加します。

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

アノテーション処理のレベルを設定するには、`<configuration>`ブロックで次のいずれかを`aptMode`として設定します。

*   `stubs` – アノテーション処理に必要なスタブのみを生成します。
*   `apt` – アノテーション処理のみを実行します。
*   `stubsAndApt` – (デフォルト) スタブを生成し、アノテーション処理を実行します。

例:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## IntelliJビルドシステムでの使用

kaptはIntelliJ IDEA独自のビルドシステムではサポートされていません。
アノテーション処理を再実行したい場合はいつでも、「Mavenプロジェクト」ツールバーからビルドを実行してください。

## CLIでの使用

kaptコンパイラープラグインは、Kotlinコンパイラーのバイナリディストリビューションで利用可能です。

`Xplugin` kotlincオプションを使用して、JARファイルへのパスを指定することでプラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

利用可能なオプションのリストは次のとおりです。

*   `sources` (*必須*): 生成されたファイルの出力パス。
*   `classes` (*必須*): 生成されたクラスファイルとリソースの出力パス。
*   `stubs` (*必須*): スタブファイルの出力パス。つまり、一時ディレクトリ。
*   `incrementalData`: バイナリスタブの出力パス。
*   `apclasspath` (*繰り返し可能*): アノテーションプロセッサーJARへのパス。持っているJARの数だけ`apclasspath`オプションを渡してください。
*   `apoptions`: アノテーションプロセッサーオプションのbase64エンコードリスト。[AP/javacオプションのエンコーディング](#ap-javac-options-encoding)で詳細を参照してください。
*   `javacArguments`: `javac`に渡されるオプションのbase64エンコードリスト。[AP/javacオプションのエンコーディング](#ap-javac-options-encoding)で詳細を参照してください。
*   `processors`: アノテーションプロセッサーの完全修飾クラス名のカンマ区切りリスト。指定されている場合、kaptは`apclasspath`内のアノテーションプロセッサーを検索しようとしません。
*   `verbose`: 詳細出力を有効にします。
*   `aptMode` (*必須*)
    *   `stubs` – アノテーション処理に必要なスタブのみを生成します。
    *   `apt` – アノテーション処理のみを実行します。
    *   `stubsAndApt` – スタブを生成し、アノテーション処理を実行します。
*   `correctErrorTypes`: 詳細については、[存在しない型の修正](#non-existent-type-correction)を参照してください。デフォルトでは無効です。
*   `dumpFileReadHistory`: アノテーション処理中に使用されたクラスのリストを各ファイルに対してダンプするための出力パス。

プラグインオプションの形式は次のとおりです: `-P plugin:<plugin id>:<key>=<value>`。オプションは繰り返すことができます。

例:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Kotlinソースの生成

kaptはKotlinソースを生成できます。生成されたKotlinソースファイルを`processingEnv.options["kapt.kotlin.generated"]`で指定されたディレクトリに書き込むだけで、これらのファイルはメインソースと一緒にコンパイルされます。

kaptは生成されたKotlinファイルに対する複数ラウンドをサポートしていないことに注意してください。

## AP/Javacオプションのエンコーディング

`apoptions`および`javacArguments` CLIオプションは、エンコードされたオプションのマップを受け入れます。
自分でオプションをエンコードする方法は次のとおりです。

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

## Javaコンパイラーのアノテーションプロセッサーを保持する

デフォルトでは、kaptはすべてのアノテーションプロセッサーを実行し、`javac`によるアノテーション処理を無効にします。
しかし、`javac`のアノテーションプロセッサーの一部（例: [Lombok](https://projectlombok.org/)）が動作する必要があるかもしれません。

Gradleビルドファイルでは、`keepJavacAnnotationProcessors`オプションを使用します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Mavenを使用する場合、具体的なプラグイン設定を指定する必要があります。
[Lombokコンパイラープラグインの設定例](lombok.md#using-with-kapt)を参照してください。