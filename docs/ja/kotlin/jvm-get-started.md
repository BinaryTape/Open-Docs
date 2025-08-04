[//]: # (title: Kotlin/JVMを使ってみる)

このチュートリアルでは、IntelliJ IDEAを使ってコンソールアプリケーションを作成する方法を説明します。

まず、始めるには、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトを作成する

1. IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
2. 左側のリストで、**Kotlin** を選択します。
3. 新しいプロジェクトに名前を付け、必要であればその場所を変更します。

   > **Create Git repository** チェックボックスを選択して、新しいプロジェクトをバージョン管理下に置きます。これはいつでも後から行うことができます。
   >
   {style="tip"}
   
   ![Create a console application](jvm-new-project.png){width=700}

4. **IntelliJ** ビルドシステムを選択します。これは追加のアーティファクトのダウンロードを必要としないネイティブビルダーです。

   さらに設定が必要な、より複雑なプロジェクトを作成したい場合は、MavenまたはGradleを選択します。Gradleの場合、ビルドスクリプトの言語としてKotlinまたはGroovyを選択します。
5. **JDK** リストから、プロジェクトで使用したい[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
   * JDKがコンピューターにインストールされているものの、IDEで定義されていない場合は、**Add JDK** を選択し、JDKホームディレクトリへのパスを指定します。 
   * 必要なJDKがコンピューターにない場合は、**Download JDK** を選択します。

6. **Add sample code** オプションを有効にして、サンプル「`Hello World!`」アプリケーションを含むファイルを作成します。

    > また、**Generate code with onboarding tips** オプションを有効にすると、サンプルコードに役立つコメントを追加できます。
    >
    {style="tip"}

7. **Create** をクリックします。

    > Gradleビルドシステムを選択した場合、プロジェクトにはビルドスクリプトファイル `build.gradle(.kts)` があります。
    > これには、コンソールアプリケーションに必要な`kotlin("jvm")`プラグインと依存関係が含まれています。プラグインの最新バージョンを使用していることを確認してください。
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

## アプリケーションを作成する

1. `src/main/kotlin` 内の `Main.kt` ファイルを開きます。  
   `src` ディレクトリにはKotlinのソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello, Kotlin!` を出力するサンプルコードと、サイクルイテレータの値を含むいくつかの行が含まれています。

   ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2. コードを修正して、あなたの名前を尋ね、「Hello」と挨拶するようにします。

   * 入力プロンプトを作成し、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)関数によって返される値を`name`変数に割り当てます。
   * 文字列の連結の代わりに、テキスト出力で変数名の前にドル記号`$`を直接追加して、`$name` のように文字列テンプレートを使用しましょう。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## アプリケーションを実行する

これでアプリケーションを実行する準備ができました。最も簡単な方法は、ガターにある緑色の**Run**アイコンをクリックし、**Run 'MainKt'** を選択することです。

![Running a console app](jvm-run-app.png){width=350}

結果は**Run**ツールウィンドウで確認できます。

![Kotlin run output](jvm-output-1.png){width=600}
   
あなたの名前を入力し、アプリケーションからの挨拶を受け取ってください！ 

![Kotlin run output](jvm-output-2.png){width=600}

おめでとうございます！初めてのKotlinアプリケーションを実行しましたね。

## 次のステップ

このアプリケーションを作成したら、Kotlinの構文をさらに深く掘り下げることができます。

* [Kotlin examples](https://play.kotlinlang.org/byExample/overview) からサンプルコードを追加する 
* IDEA 用の[JetBrains Academy プラグイン](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)をインストールし、[Kotlin Koans コース](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans)の演習を完了する