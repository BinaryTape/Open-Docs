[//]: # (title: Kotlinカスタムスクリプトの始め方 – チュートリアル)

> Kotlinカスタムスクリプトは[実験的](components-stability.md)です。これは予告なく廃止または変更される可能性があります。
> 評価目的のみにご使用ください。[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。
>
{style="warning"}

_Kotlinスクリプト_は、Kotlinコードを事前コンパイルや実行可能ファイルへのパッケージングなしにスクリプトとして実行可能にする技術です。

Kotlinスクリプトの概要と例については、KotlinConf'19でのRodrigo Oliveira氏によるトーク[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)をご覧ください。

このチュートリアルでは、Maven依存関係を持つ任意のKotlinコードを実行するKotlinスクリプトプロジェクトを作成します。
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

指定されたMaven依存関係（この例では`kotlinx-html-jvm`）は、実行中に指定されたMavenリポジトリまたはローカルキャッシュから解決され、スクリプトの残りの部分で使用されます。

## プロジェクト構造

最小限のKotlinカスタムスクリプトプロジェクトは、2つの部分で構成されます。

*   _スクリプト定義_ – このスクリプトタイプがどのように認識され、処理され、コンパイルされ、実行されるかを定義する、パラメーターと構成のセット。
*   _スクリプトホスト_ – スクリプトのコンパイルと実行を処理するアプリケーションまたはコンポーネント。実際にこのタイプのスクリプトを実行します。

これらすべてを考慮すると、プロジェクトを2つのモジュールに分割するのが最善です。

## 始める前に

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトを作成する

1.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2.  左側のパネルで、**New Project**を選択します。
3.  新しいプロジェクトに名前を付け、必要に応じてその場所を変更します。

    > **Create Git repository**チェックボックスを選択して、新しいプロジェクトをバージョン管理下に置きます。後からいつでも行うことができます。
    >
    {style="tip"}

4.  **Language**リストから、**Kotlin**を選択します。
5.  **Gradle**ビルドシステムを選択します。
6.  **JDK**リストから、プロジェクトで使用したい[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
    *   JDKがコンピューターにインストールされているが、IDEで定義されていない場合、**Add JDK**を選択し、JDKホームディレクトリへのパスを指定します。
    *   必要なJDKがコンピューターにない場合、**Download JDK**を選択します。

7.  **Gradle DSL**の言語としてKotlinまたはGradleを選択します。
8.  **Create**をクリックします。

![カスタムKotlinスクリプトのルートプロジェクトを作成](script-deps-create-root-project.png){width=700}

## スクリプトモジュールを追加する

これで、空のKotlin/JVM Gradleプロジェクトができました。必要なモジュールであるスクリプト定義とスクリプトホストを追加します。

1.  IntelliJ IDEAで、**File | New | Module**を選択します。
2.  左側のパネルで、**New Module**を選択します。このモジュールがスクリプト定義になります。
3.  新しいモジュールに名前を付け、必要に応じてその場所を変更します。
4.  **Language**リストから、**Java**を選択します。
5.  ビルドスクリプトをKotlinで記述したい場合、**Gradle**ビルドシステムと**Gradle DSL**にKotlinを選択します。
6.  モジュールの親として、ルートモジュールを選択します。
7.  **Create**をクリックします。

![スクリプト定義モジュールを作成](script-deps-module-definition.png){width=700}

8.  モジュールの`build.gradle(.kts)`ファイルで、Kotlin Gradleプラグインの`version`を削除します。これはすでにルートプロジェクトのビルドスクリプトに含まれています。

9.  前のステップをもう一度繰り返して、スクリプトホスト用のモジュールを作成します。

プロジェクトは次の構造になっているはずです。

![カスタムスクリプトプロジェクトの構造](script-deps-project-structure.png){width=300}

このようなプロジェクトの例やその他のKotlinスクリプトの例は、[kotlin-script-examples GitHubリポジトリ](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)で見つけることができます。

## スクリプト定義を作成する

まず、スクリプトタイプを定義します。開発者がこのタイプのスクリプトで何を書けるか、そしてそれがどのように処理されるかです。
このチュートリアルでは、スクリプト内の`@Repository`および`@DependsOn`アノテーションのサポートが含まれます。

1.  スクリプト定義モジュールで、`build.gradle(.kts)`の`dependencies`ブロックにKotlinスクリプトコンポーネントへの依存関係を追加します。これらの依存関係は、スクリプト定義に必要なAPIを提供します。

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

2.  モジュール内に`src/main/kotlin/`ディレクトリを作成し、例えば`scriptDef.kt`のようなKotlinソースファイルを追加します。

3.  `scriptDef.kt`でクラスを作成します。これは、このタイプのスクリプトのスーパークラスになるため、`abstract`または`open`として宣言します。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

    このクラスは、後でスクリプト定義への参照としても機能します。

4.  クラスをスクリプト定義にするには、`@KotlinScript`アノテーションでマークします。アノテーションに2つのパラメーターを渡します。
    *   `fileExtension` – このスクリプトタイプのファイル拡張子を定義する、`.kts`で終わる文字列です。
    *   `compilationConfiguration` – `ScriptCompilationConfiguration`を拡張し、このスクリプト定義のコンパイルの詳細を定義するKotlinクラスです。これは次のステップで作成します。

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

    > このチュートリアルでは、KotlinスクリプトAPIの説明なしに、動作するコードのみを提供します。
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

    完全なコードは[こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)で確認できます。

## スクリプトホストを作成する

次のステップはスクリプトホストを作成することです。これはスクリプトの実行を処理するコンポーネントです。

1.  スクリプトホストモジュールで、`build.gradle(.kts)`の`dependencies`ブロックに依存関係を追加します。
    *   スクリプトホストに必要なAPIを提供するKotlinスクリプトコンポーネント
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

2.  モジュール内に`src/main/kotlin/`ディレクトリを作成し、例えば`host.kt`のようなKotlinソースファイルを追加します。

3.  アプリケーションの`main`関数を定義します。その本体では、スクリプトファイルへのパスという1つの引数があることを確認し、スクリプトを実行します。次のステップで、`evalFile`という別の関数でスクリプト実行を定義します。今は空で宣言しておきます。

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

4.  スクリプト評価関数を定義します。ここでスクリプト定義を使用します。型パラメーターとしてスクリプト定義クラスを指定して`createJvmCompilationConfigurationFromTemplate`を呼び出すことで取得します。次に、スクリプトコードとそのコンパイル構成を渡して`BasicJvmScriptingHost().eval`を呼び出します。`eval`は`ResultWithDiagnostics`のインスタンスを返すため、それを関数の戻り型として設定します。

    ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
    ```

5.  `main`関数を調整して、スクリプト実行に関する情報を出力するようにします。

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

## スクリプトを実行する

スクリプトホストがどのように動作するかを確認するために、実行するスクリプトと実行構成を準備します。

1.  プロジェクトのルートディレクトリに、以下の内容で`html.scriptwithdeps.kts`ファイルを作成します。

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

    これは`kotlinx-html-jvm`ライブラリの関数を使用しており、これは`@DependsOn`アノテーションの引数で参照されています。

2.  スクリプトホストを起動し、このファイルを実行する実行構成を作成します。
    1.  `host.kt`を開き、`main`関数に移動します。左側に**Run**ガターアイコンがあります。
    2.  ガターアイコンを右クリックし、**Modify Run Configuration**を選択します。
    3.  **Create Run Configuration**ダイアログで、**Program arguments**にスクリプトファイル名を追加し、**OK**をクリックします。

    ![スクリプトホストの実行構成](script-deps-run-config.png){width=800}

3.  作成した構成を実行します。

スクリプトがどのように実行され、指定されたリポジトリで`kotlinx-html-jvm`への依存関係を解決し、その関数の呼び出し結果を出力するかがわかります。

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

依存関係の解決には、初回実行時に時間がかかる場合があります。その後の実行は、ローカルのMavenリポジトリからダウンロードされた依存関係を使用するため、はるかに速く完了します。

## 次のステップ

シンプルなKotlinスクリプトプロジェクトを作成したら、このトピックに関する詳細情報を見つけてください。
*   [KotlinスクリプトKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を読む
*   その他の[Kotlinスクリプトの例](https://github.com/Kotlin/kotlin-script-examples)を閲覧する
*   Rodrigo Oliveira氏によるトーク [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)を視聴する