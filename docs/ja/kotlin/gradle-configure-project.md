---
title: Gradleプロジェクトの構成
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)でKotlinプロジェクトを構築するには、ビルドスクリプトファイル`build.gradle(.kts)`に[Kotlin Gradle plugin](#apply-the-plugin)を追加し、そこで[プロジェクトの依存関係を構成する](#configure-dependencies)必要があります。

:::note
ビルドスクリプトの内容について詳しくは、
[ビルドスクリプトを調べる](get-started-with-jvm-gradle-project#explore-the-build-script)セクションをご覧ください。

:::

## プラグインの適用

Kotlin Gradle pluginを適用するには、Gradle plugins DSLの[`plugins{}` ブロック](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)を使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // ターゲット環境に適したプラグイン名で`<...>`を置き換えてください
    kotlin("<...>") version "2.1.20"
    // たとえば、ターゲット環境がJVMの場合：
    // kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // ターゲット環境に適したプラグイン名で`<...>`を置き換えてください
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // たとえば、ターゲット環境がJVMの場合： 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}
```

</TabItem>
</Tabs>

:::note
Kotlin Gradle plugin (KGP) とKotlinは、同じバージョン番号を共有します。

:::

プロジェクトを構成する際は、Kotlin Gradle plugin (KGP) と利用可能なGradleバージョンとの互換性を確認してください。
次の表に、GradleとAndroid Gradle plugin (AGP) の最小バージョンと最大**完全サポート**バージョンを示します。

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.1.20        | 7.6.3–8.11 | 7.3.1–8.7.2 |
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
:::note
*Kotlin 2.0.20–2.0.21およびKotlin 2.1.0–2.1.10は、Gradle 8.6まで完全に互換性があります。
Gradleバージョン8.7〜8.10もサポートされていますが、例外が1つあります。Kotlin Multiplatform Gradle pluginを使用している場合、
JVMターゲットで`withJava()`関数を呼び出すマルチプラットフォームプロジェクトに非推奨の警告が表示されることがあります。
詳細については、[デフォルトで作成されるJavaソースセット](multiplatform-compatibility-guide#java-source-sets-created-by-default)をご覧ください。

また、GradleとAGPのバージョンを最新リリースまで使用することもできますが、その場合は、
非推奨の警告が表示されたり、一部の新機能が動作しない可能性があることに注意してください。

たとえば、Kotlin Gradle pluginと`kotlin-multiplatform` plugin 2.1.20では、プロジェクトのコンパイルに最低限Gradle
バージョン7.6.3が必要です。

同様に、完全にサポートされている最大バージョンは8.11です。非推奨のGradle
メソッドやプロパティはなく、現在のGradleのすべての機能をサポートしています。

### プロジェクト内のKotlin Gradle pluginデータ

デフォルトでは、Kotlin Gradle pluginは、プロジェクト固有の永続的なデータをプロジェクトのルートにある`.kotlin`ディレクトリに保存します。

`.kotlin`ディレクトリをバージョン管理にコミットしないでください。
たとえば、Gitを使用している場合は、`.kotlin`をプロジェクトの`.gitignore`ファイルに追加します。

この動作を構成するために、プロジェクトの`gradle.properties`ファイルに追加できるプロパティがあります。

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | プロジェクトレベルのデータの保存場所を構成します。デフォルト：`<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | Kotlinデータの`.gradle`ディレクトリへの書き込みを無効にするかどうかを制御します（古いIDEAバージョンとの下位互換性のため）。デフォルト：false |

## JVMをターゲットにする

JVMをターゲットにするには、Kotlin JVM pluginを適用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

`version`は、このブロックではリテラルである必要があり、別のビルドスクリプトから適用することはできません。

### KotlinとJavaのソース

KotlinソースとJavaソースは、同じディレクトリに格納することも、異なるディレクトリに配置することもできます。

デフォルトの規則では、異なるディレクトリを使用します。

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

Javaの`.java`ファイルを`src/*/kotlin`ディレクトリに格納しないでください。`.java`ファイルはコンパイルされません。

代わりに、`src/main/java`を使用できます。

 

デフォルトの規則を使用していない場合は、対応する`sourceSets`プロパティを更新する必要があります。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</TabItem>
</Tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 関連するコンパイルタスクのJVMターゲットの互換性を確認する

ビルドモジュールには、次のような関連するコンパイルタスクがある場合があります。
* `compileKotlin`と`compileJava`
* `compileTestKotlin`と`compileTestJava`

`main`および`test`ソースセットのコンパイルタスクは関連していません。

:::

このような関連タスクの場合、Kotlin Gradle pluginはJVMターゲットの互換性をチェックします。`kotlin`拡張機能またはタスクの[`jvmTarget`属性](gradle-compiler-options#attributes-specific-to-jvm)と、`java`拡張機能またはタスクの[`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)の値が異なると、JVMターゲットの非互換が発生します。例：
`compileKotlin`タスクの`jvmTarget=1.8`で、
`compileJava`タスクが（または[継承](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）`targetCompatibility=15`の場合。

`build.gradle(.kts)`ファイルの`kotlin.jvm.target.validation.mode`プロパティを設定して、プロジェクト全体のこのチェックの動作を構成します。

* `error` – pluginはビルドを失敗させます。Gradle 8.0以降のプロジェクトのデフォルト値です。
* `warning` – pluginは警告メッセージを出力します。Gradle 8.0より前のプロジェクトのデフォルト値です。
* `ignore` – pluginはチェックをスキップし、メッセージを生成しません。

`build.gradle(.kts)`ファイルのタスクレベルで構成することもできます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</TabItem>
</Tabs>

JVMターゲットの非互換性を回避するには、[ツールチェーンを構成する](#gradle-java-toolchains-support)か、JVMバージョンを手動で調整してください。

#### ターゲットに互換性がない場合に何が問題になる可能性があるか

KotlinおよびJavaソースセットのJVMターゲットを手動で設定する方法は2つあります。
* [Javaツールチェーンの設定](#gradle-java-toolchains-support)による暗黙的な方法。
* `kotlin`拡張機能またはタスクで`jvmTarget`属性を、`java`拡張機能またはタスクで`targetCompatibility`を明示的に設定する方法。

JVMターゲットの非互換性は、次の場合に発生します。
* `jvmTarget`と`targetCompatibility`の異なる値を明示的に設定した場合。
* デフォルト構成があり、JDKが`1.8`と等しくない場合。

ビルドスクリプトにKotlin JVM pluginのみがあり、JVMターゲットに追加の設定がない場合のJVMターゲットのデフォルト構成を検討してみましょう。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

ビルドスクリプトに`jvmTarget`値に関する明示的な情報がない場合、そのデフォルト値は`null`であり、コンパイラはそれをデフォルト値`1.8`に変換します。`targetCompatibility`は、現在のGradleのJDKバージョンと等しく、これはJDKバージョンと等しくなります（[Javaツールチェーンのアプローチ](gradle-configure-project#gradle-java-toolchains-support)を使用しない限り）。JDKバージョンが`17`であると仮定すると、公開されたライブラリアーティファクトは、JDK 17+との互換性を[宣言](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)します：`org.gradle.jvm.version=17`、これは間違っています。この場合、メインプロジェクトでJava 17を使用してこのライブラリを追加する必要があります。ただし、バイトコードのバージョンは`1.8`です。[ツールチェーンを構成](gradle-configure-project#gradle-java-toolchains-support)して、この問題を解決します。

### Gradle Java toolchains support

:::note
Androidユーザーへの警告。Gradle toolchain supportを使用するには、Android Gradle plugin (AGP) バージョン8.1.0-alpha09以降を使用してください。 

Gradle Java toolchain supportは、AGP 7.4.0以降[で利用可能](https://issuetracker.google.com/issues/194113162)です。
ただし、[この問題](https://issuetracker.google.com/issues/260059413)のため、AGPはバージョン8.1.0-alpha09までtoolchainのJDKと等しくなるように`targetCompatibility`を設定しませんでした。
8.1.0-alpha09より前のバージョンを使用する場合は、`compileOptions`を使用して`targetCompatibility`を手動で構成する必要があります。
プレースホルダー`<MAJOR_JDK_VERSION>`を使用するJDKバージョンに置き換えます。

```kotlin
android {
    compileOptions {
        sourceCompatibility = <MAJOR_JDK_VERSION>
        targetCompatibility = <MAJOR_JDK_VERSION>
    }
}
```

 

Gradle 6.7は[Java toolchains support](https://docs.gradle.org/current/userguide/toolchains.html)を導入しました。
この機能を使用すると、次のことができます。
* コンパイル、テスト、および実行可能ファイルを実行するために、Gradleとは異なるJDKおよびJREを使用します。
* まだリリースされていない言語バージョンでコードをコンパイルおよびテストします。

toolchains supportを使用すると、GradleはローカルJDKを自動検出し、Gradleがビルドに必要な不足しているJDKをインストールできます。
これで、Gradle自体は任意のJDKで実行でき、メジャーJDKバージョンに依存するタスクの[リモートビルドキャッシュ機能](gradle-compilation-and-caches#gradle-build-cache-support)を再利用できます。

Kotlin Gradle pluginは、Kotlin/JVMコンパイルタスクのJava toolchainsをサポートしています。JSおよびNativeタスクはtoolchainsを使用しません。
Kotlinコンパイラは常にGradleデーモンが実行されているJDKで実行されます。
Java toolchain：
* JVMターゲットで使用できる[`-jdk-home`オプション](compiler-reference#jdk-home-path)を設定します。
* ユーザーが`jvmTarget`オプションを明示的に設定しない場合、[`compilerOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm)をtoolchainのJDKバージョンに設定します。
  ユーザーがtoolchainを構成しない場合、`jvmTarget`フィールドはデフォルト値を使用します。
  [JVMターゲットの互換性](#check-for-jvm-target-compatibility-of-related-compile-tasks)の詳細をご覧ください。
* すべてのJavaコンパイル、テスト、およびjavadocタスクで使用されるtoolchainを設定します。
* どのJDK [`kapt`ワーカー](kapt#run-kapt-tasks-in-parallel)が実行されているかに影響します。

次のコードを使用してtoolchainを設定します。プレースホルダー`<MAJOR_JDK_VERSION>`を使用するJDKバージョンに置き換えます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // またはより短く：
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例：
    jvmToolchain(17)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // またはより短く：
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // 例：
    jvmToolchain(17)
}
```

</TabItem>
</Tabs>

`kotlin`拡張機能を介してtoolchainを設定すると、Javaコンパイルタスクのtoolchainも更新されることに注意してください。

`java`拡張機能を介してtoolchainを設定でき、Kotlinコンパイルタスクはそれを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</TabItem>
</Tabs>

Gradle 8.0.2以降を使用する場合は、[toolchain resolver plugin](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)も追加する必要があります。 
このタイプのpluginは、toolchainをダウンロードするリポジトリを管理します。例として、`settings.gradle(.kts)`に次のpluginを追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("0.9.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.9.0'
}
```

</TabItem>
</Tabs>

`foojay-resolver-convention`のバージョンが[Gradleサイト](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)のGradleバージョンに対応していることを確認してください。

Gradleがどのtoolchainを使用しているかを理解するには、[ログレベル`--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)でGradleビルドを実行します。
出力に`[KOTLIN] Kotlin compilation 'jdkHome' argument:`で始まる文字列を見つけます。
コロンの後の部分は、toolchainからのJDKバージョンになります。

:::

特定のタスクに任意のJDK（ローカルも含む）を設定するには、[Task DSL](#set-jdk-version-with-the-task-dsl)を使用します。

[Kotlin pluginでのGradle JVM toolchain support](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)の詳細をご覧ください。

### Task DSLを使用してJDKバージョンを設定する

Task DSLを使用すると、`UsesKotlinJavaToolchain`インターフェースを実装する任意のタスクのJDKバージョンを設定できます。
現時点では、これらのタスクは`KotlinCompile`と`KaptTask`です。
GradleにメジャーJDKバージョンを検索させる場合は、ビルドスクリプトの`<MAJOR_JDK_VERSION>`プレースホルダーを置き換えます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task `->`
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
</Tabs>

または、ローカルJDKへのパスを指定し、プレースホルダー`<LOCAL_JDK_VERSION>`をこのJDKバージョンに置き換えることができます。

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // JDKへのパスを入れます
        JavaVersion.<LOCAL_JDK_VERSION> // たとえば、JavaVersion.17
    )
}
```

### コンパイラタスクを関連付ける

コンパイルを_関連付ける_には、一方のコンパイルが他方のコンパイルのコンパイル済み出力を使用するような関係を設定します。コンパイルを関連付けると、コンパイル間に`internal`可視性が確立されます。

Kotlinコンパイラは、各ターゲットの`test`コンパイルと`main`コンパイルなど、一部のコンパイルをデフォルトで関連付けます。
カスタムコンパイルの1つが別のコンパイルに接続されていることを表現する必要がある場合は、独自の関連コンパイルを作成します。

ソースセット間の可視性を推測するために、IDEが関連付けられたコンパイルをサポートするようにするには、次のコードを
`build.gradle(.kts)`に追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</TabItem>
</Tabs>

ここでは、`integrationTest`コンパイルは`main`コンパイルに関連付けられており、機能テストから`internal`
オブジェクトへのアクセスを提供します。

### Java Modules (JPMS)を有効にして構成する

Kotlin Gradle pluginが[Java Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)で動作するようにするには、
ビルドスクリプトに次の行を追加し、`YOUR_MODULE_NAME`をJPMSモジュールへの参照（たとえば、
`org.company.module`）に置き換えます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>
        
```kotlin
// Gradleバージョン7.0未満を使用する場合は、次の3行を追加します
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // javacにコンパイル済みのKotlinクラスを提供します – Java/Kotlin混合ソースが動作するために必要です
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// Gradleバージョン7.0未満を使用する場合は、次の3行を追加します
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // javacにコンパイル済みのKotlinクラスを提供します – Java/Kotlin混合ソースが動作するために必要です
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</TabItem>
</Tabs>

:::note
通常どおり、`module-info.java`を`src/main/java`ディレクトリに配置します。

モジュールの場合、Kotlinファイルのパッケージ名は、`module-info.java`のパッケージ名と一致している必要があります。そうでない場合、
「パッケージが空であるか存在しません」というビルドエラーが発生します。

:::

詳細については、以下をご覧ください。
* [Java Module Systemのモジュールの構築](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [Java Module Systemを使用したアプリケーションの構築](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlinでの「モジュール」の意味](visibility-modifiers#modules)

### その他の詳細

[Kotlin/JVM](jvm-get-started)の詳細をご覧ください。

#### コンパイルタスクでのアーティファクトの使用を無効にする

まれなシナリオでは、循環依存関係エラーが原因でビルドが失敗する可能性があります。たとえば、1つのコンパイルが別のコンパイルのすべての内部宣言を表示でき、生成されたアーティファクト
が両方のコンパイルタスクの出力に依存している場合などです。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存関係エラーを修正するために、Gradleプロパティ`archivesTaskOutputAsFriendModule`を追加しました。
このプロパティは、コンパイルタスクでのアーティファクト入力の使用を制御し、タスクの依存関係が結果として作成されるかどうかを決定します。

デフォルトでは、このプロパティはタスクの依存関係を追跡するために`true`に設定されています。循環依存関係エラーが発生した場合は、
コンパイルタスクでのアーティファクトの使用を無効にして、タスクの依存関係を削除し、循環
依存関係エラーを回避できます。

コンパイルタスクでのアーティファクトの使用を無効にするには、`gradle.properties`ファイルに以下を追加します。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 遅延Kotlin/JVMタスクの作成

Kotlin 1.8.20以降、Kotlin Gradle pluginはすべてのタスクを登録し、ドライランでは構成しません。

#### コンパイルタスクのdestinationDirectoryのデフォルト以外の場所

Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile`タスクの`destinationDirectory`の場所をオーバーライドする場合は、
ビルドスクリプトを更新してください。`sourceSets.main.kotlin.classesDirectories`をJARファイルの`sourceSets.main.outputs`に明示的に追加する必要があります。

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 複数のプラットフォームをターゲットにする

[複数のプラットフォーム](multiplatform-dsl-reference#targets)をターゲットとするプロジェクト（[マルチプラットフォームプロジェクト](multiplatform-intro)と呼ばれる）では、`kotlin-multiplatform` pluginが必要です。

:::note
`kotlin-multiplatform` pluginは、Gradle 7.6.3以降で動作します。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

さまざまなプラットフォーム向けの[Kotlin Multiplatform](multiplatform-intro)と、
[iOSおよびAndroid向けのKotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)の詳細をご覧ください。

## Androidをターゲットにする

Androidアプリケーションの作成には、Android Studioを使用することをお勧めします。[Android Gradle pluginの使用方法をご覧ください](https://developer.android.com/studio/releases/gradle-plugin)。

## JavaScriptをターゲットにする

JavaScriptをターゲットにする場合は、`kotlin-multiplatform` pluginも使用します。[Kotlin/JSプロジェクトの設定の詳細をご覧ください](js-project-setup)

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

### JavaScriptのKotlinとJavaのソース

このpluginはKotlinファイルのみで動作するため、KotlinファイルとJavaファイルは分離しておくことをお勧めします（プロジェクトにJavaファイルが含まれている場合）。分離して格納しない場合は、`sourceSets{}`ブロックでソースフォルダーを指定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</TabItem>
</Tabs>

## KotlinBasePluginインターフェースを使用した構成アクションのトリガー

Kotlin Gradle plugin（JVM、JS、Multiplatform、Nativeなど）が適用されるたびに、何らかの構成アクションをトリガーするには、すべてのKotlin pluginが継承する`KotlinBasePlugin`インターフェースを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // ここでアクションを構成します
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // ここでアクションを構成します
}
```

</TabItem>
</Tabs>

## 依存関係の構成

ライブラリへの依存関係を追加するには、ソースセットDSLの`dependencies{}`ブロックに必要な[タイプ](#dependency-types)（たとえば、`implementation`）の依存関係を設定します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

または、[トップレベルで依存関係を設定する](#set-dependencies-at-top-level)こともできます。

### 依存関係のタイプ

要件に基づいて依存関係のタイプを選択します。
<table>
<tr>
        <th>Type</th>
        <th>Description</th>
        <th>When to use</th>
</tr>
<tr>
<td>
`api`
</td>
<td>
コンパイル時と実行時の両方で使用され、ライブラリの利用者にエクスポートされます。
</td>
<td>
依存関係の型が現在のモジュールのパブリックAPIで使用されている場合は、`api`依存関係を使用します。
</td>
</tr>
<tr>
<td>
`implementation`
</td>
<td>
現在のモジュールのコンパイル時と実行時に使用されますが、`implementation`依存関係を持つモジュールに依存する他のモジュールのコンパイルには公開されません。
</td>
<td>

<p>
   モジュールの内部ロジックに必要な依存関係に使用します。
</p>
<p>
   モジュールが公開されていないエンドポイントアプリケーションである場合は、`api`依存関係ではなく`implementation`依存関係を使用します。
</p>
</td>
</tr>
<tr>
<td>
`compileOnly`
</td>
<td>
現在のモジュールのコンパイルに使用され、実行時や他のモジュールのコンパイル時には使用できません。
</td>
<td>
実行時にサードパーティの実装が利用可能なAPIに使用します。
</td>
</tr>
<tr>
<td>
`runtimeOnly`
</td>
<td>
実行時に使用できますが、モジュールのコンパイル時には表示されません。
</td>
<td>
</td>
</tr>
</table>

### 標準ライブラリへの依存関係

標準ライブラリ（`stdlib`）への依存関係は、各ソースセットに自動的に追加されます。使用される標準ライブラリのバージョンは、Kotlin Gradle pluginのバージョンと同じです。

プラットフォーム固有のソースセットの場合、ライブラリの対応するプラットフォーム固有のバリアントが使用されますが、共通の標準
ライブラリは残りの部分に追加されます。Kotlin Gradle pluginは、Gradleビルドスクリプトの
`compilerOptions.jvmTarget` [コンパイラオプション](gradle-compiler-options)に応じて、適切なJVM標準ライブラリを選択します。

標準ライブラリの依存関係を明示的に宣言した場合（たとえば、異なるバージョンが必要な場合）、Kotlin Gradle
pluginはそれをオーバーライドしたり、2番目の標準ライブラリを追加したりしません。

標準ライブラリがまったく必要ない場合は、次のGradleプロパティを`gradle.properties`ファイルに追加できます。

```none
kotlin.stdlib.default.dependency=false
```

#### 推移的な依存関係のバージョンアライメント

Kotlin標準ライブラリバージョン1.9.20以降、Gradleは標準ライブラリに含まれるメタデータを使用して、推移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係を自動的に
調整します。

Kotlin標準ライブラリのバージョン1.8.0〜1.9.10の依存関係を追加する場合は、たとえば、`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`の場合、Kotlin Gradle Pluginは、このKotlinバージョンを
推移的な`kotlin-stdlib-jdk7`および`kotlin-stdlib-jdk8`依存関係に使用します。これにより、異なる標準ライブラリバージョンからのクラスの重複を回避できます。[`kotlin-stdlib-jdk7`と`kotlin-stdlib-jdk