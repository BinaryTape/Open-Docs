[//]: # (title: Kotlinカスタムスクリプティング入門 – チュートリアル)

> Kotlinカスタムスクリプティングは[試験的機能](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

_Kotlinスクリプティング_は、事前コンパイルや実行可能ファイルへのパッケージングなしで、Kotlinコードをスクリプトとして実行可能にする技術です。

例を交えたKotlinスクリプティングの概要については、Rodrigo OliveiraによるKotlinConf'19でのトーク「[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)」をご覧ください。

このチュートリアルでは、Maven依存関係（Maven dependencies）と共に任意のKotlinコードを実行するKotlinスクリプティングプロジェクトを作成します。
次のようなスクリプトを実行できるようになります。

```kotlin
@file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

import kotlinx.html.*
import kotlinx.html.stream.*
import kotlinx.html.attributes.*

val addressee = "World"

print(
    createHTML().html {
        body {
            h1 { +"Hello, $addressee!" }
        }
    }
)
```

指定されたMaven依存関係（この例では `kotlinx-html-jvm`）は、実行時に指定されたMavenリポジトリまたはローカルキャッシュから解決され、スクリプトの残りの部分で使用されます。

## プロジェクト構造

最小限のKotlinカスタムスクリプティングプロジェクトは、次の2つの部分で構成されます。

*   _スクリプト定義_ – このスクリプトタイプがどのように認識、処理、コンパイル、実行されるかを定義する一連のパラメータと設定。
*   _スクリプティングホスト_ – スクリプトのコンパイルと実行を処理するアプリケーションまたはコンポーネント。つまり、このタイプのスクリプトを実際に実行するものです。

これらを考慮すると、プロジェクトを2つのモジュールに分割するのが最適です。

## 開始する前に

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトの作成

1.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2.  左側のパネルで、**New Project**を選択します。
3.  新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

    > **Create Git repository**チェックボックスを選択すると、新しいプロジェクトをバージョン管理下に置くことができます。これは後でいつでも行うことができます。
    >
    {style="tip"}

4.  **Language**リストから、**Kotlin**を選択します。
5.  **Gradle**ビルドシステムを選択します。
6.  **JDK**リストから、プロジェクトで使用する[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
    *   JDKがコンピューターにインストールされているがIDEで定義されていない場合は、**Add JDK**を選択し、JDKのホームディレクトリへのパスを指定します。
    *   必要なJDKがコンピューターにない場合は、**Download JDK**を選択します。

7.  **Gradle DSL**の言語としてKotlinまたはGroovyを選択します。
8.  **Create**をクリックします。

![Create a root project for custom Kotlin scripting](script-deps-create-root-project.png){width=700}

## スクリプティングモジュールの追加

これで、空のKotlin/JVM Gradleプロジェクトができました。必要なモジュール、スクリプト定義、およびスクリプティングホストを追加します。

1.  IntelliJ IDEAで、**File | New | Module**を選択します。
2.  左側のパネルで、**New Module**を選択します。このモジュールがスクリプト定義となります。
3.  新しいモジュールに名前を付け、必要に応じて場所を変更します。
4.  **Language**リストから、**Java**を選択します。
5.  **Gradle**ビルドシステムと、ビルドスクリプトをKotlinで記述したい場合は**Gradle DSL**にKotlinを選択します。
6.  モジュールの親として、ルートモジュールを選択します。
7.  **Create**をクリックします。

    ![Create script definition module](script-deps-module-definition.png){width=700}

8.  モジュールの`build.gradle(.kts)`ファイルで、Kotlin Gradleプラグインのバージョンを削除します。これはすでにルートプロジェクトのビルドスクリプトにあります。

9.  スクリプティングホスト用のモジュールを作成するために、前の手順をもう一度繰り返します。

プロジェクトは次の構造になっているはずです。

![Custom scripting project structure](script-deps-project-structure.png){width=300}

このようなプロジェクトの例やその他のKotlinスクリプティングの例は、[kotlin-script-examples GitHubリポジトリ](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)で見つけることができます。

## スクリプト定義の作成

まず、スクリプトタイプを定義します。つまり、このタイプのスクリプトで開発者が何を書けるか、そしてそれがどのように処理されるかです。
このチュートリアルでは、スクリプト内の`@Repository`および`@DependsOn`アノテーションのサポートが含まれます。

1.  スクリプト定義モジュールで、`build.gradle(.kts)`の`dependencies`ブロックにKotlinスクリプティングコンポーネントの依存関係を追加します。これらの依存関係は、スクリプト定義に必要なAPIを提供します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
        implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
        // coroutines dependency is required for this particular definition
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
        // coroutines dependency is required for this particular definition
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'

    }
    ```

    </tab>
    </tabs>

2.  モジュール内に`src/main/kotlin/`ディレクトリを作成し、Kotlinソースファイル（例: `scriptDef.kt`）を追加します。

3.  `scriptDef.kt`でクラスを作成します。このクラスはこのタイプのスクリプトのスーパークラスとなるため、`abstract`または`open`として宣言します。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

    このクラスは後でスクリプト定義への参照としても機能します。

4.  クラスをスクリプト定義にするには、`@KotlinScript`アノテーションでマークします。アノテーションに2つのパラメータを渡します。
    *   `fileExtension` – このタイプのスクリプトのファイル拡張子を定義する、`.kts`で終わる文字列。
    *   `compilationConfiguration` – `ScriptCompilationConfiguration`を拡張し、このスクリプト定義のコンパイルの詳細を定義するKotlinクラス。これは次のステップで作成します。

    ```kotlin
     // @KotlinScript annotation marks a script definition class
     @KotlinScript(
         // File extension for the script type
         fileExtension = "scriptwithdeps.kts",
         // Compilation configuration for the script type
         compilationConfiguration = ScriptWithMavenDepsConfiguration::class
     )
     abstract class ScriptWithMavenDeps

     object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
    ```

    > このチュートリアルでは、KotlinスクリプティングAPIの説明なしに動作するコードのみを提供します。
    > 詳細な説明付きの同じコードは[GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)で見つけることができます。
    >
    {style="note"}

5.  以下に示すように、スクリプトコンパイル構成を定義します。

    ```kotlin
     object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
         {
             // Implicit imports for all scripts of this type
             defaultImports(DependsOn::class, Repository::class)
             jvm {
                 // Extract the whole classpath from context classloader and use it as dependencies
                 dependenciesFromCurrentContext(wholeClasspath = true)
             }
             // Callbacks
             refineConfiguration {
                 // Process specified annotations with the provided handler
                 onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
             }
         }
     )
    ```

    `configureMavenDepsOnAnnotations`関数は次のとおりです。

    ```kotlin
     // Handler that reconfigures the compilation on the fly
     fun configureMavenDepsOnAnnotations(context: ScriptConfigurationRefinementContext): ResultWithDiagnostics<ScriptCompilationConfiguration> {
         val annotations = context.collectedData?.get(ScriptCollectedData.collectedAnnotations)?.takeIf { it.isNotEmpty() }
             ?: return context.compilationConfiguration.asSuccess()
         return runBlocking {
             resolver.resolveFromScriptSourceAnnotations(annotations)
         }.onSuccess {
             context.compilationConfiguration.with {
                 dependencies.append(JvmDependency(it))
             }.asSuccess()
         }
     }

     private val resolver = CompoundDependenciesResolver(FileSystemDependenciesResolver(), MavenDependenciesResolver())
    ```

    完全なコードは[こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)で見つけることができます。

## スクリプティングホストの作成

次のステップはスクリプティングホストの作成です。これはスクリプト実行を処理するコンポーネントです。

1.  スクリプティングホストモジュールで、`build.gradle(.kts)`の`dependencies`ブロックに依存関係を追加します。
    *   スクリプティングホストに必要なAPIを提供するKotlinスクリプティングコンポーネント
    *   以前に作成したスクリプト定義モジュール

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-scripting-common")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
        implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
        implementation(project(":script-definition")) // the script definition module
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
        implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
        implementation project(':script-definition') // the script definition module
    }
    ```

    </tab>
    </tabs>

2.  モジュール内に`src/main/kotlin/`ディレクトリを作成し、Kotlinソースファイル（例: `host.kt`）を追加します。

3.  アプリケーションの`main`関数を定義します。その本体で、スクリプトファイルへのパスという1つの引数があることを確認し、スクリプトを実行します。スクリプトの実行は、次のステップで`evalFile`という別の関数で定義します。今のところは空で宣言しておきます。

    `main`は次のようになります。

    ```kotlin
     fun main(vararg args: String) {
         if (args.size != 1) {
             println("usage: <app> <script file>")
         } else {
             val scriptFile = File(args[0])
             println("Executing script $scriptFile")
             evalFile(scriptFile)
         }
     }
    ```

4.  スクリプト評価関数を定義します。ここでスクリプト定義を使用します。スクリプト定義クラスを型パラメータとして`createJvmCompilationConfigurationFromTemplate`を呼び出すことで取得します。次に、スクリプトコードとそのコンパイル構成を渡して`BasicJvmScriptingHost().eval`を呼び出します。`eval`は`ResultWithDiagnostics`のインスタンスを返すため、これを関数の戻り値の型として設定します。

    ```kotlin
     fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
         val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
         return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
     }
    ```

5.  スクリプトの実行に関する情報を出力するように`main`関数を調整します。

    ```kotlin
     fun main(vararg args: String) {
         if (args.size != 1) {
             println("usage: <app> <script file>")
         } else {
             val scriptFile = File(args[0])
             println("Executing script $scriptFile")
             val res = evalFile(scriptFile)
             res.reports.forEach {
                 if (it.severity > ScriptDiagnostic.Severity.DEBUG) {
                     println(" : ${it.message}" + if (it.exception == null) "" else ": ${it.exception}")
                 }
             }
         }
     }
    ```

完全なコードは[こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)で見つけることができます。

## スクリプトの実行

スクリプティングホストがどのように機能するかを確認するには、実行するスクリプトと実行構成を準備します。

1.  プロジェクトのルートディレクトリに、次の内容で`html.scriptwithdeps.kts`ファイルを作成します。

    ```kotlin
    @file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
    @file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

    import kotlinx.html.*; import kotlinx.html.stream.*; import kotlinx.html.attributes.*

    val addressee = "World"

    print(
        createHTML().html {
            body {
                h1 { +"Hello, $addressee!" }
            }
        }
    )
    ```

    これは、`@DependsOn`アノテーション引数で参照されている`kotlinx-html-jvm`ライブラリの関数を使用します。

2.  スクリプティングホストを起動し、このファイルを実行する実行構成を作成します。
    1.  `host.kt`を開き、`main`関数に移動します。左側に**Run**ガターアイコンがあります。
    2.  ガターアイコンを右クリックし、**Modify Run Configuration**を選択します。
    3.  **Create Run Configuration**ダイアログで、**Program arguments**にスクリプトファイル名を追加し、**OK**をクリックします。

        ![Scripting host run configuration](script-deps-run-config.png){width=800}

3.  作成した構成を実行します。

スクリプトがどのように実行され、指定されたリポジトリで`kotlinx-html-jvm`の依存関係を解決し、その関数の呼び出し結果を出力するかがわかります。

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

依存関係の解決は、最初の実行では時間がかかる場合があります。その後の実行は、ローカルのMavenリポジトリからダウンロードされた依存関係を使用するため、はるかに高速に完了します。

## 次のステップ

簡単なKotlinスクリプティングプロジェクトを作成したら、このトピックに関する詳細情報を確認してください。
*   [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を読む
*   その他の[Kotlinスクリプティング例](https://github.com/Kotlin/kotlin-script-examples)を閲覧する
*   Rodrigo Oliveiraによるトーク「[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)」を視聴する