[//]: # (title: Gradleプロジェクトを構成する)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) を使用してKotlinプロジェクトをビルドするには、ビルドスクリプトファイル `build.gradle(.kts)` に[Kotlin Gradleプラグインを追加](#apply-the-plugin)し、そこでプロジェクトの[依存関係を構成](#configure-dependencies)する必要があります。

> ビルドスクリプトの内容についてさらに学ぶには、
> [「ビルドスクリプトを探索する」](get-started-with-jvm-gradle-project.md#explore-the-build-script)セクションを参照してください。
>
{style="note"}

## プラグインを適用する

Kotlin Gradleプラグインを適用するには、GradleプラグインDSLの [`plugins{}` ブロック](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "%kotlinVersion%"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}
```

</tab>
</tabs>

> Kotlin Gradleプラグイン (KGP) とKotlinは同じバージョン番号を共有します。
>
{style="note"}

プロジェクトを構成する際、Kotlin Gradleプラグイン (KGP) と利用可能なGradleバージョンの互換性を確認してください。以下の表に、GradleとAndroid Gradleプラグイン (AGP) の最小および最大**完全にサポートされている**バージョンを示します。

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.2.0         | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
| 2.1.20–2.1.21 | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         |
| 2.1.0–2.1.10  | 7.6.3–8.10*                           | 7.3.1–8.7.2                                         |
| 2.0.20–2.0.21 | 6.8.3–8.8*                            | 7.1.3–8.5                                           |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |      
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |   
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |

> *Kotlin 2.0.20–2.0.21およびKotlin 2.1.0–2.1.10は、Gradle 8.6まで完全に互換性があります。
> Gradleバージョン8.7–8.10もサポートされていますが、1つだけ例外があります。Kotlin Multiplatform Gradleプラグインを使用している場合、
> JVMターゲットで`withJava()`関数を呼び出すマルチプラットフォームプロジェクトで非推奨の警告が表示されることがあります。
> 詳細については、[デフォルトで作成されるJavaソースセット](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)を参照してください。
>
{style="warning"}

GradleおよびAGPバージョンは最新リリースまで使用できますが、その場合、非推奨の警告に遭遇したり、一部の新機能が動作しない可能性があることに留意してください。

例えば、Kotlin Gradleプラグインおよび`kotlin-multiplatform`プラグイン %kotlinVersion% は、プロジェクトをコンパイルするために最低限のGradleバージョンとして %minGradleVersion% を必要とします。

同様に、最大の完全にサポートされているバージョンは %maxGradleVersion% です。これは非推奨のGradleメソッドやプロパティを持たず、現在のすべてのGradle機能をサポートしています。

### プロジェクト内のKotlin Gradleプラグインデータ

デフォルトでは、Kotlin Gradleプラグインは永続的なプロジェクト固有のデータをプロジェクトのルートにある`.kotlin`ディレクトリに保存します。

> `.kotlin`ディレクトリをバージョン管理にコミットしないでください。
> 例えば、Gitを使用している場合、プロジェクトの`.gitignore`ファイルに`.kotlin`を追加してください。
>
{style="warning"}

この動作を構成するために、プロジェクトの`gradle.properties`ファイルに追加できるプロパティがあります。

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | プロジェクトレベルのデータが保存される場所を構成します。デフォルト: `<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle`ディレクトリへのKotlinデータの書き込みを無効にするかどうかを制御します（古いIDEAバージョンとの下位互換性のため）。デフォルト: false |

## JVMをターゲットにする

JVMをターゲットにするには、Kotlin JVMプラグインを適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

このブロックの`version`はリテラルであるべきであり、他のビルドスクリプトから適用することはできません。

### KotlinとJavaのソース

KotlinソースとJavaソースは同じディレクトリに保存することも、異なるディレクトリに配置することもできます。

デフォルトの規約では、異なるディレクトリを使用します。

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> `src/*/kotlin`ディレクトリにJavaの`.java`ファイルを保存しないでください。`.java`ファイルはコンパイルされません。
> 
> 代わりに、`src/main/java`を使用できます。
>
{style="warning"} 

デフォルトの規約を使用しない場合、対応する`sourceSets`プロパティを更新する必要があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</tab>
</tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 関連するコンパイルタスクのJVMターゲット互換性の確認

ビルドモジュールには、関連するコンパイルタスクがある場合があります。例えば、次のとおりです。
* `compileKotlin` と `compileJava`
* `compileTestKotlin` と `compileTestJava`

> `main`と`test`ソースセットのコンパイルタスクは関連していません。
>
{style="note"}

このような関連するタスクの場合、Kotlin GradleプラグインはJVMターゲットの互換性をチェックします。`kotlin`拡張またはタスクの [`jvmTarget`属性](gradle-compiler-options.md#attributes-specific-to-jvm)と、`java`拡張またはタスクの [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)の値が異なる場合、JVMターゲットの非互換性が発生します。例えば、`compileKotlin`タスクに`jvmTarget=1.8`があり、`compileJava`タスクに`targetCompatibility=15`がある（または[継承している](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）場合などです。

このチェックの動作をプロジェクト全体に対して構成するには、`gradle.properties`ファイルで`kotlin.jvm.target.validation.mode`プロパティを次のように設定します。

* `error` – プラグインがビルドを失敗させます。Gradle 8.0+のプロジェクトのデフォルト値です。
* `warning` – プラグインが警告メッセージを出力します。Gradle 8.0未満のプロジェクトのデフォルト値です。
* `ignore` – プラグインがチェックをスキップし、メッセージを出力しません。

`build.gradle(.kts)`ファイルでタスクレベルで構成することもできます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>

JVMターゲットの非互換性を避けるには、[ツールチェーンを構成](#gradle-java-toolchains-support)するか、JVMバージョンを手動で調整します。

#### ターゲットに互換性がない場合に発生しうる問題 {initial-collapse-state="collapsed" collapsible="true"}

KotlinおよびJavaソースセットのJVMターゲットを手動で設定する方法は2つあります。
* [Javaツールチェーンを設定する](#gradle-java-toolchains-support)ことによる暗黙的な方法。
* `kotlin`拡張またはタスクで`jvmTarget`属性を、`java`拡張またはタスクで`targetCompatibility`を明示的に設定することによる方法。

JVMターゲットの非互換性は、次の場合に発生します。
* `jvmTarget`と`targetCompatibility`に異なる値を明示的に設定した場合。
* デフォルト設定で、JDKが`1.8`と等しくない場合。

ビルドスクリプトにKotlin JVMプラグインのみがあり、JVMターゲットに対する追加設定がない場合のJVMターゲットのデフォルト設定を考えてみましょう。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

ビルドスクリプトに`jvmTarget`値に関する明示的な情報がない場合、そのデフォルト値は`null`であり、コンパイラはそれをデフォルト値`1.8`に変換します。`targetCompatibility`は現在のGradleのJDKバージョンと等しく、これはあなたのJDKバージョンと等しくなります（[Javaツールチェーンアプローチ](gradle-configure-project.md#gradle-java-toolchains-support)を使用しない限り）。あなたのJDKバージョンが`%jvmLTSVersionSupportedByKotlin%`であると仮定すると、公開されたライブラリアーティファクトはJDK %jvmLTSVersionSupportedByKotlin%+との互換性を[宣言](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)します: `org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`。これは間違っています。この場合、バイトコードのバージョンが`1.8`であるにもかかわらず、このライブラリを追加するためにメインプロジェクトでJava %jvmLTSVersionSupportedByKotlin%を使用する必要があります。この問題を解決するには、[ツールチェーンを構成](gradle-configure-project.md#gradle-java-toolchains-support)してください。

### Gradle Javaツールチェーンのサポート

> Androidユーザーへの警告。Gradleツールチェーンのサポートを使用するには、Android Gradleプラグイン (AGP) バージョン8.1.0-alpha09以降を使用してください。
> 
> Gradle Javaツールチェーンのサポートは、AGP 7.4.0以降で[利用可能](https://issuetracker.google.com/issues/194113162)です。
> それにもかかわらず、[この問題](https://issuetracker.google.com/issues/260059413)のため、AGPはバージョン8.1.0-alpha09まで`targetCompatibility`をツールチェーンのJDKと等しく設定しませんでした。
> 8.1.0-alpha09未満のバージョンを使用する場合、`compileOptions`を介して`targetCompatibility`を手動で構成する必要があります。
> プレースホルダー`<MAJOR_JDK_VERSION>`を使用したいJDKバージョンに置き換えてください。
>
> ```kotlin
> android {
>     compileOptions {
>         sourceCompatibility = <MAJOR_JDK_VERSION>
>         targetCompatibility = <MAJOR_JDK_VERSION>
>     }
> }
> ```
>
{style="warning"} 

Gradle 6.7では、[Javaツールチェーンのサポート](https://docs.gradle.org/current/userguide/toolchains.html)が導入されました。この機能を使用すると、次のことができます。
* コンパイル、テスト、および実行可能ファイルを実行するために、Gradle内のものとは異なるJDKとJREを使用する。
* まだリリースされていない言語バージョンでコードをコンパイルおよびテストする。

ツールチェーンのサポートにより、GradleはローカルJDKを自動検出し、ビルドのためにGradleが必要とする不足しているJDKをインストールできます。これでGradle自体はどのJDK上でも実行でき、主要なJDKバージョンに依存するタスクのリモートビルドキャッシュ機能を再利用できます。

Kotlin Gradleプラグインは、Kotlin/JVMコンパイルタスクに対してJavaツールチェーンをサポートします。JSおよびNativeタスクはツールチェーンを使用しません。Kotlinコンパイラは常にGradleデーモンが実行されているJDK上で実行されます。
Javaツールチェーンは次のことを行います。
* JVMターゲットで利用可能な[`-jdk-home`オプション](compiler-reference.md#jdk-home-path)を設定します。
* ユーザーが`jvmTarget`オプションを明示的に設定しない場合、[`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)をツールチェーンのJDKバージョンに設定します。ユーザーがツールチェーンを構成しない場合、`jvmTarget`フィールドはデフォルト値を使用します。[JVMターゲットの互換性](#check-for-jvm-target-compatibility-of-related-compile-tasks)についてさらに学ぶ。
* Javaのコンパイル、テスト、およびjavadocタスクによって使用されるツールチェーンを設定します。
* [`kapt`ワーカー](kapt.md#run-kapt-tasks-in-parallel)がどのJDKで実行されるかに影響します。

ツールチェーンを設定するには、以下のコードを使用します。プレースホルダー`<MAJOR_JDK_VERSION>`を使用したいJDKバージョンに置き換えてください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
</tabs>

`kotlin`拡張を介してツールチェーンを設定すると、Javaコンパイルタスクのツールチェーンも更新されることに注意してください。

`java`拡張を介してツールチェーンを設定でき、Kotlinコンパイルタスクはそれを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</tab>
</tabs>

Gradle 8.0.2以降を使用している場合は、[ツールチェーンリゾルバープラグイン](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)も追加する必要があります。この種のプラグインは、ツールチェーンをダウンロードするリポジトリを管理します。例として、`settings.gradle(.kts)`に以下のプラグインを追加してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("%foojayResolver%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '%foojayResolver%'
}
```

</tab>
</tabs>

`foojay-resolver-convention`のバージョンが[Gradleサイト](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)のGradleバージョンに対応していることを確認してください。

> Gradleがどのツールチェーンを使用しているかを理解するには、[ログレベル `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)でGradleビルドを実行し、出力で`[KOTLIN] Kotlin compilation 'jdkHome' argument:`で始まる文字列を見つけてください。
> コロンの後の部分が、ツールチェーンからのJDKバージョンになります。
>
{style="note"}

特定のタスクに任意のJDK（ローカルなものも含む）を設定するには、[Task DSL](#set-jdk-version-with-the-task-dsl)を使用します。

[KotlinプラグインでのGradle JVMツールチェーンのサポート](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)についてさらに学ぶ。

### Task DSLでJDKバージョンを設定する

Task DSLを使用すると、`UsesKotlinJavaToolchain`インターフェースを実装する任意のタスクに対して、任意のJDKバージョンを設定できます。現在、これらのタスクは`KotlinCompile`と`KaptTask`です。Gradleに主要なJDKバージョンを検索させたい場合は、ビルドスクリプトの`<MAJOR_JDK_VERSION>`プレースホルダーを置き換えてください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
</tabs>

または、ローカルJDKへのパスを指定し、プレースホルダー`<LOCAL_JDK_VERSION>`をこのJDKバージョンに置き換えることができます。

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // Put a path to your JDK
        JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
    )
}
```

### コンパイラタスクを関連付ける

コンパイルを_関連付け_ることで、あるコンパイルが別のコンパイルのコンパイル済み出力を使用するような関係をそれらの間に設定できます。コンパイルを関連付けることで、それらの間に`internal`の可視性が確立されます。

Kotlinコンパイラは、デフォルトで一部のコンパイルを関連付けます。例えば、各ターゲットの`test`と`main`コンパイルなどです。カスタムコンパイルの1つが別のコンパイルと接続されていることを表現する必要がある場合は、独自の関連付けられたコンパイルを作成します。

IDEがソースセット間の可視性を推論するために、関連するコンパイルをサポートするようにするには、`build.gradle(.kts)`に以下のコードを追加してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</tab>
</tabs>

ここでは、`integrationTest`コンパイルが`main`コンパイルと関連付けられており、関数テストからの`internal`オブジェクトへのアクセスを提供します。

### Java Modules (JPMS) を有効にして構成する

Kotlin Gradleプラグインが[Java Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)で動作するようにするには、ビルドスクリプトに以下の行を追加し、`YOUR_MODULE_NAME`をJPMSモジュールへの参照（例: `org.company.module`）に置き換えてください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">
        
```kotlin
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</tab>
</tabs>

> `module-info.java`は通常通り`src/main/java`ディレクトリに配置してください。
> 
> モジュールの場合、「package is empty or does not exist」というビルド失敗を避けるため、Kotlinファイルのパッケージ名は`module-info.java`からのパッケージ名と等しくなければなりません。
>
{style="note"}

詳細については、以下を参照してください。
* [Javaモジュールシステム用のモジュールのビルド](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [Javaモジュールシステムを使用したアプリケーションのビルド](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlinにおける「モジュール」の意味](visibility-modifiers.md#modules)

### その他の詳細

[Kotlin/JVM](jvm-get-started.md)についてさらに学ぶ。

#### コンパイルタスクでの成果物の使用を無効にする

まれなシナリオでは、循環依存関係エラーによってビルド失敗が発生する可能性があります。例えば、複数のコンパイルがあり、あるコンパイルが別のコンパイルのすべての内部宣言を見ることができ、生成された成果物が両方のコンパイルタスクの出力に依存している場合などです。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存関係エラーを修正するために、Gradleプロパティ `archivesTaskOutputAsFriendModule` を追加しました。このプロパティは、コンパイルタスクでの成果物入力の使用を制御し、結果としてタスク依存関係が作成されるかどうかを決定します。

デフォルトでは、このプロパティはタスク依存関係を追跡するために`true`に設定されています。循環依存関係エラーに遭遇した場合、コンパイルタスクでの成果物の使用を無効にしてタスク依存関係を削除し、循環依存関係エラーを回避することができます。

コンパイルタスクでの成果物の使用を無効にするには、`gradle.properties`ファイルに以下を追加してください。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 遅延Kotlin/JVMタスク作成

Kotlin 1.8.20以降、Kotlin Gradleプラグインはすべてのタスクを登録し、ドライランではそれらを構成しません。

#### コンパイルタスクのdestinationDirectoryの非デフォルトロケーション

Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile`タスクの`destinationDirectory`ロケーションをオーバーライドする場合、ビルドスクリプトを更新してください。JARファイル内の`sourceSets.main.outputs`に`sourceSets.main.kotlin.classesDirectories`を明示的に追加する必要があります。

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 複数プラットフォームをターゲットにする

[複数プラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)をターゲットとするプロジェクトは、[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)と呼ばれ、`kotlin-multiplatform`プラグインを必要とします。

> `kotlin-multiplatform`プラグインは、Gradle %minGradleVersion%以降で動作します。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

[異なるプラットフォーム向けKotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)および[iOSとAndroid向けKotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)についてさらに学ぶ。

## Androidをターゲットにする

Androidアプリケーションを作成するには、Android Studioを使用することをお勧めします。[Android Gradleプラグインの使用方法を学ぶ](https://developer.android.com/studio/releases/gradle-plugin)。

## JavaScriptをターゲットにする

JavaScriptをターゲットにする場合も、`kotlin-multiplatform`プラグインを使用します。[Kotlin/JSプロジェクトの設定についてさらに学ぶ](js-project-setup.md)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

### JavaScript用のKotlinおよびJavaソース

このプラグインはKotlinファイルのみで動作するため、KotlinファイルとJavaファイルを分離しておくことをお勧めします（プロジェクトにJavaファイルが含まれている場合）。別々に保存しない場合は、`sourceSets{}`ブロックでソースフォルダを指定してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</tab>
</tabs>

## KotlinBasePluginインターフェースによる構成アクションのトリガー

任意のKotlin Gradleプラグイン（JVM、JS、マルチプラットフォーム、Nativeなど）が適用されるたびに、いくつかの構成アクションをトリガーするには、すべてのKotlinプラグインが継承する`KotlinBasePlugin`インターフェースを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // Configure your action here
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // Configure your action here
}
```

</tab>
</tabs>

## 依存関係を構成する

ライブラリに依存関係を追加するには、ソースセットDSLの`dependencies{}`ブロックで、必要な[タイプ](#dependency-types)の依存関係（例: `implementation`）を設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

または、[トップレベルで依存関係を設定](#set-dependencies-at-top-level)することもできます。

### 依存関係のタイプ

要件に基づいて依存関係のタイプを選択してください。

<table>
    <tr>
        <th>タイプ</th>
        <th>説明</th>
        <th>使用すべき場合</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>コンパイル時と実行時の両方で使用され、ライブラリのコンシューマーにエクスポートされます。</td>
        <td>依存関係からの型が現在のモジュールの公開APIで使用される場合、<code>api</code>依存関係を使用します。
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>現在のモジュールのコンパイル時と実行時に使用されますが、<code>implementation</code>依存関係を持つモジュールに依存する他のモジュールのコンパイルには公開されません。</td>
        <td>
            <p>モジュールの内部ロジックに必要な依存関係に使用します。</p>
            <p>モジュールが公開されないエンドポイントアプリケーションである場合、<code>api</code>依存関係の代わりに<code>implementation</code>依存関係を使用します。</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>現在のモジュールのコンパイルに使用され、実行時にも他のモジュールのコンパイル時にも利用できません。</td>
        <td>実行時にサードパーティの実装が利用可能なAPIに使用します。</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>実行時には利用可能ですが、どのモジュールのコンパイル時にも可視ではありません。</td>
        <td></td>
    </tr>
</table>

### 標準ライブラリへの依存関係

標準ライブラリ（`stdlib`）への依存関係は、各ソースセットに自動的に追加されます。使用される標準ライブラリのバージョンは、Kotlin Gradleプラグインのバージョンと同じです。

プラットフォーム固有のソースセットの場合、対応するプラットフォーム固有のライブラリのバリアントが使用され、残りのソースセットには共通の標準ライブラリが追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`compilerOptions.jvmTarget`[コンパイラオプション](gradle-compiler-options.md)に応じて適切なJVM標準ライブラリを選択します。

標準ライブラリの依存関係を明示的に宣言する場合（例えば、異なるバージョンが必要な場合）、Kotlin Gradleプラグインはそれをオーバーライドしたり、2つ目の標準ライブラリを追加したりすることはありません。

標準ライブラリがまったく必要ない場合は、`gradle.properties`ファイルに以下のGradleプロパティを追加できます。

```none
kotlin.stdlib.default.dependency=false
```

#### 遷移的な依存関係のバージョン調整

Kotlin標準ライブラリバージョン1.9.20以降、Gradleは標準ライブラリに含まれるメタデータを使用して、遷移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`の依存関係を自動的に調整します。

1.8.0～1.9.10のいずれかのKotlin標準ライブラリバージョンに対して依存関係を追加した場合（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`）、Kotlin Gradleプラグインは遷移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`の依存関係にこのKotlinバージョンを使用します。これにより、異なる標準ライブラリバージョンからのクラス重複が回避されます。[`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`を`kotlin-stdlib`にマージすることについてさらに学ぶ](whatsnew18.md#updated-jvm-compilation-target)。この動作を無効にするには、`gradle.properties`ファイルで`kotlin.stdlib.jdk.variants.version.alignment` Gradleプロパティを使用します。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### その他のバージョン調整方法 {initial-collapse-state="collapsed" collapsible="true"}

* バージョン調整に問題がある場合、Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)を介してすべてのバージョンを調整できます。ビルドスクリプトで`kotlin-bom`へのプラットフォーム依存関係を宣言してください。

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%"))
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%')
  ```

  </tab>
  </tabs>

* 標準ライブラリバージョンに対する依存関係を追加しない場合でも、Kotlin標準ライブラリの異なる古いバージョンを遷移的に引き起こす2つの異なる依存関係がある場合は、これらの遷移的なライブラリの%kotlinVersion%バージョンを明示的に要求できます。

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  </tabs>
  
* Kotlin標準ライブラリバージョン %kotlinVersion% に対する依存関係（`implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`）と、古いバージョン（`1.8.0`より前）のKotlin Gradleプラグインを使用している場合、標準ライブラリのバージョンに合わせてKotlin Gradleプラグインを更新してください。

  
  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  plugins {
      // replace `<...>` with the plugin name
      kotlin("<...>") version "%kotlinVersion%"
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  plugins {
      // replace `<...>` with the plugin name
      id "org.jetbrains.kotlin.<...>" version "%kotlinVersion%"
  }
  ```

  </tab>
  </tabs>

* `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8`の`1.8.0`より前のバージョン（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`）を使用しており、かつ`kotlin-stdlib:1.8+`を遷移的に引き起こす依存関係がある場合は、[`kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION`を`kotlin-stdlib-jdk*:%kotlinVersion%`に置き換える](whatsnew18.md#updated-jvm-compilation-target)か、それを引き起こすライブラリから遷移的な`kotlin-stdlib:1.8+`を[除外](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps)してください。

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib")
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude group: "org.jetbrains.kotlin", module: "kotlin-stdlib"
      }
  }
  ```

  </tab>
  </tabs>

### テストライブラリに依存関係を設定する

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIは、サポートされているすべてのプラットフォームでKotlinプロジェクトをテストするために利用できます。`commonTest`ソースセットに`kotlin-test`依存関係を追加すると、Gradleプラグインが各テストソースセットに対応するテスト依存関係を推論できるようになります。

Kotlin/Nativeターゲットは追加のテスト依存関係を必要とせず、`kotlin.test` API実装は組み込まれています。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
         commonTest.dependencies {
             implementation(kotlin("test")) // This brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

> Kotlinモジュールへの依存関係には短縮形を使用できます。例えば、"org.jetbrains.kotlin:kotlin-test"にはkotlin("test")を使用します。
>
{style="note"}

`kotlin-test`依存関係は、任意の共有ソースセットまたはプラットフォーム固有のソースセットでも使用できます。

#### kotlin-testのJVMバリアント

Kotlin/JVMの場合、GradleはデフォルトでJUnit 4を使用します。したがって、`kotlin("test")`依存関係はJUnit 4のバリアント、すなわち`kotlin-test-junit`に解決されます。

ビルドスクリプトのテストタスクで [`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)または [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)を呼び出すことで、JUnit 5またはTestNGを選択できます。以下の例はKotlinマルチプラットフォームプロジェクトのものです。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

以下の例はJVMプロジェクトのものです。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</tab>
</tabs>

[JVMでJUnitを使用してコードをテストする方法を学ぶ](jvm-test-using-junit.md)。

自動JVMバリアント解決が設定に問題を引き起こす場合があります。その場合、必要なフレームワークを明示的に指定し、プロジェクトの`gradle.properties`ファイルにこの行を追加することで自動解決を無効にできます。

```text
kotlin.test.infer.jvm.variant=false
```

ビルドスクリプトで`kotlin("test")`のバリアントを明示的に使用していて、プロジェクトのビルドが互換性競合で動作しなくなった場合は、[互換性ガイドのこの問題](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project)を参照してください。

### kotlinxライブラリに依存関係を設定する

マルチプラットフォームライブラリを使用し、共有コードに依存する必要がある場合は、共有ソースセットで一度だけ依存関係を設定します。`kotlinx-coroutines-core`や`ktor-client-core`などのライブラリの基本アーティファクト名を使用してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

プラットフォーム固有の依存関係のためにkotlinxライブラリが必要な場合でも、対応するプラットフォームソースセットでライブラリの基本アーティファクト名を使用できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

### トップレベルで依存関係を設定する

または、構成名に`<sourceSetName><DependencyType>`というパターンを使用して、トップレベルで依存関係を指定できます。これは、ソースセットの依存関係DSLでは利用できない`gradleApi()`、`localGroovy()`、`gradleTestKit()`などの一部のGradle組み込み依存関係に役立つ場合があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

</tab>
</tabs>

## リポジトリを宣言する

オープンソースの依存関係を使用するために、公開されているリポジトリを宣言できます。`repositories{}`ブロックで、リポジトリの名前を設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}
```
</tab>
</tabs>

一般的なリポジトリは[Maven Central](https://central.sonatype.com/)と[GoogleのMavenリポジトリ](https://maven.google.com/web/index.html)です。

> Mavenプロジェクトも扱う場合、GradleとMavenプロジェクトを切り替える際に問題が発生する可能性があるため、`mavenLocal()`をリポジトリとして追加することを避けることをお勧めします。もし`mavenLocal()`リポジトリを追加する必要がある場合は、`repositories{}`ブロックの最後のリポジトリとして追加してください。詳細については、[The case for mavenLocal()](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local)を参照してください。
> 
{style="warning"}

複数のサブプロジェクトで同じリポジトリを宣言する必要がある場合は、`settings.gradle(.kts)`ファイルの`dependencyResolutionManagement{}`ブロックでリポジトリを一元的に宣言してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
</tabs>

サブプロジェクトで宣言されたリポジトリは、一元的に宣言されたリポジトリをオーバーライドします。この動作を制御する方法と利用可能なオプションに関する詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)を参照してください。

## 次のステップ

詳細については、以下を参照してください。
* [コンパイラオプションとそれらを渡す方法](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleの基礎と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。