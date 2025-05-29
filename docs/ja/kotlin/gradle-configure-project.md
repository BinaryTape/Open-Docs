[//]: # (title: Gradleプロジェクトを構成する)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)でKotlinプロジェクトをビルドするには、ビルドスクリプトファイル`build.gradle(.kts)`に[Kotlin Gradleプラグインを追加](#apply-the-plugin)し、そこで[プロジェクトの依存関係を構成する](#configure-dependencies)必要があります。

> ビルドスクリプトの内容について詳しく学ぶには、
> [ビルドスクリプトを探索する](get-started-with-jvm-gradle-project.md#explore-the-build-script)セクションをご覧ください。
>
{style="note"}

## プラグインを適用する

Kotlin Gradleプラグインを適用するには、GradleのプラグインDSLから[`plugins{}`ブロック](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を使用します。

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

> Kotlin Gradleプラグイン (KGP) とKotlinは同じバージョン番号を共有しています。
>
{style="note"}

プロジェクトを構成する際、Kotlin Gradleプラグイン (KGP) と利用可能なGradleバージョンの互換性を確認してください。次の表は、GradleとAndroid Gradleプラグイン (AGP) の最小および最大**完全サポート**バージョンです。

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.1.20        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
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

> *Kotlin 2.0.20–2.0.21およびKotlin 2.1.0–2.1.10は、Gradle 8.6まで完全な互換性があります。
> Gradleバージョン8.7–8.10もサポートされていますが、1つだけ例外があります。Kotlin Multiplatform Gradleプラグインを使用している場合、
> JVMターゲットで`withJava()`関数を呼び出すMultiplatformプロジェクトで非推奨警告が表示される場合があります。
> 詳細については、[デフォルトで作成されるJavaソースセット](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)をご覧ください。
>
{style="warning"}

最新リリースまでのGradleおよびAGPバージョンも使用できますが、その場合、非推奨警告が表示されたり、一部の新機能が動作しなかったりする可能性があることに注意してください。

たとえば、Kotlin Gradleプラグインと`kotlin-multiplatform`プラグイン %kotlinVersion% は、プロジェクトをコンパイルするために最低Gradleバージョン %minGradleVersion% を必要とします。

同様に、最大完全サポートバージョンは %maxGradleVersion% です。これには非推奨のGradleメソッドやプロパティがなく、すべての現在のGradle機能をサポートしています。

### プロジェクト内のKotlin Gradleプラグインデータ

デフォルトでは、Kotlin Gradleプラグインは、プロジェクト固有の永続データをプロジェクトのルートの`.kotlin`ディレクトリに保存します。

> `.kotlin`ディレクトリをバージョン管理にコミットしないでください。
> たとえば、Gitを使用している場合は、`.kotlin`をプロジェクトの`.gitignore`ファイルに追加してください。
>
{style="warning"}

この動作を設定するために、プロジェクトの`gradle.properties`ファイルに追加できるプロパティがあります。

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | プロジェクトレベルのデータが保存される場所を構成します。デフォルト: `<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle`ディレクトリへのKotlinデータの書き込みを無効にするかどうかを制御します (古いIDEAバージョンとの後方互換性のため)。デフォルト: false |

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

このブロックの`version`はリテラルである必要があり、別のビルドスクリプトから適用することはできません。

### KotlinとJavaのソース

KotlinソースとJavaソースは同じディレクトリに保存することも、異なるディレクトリに配置することもできます。

デフォルトの慣習では、異なるディレクトリを使用します。

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> `.java`ファイルを`src/*/kotlin`ディレクトリに保存しないでください。`.java`ファイルはコンパイルされません。
> 
> 代わりに、`src/main/java`を使用できます。
>
{style="warning"} 

デフォルトの慣習を使用しない場合は、対応する`sourceSets`プロパティを更新する必要があります。

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

### 関連するコンパイルタスクのJVMターゲット互換性を確認する

ビルドモジュールには、関連するコンパイルタスクが存在する場合があります。たとえば、次のとおりです。
* `compileKotlin`と`compileJava`
* `compileTestKotlin`と`compileTestJava`

> `main`と`test`ソースセットのコンパイルタスクは関連していません。
>
{style="note"}

これらの関連するタスクについては、Kotlin GradleプラグインがJVMターゲットの互換性をチェックします。`kotlin`拡張またはタスクの[`jvmTarget`属性](gradle-compiler-options.md#attributes-specific-to-jvm)と、`java`拡張またはタスクの[`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)の値が異なる場合、JVMターゲットの互換性がなくなります。たとえば、
`compileKotlin`タスクの`jvmTarget=1.8`と、
`compileJava`タスクの`targetCompatibility=15` (または[継承される](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)値)です。

このチェックの動作をプロジェクト全体で構成するには、`gradle.properties`ファイルの`kotlin.jvm.target.validation.mode`プロパティを次のように設定します。

* `error` – プラグインがビルドを失敗させます。Gradle 8.0以降のプロジェクトのデフォルト値です。
* `warning` – プラグインが警告メッセージを出力します。Gradle 8.0未満のプロジェクトのデフォルト値です。
* `ignore` – プラグインがチェックをスキップし、メッセージを出力しません。

`build.gradle(.kts)`ファイルでタスクレベルで設定することもできます。

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

JVMターゲットの非互換性を回避するには、[ツールチェーンを構成する](#gradle-java-toolchains-support)か、JVMバージョンを手動で調整します。

#### ターゲットが非互換の場合に何が問題になるか {initial-collapse-state="collapsed" collapsible="true"}

KotlinとJavaのソースセットに対してJVMターゲットを手動で設定する方法は2つあります。
* [Javaツールチェーンを設定する](#gradle-java-toolchains-support)という暗黙的な方法。
* `kotlin`拡張またはタスクの`jvmTarget`属性と、`java`拡張またはタスクの`targetCompatibility`を明示的に設定する方法。

JVMターゲットの非互換性は、次の場合に発生します。
* `jvmTarget`と`targetCompatibility`に異なる値を明示的に設定した場合。
* デフォルト設定で、JDKが`1.8`と等しくない場合。

ビルドスクリプトに`jvmTarget`値に関する明示的な情報がなく、Kotlin JVMプラグインのみが存在するデフォルトのJVMターゲット構成を考えてみましょう。

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

ビルドスクリプトに`jvmTarget`値に関する明示的な情報がない場合、そのデフォルト値は`null`であり、コンパイラはそれをデフォルト値`1.8`に変換します。`targetCompatibility`は、現在のGradleのJDKバージョン、つまりご自身のJDKバージョンと等しくなります（[Javaツールチェーンアプローチ](gradle-configure-project.md#gradle-java-toolchains-support)を使用しない限り）。ご自身のJDKバージョンが`%jvmLTSVersionSupportedByKotlin%`であると仮定すると、発行されるライブラリ成果物はJDK %jvmLTSVersionSupportedByKotlin%+と互換性があることを[宣言します](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) (`org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`)。これは誤りです。この場合、バイトコードのバージョンが`1.8`であっても、このライブラリを追加するにはメインプロジェクトでJava %jvmLTSVersionSupportedByKotlin%を使用する必要があります。この問題を解決するには、[ツールチェーンを構成します](gradle-configure-project.md#gradle-java-toolchains-support)。

### Gradle Javaツールチェーンサポート

> Androidユーザーへの警告。Gradleツールチェーンサポートを使用するには、Android Gradleプラグイン (AGP) バージョン8.1.0-alpha09以降を使用してください。
> 
> Gradle Javaツールチェーンサポートは、AGP 7.4.0から[利用可能](https://issuetracker.google.com/issues/194113162)です。
> しかし、[この問題](https://issuetracker.google.com/issues/260059413)のため、AGPはバージョン8.1.0-alpha09まで`targetCompatibility`をツールチェーンのJDKと等しく設定しませんでした。
> バージョン8.1.0-alpha09より前のバージョンを使用している場合は、`compileOptions`を介して`targetCompatibility`を手動で構成する必要があります。
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

Gradle 6.7で[Javaツールチェーンサポート](https://docs.gradle.org/current/userguide/toolchains.html)が導入されました。
この機能を使用すると、次のことが可能です。
* Gradleとは異なるJDKとJREを使用して、コンパイル、テスト、実行可能ファイルを実行できます。
* まだリリースされていない言語バージョンでコードをコンパイルおよびテストできます。

ツールチェーンサポートにより、GradleはローカルJDKを自動検出でき、ビルドに必要な不足しているJDKをインストールできます。
これにより、Gradle自体は任意のJDKで実行でき、メジャーなJDKバージョンに依存するタスクでは[リモートビルドキャッシュ機能](gradle-compilation-and-caches.md#gradle-build-cache-support)を再利用できます。

Kotlin Gradleプラグインは、Kotlin/JVMコンパイルタスクに対してJavaツールチェーンをサポートしています。JSおよびNativeタスクはツールチェーンを使用しません。
Kotlinコンパイラは常にGradleデーモンが実行されているJDK上で実行されます。
Javaツールチェーンは次のことを行います。
* JVMターゲットで利用可能な[`-jdk-home`オプション](compiler-reference.md#jdk-home-path)を設定します。
* ユーザーが`jvmTarget`オプションを明示的に設定しない場合、[`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)をツールチェーンのJDKバージョンに設定します。
  ユーザーがツールチェーンを構成しない場合、`jvmTarget`フィールドはデフォルト値を使用します。
  [JVMターゲットの互換性](#check-for-jvm-target-compatibility-of-related-compile-tasks)について詳しく学ぶ。
* Javaコンパイル、テスト、javadocの各タスクで使用されるツールチェーンを設定します。
* [`kapt`ワーカー](kapt.md#run-kapt-tasks-in-parallel)が実行されるJDKに影響します。

ツールチェーンを設定するには、次のコードを使用します。プレースホルダー`<MAJOR_JDK_VERSION>`を使用したいJDKバージョンに置き換えてください。

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

Gradle 8.0.2以降を使用している場合は、[ツールチェーンリゾルバープラグイン](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)も追加する必要があります。
この種類のプラグインは、ツールチェーンをダウンロードするリポジトリを管理します。例として、`settings.gradle(.kts)`に以下のプラグインを追加してください。

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

`foojay-resolver-convention`のバージョンが[Gradleサイト](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)のGradleバージョンと一致していることを確認してください。

> Gradleがどのツールチェーンを使用しているかを確認するには、[ログレベル`--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)でGradleビルドを実行し、出力で`[KOTLIN] Kotlin compilation 'jdkHome' argument:`から始まる文字列を探してください。
> コロンの後の部分がツールチェーンのJDKバージョンになります。
>
{style="note"}

特定のタスクに任意のJDK (ローカルJDKでも) を設定するには、[Task DSL](#set-jdk-version-with-the-task-dsl)を使用します。

[KotlinプラグインにおけるGradle JVMツールチェーンサポート](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)について詳しく学ぶ。

### Task DSLでJDKバージョンを設定する

Task DSLを使用すると、`UsesKotlinJavaToolchain`インターフェースを実装するすべてのタスク（現時点では`KotlinCompile`と`KaptTask`）に対して任意のJDKバージョンを設定できます。
GradleにメジャーJDKバージョンを検索させる場合は、ビルドスクリプトの`<MAJOR_JDK_VERSION>`プレースホルダーを置き換えてください。

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

または、ローカルJDKへのパスを指定し、`<LOCAL_JDK_VERSION>`プレースホルダーをこのJDKバージョンに置き換えることもできます。

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // Put a path to your JDK
        JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
    )
}
```

### コンパイラタスクを関連付ける

コンパイルタスクを_関連付ける_ことで、一方のコンパイルが他方のコンパイル済み出力を利用するような関係を構築できます。コンパイルを関連付けることで、それらの間に`internal`な可視性が確立されます。

Kotlinコンパイラは、デフォルトで各ターゲットの`test`コンパイルと`main`コンパイルなど、一部のコンパイルを関連付けます。
カスタムコンパイルのいずれかが別のコンパイルと関連していることを表現する必要がある場合は、独自の関連コンパイルを作成します。

IDEがソースセット間の可視性を推測するために関連コンパイルをサポートするようにするには、`build.gradle(.kts)`に以下のコードを追加します。

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

ここで、`integrationTest`コンパイルは`main`コンパイルと関連付けられており、機能テストから`internal`オブジェクトにアクセスできるようになります。

### Javaモジュール (JPMS) が有効な場合の構成

Kotlin Gradleプラグインを[Javaモジュール](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)で動作させるには、ビルドスクリプトに以下の行を追加し、`YOUR_MODULE_NAME`をJPMSモジュールへの参照（例: `org.company.module`）に置き換えてください。

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
> モジュールの場合、Kotlinファイルのパッケージ名は`module-info.java`のパッケージ名と一致している必要があります。「package is empty or does not exist」というビルドエラーを回避するためです。
>
{style="note"}

詳細については、以下をご覧ください。
* [Javaモジュールシステム用のモジュールをビルドする](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [Javaモジュールシステムを使用してアプリケーションをビルドする](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlinにおける「モジュール」の意味](visibility-modifiers.md#modules)

### その他の詳細

詳細については、以下をご覧ください。
* [コンパイラのオプションとそれらを渡す方法](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、Kotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインのバリアントのサポート](gradle-plugin-variants.md)。

#### コンパイルタスクでの成果物の使用を無効にする

まれなシナリオでは、循環依存関係エラーが原因でビルドが失敗することがあります。たとえば、複数のコンパイルがあり、1つのコンパイルが別のコンパイルのすべての内部宣言を参照でき、生成された成果物が両方のコンパイルタスクの出力に依存している場合です。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存関係エラーを解決するために、Gradleプロパティ`archivesTaskOutputAsFriendModule`が追加されました。
このプロパティは、コンパイルタスクでの成果物入力の使用を制御し、結果としてタスク依存関係が作成されるかどうかを決定します。

デフォルトでは、このプロパティはタスクの依存関係を追跡するために`true`に設定されています。循環依存関係エラーが発生した場合、コンパイルタスクでの成果物の使用を無効にしてタスクの依存関係を削除し、循環依存関係エラーを回避できます。

コンパイルタスクでの成果物の使用を無効にするには、`gradle.properties`ファイルに次の行を追加します。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### Lazy Kotlin/JVMタスクの作成

Kotlin 1.8.20以降、Kotlin Gradleプラグインはすべてのタスクを登録し、ドライランではそれらを構成しません。

#### コンパイルタスクの`destinationDirectory`の非デフォルトの場所

Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile`タスクの`destinationDirectory`の場所をオーバーライドする場合は、ビルドスクリプトを更新してください。JARファイルで`sourceSets.main.kotlin.classesDirectories`を`sourceSets.main.outputs`に明示的に追加する必要があります。

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 複数のプラットフォームをターゲットにする

[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)と呼ばれる、[複数のプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)をターゲットにするプロジェクトでは、`kotlin-multiplatform`プラグインが必要です。

> `kotlin-multiplatform`プラグインはGradle %minGradleVersion%以降で動作します。
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

[異なるプラットフォーム向けKotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)および[iOSとAndroid向けKotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)について詳しく学ぶ。

## Androidをターゲットにする

Androidアプリケーションの作成にはAndroid Studioを使用することをお勧めします。[Android Gradleプラグインの使用方法](https://developer.android.com/studio/releases/gradle-plugin)を学びましょう。

## JavaScriptをターゲットにする

JavaScriptをターゲットにする場合も、`kotlin-multiplatform`プラグインを使用します。[Kotlin/JSプロジェクトのセットアップ方法](js-project-setup.md)について詳しく学ぶ。

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

### JavaScript向けのKotlinとJavaのソース

このプラグインはKotlinファイルのみで動作するため、KotlinファイルとJavaファイル（プロジェクトにJavaファイルが含まれる場合）は分けておくことをお勧めします。もし分けておかない場合は、`sourceSets{}`ブロックでソースフォルダを指定してください。

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

任意のKotlin Gradleプラグイン（JVM、JS、Multiplatform、Nativeなど）が適用されるたびに、何らかの構成アクションをトリガーするには、すべてのKotlinプラグインが継承する`KotlinBasePlugin`インターフェースを使用します。

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

ライブラリへの依存関係を追加するには、ソースセットDSLの`dependencies{}`ブロックで、必要な[タイプ](#dependency-types)の依存関係（例: `implementation`）を設定します。

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

あるいは、[トップレベルで依存関係を設定](#set-dependencies-at-top-level)することもできます。

### 依存関係のタイプ

要件に基づいて依存関係のタイプを選択してください。

<table>
    <tr>
        <th>タイプ</th>
        <th>説明</th>
        <th>使用する場合</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>コンパイル時とランタイム時の両方で使用され、ライブラリの利用者にエクスポートされます。</td>
        <td>依存関係の型が現在のモジュールのパブリックAPIで使用される場合、<code>api</code>依存関係を使用します。
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>現在のモジュールのコンパイル時とランタイム時に使用されますが、<code>implementation</code>依存関係を持つモジュールに依存する他のモジュールのコンパイルには公開されません。</td>
        <td>
            <p>モジュールの内部ロジックに必要な依存関係に使用します。</p>
            <p>モジュールが公開されないエンドポイントアプリケーションの場合、<code>api</code>依存関係の代わりに<code>implementation</code>依存関係を使用します。</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>現在のモジュールのコンパイル時に使用され、ランタイム時および他のモジュールのコンパイル時には利用できません。</td>
        <td>ランタイム時にサードパーティの実装が利用可能なAPIに使用します。</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>ランタイム時には利用可能ですが、どのモジュールのコンパイル時にも可視ではありません。</td>
        <td></td>
    </tr>
</table>

### 標準ライブラリへの依存関係

標準ライブラリ（`stdlib`）への依存関係は、各ソースセットに自動的に追加されます。
使用される標準ライブラリのバージョンは、Kotlin Gradleプラグインのバージョンと同じです。

プラットフォーム固有のソースセットの場合、対応するプラットフォーム固有のライブラリのバリアントが使用され、残りの部分には共通の標準ライブラリが追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`compilerOptions.jvmTarget`[コンパイラオプション](gradle-compiler-options.md)に応じて適切なJVM標準ライブラリを選択します。

標準ライブラリの依存関係を明示的に宣言した場合（例: 異なるバージョンが必要な場合）、Kotlin Gradleプラグインはそれを上書きしたり、2つ目の標準ライブラリを追加したりしません。

標準ライブラリがまったく不要な場合は、`gradle.properties`ファイルに次のGradleプロパティを追加できます。

```none
kotlin.stdlib.default.dependency=false
```

#### 推移的依存関係のバージョンアライメント

Kotlin標準ライブラリバージョン1.9.20以降、Gradleは標準ライブラリに含まれるメタデータを使用して、推移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係を自動的にアライメントします。

Kotlin標準ライブラリのバージョン1.8.0から1.9.10までの依存関係を追加した場合（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`）、Kotlin Gradleプラグインは推移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係にこのKotlinバージョンを使用します。これにより、異なる標準ライブラリバージョンからのクラスの重複が回避されます。[`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk8`を`kotlin-stdlib`にマージする](whatsnew18.md#updated-jvm-compilation-target)について詳しく学ぶ。
この動作は、`gradle.properties`ファイルの`kotlin.stdlib.jdk.variants.version.alignment` Gradleプロパティで無効にできます。

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### バージョンをアライメントするその他の方法 {initial-collapse-state="collapsed" collapsible="true"}

* バージョンアライメントに問題がある場合、Kotlinの[BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)を介してすべてのバージョンをアライメントできます。
  ビルドスクリプトで`kotlin-bom`に対するプラットフォーム依存関係を宣言してください。

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

* 標準ライブラリのバージョンに依存関係を追加していないが、推移的に異なる古いバージョンのKotlin標準ライブラリをもたらす2つの異なる依存関係がある場合、これらの推移的なライブラリに対して明示的に`%kotlinVersion%`バージョンを要求できます。

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
  
* Kotlin標準ライブラリバージョン`%kotlinVersion%`への依存関係を追加し（`implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`など）、古いバージョン（`1.8.0`より前）のKotlin Gradleプラグインを使用している場合、Kotlin Gradleプラグインを標準ライブラリのバージョンに合わせて更新してください。

  
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

* `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8`の`1.8.0`より前のバージョンを使用しており（例: `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`）、かつ推移的に`kotlin-stdlib:1.8+`をもたらす依存関係がある場合、[`kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION`を`kotlin-stdlib-jdk*:%kotlinVersion%`に置き換える](whatsnew18.md#updated-jvm-compilation-target)か、`kotlin-stdlib:1.8+`をもたらすライブラリからその推移的依存関係を[除外](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps)してください。

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

### テストライブラリの依存関係を設定する

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) APIは、サポートされているすべてのプラットフォームでKotlinプロジェクトをテストするために利用できます。
`kotlin-test`依存関係を`commonTest`ソースセットに追加すると、Gradleプラグインが各テストソースセットに対応するテスト依存関係を推測できます。

Kotlin/Nativeターゲットは追加のテスト依存関係を必要とせず、`kotlin.test` APIの実装は組み込まれています。

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

> Kotlinモジュールへの依存関係には、たとえば`"org.jetbrains.kotlin:kotlin-test"`の代わりに`kotlin("test")`のようなショートハンドを使用できます。
>
{style="note"}

`kotlin-test`依存関係は、共有ソースセットまたはプラットフォーム固有のソースセットでも使用できます。

#### kotlin-testのJVMバリアント

Kotlin/JVMでは、GradleはデフォルトでJUnit 4を使用します。そのため、`kotlin("test")`の依存関係はJUnit 4のバリアント、すなわち`kotlin-test-junit`に解決されます。

ビルドスクリプトのテストタスクで[`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)または[`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)を呼び出すことで、JUnit 5またはTestNGを選択できます。
以下の例はKotlin Multiplatformプロジェクトのものです。

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

[JUnitを使用してJVMでコードをテストする方法](jvm-test-using-junit.md)を学ぶ。

JVMバリアントの自動解決は、設定に問題を引き起こすことがあります。その場合、必要なフレームワークを明示的に指定し、プロジェクトの`gradle.properties`ファイルに以下の行を追加して自動解決を無効にできます。

```text
kotlin.test.infer.jvm.variant=false
```

ビルドスクリプトで`kotlin("test")`のバリアントを明示的に使用していて、プロジェクトビルドが互換性衝突で動作しなくなった場合は、[互換性ガイドのこの問題](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project)を参照してください。

### kotlinxライブラリの依存関係を設定する

マルチプラットフォームライブラリを使用し、共有コードに依存する必要がある場合は、共有ソースセットにのみ一度依存関係を設定します。ライブラリの基本アーティファクト名（`kotlinx-coroutines-core`や`ktor-client-core`など）を使用してください。

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

プラットフォーム固有の依存関係としてkotlinxライブラリが必要な場合でも、対応するプラットフォームソースセットでライブラリの基本アーティファクト名を使用できます。

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

あるいは、構成名に`<sourceSetName><DependencyType>`のパターンを使用して、依存関係をトップレベルで指定することもできます。これは、`gradleApi()`、`localGroovy()`、`gradleTestKit()`など、ソースセットの依存関係DSLでは利用できないGradleの組み込み依存関係の一部に役立つ場合があります。

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

公開されているリポジトリを宣言して、そのオープンソースの依存関係を使用できます。`repositories{}`ブロックでリポジトリの名前を設定します。

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

一般的なリポジトリは、[Maven Central](https://central.sonatype.com/)と[GoogleのMavenリポジトリ](https://maven.google.com/web/index.html)です。

> Mavenプロジェクトも扱っている場合は、`mavenLocal()`をリポジトリとして追加しないことをお勧めします。GradleとMavenプロジェクトを切り替える際に問題が発生する可能性があるためです。もし`mavenLocal()`リポジトリをどうしても追加する必要がある場合は、`repositories{}`ブロックの最後に配置してください。詳細については、[The case for mavenLocal()](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local)をご覧ください。
> 
{style="warning"}

複数のサブプロジェクトで同じリポジトリを宣言する必要がある場合は、`settings.gradle(.kts)`ファイルの`dependencyResolutionManagement{}`ブロックでリポジトリを一元的に宣言します。

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

サブプロジェクトで宣言されたリポジトリは、一元的に宣言されたリポジトリを上書きします。この動作を制御する方法や利用可能なオプションの詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)を参照してください。

## 次のステップ

詳細については、以下をご覧ください。
* [コンパイラオプションとその渡し方](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、Kotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。