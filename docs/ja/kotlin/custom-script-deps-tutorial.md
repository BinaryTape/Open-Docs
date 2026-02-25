[//]: # (title: Kotlinカスタムスクリプティングを始める – チュートリアル)

> Kotlinカスタムスクリプティングは[実験的（Experimental）](components-stability.md)な機能です。将来的に廃止または変更される可能性があります。
> 評価目的でのみ使用してください。フィードバックは[YouTrack](https://kotl.in/issue)でお待ちしています。
>
{style="warning"}

「Kotlinスクリプティング（Kotlin scripting）」は、事前のコンパイルや実行可能ファイルへのパッケージ化を行わずに、Kotlinコードをスクリプトとして実行することを可能にする技術です。

例を用いたKotlinスクリプティングの概要については、KotlinConf'19でのRodrigo Oliveira氏による講演「[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)」を確認してください。

このチュートリアルでは、Maven依存関係を含む任意のKotlinコードを実行するKotlinスクリプティングプロジェクトを作成します。次のようなスクリプトを実行できるようになります：

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

指定されたMaven依存関係（この例では `kotlinx-html-jvm`）は、実行中に指定されたMavenリポジトリまたはローカルキャッシュから解決され、スクリプトの残りの部分で使用されます。

## プロジェクト構造

最小限のKotlinカスタムスクリプティングプロジェクトは、2つのパートで構成されます：

* **スクリプト定義（Script definition）** – そのスクリプトタイプがどのように認識、処理、コンパイル、および実行されるかを定義する一連のパラメータと構成。
* **スクリプティングホスト（Scripting host）** – スクリプトのコンパイルと実行を処理し、実際にそのタイプのスクリプトを実行するアプリケーションまたはコンポーネント。

これらを踏まえ、プロジェクトを2つのモジュールに分割するのが最善です。

## 始める前に

最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) をダウンロードしてインストールしてください。

## プロジェクトの作成

1. IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
2. 左側のパネルで、**New Project** を選択します。
3. 新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

   > **Create Git repository** チェックボックスを選択すると、新しいプロジェクトをバージョン管理下に置くことができます。これは後からいつでも行うことができます。
   >
   {style="tip"}

4. **Language** リストから **Kotlin** を選択します。
5. **Gradle** ビルドシステムを選択します。
6. **JDK** リストから、プロジェクトで使用する [JDK](https://www.oracle.com/java/technologies/downloads/) を選択します。
   * JDKがコンピュータにインストールされているがIDEで定義されていない場合は、**Add JDK** を選択し、JDKのホームディレクトリへのパスを指定してください。
   * 必要なJDKがコンピュータにない場合は、**Download JDK** を選択してください。

7. **Gradle DSL** に Kotlin または Gradle 言語を選択します。
8. **Create** をクリックします。

![カスタムKotlinスクリプティング用のルートプロジェクトを作成する](script-deps-create-root-project.png){width=700}

## スクリプティングモジュールの追加

これで空のKotlin/JVM Gradleプロジェクトが作成されました。必要なモジュール、スクリプト定義、およびスクリプティングホストを追加します：

1. IntelliJ IDEAで、**File | New | Module** を選択します。
2. 左側のパネルで、**New Module** を選択します。このモジュールがスクリプト定義になります。
3. 新しいモジュールに名前を付け、必要に応じて場所を変更します。
4. **Language** リストから **Java** を選択します。
5. ビルドスクリプトをKotlinで記述したい場合は、**Gradle** ビルドシステムと、**Gradle DSL** に Kotlin を選択します。
6. モジュールの親として、ルートモジュールを選択します。
7. **Create** をクリックします。

   ![スクリプト定義モジュールの作成](script-deps-module-definition.png){width=700}

8. モジュールの `build.gradle(.kts)` ファイルで、Kotlin Gradleプラグインの `version` を削除します。これはすでにルートプロジェクトのビルドスクリプトに含まれています。

9. スクリプティングホスト用のモジュールを作成するために、前の手順をもう一度繰り返します。

プロジェクトは以下の構造になるはずです：

![カスタムスクリプティングプロジェクトの構造](script-deps-project-structure.png){width=300}

このようなプロジェクトの例や、その他のKotlinスクリプティングの例は、[kotlin-script-examples GitHubリポジトリ](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps)で見つけることができます。

## スクリプト定義の作成

まず、スクリプトのタイプを定義します。開発者がこのタイプのスクリプトに何を記述できるか、そしてそれがどのように処理されるかを定義します。このチュートリアルでは、スクリプト内での `@Repository` および `@DependsOn` アノテーションのサポートを含めます。

1. スクリプト定義モジュールの `build.gradle(.kts)` の `dependencies` ブロックに、Kotlinスクリプティングコンポーネントへの依存関係を追加します。これらの依存関係は、スクリプト定義に必要なAPIを提供します：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // この特定の定義には coroutines の依存関係が必要です
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
       // この特定の定義には coroutines の依存関係が必要です
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```

   </tab>
   </tabs>

2. モジュール内に `src/main/kotlin/` ディレクトリを作成し、Kotlinソースファイル（例：`scriptDef.kt`）を追加します。

3. `scriptDef.kt` でクラスを作成します。これはこのタイプのスクリプトのスーパークラスになるため、`abstract` または `open` として宣言します。

    ```kotlin
    // このタイプのスクリプト用の abstract（または open）スーパークラス
    abstract class ScriptWithMavenDeps
    ```

   このクラスは、後でスクリプト定義への参照としても機能します。

4. クラスをスクリプト定義にするために、`@KotlinScript` アノテーションを付けます。アノテーションには2つのパラメータを渡します：
   * `fileExtension` – このタイプのスクリプトのファイル拡張子を定義する、`.kts` で終わる文字列。
   * `compilationConfiguration` – `ScriptCompilationConfiguration` を継承し、このスクリプト定義のコンパイル詳細を定義するKotlinクラス。次のステップで作成します。

   ```kotlin
    // @KotlinScript アノテーションはスクリプト定義クラスをマークします
    @KotlinScript(
        // スクリプトタイプのファイル拡張子
        fileExtension = "scriptwithdeps.kts",
        // スクリプトタイプのコンパイル構成
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > このチュートリアルでは、KotlinスクリプティングAPIの詳細な説明は省き、動作するコードのみを提供します。
   > 詳細な説明付きの同じコードは [GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) にあります。
   > 
   {style="note"}

5. 以下のようにスクリプトコンパイル構成を定義します。

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // このタイプのすべてのスクリプトに対する暗黙のインポート
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // コンテキストクラスローダーからクラスパス全体を抽出し、依存関係として使用する
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // コールバック
            refineConfiguration {
                // 指定されたアノテーションを、提供されたハンドラーで処理する
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   `configureMavenDepsOnAnnotations` 関数は以下の通りです：

   ```kotlin
    // コンパイルを動的に再構成するハンドラー
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

   完全なコードは [こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt) にあります。

## スクリプティングホストの作成

次のステップは、スクリプトの実行を処理するコンポーネントであるスクリプティングホストの作成です。

1. スクリプティングホストモジュールの `build.gradle(.kts)` の `dependencies` ブロックに、以下の依存関係を追加します：
   * スクリプティングホストに必要なAPIを提供するKotlinスクリプティングコンポーネント
   * 以前に作成したスクリプト定義モジュール

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // スクリプト定義モジュール
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // スクリプト定義モジュール
   }
   ```

   </tab>
   </tabs>

2. モジュール内に `src/main/kotlin/` ディレクトリを作成し、Kotlinソースファイル（例：`host.kt`）を追加します。

3. アプリケーションの `main` 関数を定義します。その中で、引数が1つ（スクリプトファイルへのパス）であることを確認し、スクリプトを実行します。スクリプトの実行は、次のステップで別の関数 `evalFile` として定義します。
   ひとまず、中身は空にしておきます。

   `main` は以下のようになります：

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

4. スクリプト評価関数を定義します。ここでスクリプト定義を使用します。`createJvmCompilationConfigurationFromTemplate` を呼び出し、スクリプト定義クラスを型パラメータとして指定することで取得します。次に、`BasicJvmScriptingHost().eval` を呼び出し、スクリプトコードとそのコンパイル構成を渡します。`eval` は `ResultWithDiagnostics` のインスタンスを返すため、これを関数の戻り値の型として設定します。

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. `main` 関数を調整して、スクリプトの実行に関する情報を出力するようにします：

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

完全なコードは [こちら](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt) にあります。

## スクリプトの実行

スクリプティングホストがどのように動作するかを確認するために、実行するスクリプトと実行構成を準備します。

1. プロジェクトのルートディレクトリに、以下の内容の `html.scriptwithdeps.kts` ファイルを作成します：

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

   これは、`@DependsOn` アノテーションの引数で参照されている `kotlinx-html-jvm` ライブラリの関数を使用しています。

2. スクリプティングホストを起動し、このファイルを実行する実行構成（Run Configuration）を作成します：
   1. `host.kt` を開き、`main` 関数に移動します。左側に **Run** ガターアイコンがあります。
   2. ガターアイコンを右クリックし、**Modify Run Configuration** を選択します。
   3. **Create Run Configuration** ダイアログで、**Program arguments** にスクリプトファイル名を追加し、**OK** をクリックします。
   
      ![スクリプティングホストの実行構成](script-deps-run-config.png){width=800}

3. 作成した構成を実行します。

スクリプトが実行され、指定されたリポジトリにある `kotlinx-html-jvm` への依存関係が解決され、その関数の呼び出し結果が出力されるのが確認できます：

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

初回の実行では依存関係の解決に時間がかかる場合があります。2回目以降の実行は、ローカルのMavenリポジトリからダウンロード済みの依存関係が使用されるため、はるかに速くなります。

## 次のステップ

シンプルなKotlinスクリプティングプロジェクトを作成したら、このトピックに関する詳細情報を確認してください：
* [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md) を読む
* その他の [Kotlinスクリプティングの例](https://github.com/Kotlin/kotlin-script-examples) を閲覧する
* Rodrigo Oliveira氏による講演「[Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)」を視聴する