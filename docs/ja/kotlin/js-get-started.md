) を接頭辞として付け、中括弧 (`{}`) で囲むことで、文字列内に単語の長さを挿入します。
一方、`it` は [ラムダパラメータ](coding-conventions.md#lambda-parameters) のデフォルト名です。

#### アプリケーションの実行

1. [アプリケーションを実行します](#アプリケーションのビルドと実行)。
2. 名前を入力します。
3. <shortcut>Enter</shortcut> を押します。 

結果を確認できます。

![Application output](js-output-gutter-2.png){width=600}

#### 入力を処理して一意の文字数をカウントする

追加の演習として、入力を処理して、単語内の一意の（重複しない）文字の数を計算して表示してみましょう：

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

   慣例により、すべてのソースは `src/<ターゲット名>[Main|Test]/kotlin` ディレクトリに配置されます：
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

3. `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` プレースホルダをプロジェクトのディレクトリ名に置き換えてください。

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