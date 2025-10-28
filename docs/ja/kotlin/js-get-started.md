[//]: # (title: Kotlin/JSを始めよう)

このチュートリアルでは、Kotlin/JavaScript (Kotlin/JS) を使用してブラウザ向けのウェブアプリケーションを作成する方法を説明します。
アプリケーションを作成するには、ワークフローに最適なツールを選択してください。

*   **[IntelliJ IDEA](#create-your-application-in-intellij-idea)**: バージョン管理からプロジェクトテンプレートをクローンし、IntelliJ IDEAで作業します。
*   **[Gradle ビルドシステム](#create-your-application-using-gradle)**: プロジェクトのビルドファイルを自分で作成し、内部でセットアップがどのように機能するかをより深く理解します。

> ブラウザをターゲットにするだけでなく、Kotlin/JSを使用すると他の環境向けにコンパイルできます。
> 詳細については、「[実行環境](js-project-setup.md#execution-environments)」を参照してください。
> 
{style="tip"}

## IntelliJ IDEA でアプリケーションを作成する 

Kotlin/JS ウェブアプリケーションを作成するには、
[IntelliJ IDEA](https://www.jetbrains.com/idea/download/?section=mac) の Community 版または Ultimate 版のいずれかを使用できます。

### 環境をセットアップする

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。
2.  [Kotlin Multiplatform 開発用に環境をセットアップ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)します。

### プロジェクトを作成する

1.  IntelliJ IDEA で、**File** | **New** | **Project from Version Control** を選択します。
2.  [Kotlin/JS テンプレートプロジェクト](https://github.com/Kotlin/kmp-js-wizard)の URL を入力します。

   ```text
   https://github.com/Kotlin/kmp-js-wizard
   ```   
   
3.  **Clone** をクリックします。

### プロジェクトを設定する

1.  `kmp-js-wizard/gradle/libs.versions.toml` ファイルを開きます。このファイルには、プロジェクトの依存関係のバージョンカタログが含まれています。
2.  Kotlin バージョンが、Kotlin/JS をターゲットとするウェブアプリケーションを作成するために必要な Kotlin Multiplatform Gradle プラグインのバージョンと一致していることを確認します。

   ```text
   [versions]
   kotlin = "%kotlinVersion%"
   
   [plugins]
   kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
   ```

3.  Gradle ファイルを同期します（`libs.versions.toml` ファイルを更新した場合）。ビルドファイルに表示される**Load Gradle Changes**アイコンをクリックします。

   ![Load the Gradle changes button](load-gradle-changes.png){width=300}

   または、Gradle ツールウィンドウの更新ボタンをクリックします。

マルチプラットフォームプロジェクトの Gradle 設定に関する詳細については、
[Multiplatform Gradle DSL リファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を参照してください。

### アプリケーションをビルドして実行する

1.  `src/jsMain/kotlin/Main.kt` ファイルを開きます。

   *   `src/jsMain/kotlin/` ディレクトリには、プロジェクトの JavaScript ターゲット用の主要な Kotlin ソースファイルが含まれています。
   *   `Main.kt` ファイルには、[`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API を使用してブラウザページに「Hello, Kotlin/JS!」をレンダリングするコードが含まれています。

2.  `main()` 関数内の**Run**アイコンをクリックしてコードを実行します。

   ![Run the application](js-run-gutter.png){width=500}

ウェブアプリケーションはブラウザで自動的に開きます。
または、実行が完了したら、ブラウザで次の URL を開くこともできます。

```text
   http://localhost:8080/
```

ウェブアプリケーションが表示されます。

![Application output](js-output-gutter-1.png){width=600}

アプリケーションを初めて実行すると、IntelliJ IDEA はトップバーにそれに対応する実行構成（**jsMain [js]**）を作成します。

![Gradle run configuration](js-run-config.png){width=500}

> IntelliJ IDEA Ultimate では、
> [JS デバッガー](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> を使用して、IDE から直接コードをデバッグできます。
> 
> {style="tip"}

### 継続ビルドを有効にする

変更を加えるたびに、Gradle はプロジェクトを自動的にリビルドできます。

1.  実行構成のリストで**jsMain [js]**を選択し、**More Actions** | **Edit**をクリックします。

    ![Gradle edit run configuration](js-edit-run-config.png){width=500}

2.  **Run/Debug Configurations**ダイアログで、**Run**フィールドに`jsBrowserDevelopmentRun --continuous`と入力します。

    ![Continuous run configuration](js-continuous-run-config.png){width=500}

3.  **OK**をクリックします。

これで、アプリケーションを実行して変更を加えるたびに、
Gradle はプロジェクトのインクリメンタルビルドを自動的に実行し、
保存（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）またはクラスファイルの変更時にブラウザをホットリロードします。

### アプリケーションを変更する

アプリケーションを変更して、単語の文字数をカウントする機能を追加します。

#### 入力要素を追加する

1.  `src/jsMain/kotlin/Main.kt` ファイルに、
    ユーザー入力を読み取るための[拡張関数](extensions.md#extension-functions)を介して[HTML input要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)を追加します。

   ```kotlin
   // Replace the Element.appendMessage() function
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```

2.  `main()` で`appendInput()`関数を呼び出します。これにより、ページに入力要素が表示されます。

   ```kotlin
   fun main() {
       // Replace document.body!!.appendMessage(message)
       document.body?.appendInput()
   }
   ```

3.  [アプリケーションを再度実行](#build-and-run-the-application)します。

    アプリケーションは次のようになります。

   ![Application with an input element](js-added-input-element.png){width=600}

#### 入力イベント処理を追加する

1.  `appendInput()`関数内にリスナーを追加して、入力値を読み取り、変更に反応するようにします。

    ```kotlin
    // Replace the current appendInput() function
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2.  IDEの提案に従って、`HTMLInputElement`依存関係をインポートします。

   ![Import dependencies](js-import-dependency.png){width=600}

3.  `main()`で`onChange`コールバックを呼び出します。これにより、入力値が読み取られ、処理されます。

    ```kotlin
    fun main() {
        // Replace document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
    ```

#### 出力要素を追加する

1.  パラグラフを作成する[拡張関数](extensions.md#extension-functions)を定義して、出力を表示するテキスト要素を追加します。

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```
   
2.  `main()`で`appendTextContainer()`関数を呼び出します。これにより、出力要素が作成されます。

   ```kotlin
    fun main() {
        // Creates a text container for our output
        // Replace val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()
   
        // Reads the input value
        document.body?.appendInput(onChange = { println(it) })
    }
   ```
   
#### 入力を処理して文字数をカウントする

入力から空白を削除し、文字数とともに出力を表示して、入力を処理します。

`main()`関数内の`appendInput()`関数に、以下のコードを追加します。

```kotlin
fun main() {
    // Creates a text container for our output
    val output = document.body?.appendTextContainer()

    // Reads the input value
    // Replace the current appendInput() function
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

上記のコードについて：

*   [`replace()`関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html)は、名前内の空のスペースを削除します。
*   [`let{}`スコープ関数](scope-functions.md#let)は、オブジェクトコンテキスト内で関数を実行します。
*   [文字列テンプレート](strings.md#string-templates) (`${it.length}`) は、ドル記号（`$`）を前に付け、波括弧（`{}`）で囲むことにより、単語の長さを文字列に挿入します。
    一方、`it`は[ラムダパラメーター](coding-conventions.md#lambda-parameters)のデフォルト名です。

#### アプリケーションを実行する

1.  [アプリケーションを実行](#build-and-run-the-application)します。
2.  名前を入力します。
3.  <shortcut>Enter</shortcut>キーを押します。

結果が表示されます。

![Application output](js-output-gutter-2.png){width=600}

#### 入力を処理して一意の文字をカウントする

追加の演習として、単語内の一意の文字数を計算して表示するように入力を処理してみましょう。

1.  `src/jsMain/kotlin/Main.kt` ファイルに、`String`用の`.countDistinctCharacters()`[拡張関数](extensions.md#extension-functions)を追加します。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   上記のコードについて：

   *   [`.lowercase()`関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html)は、名前を小文字に変換します。
   *   [`toList()`関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html)は、入力文字列を文字のリストに変換します。
   *   [`distinct()`関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html)は、単語から重複しない文字のみを選択します。
   *   [`count()`関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)は、重複しない文字をカウントします。

2.  `main()`で`.countDistinctCharacters()`関数を呼び出します。これにより、名前の一意の文字数がカウントされます。

   ```kotlin
    fun main() {
        // Creates a text container for our output
        val output = document.body?.appendTextContainer()
   
        // Reads the input value
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // Prints the number of unique letters
                // Replace output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3.  [アプリケーションを実行して名前を入力する](#run-the-application)手順に従います。

結果が表示されます。

![Application output](js-output-gutter-3.png){width=600}

## Gradle を使用してアプリケーションを作成する

このセクションでは、[Gradle](https://gradle.org) を使用して Kotlin/JS アプリケーションを手動で作成する方法を学びます。

Gradle は、Kotlin/JS および Kotlin Multiplatform プロジェクトのデフォルトのビルドシステムです。
また、Java、Android、およびその他のエコシステムでも一般的に使用されます。

### プロジェクトファイルを作成する

1.  Kotlin Gradle プラグイン (KGP) と互換性のある Gradle バージョンを使用していることを確認してください。
    詳細については、[互換性表](gradle-configure-project.md#apply-the-plugin)を参照してください。
2.  ファイルエクスプローラー、コマンドライン、または任意のツールを使用して、プロジェクトの空のディレクトリを作成します。
3.  プロジェクトディレクトリ内に、以下の内容で`build.gradle.kts`ファイルを作成します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           // Use browser() for running in a browser or nodejs() for running in Node.js
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           // Use browser() for running in a browser or nodejs() for running in Node.js
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > `browser()`や`nodejs()`など、さまざまな[実行環境](js-project-setup.md#execution-environments)を使用できます。
   > 各環境は、コードがどこで実行されるかを定義し、プロジェクト内でGradleがタスク名をどのように生成するかを決定します。
   >
   > {style="note"}

4.  プロジェクトディレクトリ内に、空の`settings.gradle.kts`ファイルを作成します。
5.  プロジェクトディレクトリ内に、`src/jsMain/kotlin`ディレクトリを作成します。
6.  `src/jsMain/kotlin`ディレクトリ内に、以下の内容で`hello.kt`ファイルを追加します。

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   慣例により、すべてのソースは`src/<target name>[Main|Test]/kotlin`ディレクトリに配置されます。
   *   `Main`はソースコードの場所です。
   *   `Test`はテストの場所です。
   *   `<target name>`はターゲットプラットフォーム（この場合は`js`）に対応します。

**`browser`環境の場合**

> `browser`環境で作業している場合は、次の手順に従ってください。
> `nodejs`環境で作業している場合は、[プロジェクトのビルドと実行](#build-and-run-the-project)セクションに進んでください。
> 
> {style="note"}

1.  プロジェクトディレクトリ内に、`src/jsMain/resources`ディレクトリを作成します。
2.  `src/jsMain/resources`ディレクトリ内に、以下の内容で`index.html`ファイルを作成します。

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Application title</title>
   </head>
   <body>
       <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
   </body>
   </html>
   ```

3.  `<YOUR_PROJECT_DIRECTORY>`プレースホルダーをプロジェクトディレクトリの名前に置き換えます。

### プロジェクトをビルドして実行する

プロジェクトをビルドするには、ルートプロジェクトディレクトリから次のコマンドを実行します。

```bash
# For browser
gradle jsBrowserDevelopmentRun

# OR

# For Node.js
gradle jsNodeDevelopmentRun 
```

`browser`環境を使用している場合、ブラウザが`index.html`ファイルを開き、ブラウザコンソールに「"Hello, Kotlin/JS!"」と出力することがわかります。<shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut>コマンドを使用してコンソールを開くことができます。

![Application output](js-output-gutter-4.png){width=600}

`nodejs`環境を使用している場合、ターミナルが「"Hello, Kotlin/JS!"」と出力することがわかります。

![Application output](js-output-gutter-5.png){width=500}

### IDEでプロジェクトを開く

Gradleをサポートする任意のIDEでプロジェクトを開くことができます。

IntelliJ IDEAを使用する場合：

1.  **File** | **Open** を選択します。
2.  プロジェクトディレクトリを見つけます。
3.  **Open** をクリックします。

IntelliJ IDEAは、それがKotlin/JSプロジェクトであるかどうかを自動的に検出します。
プロジェクトで問題が発生した場合、IntelliJ IDEAは**Build**ペインにエラーメッセージを表示します。

## 次のステップ

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

*   [Kotlin/JS プロジェクトをセットアップする](js-project-setup.md)。
*   [Kotlin/JS アプリケーションをデバッグする方法](js-debugging.md)を学ぶ。
*   [Kotlin/JS でテストを作成および実行する方法](js-running-tests.md)を学ぶ。
*   [実際の Kotlin/JS プロジェクト用の Gradle ビルドスクリプトを作成する方法](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を学ぶ。
*   [Gradle ビルドシステム](gradle.md)に関する詳細を読む。