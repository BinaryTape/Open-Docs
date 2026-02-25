[//]: # (title: Kotlin/JS を始める)

このチュートリアルでは、Kotlin/JavaScript (Kotlin/JS) を使用してブラウザ用の Web アプリケーションを作成する方法を説明します。
アプリを作成するには、ワークフローに最も適したツールを選択してください。

* **[IntelliJ IDEA](#intellij-idea-でアプリケーションを作成する)**: バージョン管理からプロジェクトテンプレートをクローンし、IntelliJ IDEA で作業します。
* **[Gradle ビルドシステム](#gradle-を使用してアプリケーションを作成する)**: セットアップが内部でどのように動作するかをよりよく理解するために、プロジェクトのビルドファイルを手動で作成します。

> Kotlin/JS では、ブラウザをターゲットにする以外にも、他の環境向けにコンパイルできます。
> 詳細については、[実行環境](js-project-setup.md#execution-environments) を参照してください。
> 
{style="tip"}

## IntelliJ IDEA でアプリケーションを作成する 

Kotlin/JS Web アプリケーションを作成するには、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/?section=mac) の Community エディションまたは Ultimate エディションのいずれかを使用できます。

### 環境のセットアップ

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/) をダウンロードしてインストールします。
2. [Kotlin マルチプラットフォーム開発のための環境をセットアップします](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。

### プロジェクトの作成

1. IntelliJ IDEA で、**File** | **New** | **Project from Version Control** を選択します。
2. [Kotlin/JS テンプレートプロジェクト](https://github.com/Kotlin/kmp-js-wizard) の URL を入力します。

   ```text
   https://github.com/Kotlin/kmp-js-wizard
   ```   
   
3. **Clone** をクリックします。

### プロジェクトの設定

1. `kmp-js-wizard/gradle/libs.versions.toml` ファイルを開きます。これにはプロジェクト依存関係のバージョンカタログが含まれています。
2. Kotlin のバージョンが、Kotlin/JS をターゲットとする Web アプリケーションを作成するために必要な Kotlin Multiplatform Gradle プラグインのバージョンと一致していることを確認してください。

   ```text
   [versions]
   kotlin = "%kotlinVersion%"
   
   [plugins]
   kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
   ```

3. Gradle ファイルを同期します（`libs.versions.toml` ファイルを更新した場合）。ビルドファイルに表示される **Load Gradle Changes** アイコンをクリックします。

   ![Load the Gradle changes button](load-gradle-changes.png){width=300}

   あるいは、Gradle ツールウィンドウの更新ボタンをクリックします。

マルチプラットフォームプロジェクトの Gradle 設定の詳細については、[Multiplatform Gradle DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) を参照してください。

### アプリケーションのビルドと実行

1. `src/jsMain/kotlin/Main.kt` ファイルを開きます。

   * `src/jsMain/kotlin/` ディレクトリには、プロジェクトの JavaScript ターゲット用のメインの Kotlin ソースファイルが含まれています。
   * `Main.kt` ファイルには、[`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API を使用してブラウザページに "Hello, Kotlin/JS!" を描画するコードが含まれています。

2. `main()` 関数にある **Run** アイコンをクリックしてコードを実行します。

   ![Run the application](js-run-gutter.png){width=500}

Web アプリケーションがブラウザで自動的に開きます。
あるいは、実行が完了した後にブラウザで次の URL を開くこともできます。

```text
   http://localhost:8080/
```

Web アプリケーションが表示されます。

![Application output](js-output-gutter-1.png){width=600}

アプリケーションを最初に実行した後、IntelliJ IDEA は対応する実行構成 (**jsMain [js]**) をトップバーに作成します。

![Gradle run configuration](js-run-config.png){width=500}

> IntelliJ IDEA Ultimate では、
> [JS デバッガ](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> を使用して IDE から直接コードをデバッグできます。
> 
> {style="tip"}

### 継続的ビルドの有効化

Gradle は、変更を加えるたびにプロジェクトを自動的に再ビルドできます。

1. 実行構成のリストから **jsMain [js]** を選択し、**More Actions** | **Edit** をクリックします。

    ![Gradle edit run configuration](js-edit-run-config.png){width=500}

2. **Run/Debug Configurations** ダイアログで、**Run** フィールドに `jsBrowserDevelopmentRun --continuous` と入力します。

    ![Continuous run configuration](js-continuous-run-config.png){width=500}

3. **OK** をクリックします。

これで、アプリケーションを実行して変更を加えると、Gradle はプロジェクトのインクリメンタルビルドを自動的に実行し、クラスファイルを保存 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) または変更するたびにブラウザをホットリロードします。

### アプリケーションの修正

単語内の文字数をカウントする機能を追加するために、アプリケーションを修正します。

#### input 要素の追加

1. `src/jsMain/kotlin/Main.kt` ファイルで、ユーザー入力を読み取るための [HTML input 要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) を [拡張関数](extensions.md#extension-functions) を通じて追加します。

   ```kotlin
   // Element.appendMessage() 関数を置き換える
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```

2. `main()` で `appendInput()` 関数を呼び出します。これにより、ページに input 要素が表示されます。

   ```kotlin
   fun main() {
       // document.body!!.appendMessage(message) を置き換える
       document.body?.appendInput()
   }
   ```

3. [アプリケーションを再度実行します](#アプリケーションのビルドと実行)。

    アプリケーションは以下のようになります。

   ![Application with an input element](js-added-input-element.png){width=600}

#### 入力イベントハンドリングの追加

1. `appendInput()` 関数内にリスナーを追加して、入力値を読み取り、変更に反応するようにします。

    ```kotlin
   // 現在の appendInput() 関数を置き換える
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2. IDE の提案に従って、`HTMLInputElement` の依存関係をインポートします。

   ![Import dependencies](js-import-dependency.png){width=600}

3. `main()` で `onChange` コールバックを呼び出します。これにより入力値が読み取られ、処理されます。

    ```kotlin
    fun main() {
        // document.body?.appendInput() を置き換える
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

#### 出力要素の追加

1. 段落を作成する [拡張関数](extensions.md#extension-functions) を定義して、出力を表示するためのテキスト要素を追加します。

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```
   
2. `main()` で `appendTextContainer()` 関数を呼び出します。これにより出力要素が作成されます。

   ```kotlin
    fun main() {
        // 出力用のテキストコンテナを作成
        // val message = Message(topic = "Kotlin/JS", content = "Hello!") を置き換える
        val output = document.body?.appendTextContainer()
   
        // 入力値を読み取る
        document.body?.appendInput(onChange = { println(it) })
    }
   ```
   
#### 入力を処理して文字数をカウントする

空白を削除し、文字数とともに出力を表示することで、入力を処理します。

`main()` 関数内の `appendInput()` 関数の呼び出しに次のコードを追加します。

```kotlin
fun main() {
    // 出力用のテキストコンテナを作成
    val output = document.body?.appendTextContainer()

    // 入力値を読み取る
    // 現在の appendInput() 関数を置き換える
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

上記のコードについて：

* [`replace()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) は、名前の中の空のスペースを削除します。
* [`let{}` スコープ関数](scope-functions.md#let) は、オブジェクトのコンテキスト内で関数を実行します。
* [文字列テンプレート](strings.md#string-templates) (`${it.length}`) は、ドル記号 (`$`) を接頭辞として付け、中括弧 (`{}`) で囲むことで、文字列内に単語の長さを挿入します。
一方、`it` は [ラムダパラメータ](coding-conventions.md#lambda-parameters) のデフォルト名です。

#### アプリケーションの実行

1. [アプリケーションを実行します](#アプリケーションのビルドと実行)。
2. 名前を入力します。
3. <shortcut>Enter</shortcut> を押します。

結果を確認できます。

![Application output](js-output-gutter-2.png){width=600}

#### 入力を処理して一意の文字数をカウントする

追加の演習として、入力を処理して、単語内の一意の（重複しない）文字の数を計算して表示してみましょう。

1. `src/jsMain/kotlin/Main.kt` ファイルに、`String` 用の `.countDistinctCharacters()` [拡張関数](extensions.md#extension-functions) を追加します。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   上記のコードについて：

   * [`.lowercase()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) は、名前を小文字に変換します。
   * [`toList()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) は、入力文字列を文字のリストに変換します。
   * [`distinct()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) は、単語から重複しない文字のみを選択します。
   * [`count()` 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) は、一意の文字をカウントします。

2. `main()` で `.countDistinctCharacters()` 関数を呼び出します。これにより名前の中の一意の文字数がカウントされます。

   ```kotlin
    fun main() {
        // 出力用のテキストコンテナを作成
        val output = document.body?.appendTextContainer()
   
        // 入力値を読み取る
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // 一意の文字数を出力
                // output?.textContent = "Your name contains ${it.length} letters" を置き換える
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. [アプリケーションを実行して名前を入力する](#アプリケーションの実行) 手順に従います。

結果を確認できます。

![Application output](js-output-gutter-3.png){width=600}

## Gradle を使用してアプリケーションを作成する

このセクションでは、[Gradle](https://gradle.org) を使用して Kotlin/JS アプリケーションを手動で作成する方法を学びます。

Gradle は、Kotlin/JS および Kotlin Multiplatform プロジェクトのデフォルトのビルドシステムです。
また、Java、Android、その他のエコシステムでも一般的に使用されています。

### プロジェクトファイルの作成

1. Kotlin Gradle プラグイン (KGP) と互換性のある Gradle バージョンを使用していることを確認してください。詳細は [互換性テーブル](gradle-configure-project.md#apply-the-plugin) を参照してください。
2. ファイルエクスプローラー、コマンドライン、またはお好みのツールを使用して、プロジェクト用の空のディレクトリを作成します。
3. プロジェクトディレクトリ内に、次の内容の `build.gradle.kts` ファイルを作成します。

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
           // ブラウザで実行する場合は browser()、Node.js で実行する場合は nodejs() を使用
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
           // ブラウザで実行する場合は browser()、Node.js で実行する場合は nodejs() を使用
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > `browser()` や `nodejs()` など、さまざまな [実行環境](js-project-setup.md#execution-environments) を使用できます。
   > 各環境はコードがどこで実行されるかを定義し、Gradle がプロジェクト内でタスク名を生成する方法を決定します。
   >
   > {style="note"}

4. プロジェクトディレクトリ内に、空の `settings.gradle.kts` ファイルを作成します。
5. プロジェクトディレクトリ内に、`src/jsMain/kotlin` ディレクトリを作成します。
6. `src/jsMain/kotlin` ディレクトリ内に、次の内容の `hello.kt` ファイルを追加します。

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   慣例により、すべてのソースは `src/<ターゲット名>[Main|Test]/kotlin` ディレクトリに配置されます。
   * `Main` はソースコードの場所です。
   * `Test` はテストの場所です。
   * `<ターゲット名>` はターゲットプラットフォーム（この場合は `js`）に対応します。

**`browser` 環境の場合**

> `browser` 環境を使用している場合は、次の手順に従ってください。
> `nodejs` 環境を使用している場合は、[プロジェクトのビルドと実行](#プロジェクトのビルドと実行) セクションに進んでください。
> 
> {style="note"}

1. プロジェクトディレクトリ内に、`src/jsMain/resources` ディレクトリを作成します。
2. `src/jsMain/resources` ディレクトリ内に、次の内容の `index.html` ファイルを作成します。

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

3. `$NAME_OF_YOUR_PROJECT_DIRECTORY` プレースホルダをプロジェクトのディレクトリ名に置き換えてください。

### プロジェクトのビルドと実行

プロジェクトをビルドするには、プロジェクトのルートディレクトリから次のコマンドを実行します。

```bash
# ブラウザの場合
gradle jsBrowserDevelopmentRun

# または

# Node.js の場合
gradle jsNodeDevelopmentRun 
```

`browser` 環境を使用している場合、ブラウザが `index.html` ファイルを開き、ブラウザコンソールに `"Hello, Kotlin/JS!"` と出力されるのを確認できます。
コンソールは <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> コマンドを使用して開くことができます。

![Application output](js-output-gutter-4.png){width=600}

`nodejs` 環境を使用している場合、ターミナルに `"Hello, Kotlin/JS!"` と出力されるのを確認できます。

![Application output](js-output-gutter-5.png){width=500}

### IDE でプロジェクトを開く

Gradle をサポートする任意の IDE でプロジェクトを開くことができます。

IntelliJ IDEA を使用する場合：

1. **File** | **Open** を選択します。
2. プロジェクトディレクトリを見つけます。
3. **Open** をクリックします。

IntelliJ IDEA は、それが Kotlin/JS プロジェクトであるかどうかを自動的に検出します。
プロジェクトに問題が発生した場合、IntelliJ IDEA は **Build** ペインにエラーメッセージを表示します。

## 次のステップ

* [Kotlin/JS プロジェクトをセットアップする](js-project-setup.md)。
* [Kotlin/JS アプリケーションをデバッグする](js-debugging.md) 方法を学ぶ。
* [Kotlin/JS でテストを記述して実行する](js-running-tests.md) 方法を学ぶ。
* [実際の Kotlin/JS プロジェクト向けの Gradle ビルドスクリプトを作成する](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 方法を学ぶ。
* [Gradle ビルドシステム](gradle.md) についてさらに読む。