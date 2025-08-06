[//]: # (title: KotlinでSpring Bootプロジェクトを作成する)

<web-summary>IntelliJ IDEAを使用してKotlinでSpring Bootアプリケーションを作成します。</web-summary>

<tldr>
    <p>これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの最初のパートです。</p><br/>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ"/> <strong>KotlinでSpring Bootプロジェクトを作成する</strong><br/><img src="icon-2-todo.svg" width="20" alt="2番目のステップ"/> Spring Bootプロジェクトにデータクラスを追加する<br/><img src="icon-3-todo.svg" width="20" alt="3番目のステップ"/> Spring Bootプロジェクトのデータベースサポートを追加する<br/><img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> データベースアクセスにSpring Data CrudRepositoryを使用する<br/></p>
</tldr>

チュートリアルの最初のパートでは、IntelliJ IDEAのプロジェクトウィザードを使用して、GradleでSpring Bootプロジェクトを作成する方法を示します。

> このチュートリアルでは、ビルドシステムとしてGradleを使用する必要はありません。Mavenを使用する場合でも、同じ手順に従うことができます。
> 
{style="note"}

## 開始する前に

[IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

> IntelliJ IDEA Community Editionまたは他のIDEを使用している場合は、
> [ウェブベースのプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)を使用してSpring Bootプロジェクトを生成できます。
> 
{style="tip"}

## Spring Bootプロジェクトを作成する

IntelliJ IDEA Ultimate Editionのプロジェクトウィザードを使用して、Kotlinで新しいSpring Bootプロジェクトを作成します。

1.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2.  左側のパネルで、**New Project** | **Spring Boot**を選択します。
3.  **New Project**ウィンドウで、以下のフィールドとオプションを指定します。
   
   *   **Name**: demo
   *   **Language**: Kotlin
   *   **Type**: Gradle - Kotlin

     > このオプションは、ビルドシステムとDSLを指定します。
     >
     {style="tip"}

   *   **Package name**: com.example.demo
   *   **JDK**: Java JDK
     
     > このチュートリアルでは、**Amazon Corretto version 23**を使用します。
     > JDKがインストールされていない場合、ドロップダウンリストからダウンロードできます。
     >
     {style="note"}
   
   *   **Java**: 17
   
     > Java 17がインストールされていない場合、JDKドロップダウンリストからダウンロードできます。
     >
     {style="tip"}

   ![Spring Bootプロジェクトの作成](create-spring-boot-project.png){width=800}

4.  すべてのフィールドが指定されていることを確認し、**Next**をクリックします。

5.  チュートリアルに必要な以下の依存関係を選択します。

   *   **Web | Spring Web**
   *   **SQL | Spring Data JDBC**
   *   **SQL | H2 Database**

   ![Spring Bootプロジェクトのセットアップ](set-up-spring-boot-project.png){width=800}

6.  **Create**をクリックしてプロジェクトを生成およびセットアップします。

   > IDEは新しいプロジェクトを生成して開きます。プロジェクトの依存関係のダウンロードとインポートには時間がかかる場合があります。
   >
   {style="tip"} 

7.  その後、**Project view**で以下の構造を確認できます。

   ![Spring Bootプロジェクトのビュー](spring-boot-project-view.png){width=400}

   生成されたGradleプロジェクトは、Mavenの標準ディレクトリレイアウトに対応しています。
   *   `main/kotlin`フォルダーの下には、アプリケーションに属するパッケージとクラスがあります。
   *   アプリケーションのエントリポイントは、`DemoApplication.kt`ファイルの`main()`メソッドです。

## プロジェクトのGradleビルドファイルを確認する {initial-collapse-state="collapsed" collapsible="true"}

`build.gradle.kts`ファイルを開きます。これはGradle Kotlinビルドスクリプトであり、アプリケーションに必要な依存関係のリストが含まれています。

このGradleファイルはSpring Bootの標準ですが、kotlin-spring Gradleプラグイン (`kotlin("plugin.spring")`) を含む必要なKotlin依存関係も含まれています。

以下は、すべてのパートと依存関係の説明を含む完全なスクリプトです。

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "%springBootSupportedKotlinVersion%" // 使用するKotlinのバージョン
    kotlin("plugin.spring") version "%springBootSupportedKotlinVersion%" // Kotlin Springプラグイン
    id("org.springframework.boot") version "%springBootVersion%"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // JSONを扱うためのKotlin用Jackson拡張
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlinリフレクションライブラリ。Springで作業するために必要
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict") // `-Xjsr305=strict`はJSR-305アノテーションの厳格モードを有効にする
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

ご覧のとおり、GradleビルドファイルにはいくつかのKotlin関連のアーティファクトが追加されています。

1.  `plugins`ブロックには2つのKotlinアーティファクトがあります。

   *   `kotlin("jvm")` – プロジェクトで使用するKotlinのバージョンを定義するプラグイン
   *   `kotlin("plugin.spring")` – Spring Frameworkの機能と互換性を持たせるために、Kotlinクラスに`open`修飾子を追加するKotlin Springコンパイラプラグイン

2.  `dependencies`ブロックには、いくつかのKotlin関連モジュールがリストされています。

   *   `com.fasterxml.jackson.module:jackson-module-kotlin` – Kotlinクラスおよびデータクラスのシリアライズとデシリアライズのサポートを追加するモジュール
   *   `org.jetbrains.kotlin:kotlin-reflect` – Kotlinリフレクションライブラリ

3.  依存関係セクションの後には、`kotlin`プラグインの設定ブロックが表示されます。
    ここでは、さまざまな言語機能を有効または無効にするために、コンパイラに追加の引数を追加できます。

Kotlinコンパイラのオプションの詳細については、[](gradle-compiler-options.md)を参照してください。

## 生成されたSpring Bootアプリケーションを確認する

`DemoApplication.kt`ファイルを開きます。

```kotlin
// DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

<deflist collapsible="true">
   <def title="クラスの宣言 – class DemoApplication">
      <p>パッケージ宣言とインポート文の直後に、最初のクラス宣言である<code>class DemoApplication</code>が表示されます。</p>
      <p>Kotlinでは、クラスにメンバー（プロパティや関数）が含まれていない場合、クラス本体（<code>{}</code>）を省略することができます。</p>
   </def>
   <def title="@SpringBootApplicationアノテーション">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplicationアノテーション</code></a>は、Spring Bootアプリケーションの便利なアノテーションです。
      Spring Bootの<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動構成</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">コンポーネントスキャン</a>を有効にし、その「アプリケーションクラス」に追加の構成を定義できるようにします。
      </p>
   </def>
   <def title="プログラムのエントリポイント – main()">
      <p><a href="basic-syntax.md#program-entry-point"><code>main()</code></a>関数は、アプリケーションのエントリポイントです。</p>
      <p>これは、`DemoApplication`クラスの外で<a href="functions.md#function-scope">トップレベル関数</a>として宣言されています。<code>main()</code>関数は、Springの`runApplication(*args)`関数を呼び出して、Spring Frameworkでアプリケーションを起動します。</p>
   </def>
   <def title="可変引数 – args: Array&lt;String&gt;">
      <p>`runApplication()`関数の宣言を確認すると、関数のパラメータが<a href="functions.md#variable-number-of-arguments-varargs"><code>vararg</code>修飾子</a>でマークされていることがわかります。`vararg args: String`です。
        これは、関数に可変数の`String`引数を渡すことができることを意味します。
      </p>
   </def>
   <def title="スプレッド演算子 – (*args)">
      <p>`args`は、`main()`関数へのパラメータであり、`String`の配列として宣言されています。
        `String`の配列があり、その内容を関数に渡したい場合は、スプレッド演算子（配列の前にアスタリスク`*`を付ける）を使用します。
      </p>
   </def>
</deflist>

## コントローラーを作成する

アプリケーションを実行する準備ができていますが、まずそのロジックを更新しましょう。

Springアプリケーションでは、Webリクエストを処理するためにコントローラーが使用されます。
`DemoApplication.kt`ファイルと同じパッケージに、`MessageController.kt`ファイルを以下の`MessageController`クラスとともに作成します。

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

<deflist collapsible="true">
   <def title="@RestControllerアノテーション">
      <p>`MessageController`がRESTコントローラーであることをSpringに伝える必要があるため、`@RestController`アノテーションでマークする必要があります。</p>
      <p>このアノテーションは、このクラスが`DemoApplication`クラスと同じパッケージにあるため、コンポーネントスキャンによって取得されることを意味します。</p>
   </def>
   <def title="@GetMappingアノテーション">
      <p>`@GetMapping`は、HTTP GET呼び出しに対応するエンドポイントを実装するRESTコントローラーの関数をマークします。</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParamアノテーション">
      <p>関数パラメータ`name`は`@RequestParam`アノテーションでマークされています。このアノテーションは、メソッドパラメータがWebリクエストパラメータにバインドされるべきであることを示します。</p>
      <p>したがって、ルートでアプリケーションにアクセスし、`/?name=&lt;your-value&gt;`のように「name」というリクエストパラメータを提供すると、そのパラメータ値が`index()`関数を呼び出すための引数として使用されます。</p>
   </def>
   <def title="単一式関数 – index()">
      <p>`index()`関数には1つのステートメントしか含まれていないため、<a href="functions.md#single-expression-functions">単一式関数</a>として宣言できます。</p>
      <p>これは、中括弧を省略でき、本文が等号`=`の後に指定されることを意味します。</p>
   </def>
   <def title="関数の戻り値の型の型推論">
      <p>`index()`関数は、戻り値の型を明示的に宣言していません。代わりに、コンパイラは等号`=`の右側のステートメントの結果を見て、戻り値の型を推論します。</p>
      <p>`Hello, $name!`式の型は`String`であるため、関数の戻り値の型も`String`です。</p>
   </def>
   <def title="文字列テンプレート – $name">
      <p>`Hello, $name!`式は、Kotlinでは<a href="strings.md#string-templates"><i>文字列テンプレート</i></a>と呼ばれます。</p>
      <p>文字列テンプレートは、埋め込み式を含む文字列リテラルです。</p>
      <p>これは、文字列連結操作の便利な代替手段です。</p>
   </def>
</deflist>

## アプリケーションを実行する

Springアプリケーションの実行準備が整いました。

1.  `DemoApplication.kt`ファイルで、`main()`メソッドの横にあるガターの緑色の**Run**アイコンをクリックします。

    ![Spring Bootアプリケーションの実行](run-spring-boot-application.png){width=706}
    
    > ターミナルで`./gradlew bootRun`コマンドを実行することもできます。
    >
    {style="tip"}

    これにより、ローカルサーバーがコンピューター上で起動します。

2.  アプリケーションが起動したら、以下のURLを開きます。

    ```text
    http://localhost:8080?name=John
    ```

    「Hello, John!」という応答が表示されるはずです。

    ![Springアプリケーションの応答](spring-application-response.png){width=706}

## 次のステップ

チュートリアルの次のパートでは、Kotlinのデータクラスについて、そしてそれらをアプリケーションでどのように使用できるかを学びます。

**[次の章に進む](jvm-spring-boot-add-data-class.md)**