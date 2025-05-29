[//]: # (title: 使用 Kotlin 建立 Spring Boot 專案)
[//]: # (description: 使用 IntelliJ IDEA 建立 Kotlin 的 Spring Boot 應用程式。)

<tldr>
    <p>這是「**Spring Boot 與 Kotlin 入門**」教學的第一部分：</p><br/>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>使用 Kotlin 建立 Spring Boot 專案</strong><br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> 將資料類別新增至 Spring Boot 專案<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 為 Spring Boot 專案新增資料庫支援<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取<br/></p>
</tldr>

本教學的第一部分將展示如何使用 IntelliJ IDEA 中的專案精靈 (Project Wizard) 建立一個使用 Gradle 的 Spring Boot 專案。

> 本教學不強制使用 Gradle 作為建置系統 (build system)。如果您使用 Maven，也可以遵循相同的步驟。
> 
{style="note"}

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

> 如果您使用 IntelliJ IDEA Community Edition 或其他 IDE，可以使用 [基於網頁的專案產生器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 建立 Spring Boot 專案。
> 
{style="tip"}

## 建立 Spring Boot 專案

使用 IntelliJ IDEA Ultimate Edition 中的專案精靈，建立一個新的 Kotlin Spring Boot 專案：

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。 
2. 在左側面板中，選取 **New Project** | **Spring Boot**。
3. 在 **New Project** 視窗中指定以下欄位和選項：
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 此選項指定了建置系統和 DSL。
     >
     {style="tip"}

   * **Package name**: com.example.demo
   * **JDK**: Java JDK
     
     > 本教學使用 **Amazon Corretto version 23**。
     > 如果您沒有安裝 JDK，可以從下拉式清單中下載。
     >
     {style="note"}
   
   * **Java**: 17

   ![Create Spring Boot project](create-spring-boot-project.png){width=800}

4. 確保您已指定所有欄位，然後點擊 **Next**。

5. 選取本教學所需用的以下依賴項 (dependencies)：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   ![Set up Spring Boot project](set-up-spring-boot-project.png){width=800}

6. 點擊 **Create** 以產生並設定專案。

   > IDE 將會產生並開啟一個新專案。下載和匯入專案依賴項 (project dependencies) 可能需要一些時間。
   >
   {style="tip"} 

7. 在此之後，您可以在「**Project view**」中看到以下結構：

   ![Set up Spring Boot project](spring-boot-project-view.png){width=400}

   所產生的 Gradle 專案與 Maven 的標準目錄佈局相對應：
   * 在 `main/kotlin` 資料夾下有屬於應用程式的套件和類別。
   * 應用程式的進入點是 `DemoApplication.kt` 檔案的 `main()` 方法。

## 探索專案的 Gradle 建置檔案 {initial-collapse-state="collapsed" collapsible="true"}

開啟 `build.gradle.kts` 檔案：它是 Gradle Kotlin 建置腳本 (build script)，其中包含了應用程式所需的所有依賴項列表。

此 Gradle 檔案對於 Spring Boot 而言是標準的，但它也包含了必要的 Kotlin 依賴項，包括 kotlin-spring Gradle 外掛程式 (plugin) – `kotlin("plugin.spring")`。

以下是完整的腳本，並附有所有部分和依賴項的解釋：

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

如您所見，Gradle 建置檔案中新增了一些與 Kotlin 相關的構件 (artifacts)：

1. 在 `plugins` 區塊中，有兩個 Kotlin 構件：

   * `kotlin("jvm")` – 此外掛程式定義了專案中要使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 編譯器外掛程式 (compiler plugin)，用於為 Kotlin 類別新增 `open` 修飾符 (modifier)，以使其與 Spring Framework 功能相容

2. 在 `dependencies` 區塊中，列出了一些與 Kotlin 相關的模組：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 此模組為 Kotlin 類別和資料類別的序列化 (serialization) 和反序列化 (deserialization) 新增支援
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射函式庫 (reflection library)

3. 在依賴項部分之後，您可以看到 `kotlin` 外掛程式設定區塊。
   您可以在此處為編譯器新增額外引數 (arguments)，以啟用或禁用各種語言功能。

在 [](gradle-compiler-options.md) 中了解更多關於 Kotlin 編譯器選項的資訊。

## 探索已產生的 Spring Boot 應用程式

開啟 `DemoApplication.kt` 檔案：

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
   <def title="宣告類別 – class DemoApplication">
      <p>在套件宣告 (package declaration) 和匯入語句 (import statements) 之後，您可以看到第一個類別宣告，<code>class DemoApplication</code>。</p>
      <p>在 Kotlin 中，如果一個類別不包含任何成員（屬性或函式），您可以省略類別主體（<code>{}</code>）。</p>
   </def>
   <def title="@SpringBootApplication 註解">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplication 註解</code></a> 是 Spring Boot 應用程式中的一個便捷註解。
      它啟用了 Spring Boot 的 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動組態 (auto-configuration)</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">元件掃描 (component scan)</a>，並能夠在其「應用程式類別」上定義額外組態。
      </p>
   </def>
   <def title="程式進入點 – main()">
      <p><a href="basic-syntax.md#program-entry-point"><code>main()</code></a> 函式是應用程式的進入點。</p>
      <p>它被宣告為 `DemoApplication` 類別之外的 <a href="functions.md#function-scope">頂層函式 (top-level function)</a>。`main()` 函式呼叫 Spring 的 `runApplication(*args)` 函式，以使用 Spring Framework 啟動應用程式。</p>
   </def>
   <def title="可變引數 – args: Array&lt;String&gt;">
      <p>如果您檢查 `runApplication()` 函式的宣告，您將看到函式的參數被標記為 <a href="functions.md#variable-number-of-arguments-varargs">`vararg` 修飾符 (modifier)</a>：<code>vararg args: String</code>。
        這表示您可以向函式傳遞可變數量的字串引數 (String arguments)。
      </p>
   </def>
   <def title="展開運算子 – (*args)">
      <p><code>args</code> 是宣告為字串陣列的 `main()` 函式參數。
        由於這是一個字串陣列，並且您想將其內容傳遞給函式，因此請使用展開運算子（在陣列前面加上星號 <code>*</code>）。
      </p>
   </def>
</deflist>

## 建立控制器

應用程式已準備好執行，但讓我們先更新其邏輯。

在 Spring 應用程式中，控制器 (controller) 用於處理網頁請求 (web requests)。
在相同的套件中，緊鄰 `DemoApplication.kt` 檔案，建立 `MessageController.kt` 檔案，其中包含 `MessageController` 類別，如下所示：

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
   <def title="@RestController 註解">
      <p>您需要告知 Spring <code>MessageController</code> 是一個 REST 控制器 (REST Controller)，因此您應該使用 <code>@RestController</code> 註解來標記它。</p>
      <p>此註解表示該類別將被元件掃描 (component scan) 識別，因為它與我們的 <code>DemoApplication</code> 類別在同一個套件中。</p>
   </def>
   <def title="@GetMapping 註解">
      <p><code>@GetMapping</code> 標記了 REST 控制器中實作與 HTTP GET 呼叫相對應的端點 (endpoints) 的函式：</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParam 註解">
      <p>函式參數 <code>name</code> 被標記為 <code>@RequestParam</code> 註解。此註解表示方法參數應綁定到網頁請求參數 (web request parameter)。</p>
      <p>因此，如果您在根目錄存取應用程式並提供一個名為「name」的請求參數，例如 <code>/?name=&lt;your-value&gt;</code>，則該參數值將用作呼叫 <code>index()</code> 函式的引數。</p>
   </def>
   <def title="單一表達式函式 – index()">
      <p>由於 <code>index()</code> 函式只包含一個語句 (statement)，您可以將其宣告為 <a href="functions.md#single-expression-functions">單一表達式函式 (single-expression function)</a>。</p>
      <p>這表示可以省略大括號，函式主體在等號 <code>=</code> 之後指定。</p>
   </def>
   <def title="函式回傳型別的型別推斷">
      <p><code>index()</code> 函式沒有明確宣告回傳型別。相反，編譯器通過查看等號 <code>=</code> 右側語句的結果來推斷 (infer) 回傳型別。</p>
      <p><code>Hello, $name!</code> 表達式 (expression) 的型別是 <code>String</code>，因此函式的回傳型別也是 <code>String</code>。</p>
   </def>
   <def title="字串樣板 – $name">
      <p><code>Hello, $name!</code> 表達式在 Kotlin 中稱為 <a href="strings.md#string-templates"><i>字串樣板 (String template)</i></a>。</p>
      <p>字串樣板是包含嵌入式表達式 (embedded expressions) 的字串常值 (String literals)。</p>
      <p>這是字串串聯 (String concatenation) 操作的便捷替代方案。</p>
   </def>
</deflist>

## 執行應用程式

Spring 應用程式現在已準備好執行：

1. 在 `DemoApplication.kt` 檔案中，點擊 `main()` 方法旁邊側邊欄 (gutter) 中的綠色 **Run** 圖示：

    ![Run Spring Boot application](run-spring-boot-application.png){width=706}
    
    > 您也可以在終端機 (terminal) 中執行 `./gradlew bootRun` 命令。
    >
    {style="tip"}

    這將在您的電腦上啟動本地伺服器。

2. 應用程式啟動後，開啟以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    您應該會看到「Hello, John!」作為回應印出：

    ![Spring Application response](spring-application-response.png){width=706}

## 下一步

在教學的下一部分，您將了解 Kotlin 資料類別以及如何在應用程式中使用它們。

**[繼續閱讀下一章](jvm-spring-boot-add-data-class.md)**