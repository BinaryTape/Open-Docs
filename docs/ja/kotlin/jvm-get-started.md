[//]: # (title: コンソールアプリの作成 – チュートリアル)

<web-summary>IntelliJ IDEA で Kotlin コンソールアプリを作成し、Kotlin コンパイラーを使用して実行します。</web-summary>

このチュートリアルでは、IntelliJ IDEA を使用してコンソールアプリケーションを作成する方法を説明します。

まず、最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) をダウンロードしてインストールしてください。

## プロジェクトの作成

1. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
2. 左側のリストで **Kotlin** を選択します。
3. 新しいプロジェクトに名前を付け、必要に応じて場所を変更します。

   > **Create Git repository** チェックボックスを選択すると、新しいプロジェクトをバージョン管理下に置くことができます。これは後からいつでも行うことができます。
   >
   {style="tip"}
   
   ![コンソールアプリケーションの作成](jvm-new-project.png){width=700}

4. **IntelliJ** ビルドシステムを選択します。これは追加のアーティファクトをダウンロードする必要がないネイティブビルダーです。

   より詳細な設定が必要な複雑なプロジェクトを作成したい場合は、Maven または Gradle を選択してください。Gradle の場合は、ビルドスクリプトの言語（Kotlin または Groovy）を選択します。
5. **JDK** リストから、プロジェクトで使用する [JDK](https://www.oracle.com/java/technologies/downloads/) を選択します。
   * コンピューターに JDK はインストールされているが IDE で定義されていない場合は、**Add JDK** を選択して JDK のホームディレクトリへのパスを指定します。 
   * コンピューターに必要な JDK がない場合は、**Download JDK** を選択します。

6. **Add sample code** オプションを有効にすると、サンプルの `"Hello World!"` アプリケーションを含むファイルが作成されます。

    > **Generate code with onboarding tips** オプションを有効にして、サンプルコードに役立つ追加のコメントを追加することもできます。
    >
    {style="tip"}

7. **Create** をクリックします。

    > Gradle ビルドシステムを選択した場合、プロジェクトにはビルドスクリプトファイル `build.gradle(.kts)` が含まれます。これには、コンソールアプリケーションに必要な `kotlin("jvm")` プラグインと依存関係が含まれています。プラグインの最新バージョンを使用していることを確認してください。
    > 
    > <tabs group="build-script">
    > <tab title="Kotlin" group-key="kotlin">
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    > 
    > </tab>
    > <tab title="Groovy" group-key="groovy">
    > 
    > ```groovy
    > plugins {
    >     id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    >     id 'application'
    > }
    > ```
    > 
    > </tab>
    > </tabs>
    > 
    {style="note"}

## アプリケーションの作成

1. `src/main/kotlin` にある `Main.kt` ファイルを開きます。  
   `src` ディレクトリには Kotlin のソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello, Kotlin!` と、ループイテレータの値を含む数行を出力するサンプルコードが含まれています。

   ![main 関数を含む Main.kt](jvm-main-kt-initial.png){width=700}

2. 名前を尋ねて `Hello` と挨拶するようにコードを修正します。

   * 入力プロンプトを作成し、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数によって返された値を変数 `name` に代入します。
   * 文字列の結合の代わりに、次のようにテキスト出力の中で変数名の前にドル記号を付けて `$name` のように記述する「文字列テンプレート」を使用しましょう。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## アプリケーションの実行

これでアプリケーションを実行する準備が整いました。最も簡単な方法は、ガターにある緑色の **Run** アイコンをクリックして、**Run 'MainKt'** を選択することです。

![コンソールアプリの実行](jvm-run-app.png){width=350}

実行結果は **Run** ツールウィンドウで確認できます。

![Kotlin の実行出力](jvm-output-1.png){width=600}
   
名前を入力して、アプリケーションからの挨拶を受け取りましょう！ 

![Kotlin の実行出力](jvm-output-2.png){width=600}

おめでとうございます！最初の Kotlin アプリケーションを実行できました。

## 次のステップ

このアプリケーションを作成したら、Kotlin の構文をさらに深く学び始めることができます。

* [Kotlin tour](kotlin-tour-welcome.md) を受講する
* IDEA 用の [JetBrains Academy プラグイン](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)をインストールして、[Kotlin Koans コース](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans)の演習を完了する