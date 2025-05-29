[//]: # (title: KotlinでSpring Bootプロジェクトを作成する)
[//]: # (description: IntelliJ IDEAを使用して、KotlinでSpring Bootアプリケーションを作成する。)

<tldr>
    <p>これは「<strong>Spring BootとKotlin入門</strong>」チュートリアルの最初のパートです:</p><br/>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Spring BootプロジェクトをKotlinで作成する</strong><br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> Spring Bootプロジェクトにデータクラスを追加する<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Spring Bootプロジェクトにデータベースサポートを追加する<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepositoryを使用してデータベースにアクセスする<br/></p>
</tldr>

チュートリアルの最初のパートでは、IntelliJ IDEAのプロジェクトウィザードを使用して、GradleでSpring Bootプロジェクトを作成する方法を説明します。

> このチュートリアルでは、Gradleをビルドシステムとして使用する必要はありません。Mavenを使用する場合でも、同じ手順に従うことができます。
> 
{style="note"}

## 始める前に

[IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールします。

> IntelliJ IDEA Community Editionまたは別のIDEを使用している場合、[Webベースのプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)を使用してSpring Bootプロジェクトを生成できます。
> 
{style="tip"}

## Spring Bootプロジェクトの作成

IntelliJ IDEA Ultimate Editionのプロジェクトウィザードを使用して、Kotlinで新しいSpring Bootプロジェクトを作成します:

1.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2.  左側のパネルで、**New Project** | **Spring Boot**を選択します。
3.  **New Project**ウィンドウで、以下のフィールドとオプションを指定します:
   
    *   **Name**: demo
    *   **Language**: Kotlin
    *   **Type**: Gradle - Kotlin

      > このオプションは、ビルドシステムとDSLを指定します。
      >
      {style="tip"}

    *   **Package name**: com.example.demo
    *   **JDK**: Java JDK
     
      > このチュートリアルでは、**Amazon Correttoバージョン23**を使用します。
      > JDKがインストールされていない場合は、ドロップダウンリストからダウンロードできます。
      >
      {style="note"}
   
    *   **Java**: 17

    ![Create Spring Boot project](create-spring-boot-project.png){width=800}

4.  すべてのフィールドを指定したことを確認し、**Next**をクリックします。

5.  チュートリアルで必要となる以下の依存関係を選択します:

    *   **Web | Spring Web**
    *   **SQL | Spring Data JDBC**
    *   **SQL | H2 Database**

    ![Set up Spring Boot project](set-up-spring-boot-project.png){width=800}

6.  **Create**をクリックしてプロジェクトを生成および設定します。

    > IDEは新しいプロジェクトを生成して開きます。プロジェクトの依存関係のダウンロードとインポートには時間がかかる場合があります。
    >
    {style="tip"} 

7.  その後、**Projectビュー**で以下の構造を確認できます:

    ![Set up Spring Boot project](spring-boot-project-view.png){width=400}

    生成されたGradleプロジェクトは、Mavenの標準ディレクトリレイアウトに対応しています:
    *   `main/kotlin`フォルダ配下には、アプリケーションに属するパッケージとクラスがあります。
    *   アプリケーションのエントリポイントは、`DemoApplication.kt`ファイルの`main()`メソッドです。

## プロジェクトのGradleビルドファイルを確認する {initial-collapse-state="collapsed" collapsible="true"}

`build.gradle.kts`ファイルを開きます。これはGradle Kotlinビルドスクリプトであり、アプリケーションに必要な依存関係のリストが含まれています。

このGradleファイルはSpring Bootの標準ですが、kotlin-spring Gradleプラグイン (`kotlin("plugin.spring")`) を含む必要なKotlinの依存関係も含まれています。

すべてのアートファクトと依存関係の説明を含む完全なスクリプトは以下の通りです:

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "%springBootSupportedKotlinVersion%" // The version of Kotlin to use
    kotlin("plugin.spring") version "%springBootSupportedKotlinVersion%" // The Kotlin Spring plugin
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
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // Jackson extensions for Kotlin for working with JSON
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlin reflection library, required for working with Spring
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict") // `-Xjsr305=strict` enables the strict mode for JSR-305 annotations
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

ご覧の通り、GradleビルドファイルにはいくつかのKotlin関連のアーティファクトが追加されています:

1.  `plugins`ブロックには、2つのKotlinアーティファクトがあります:

    *   `kotlin("jvm")` – プロジェクトで使用するKotlinのバージョンを定義するプラグイン
    *   `kotlin("plugin.spring")` – Kotlinクラスに`open`修飾子を追加してSpring Frameworkの機能と互換性を持たせるためのKotlin Springコンパイラプラグイン

2.  `dependencies`ブロックには、いくつかのKotlin関連モジュールがリストされています:

    *   `com.fasterxml.jackson.module:jackson-module-kotlin` – Kotlinクラスとデータクラスのシリアライズおよびデシリアライズのサポートを追加するモジュール
    *   `org.jetbrains.kotlin:kotlin-reflect` – Kotlinリフレクションライブラリ

3.  依存関係セクションの後には、`kotlin`プラグインの設定ブロックがあります。
    ここでは、さまざまな言語機能を有効または無効にするために、コンパイラに追加の引数を追加できます。

Kotlinコンパイラオプションの詳細については、[](gradle-compiler-options.md)を参照してください。

## 生成されたSpring Bootアプリケーションの確認

`DemoApplication.kt`ファイルを開きます:

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
      <p>パッケージ宣言とインポート文の直後に、最初のクラス宣言 <code>class DemoApplication</code> を確認できます。</p>
      <p>Kotlinでは、クラスにメンバー（プロパティや関数）が含まれていない場合、クラス本体（<code>{}</code>）を省略できます。</p>
   </def>
   <def title="@SpringBootApplicationアノテーション">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplicationアノテーション</code></a>は、Spring Bootアプリケーションにおける便利なアノテーションです。
      これはSpring Bootの<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動設定</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">コンポーネントスキャン</a>を有効にし、独自の「アプリケーションクラス」に追加の設定を定義できるようにします。
      </p>
   </def>
   <def title="プログラムのエントリポイント – main()">
      <p><a href="basic-syntax.md#program-entry-point"><code>main()</code></a>関数はアプリケーションのエントリポイントです。</p>
      <p>これは<code>DemoApplication</code>クラスの外部で<a href="functions.md#function-scope">トップレベル関数</a>として宣言されています。<code>main()</code>関数はSpringの<code>runApplication(*args)</code>関数を呼び出して、Spring Frameworkでアプリケーションを開始します。</p>
   </def>
   <def title="可変長引数 – args: Array&lt;String&gt;">
      <p><code>runApplication()</code>関数の宣言を確認すると、関数のパラメータが<a href="functions.md#variable-number-of-arguments-varargs">可変長引数 (`vararg`) 修飾子</a>でマークされていることがわかります: <code>vararg args: String</code>。
        これは、関数に任意の数のString引数を渡すことができることを意味します。
      </p>
   </def>
   <def title="スプレッド演算子 – (*args)">
      <p><code>args</code>は<code>main()</code>関数のパラメータで、Stringの配列として宣言されています。
        Stringの配列があり、その内容を関数に渡したい場合は、スプレッド演算子（配列の前にアスタリスク <code>*</code> を付ける）を使用します。
      </p>
   </def>
</deflist>

## コントローラの作成

アプリケーションは実行準備ができていますが、まずそのロジックを更新しましょう。

Springアプリケーションでは、Webリクエストを処理するためにコントローラが使用されます。
`DemoApplication.kt`ファイルと同じパッケージ内に、`MessageController`クラスを持つ`MessageController.kt`ファイルを次のように作成します:

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
      <p>Springに<code>MessageController</code>がRESTコントローラであることを伝えるために、<code>@RestController</code>アノテーションでマークする必要があります。</p>
      <p>このアノテーションは、<code>DemoApplication</code>クラスと同じパッケージにあるため、このクラスがコンポーネントスキャンによって認識されることを意味します。</p>
   </def>
   <def title="@GetMappingアノテーション">
      <p><code>@GetMapping</code>は、HTTP GET呼び出しに対応するエンドポイントを実装するRESTコントローラの関数をマークします:</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParamアノテーション">
      <p>関数パラメータ<code>name</code>は<code>@RequestParam</code>アノテーションでマークされています。このアノテーションは、メソッドパラメータがWebリクエストパラメータにバインドされるべきであることを示します。</p>
      <p>したがって、アプリケーションをルートでアクセスし、「name」というリクエストパラメータ（例: <code>/?name=&lt;your-value&gt;</code>）を提供した場合、そのパラメータ値は<code>index()</code>関数を呼び出すための引数として使用されます。</p>
   </def>
   <def title="単一式関数 – index()">
      <p><code>index()</code>関数は1つのステートメントのみを含むため、<a href="functions.md#single-expression-functions">単一式関数</a>として宣言できます。</p>
      <p>これは、中括弧を省略し、等号 <code>=</code> の後に本体を指定できることを意味します。</p>
   </def>
   <def title="関数の戻り値の型推論">
      <p><code>index()</code>関数は戻り値の型を明示的に宣言していません。代わりに、コンパイラは等号 <code>=</code> の右側のステートメントの結果を見て、戻り値の型を推論します。</p>
      <p><code>Hello, $name!</code>式の型は<code>String</code>であるため、関数の戻り値の型も<code>String</code>です。</p>
   </def>
   <def title="文字列テンプレート – $name">
      <p><code>Hello, $name!</code>式はKotlinでは<a href="strings.md#string-templates"><i>文字列テンプレート</i></a>と呼ばれます。</p>
      <p>文字列テンプレートは、埋め込み式を含む文字列リテラルです。</p>
      <p>これは文字列結合操作の便利な代替手段です。</p>
   </def>
</deflist>

## アプリケーションの実行

Springアプリケーションが実行準備ができました:

1.  `DemoApplication.kt`ファイルで、`main()`メソッドの横にあるガターの緑色の**実行**アイコンをクリックします:

    ![Run Spring Boot application](run-spring-boot-application.png){width=706}
    
    > ターミナルで<code>./gradlew bootRun</code>コマンドを実行することもできます。
    >
    {style="tip"}

    これにより、コンピュータ上でローカルサーバーが起動します。

2.  アプリケーションが起動したら、以下のURLを開きます:

    ```text
    http://localhost:8080?name=John
    ```

    応答として「Hello, John!」が表示されるはずです:

    ![Spring Application response](spring-application-response.png){width=706}

## 次のステップ

チュートリアルの次のパートでは、Kotlinのデータクラスと、それらをアプリケーションでどのように使用できるかについて学びます。

**[次の章に進む](jvm-spring-boot-add-data-class.md)**