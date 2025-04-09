---
title: "Kotlin/JVM を始める"
---
このチュートリアルでは、IntelliJ IDEA を使用してコンソールアプリケーションを作成する方法を説明します。

まず、最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) をダウンロードしてインストールしてください。

## プロジェクトの作成

1. IntelliJ IDEA で、**File（ファイル）** | **New（新規）** | **Project（プロジェクト）** を選択します。
2. 左側のリストで、**Kotlin** を選択します。
3. 新しいプロジェクトに名前を付け、必要に応じてその場所を変更します。

   > 新しいプロジェクトをバージョン管理下に置くには、**Create Git repository（Gitリポジトリを作成）** チェックボックスをオンにします。これは後でいつでも行うことができます。
   >
   
   
   <img src="/img/jvm-new-project.png" alt="コンソールアプリケーションを作成" width="700" style={{verticalAlign: 'middle'}}/>

4. **IntelliJ** ビルドシステムを選択します。これは、追加のアーティファクトをダウンロードする必要がないネイティブビルダーです。

   さらに構成が必要な、より複雑なプロジェクトを作成する場合は、Maven または Gradle を選択します。 Gradle の場合は、ビルドスクリプトの言語（Kotlin または Groovy）を選択します。
5. **JDK list（JDKリスト）** から、プロジェクトで使用する [JDK](https://www.oracle.com/java/technologies/downloads/) を選択します。
   * JDK がコンピューターにインストールされていても、IDE で定義されていない場合は、**Add JDK（JDKを追加）** を選択して、JDK ホームディレクトリへのパスを指定します。
   * 必要な JDK がコンピューターにない場合は、**Download JDK（JDKをダウンロード）** を選択します。

6. **Add sample code（サンプルコードを追加）** オプションを有効にして、サンプルの`"Hello World!"`アプリケーションを含むファイルを作成します。

    > **Generate code with onboarding tips（オンボーディングのヒントを含むコードを生成）** オプションを有効にして、サンプルコードに役立つコメントを追加することもできます。
    >
    

7. **Create（作成）** をクリックします。

    > Gradle ビルドシステムを選択した場合、プロジェクトにはビルドスクリプトファイル `build.gradle(.kts)` があります。これには、`kotlin("jvm")` プラグインとコンソールアプリケーションに必要な依存関係が含まれています。プラグインの最新バージョンを使用していることを確認してください。
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "2.1.20"
    >     application
    > }
    > ```
    > 
    

## アプリケーションの作成

1. `src/main/kotlin` にある `Main.kt` ファイルを開きます。
   `src` ディレクトリには、Kotlin ソースファイルとリソースが含まれています。 `Main.kt` ファイルには、`Hello, Kotlin!` と、サイクルイテレーターの値を含むいくつかの行を出力するサンプルコードが含まれています。

   <img src="/img/jvm-main-kt-initial.png" alt="main fun を含む Main.kt" width="700" style={{verticalAlign: 'middle'}}/>

2. あなたの名前を要求し、あなたに `Hello` と言うようにコードを変更します。

   * 入力プロンプトを作成し、[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数によって返される値を `name` 変数に割り当てます。
   * 文字列連結の代わりに、ドル記号 `$` を追加して文字列テンプレートを使用しましょう。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## アプリケーションの実行

これで、アプリケーションを実行する準備ができました。 最も簡単な方法は、ガターにある緑色の **Run（実行）** アイコンをクリックし、**Run 'MainKt'（'MainKt' を実行）** を選択することです。

<img src="/img/jvm-run-app.png" alt="コンソールアプリの実行" width="350" style={{verticalAlign: 'middle'}}/>

**Run（実行）** ツールウィンドウで結果を確認できます。

<img src="/img/jvm-output-1.png" alt="Kotlin の実行結果" width="600" style={{verticalAlign: 'middle'}}/>
   
名前を入力して、アプリケーションからの挨拶を受け入れてください！

<img src="/img/jvm-output-2.png" alt="Kotlin の実行結果" width="600" style={{verticalAlign: 'middle'}}/>

おめでとうございます！ これで、最初の Kotlin アプリケーションを実行できました。

## 次は何をしますか？

このアプリケーションを作成したら、Kotlin の構文をさらに深く掘り下げることができます。

* [Kotlin examples（Kotlin の例）](https://play.kotlinlang.org/byExample/overview) からサンプルコードを追加する
* IDEA 用の [JetBrains Academy plugin](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) をインストールし、[Kotlin Koans course（Kotlin Koans コース）](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) の演習を完了する