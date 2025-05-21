---
title: "Kotlin で Spring Boot プロジェクトを作成する"
description: "IntelliJ IDEA を使用して Kotlin で Spring Boot アプリケーションを作成します。"
---
:::info
<p>
   これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの最初の部分です。
</p><br/>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>KotlinでSpring Bootプロジェクトを作成する</strong><br/><img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> Spring Bootプロジェクトにデータクラスを追加する<br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> Spring Bootプロジェクトにデータベースサポートを追加する<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> Spring Data CrudRepository を使用してデータベースにアクセスする<br/>
</p>

:::

チュートリアルの最初の部分では、Project Wizard を使用して IntelliJ IDEA で Spring Boot プロジェクトを作成する方法を説明します。

## はじめる前に

[IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールします。

:::note
IntelliJ IDEA Community Edition または別の IDE を使用する場合は、[ウェブベースのプロジェクトジェネレーター](https://start.spring.io) を使用して Spring Boot プロジェクトを生成できます。

:::

## Spring Bootプロジェクトを作成する

IntelliJ IDEA Ultimate Edition の Project Wizard を使用して、Kotlin で新しい Spring Boot プロジェクトを作成します。

:::note
[Spring Boot プラグインを備えた IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html) を使用して、新しいプロジェクトを作成することもできます。

:::

1. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
2. 左側のパネルで、**New Project** | **Spring Boot** を選択します。
3. Project Wizard ウィンドウで、次のフィールドとオプションを指定します。
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > このオプションは、ビルドシステムと DSL を指定します。
     >
     

   * **Package name**: demo
   * **JDK**: Java JDK
     
     > このチュートリアルでは、**Amazon Corretto version 21** を使用します。
     > JDK がインストールされていない場合は、ドロップダウンリストからダウンロードできます。
     >
     
   
   * **Java**: 17

   <img src="/img/create-spring-boot-project.png" alt="Create Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

4. すべてのフィールドが指定されていることを確認し、**Next** をクリックします。

5. チュートリアルに必要な次の依存関係を選択します。

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   <img src="/img/set-up-spring-boot-project.png" alt="Set up Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

6. **Create** をクリックして、プロジェクトを生成およびセットアップします。

   > IDE が新しいプロジェクトを生成して開きます。プロジェクトの依存関係のダウンロードとインポートに時間がかかる場合があります。
   >
    

7. この後、**Project view** で次の構造を確認できます。

   <img src="/img/spring-boot-project-view.png" alt="Set up Spring Boot project" width="400" style={{verticalAlign: 'middle'}}/>

   生成された Gradle プロジェクトは、Maven の標準ディレクトリレイアウトに対応しています。
   * アプリケーションに属するパッケージとクラスは、`main/kotlin` フォルダの下にあります。
   * アプリケーションのエントリーポイントは、`DemoApplication.kt` ファイルの `main()` メソッドです。

## プロジェクトの Gradle ビルドファイル を調べる

`build.gradle.kts` ファイルを開きます。これは Gradle Kotlin ビルドスクリプトであり、アプリケーションに必要な依存関係のリストが含まれています。

Gradle ファイルは Spring Boot では標準ですが、kotlin-spring Gradle プラグイン (`kotlin("plugin.spring")`) を含む、必要な Kotlin の依存関係も含まれています。

以下は、すべての部分と依存関係の説明を含む完全なスクリプトです。

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.24" // The version of Kotlin to use
    kotlin("plugin.spring") version "1.9.24" // The Kotlin Spring plugin
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
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

ご覧のとおり、Gradle ビルドファイルにはいくつかの Kotlin 関連の成果物が追加されています。

1. `plugins` ブロックには、2 つの Kotlin 成果物があります。

   * `kotlin("jvm")` – プラグインは、プロジェクトで使用する Kotlin のバージョンを定義します
   * `kotlin("plugin.spring")` – Kotlin Spring コンパイラープラグイン。Spring Framework の機能と互換性を持たせるために、Kotlin クラスに `open` 修飾子を追加します

2. `dependencies` ブロックには、いくつかの Kotlin 関連のモジュールがリストされています。

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – モジュールは、Kotlin クラスおよびデータクラスのシリアル化とデシリアル化のサポートを追加します
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin リフレクションライブラリ

3. 依存関係セクションの後に、`kotlin` プラグイン構成ブロックが表示されます。
   ここでは、コンパイラーに追加の引数を追加して、さまざまな言語機能を有効または無効にできます。

## 生成されたSpring Bootアプリケーションを調べる

`DemoApplication.kt` ファイルを開きます。

```kotlin
// DemoApplication.kt
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
<h3>クラスの宣言 – class DemoApplication</h3>
<p>
   パッケージの宣言とインポートステートメントの直後に、最初のクラス宣言 `class DemoApplication` が表示されます。
</p>
<p>
   Kotlin では、クラスにメンバー (プロパティまたは関数) が含まれていない場合は、クラス本体 (`{}`) を省略できます。
</p>
<h3>@SpringBootApplication アノテーション</h3>
<p>
   <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">`@SpringBootApplication annotation`</a> は、Spring Boot アプリケーションの便利なアノテーションです。
      Spring Boot の <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動構成</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">コンポーネントスキャン</a>を有効にし、「アプリケーションクラス」で追加の構成を定義できるようにします。
</p>
<h3>プログラムのエントリーポイント – main()</h3>
<p>
   <a href="basic-syntax#program-entry-point">`main()`</a> 関数は、アプリケーションのエントリーポイントです。
</p>
<p>
   これは、`DemoApplication` クラスの外側の <a href="functions#function-scope">トップレベル関数</a> として宣言されています。`main()` 関数は、Spring の `runApplication(*args)` 関数を呼び出して、Spring Framework でアプリケーションを起動します。
</p>
<h3>可変引数 – args: Array&lt;String&gt;</h3>
<p>
   `runApplication()` 関数の宣言を確認すると、関数のパラメータが <a href="functions#variable-number-of-arguments-varargs">`vararg` 修飾子</a>: `vararg args: String` でマークされていることがわかります。
        これは、可変数の String 引数を関数に渡すことができることを意味します。
</p>
<h3>スプレッド演算子 – (*args)</h3>
<p>
   `args` は、String の配列として宣言された `main()` 関数のパラメータです。
        文字列の配列があり、そのコンテンツを関数に渡したい場合は、スプレッド演算子を使用します (配列の前にアスタリスク記号 `*` を付けます)。
</p>
   

## コントローラーの作成

アプリケーションは実行する準備ができていますが、最初にそのロジックを更新しましょう。

Spring アプリケーションでは、コントローラーはウェブ要求を処理するために使用されます。
`DemoApplication.kt` ファイルと同じパッケージで、`MessageController` クラスを含む `MessageController.kt` ファイルを次のように作成します。

```kotlin
// MessageController.kt
package demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```
<h3>@RestController アノテーション</h3>
<p>
   `MessageController` が REST Controller であることを Spring に伝える必要があるため、`@RestController` アノテーションでマークする必要があります。
</p>
<p>
   このアノテーションは、このクラスが `DemoApplication` クラスと同じパッケージにあるため、コンポーネントスキャンによって選択されることを意味します。
</p>
<h3>@GetMapping アノテーション</h3>
<p>
   `@GetMapping` は、HTTP GET 呼び出しに対応するエンドポイントを実装する REST コントローラーの関数をマークします。
</p>
      ```kotlin
@GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
```
<h3>@RequestParam アノテーション</h3>
<p>
   関数パラメータ `name` は `@RequestParam` アノテーションでマークされています。このアノテーションは、メソッドパラメータをウェブ要求パラメータにバインドする必要があることを示します。
</p>
<p>
   したがって、ルートでアプリケーションにアクセスし、`/?name=&lt;your-value&gt;` のように「name」という要求パラメータを指定すると、パラメータ値は `index()` 関数を呼び出すための引数として使用されます。
</p>
<h3>単一式関数 – index()</h3>
<p>
   `index()` 関数にはステートメントが 1 つしかないため、<a href="functions#single-expression-functions">単一式関数</a>として宣言できます。
</p>
<p>
   これは、中括弧を省略でき、本体が等号 `=` の後に指定されることを意味します。
</p>
<h3>関数戻り値の型の型推論</h3>
<p>
   `index()` 関数は、戻り値の型を明示的に宣言しません。代わりに、コンパイラーは等号 `=` の右側のステートメントの結果を見て戻り値の型を推論します。
</p>
<p>
   `Hello, $name!` 式の型は `String` であるため、関数の戻り値の型も `String` です。
</p>
<h3>文字列テンプレート – $name</h3>
<p>
   `Hello, $name!` 式は、Kotlin では <a href="strings#string-templates"><i>文字列テンプレート</i></a> と呼ばれます。
</p>
<p>
   文字列テンプレートは、埋め込み式を含む文字列リテラルです。
</p>
<p>
   これは、文字列連結操作の便利な代替手段です。
</p>
   

## アプリケーションの実行

Spring アプリケーションを実行する準備ができました。

1. `main()` メソッドの横にあるガターにある緑色の実行アイコンをクリックします。

    <img src="/img/run-spring-boot-application.png" alt="Run Spring Boot application" width="706" style={{verticalAlign: 'middle'}}/>
    
    > ターミナルで `./gradlew bootRun` コマンドを実行することもできます。
    >
    

    これにより、ローカルサーバーがコンピューター上で起動します。

2. アプリケーションが起動したら、次の URL を開きます。

    ```text
    http://localhost:8080?name=John
    ```

    「Hello, John!」が応答として出力されるはずです。

    <img src="/img/spring-application-response.png" alt="Spring Application response" width="706" style={{verticalAlign: 'middle'}}/>

## 次のステップ

チュートリアルの次のパートでは、Kotlin データクラスと、アプリケーションでの使用方法について学習します。

**[次の章に進む](jvm-spring-boot-add-data-class)**