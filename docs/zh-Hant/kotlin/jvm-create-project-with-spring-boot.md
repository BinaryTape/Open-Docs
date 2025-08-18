[//]: # (title: 使用 Kotlin 建立 Spring Boot 專案)

<web-summary>使用 IntelliJ IDEA 搭配 Kotlin 建立 Spring Boot 應用程式。</web-summary>

<tldr>
    <p>這是「<strong>Spring Boot 與 Kotlin 入門</strong>」教學的第一部分：</p><br/>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>使用 Kotlin 建立 Spring Boot 專案</strong><br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> 在 Spring Boot 專案中新增資料類別<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 為 Spring Boot 專案新增資料庫支援<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取<br/></p>
</tldr>

本教學的第一部分將展示如何使用 IntelliJ IDEA 中的專案精靈 (Project Wizard) 透過 Gradle 建立一個 Spring Boot 專案。

> 本教學不強制要求使用 Gradle 作為建構系統。如果您使用 Maven，也可以遵循相同的步驟。
> 
{style="note"}

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

> 如果您使用 IntelliJ IDEA Community Edition 或其他 IDE，您可以透過
> [基於網頁的專案產生器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 來產生 Spring Boot 專案。
> 
{style="tip"}

## 建立 Spring Boot 專案

使用 IntelliJ IDEA Ultimate Edition 中的專案精靈來建立一個新的 Kotlin Spring Boot 專案：

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
2. 在左側面板中，選取 **New Project** | **Spring Boot**。
3. 在 **New Project** 視窗中指定以下欄位和選項：
   
   * **Name** (名稱): demo
   * **Language** (語言): Kotlin
   * **Type** (類型): Gradle - Kotlin

     > 此選項指定了建構系統和 DSL。
     >
     {style="tip"}

   * **Package name** (套件名稱): com.example.demo
   * **JDK**: Java JDK
     
     > 本教學使用 **Amazon Corretto 版本 23**。
     > 如果您沒有安裝 JDK，可以從下拉式選單中下載。
     >
     {style="note"}
   
   * **Java**: 17
   
     > 如果您沒有安裝 Java 17，可以從 JDK 下拉式選單中下載。
     >
     {style="tip"}

   ![建立 Spring Boot 專案](create-spring-boot-project.png){width=800}

4. 確保您已指定所有欄位，然後點擊 **Next** (下一步)。

5. 選取教學所需的以下相依性 (dependencies)：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   ![設定 Spring Boot 專案](set-up-spring-boot-project.png){width=800}

6. 點擊 **Create** (建立) 以產生並設定專案。

   > IDE 將產生並開啟一個新專案。下載並匯入專案相依性可能需要一些時間。
   >
   {style="tip"} 

7. 完成後，您可以在 **Project view** (專案檢視) 中觀察到以下結構：

   ![設定 Spring Boot 專案](spring-boot-project-view.png){width=400}

   所產生的 Gradle 專案與 Maven 的標準目錄佈局相符：
   * 在 `main/kotlin` 資料夾下有屬於應用程式的套件和類別。
   * 應用程式的進入點 (entry point) 是 `DemoApplication.kt` 檔案的 `main()` 方法。

## 探索專案的 Gradle 建構檔 {initial-collapse-state="collapsed" collapsible="true"}

開啟 `build.gradle.kts` 檔案：它是 Gradle Kotlin 建構腳本，其中包含應用程式所需相依性的列表。

此 Gradle 檔案對於 Spring Boot 來說是標準的，但它也包含必要的 Kotlin 相依性，包括 kotlin-spring Gradle 外掛程式 (plugin) – `kotlin("plugin.spring")`。

以下是完整腳本以及所有部分和相依性的解釋：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "%springBootSupportedKotlinVersion%" // 要使用的 Kotlin 版本
    kotlin("plugin.spring") version "%springBootSupportedKotlinVersion%" // Kotlin Spring 外掛程式
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
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // 用於與 JSON 協作的 Kotlin Jackson 擴充功能
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlin 反射函式庫，Spring 協作所需
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict") // `-Xjsr305=strict` 啟用 JSR-305 註解的嚴格模式
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

如您所見，Gradle 建構檔中新增了一些與 Kotlin 相關的 artifacts：

1. 在 `plugins` 區塊中，有兩個 Kotlin artifacts：

   * `kotlin("jvm")` – 此外掛程式定義了專案中使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 編譯器外掛程式，用於向 Kotlin 類別新增 `open` 修飾符 (modifier)，使其與 Spring Framework 功能相容

2. 在 `dependencies` 區塊中，列出了一些與 Kotlin 相關的模組：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 此模組增加了對 Kotlin 類別和資料類別的序列化 (serialization) 和反序列化 (deserialization) 支援
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射函式庫 (reflection library)

3. 在相依性區段之後，您可以看到 `kotlin` 外掛程式的組態區塊。
   您可以在此處為編譯器新增額外參數，以啟用或停用各種語言功能。

了解更多關於 Kotlin 編譯器選項的資訊，請參閱 [](gradle-compiler-options.md)。

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
      <p>在套件宣告和匯入 (import) 語句之後，您會看到第一個類別宣告，<code>class DemoApplication</code>。</p>
      <p>在 Kotlin 中，如果一個類別不包含任何成員（屬性或函數），您可以省略類別主體（<code>{}</code>），以求簡潔。</p>
   </def>
   <def title="@SpringBootApplication 註解">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplication 註解</code></a> 是 Spring Boot 應用程式中的一個便利註解。
      它啟用了 Spring Boot 的 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動組態 (auto-configuration)</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">元件掃描 (component scan)</a>，並且能夠在「應用程式類別」上定義額外組態。
      </p>
   </def>
   <def title="程式進入點 – main()">
      <p><a href="basic-syntax.md#program-entry-point"><code>main()</code></a> 函數是應用程式的進入點。</p>
      <p>它被宣告為 <code>DemoApplication</code> 類別之外的<a href="functions.md#function-scope">頂層函數 (top-level function)</a>。<code>main()</code> 函數呼叫 Spring 的 <code>runApplication(*args)</code> 函數，以啟動 Spring Framework 應用程式。</p>
   </def>
   <def title="可變引數 – args: Array&lt;String&gt;">
      <p>如果您檢查 <code>runApplication()</code> 函數的宣告，您會看到函數的參數被標記為 <a href="functions.md#variable-number-of-arguments-varargs"><code>vararg</code> 修飾符</a>：<code>vararg args: String</code>。
        這意味著您可以向函數傳遞可變數量的 String 引數。
      </p>
   </def>
   <def title="展開運算子 – (*args)">
      <p><code>args</code> 是 <code>main()</code> 函數的一個參數，宣告為 String 陣列。
        由於這是一個 String 陣列，並且您想將其內容傳遞給函數，因此請使用展開運算子 (spread operator)（在陣列前加上星號 <code>&#42;</code>）。
      </p>
   </def>
</deflist>

## 建立控制器

應用程式已準備就緒可以執行，但讓我們先更新其邏輯。

在 Spring 應用程式中，控制器 (controller) 用於處理網頁請求。
在與 `DemoApplication.kt` 檔案相同的套件中，建立 `MessageController.kt` 檔案，其中包含
`MessageController` 類別，如下所示：

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
      <p>您需要告訴 Spring <code>MessageController</code> 是一個 REST 控制器 (REST Controller)，因此您應該用 <code>@RestController</code> 註解來標記它。</p>
      <p>這個註解表示這個類別將會被元件掃描 (component scan) 所識別，因為它與我們的 <code>DemoApplication</code> 類別位於同一個套件中。</p>
   </def>
   <def title="@GetMapping 註解">
      <p><code>@GetMapping</code> 標記了 REST 控制器中實作對應 HTTP GET 呼叫端點 (endpoints) 的函數：</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParam 註解">
      <p>函數參數 <code>name</code> 被標記為 <code>@RequestParam</code> 註解。這個註解表示方法參數應該綁定到網頁請求參數。</p>
      <p>因此，如果您在根目錄存取應用程式並提供一個名為「name」的請求參數，例如 <code>/?name=&lt;your-value&gt;</code>，該參數值將被用作呼叫 <code>index()</code> 函數的引數。</p>
   </def>
   <def title="單一表達式函數 – index()">
      <p>由於 <code>index()</code> 函數只包含一個語句，您可以將其宣告為<a href="functions.md#single-expression-functions">單一表達式函數 (single-expression function)</a>。</p>
      <p>這表示可以省略花括號 (curly braces)，並且函數主體在等號 <code>=</code> 後面指定。</p>
   </def>
   <def title="函數回傳型別的型別推斷">
      <p><code>index()</code> 函數沒有明確宣告回傳型別。相反地，編譯器透過查看等號 <code>=</code> 右側語句的結果來推斷回傳型別。</p>
      <p>表達式 <code>Hello, $name!</code> 的型別是 <code>String</code>，因此函數的回傳型別也是 <code>String</code>。</p>
   </def>
   <def title="字串模板 – $name">
      <p><code>Hello, $name!</code> 表達式在 Kotlin 中稱為<a href="strings.md#string-templates"><em>字串模板 (String template)</em></a>。</p>
      <p>字串模板是包含嵌入式表達式的字串文字 (String literals)。</p>
      <p>這是字串串聯 (String concatenation) 操作的便捷替代方案。</p>
   </def>
</deflist>

## 執行應用程式

Spring 應用程式現在已準備好執行：

1. 在 `DemoApplication.kt` 檔案中，點擊 `main()` 方法旁裝訂線 (gutter) 中的綠色 **Run** (執行) 圖示：

    ![執行 Spring Boot 應用程式](run-spring-boot-application.png){width=706}
    
    > 您也可以在終端機中執行 `./gradlew bootRun` 命令。
    >
    {style="tip"}

    這將在您的電腦上啟動本地伺服器。

2. 應用程式啟動後，開啟以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    您應該會看到「Hello, John!」作為回應：

    ![Spring 應用程式回應](spring-application-response.png){width=706}

## 下一步

在本教學的下一部分中，您將了解 Kotlin 資料類別以及如何在應用程式中使用它們。

**[前往下一章](jvm-spring-boot-add-data-class.md)**