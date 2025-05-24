---
title: "Kotlinカスタムスクリプトを始める - チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::caution
Kotlinカスタムスクリプトは[試験的](components-stability)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。

:::

_Kotlin scripting_ は、事前にコンパイルしたり、実行可能ファイルにパッケージ化したりせずに、Kotlinコードをスクリプトとして実行できるようにする技術です。

Kotlinスクリプトの概要と例については、KotlinConf'19のRodrigo Oliveiraによる講演[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)をご覧ください。

このチュートリアルでは、Mavenの依存関係を持つ任意のKotlinコードを実行するKotlinスクリプトプロジェクトを作成します。次のようなスクリプトを実行できます。

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

指定されたMavenの依存関係（この例では`kotlinx-html-jvm`）は、実行中に指定されたMaven
リポジトリまたはローカルキャッシュから解決され、スクリプトの残りの部分で使用されます。

## プロジェクト構成

最小限のKotlinカスタムスクリプトプロジェクトには、次の2つの部分が含まれています。

* _スクリプト定義_ – このスクリプトタイプを認識、処理、コンパイル、および実行する方法を定義する一連のパラメータと構成。
* _スクリプトホスト_ – スクリプトのコンパイルと実行を処理するアプリケーションまたはコンポーネント。実際には、このタイプのスクリプトを実行します。

これらすべてを考慮して、プロジェクトを2つのモジュールに分割するのが最適です。

## 開始する前に

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールします。

## プロジェクトを作成する

1. IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2. 左側のパネルで、**New Project**を選択します。
3. 新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

   > **Create Git repository**チェックボックスを選択して、新しいプロジェクトをバージョン管理下に置きます。いつでも実行できます。
   >
   

4. **Language**リストから、**Kotlin**を選択します。
5. **Gradle**ビルドシステムを選択します。
6. **JDK**リストから、プロジェクトで使用する[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
   * JDKがコンピューターにインストールされていても、IDEで定義されていない場合は、**Add JDK**を選択し、JDKホームディレクトリへのパスを指定します。
   * コンピューターに必要なJDKがない場合は、**Download JDK**を選択します。

7. **Gradle DSL**にKotlinまたはGradle言語を選択します。
8. **Create**をクリックします。

<img src="/img/script-deps-create-root-project.png" alt="カスタムKotlinスクリプトのルートプロジェクトを作成する" width="700" style={{verticalAlign: 'middle'}}/>

## スクリプトモジュールを追加する

これで、空のKotlin/JVM Gradleプロジェクトができました。必要なモジュール、スクリプト定義、およびスクリプトホストを追加します。

1. IntelliJ IDEAで、**File | New | Module**を選択します。
2. 左側のパネルで、**New Module**を選択します。このモジュールはスクリプト定義になります。
3. 新しいモジュールに名前を付け、必要に応じて場所を変更します。
4. **Language**リストから、**Java**を選択します。
5. **Gradle DSL**に**Gradle**ビルドシステムとKotlinを選択します。Kotlinでビルドスクリプトを記述する場合。
6. モジュールの親として、ルートモジュールを選択します。
7. **Create**をクリックします。

   <img src="/img/script-deps-module-definition.png" alt="スクリプト定義モジュールを作成する" width="700" style={{verticalAlign: 'middle'}}/>

8. モジュールの`build.gradle(.kts)`ファイルで、Kotlin Gradleプラグインの`version`を削除します。これは、ルートプロジェクトのビルドスクリプトにすでに存在します。

9. 前の手順をもう一度繰り返して、スクリプトホストのモジュールを作成します。

プロジェクトは次の構造になっている必要があります。

<img src="/img/script-deps-project-structure.png" alt="カスタムスクリプトプロジェクトの構造" width="300" style={{verticalAlign: 'middle'}}/>

このようなプロジェクトの例、およびその他のKotlinスクリプトの例は、[kotlin-script-examples GitHubリポジトリ](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)にあります。

## スクリプト定義を作成する

まず、スクリプトのタイプを定義します。開発者がこのタイプのスクリプトに何を書くことができ、どのように処理されるかを定義します。
このチュートリアルでは、これにはスクリプトの`@Repository`および`@DependsOn`アノテーションのサポートが含まれています。

1. スクリプト定義モジュールで、`build.gradle(.kts)`の`dependencies`ブロックにKotlinスクリプトコンポーネントへの依存関係を追加します。これらの依存関係は、スクリプト定義に必要なAPIを提供します。

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // coroutines dependency is required for this particular definition
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1") 
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
       // coroutines dependency is required for this particular definition
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'

   }
   ```

   </TabItem>
   </Tabs>

2. モジュールに`src/main/kotlin/`ディレクトリを作成し、Kotlinソースファイル（たとえば、`scriptDef.kt`）を追加します。

3. `scriptDef.kt`で、クラスを作成します。これはこのタイプのスクリプトのスーパークラスになるため、`abstract`または`open`として宣言します。

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

   このクラスは、後でスクリプト定義への参照としても機能します。

4. クラスをスクリプト定義にするには、`@KotlinScript`アノテーションでマークします。アノテーションに2つのパラメータを渡します。
   * `fileExtension` – このタイプのスクリプトのファイル拡張子を定義する`.kts`で終わる文字列。
   * `compilationConfiguration` – `ScriptCompilationConfiguration`を拡張し、このスクリプト定義のコンパイルの特殊性を定義するKotlinクラス。次のステップで作成します。

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
   
   > このチュートリアルでは、KotlinスクリプトAPIの説明なしで、動作するコードのみを提供します。
   > 詳細な説明付きの同じコードは、[GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)にあります。
   > 
   

5. 次に示すように、スクリプトコンパイル構成を定義します。

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

   完全なコードは[こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt)にあります。

## スクリプトホストを作成する

次のステップは、スクリプトの実行を処理するコンポーネントであるスクリプトホストを作成することです。

1. スクリプトホストモジュールで、`build.gradle(.kts)`の`dependencies`ブロックに依存関係を追加します。
   * スクリプトホストに必要なAPIを提供するKotlinスクリプトコンポーネント
   * 以前に作成したスクリプト定義モジュール

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // the script definition module
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // the script definition module
   }
   ```

   </TabItem>
   </Tabs>

2. モジュールに`src/main/kotlin/`ディレクトリを作成し、Kotlinソースファイル（たとえば、`host.kt`）を追加します。

3. アプリケーションの`main`関数を定義します。その本文で、引数が1つ（スクリプトファイルへのパス）があることを確認し、スクリプトを実行します。次のステップで、別の関数`evalFile`でスクリプトの実行を定義します。
   今のところ、空のままにしておきます。

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

4. スクリプト評価関数を定義します。ここでは、スクリプト定義を使用します。スクリプト定義クラスを型パラメータとして使用して、`createJvmCompilationConfigurationFromTemplate`を呼び出すことによって、スクリプト定義を取得します。次に、スクリプトコードとそのコンパイル構成を渡して、`BasicJvmScriptingHost().eval`を呼び出します。`eval`は`ResultWithDiagnostics`のインスタンスを返すため、それを関数の戻り値の型として設定します。

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. スクリプトの実行に関する情報を出力するように`main`関数を調整します。

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

完全なコードは[こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)にあります。

## スクリプトを実行する

スクリプトホストがどのように機能するかを確認するには、実行するスクリプトと実行構成を準備します。

1. 次の内容でファイル`html.scriptwithdeps.kts`をプロジェクトのルートディレクトリに作成します。

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
   
   `@DependsOn`アノテーション引数で参照されている`kotlinx-html-jvm`ライブラリの関数を使用します。

2. スクリプトホストを起動してこのファイルを実行する実行構成を作成します。
   1. `host.kt`を開き、`main`関数に移動します。左側に**Run**ガターアイコンがあります。
   2. ガターアイコンを右クリックし、**Modify Run Configuration**を選択します。
   3. **Create Run Configuration**ダイアログで、スクリプトファイル名を**Program arguments**に追加し、**OK**をクリックします。
   
      <img src="/img/script-deps-run-config.png" alt="スクリプトホストの実行構成" width="800" style={{verticalAlign: 'middle'}}/>

3. 作成された構成を実行します。

スクリプトが実行され、指定されたリポジトリで`kotlinx-html-jvm`への依存関係が解決され、その関数の呼び出し結果が出力される様子が表示されます。

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

依存関係の解決には、最初の実行に時間がかかる場合があります。後続の実行では、ローカルのMavenリポジトリからダウンロードした依存関係を使用するため、はるかに高速に完了します。

## 次は何ですか？

簡単なKotlinスクリプトプロジェクトを作成したら、このトピックに関する詳細情報を検索してください。
* [KotlinスクリプトKEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)を読む
* [Kotlinスクリプトの例](https://github.com/Kotlin/kotlin-script-examples)をさらに参照する
* Rodrigo Oliveiraによる講演[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)を見る

  ```