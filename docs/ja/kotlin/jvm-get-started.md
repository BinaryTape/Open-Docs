[//]: # (title: Kotlin/JVM を使ってみる)

このチュートリアルでは、IntelliJ IDEA を使用してコンソールアプリケーションを作成する方法を説明します。

始めるには、まず [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトを作成する

1. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
2. 左側のリストで、**Kotlin** を選択します。
3. 新しいプロジェクトに名前を付け、必要であればその場所を変更します。

   > 新しいプロジェクトをバージョン管理下に置くには、**Create Git repository** チェックボックスを選択します。これは後でいつでも実行できます。
   >
   {style="tip"}
   
   ![コンソールアプリケーションを作成](jvm-new-project.png){width=700}

4. **IntelliJ** ビルドシステムを選択します。これは、追加のアーティファクトをダウンロードする必要がないネイティブビルダーです。

   さらに設定が必要なより複雑なプロジェクトを作成したい場合は、Maven または Gradle を選択します。Gradle の場合は、ビルドスクリプトの言語として Kotlin または Groovy を選択します。
5. **JDK** リストから、プロジェクトで使用する [JDK](https://www.oracle.com/java/technologies/downloads/) を選択します。
   * JDK がコンピュータにインストールされていても、IDE で定義されていない場合は、**Add JDK** を選択し、JDK のホームディレクトリへのパスを指定します。
   * 必要な JDK がコンピュータにない場合は、**Download JDK** を選択します。

6. サンプル `"Hello World!"` アプリケーションのファイルを作成するために、**Add sample code** オプションを有効にします。

    > また、**Generate code with onboarding tips** オプションを有効にして、サンプルコードにさらに役立つコメントを追加することもできます。
    >
    {style="tip"}

7. **Create** をクリックします。

    > Gradle ビルドシステムを選択した場合、プロジェクト内にビルドスクリプトファイル `build.gradle(.kts)` があります。これには、`kotlin("jvm")` プラグインとコンソールアプリケーションに必要な依存関係が含まれています。プラグインの最新バージョンを使用していることを確認してください。
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    > 
    {style="note"}

## アプリケーションを作成する

1. `src/main/kotlin` 内の `Main.kt` ファイルを開きます。
   `src` ディレクトリには Kotlin のソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello, Kotlin!` とサイクルのイテレータの値をいくつか出力するサンプルコードが含まれています。

   ![main fun を含む Main.kt](jvm-main-kt-initial.png){width=700}

2. コードを修正して、あなたの名前を尋ね、`Hello` と挨拶するようにします。

   * 入力プロンプトを作成し、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数によって返された値を `name` 変数に割り当てます。
   * 結合ではなく文字列テンプレートを使用し、テキスト出力で変数名の前にドル記号 `$` を直接追加します。例：`$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## アプリケーションを実行する

これでアプリケーションを実行する準備ができました。最も簡単な方法は、ガターにある緑色の**実行**アイコンをクリックし、**Run 'MainKt'** を選択することです。

![コンソールアプリを実行中](jvm-run-app.png){width=350}

結果は**実行**ツールウィンドウで確認できます。

![Kotlin 実行出力](jvm-output-1.png){width=600}
   
名前を入力し、アプリケーションからの挨拶を受け取ってください！ 

![Kotlin 実行出力](jvm-output-2.png){width=600}

おめでとうございます！初めての Kotlin アプリケーションを実行しました。

## 次のステップは？

このアプリケーションを作成したら、Kotlin の構文をさらに深く掘り下げてみましょう。

* [Kotlin の例](https://play.kotlinlang.org/byExample/overview) からサンプルコードを追加する
* IDEA 用の [JetBrains Academy プラグイン](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) をインストールし、[Kotlin Koans コース](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) の演習を完了する