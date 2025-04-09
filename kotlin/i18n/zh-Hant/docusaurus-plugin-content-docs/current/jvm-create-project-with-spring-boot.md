---
title: "使用 Kotlin 建立 Spring Boot 專案"
description: "使用 IntelliJ IDEA 建立基於 Kotlin 的 Spring Boot 應用程式。"
---
:::info
<p>
   這是 <strong>Spring Boot 和 Kotlin 入門</strong>教學的第一部分：
</p><br/>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>使用 Kotlin 建立 Spring Boot 專案</strong><br/><img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> 將資料類別新增至 Spring Boot 專案<br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 新增對 Spring Boot 專案的資料庫支援<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取<br/>
</p>

:::

本教學的第一部分將向您展示如何在 IntelliJ IDEA 中使用 Project Wizard 建立 Spring Boot 專案。

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

:::note
如果您使用 IntelliJ IDEA Community Edition 或其他 IDE，您可以使用 [基於網路的專案產生器](https://start.spring.io) 來產生 Spring Boot 專案。

:::

## 建立 Spring Boot 專案

透過使用 IntelliJ IDEA Ultimate Edition 中的 Project Wizard，使用 Kotlin 建立一個新的 Spring Boot 專案：

:::note
您也可以使用 [具有 Spring Boot 插件的 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html) 建立新專案。

:::

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
2. 在左側的面板中，選取 **New Project** | **Spring Boot**。
3. 在 Project Wizard 視窗中指定以下欄位和選項：
   
   * **Name (名稱)**：demo
   * **Language (語言)**：Kotlin
   * **Type (類型)**：Gradle - Kotlin

     > 此選項指定建置系統和 DSL（Domain Specific Language，領域特定語言）。
     >
     

   * **Package name (套件名稱)**：demo
   * **JDK (Java 開發套件)**：Java JDK
     
     > 本教學課程使用 **Amazon Corretto version 21**。
     > 如果您沒有安裝 JDK，您可以從下拉式清單中下載。
     >
     
   
   * **Java**：17

   <img src="/img/create-spring-boot-project.png" alt="Create Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

4. 確保您已指定所有欄位，然後按一下 **Next**。

5. 選取本教學課程所需的以下依賴項：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   <img src="/img/set-up-spring-boot-project.png" alt="Set up Spring Boot project" width="800" style={{verticalAlign: 'middle'}}/>

6. 按一下 **Create** 以產生並設定專案。

   > IDE 將產生並開啟一個新專案。下載並匯入專案依賴項可能需要一些時間。
   >
    

7. 完成後，您可以在 **Project view（專案檢視）**中觀察到以下結構：

   <img src="/img/spring-boot-project-view.png" alt="Set up Spring Boot project" width="400" style={{verticalAlign: 'middle'}}/>

   產生的 Gradle 專案對應於 Maven 的標準目錄佈局：
   * `main/kotlin` 資料夾下有屬於應用程式的套件和類別。
   * 應用程式的進入點是 `DemoApplication.kt` 檔案的 `main()` 方法。

## 探索專案 Gradle 建置檔案

開啟 `build.gradle.kts` 檔案：它是 Gradle Kotlin 建置腳本，其中包含應用程式所需的依賴項清單。

Gradle 檔案對於 Spring Boot 來說是標準的，但它也包含必要的 Kotlin 依賴項，包括 kotlin-spring Gradle 插件 – `kotlin("plugin.spring")`。

以下是包含所有部分和依賴項的完整腳本及其說明：

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

正如您所看到的，有一些與 Kotlin 相關的 Artifact（產物）已新增至 Gradle 建置檔案：

1. 在 `plugins` 區塊中，有兩個 Kotlin Artifact（產物）：

   * `kotlin("jvm")` – 此插件定義要在專案中使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 編譯器插件，用於將 `open` 修飾符新增至 Kotlin 類別，以使其與 Spring Framework 功能相容

2. 在 `dependencies` 區塊中，列出了一些與 Kotlin 相關的模組：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 此模組新增了對 Kotlin 類別和資料類別的序列化和反序列化支援
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射函式庫

3. 在 dependencies 區塊之後，您可以看到 `kotlin` 插件配置區塊。
   您可以在此處將額外的參數新增至編譯器，以啟用或停用各種語言功能。

## 探索產生的 Spring Boot 應用程式

開啟 `DemoApplication.kt` 檔案：

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
<h3>宣告類別 – class DemoApplication</h3>
<p>
   在套件宣告和 import 語句之後，您可以看到第一個類別宣告，`class DemoApplication`。
</p>
<p>
   在 Kotlin 中，如果一個類別不包含任何成員（屬性或函數），您可以省略類別主體 (`{}`)。
</p>
<h3>@SpringBootApplication annotation（@SpringBootApplication 註解）</h3>
<p>
   <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">`@SpringBootApplication annotation（@SpringBootApplication 註解）`</a> 是 Spring Boot 應用程式中的一個便利註解。
      它啟用了 Spring Boot 的 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自動配置（auto-configuration）</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">元件掃描（component scan）</a>，並且能夠在其「應用程式類別」上定義額外的配置。
</p>
<h3>Program entry point（程式進入點） – main()</h3>
<p>
   <a href="basic-syntax#program-entry-point">`main()`</a> 函數是應用程式的進入點。
</p>
<p>
   它被宣告為 `DemoApplication` 類別之外的 <a href="functions#function-scope">頂層函數</a>。`main()` 函數調用 Spring 的 `runApplication(*args)` 函數，以使用 Spring Framework 啟動應用程式。
</p>
<h3>Variable arguments（可變參數） – args: Array&lt;String&gt;</h3>
<p>
   如果您檢查 `runApplication()` 函數的宣告，您會看到該函數的參數標有 <a href="functions#variable-number-of-arguments-varargs">`vararg` 修飾符</a>：`vararg args: String`。
        這表示您可以將可變數量的 String 參數傳遞給函數。
</p>
<h3>The spread operator（展開運算符） – (*args)</h3>
<p>
   `args` 是宣告為 String 陣列的 `main()` 函數的參數。
        由於存在一個字串陣列，並且您想要將其內容傳遞給函數，因此請使用展開運算符（在陣列前加上星號 `*`）。
</p>
   

## 建立 Controller（控制器）

應用程式已準備好執行，但我們先更新其邏輯。

在 Spring 應用程式中，Controller（控制器）用於處理 Web 請求。
在與 `DemoApplication.kt` 檔案相同的套件中，建立 `MessageController.kt` 檔案，並將 `MessageController` 類別建立如下：

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
<h3>@RestController annotation（@RestController 註解）</h3>
<p>
   您需要告訴 Spring `MessageController` 是一個 REST Controller（REST 控制器），因此您應該使用 `@RestController` 註解對其進行標記。
</p>
<p>
   此註解表示此類別將被元件掃描拾取，因為它與我們的 `DemoApplication` 類別位於同一套件中。
</p>
<h3>@GetMapping annotation（@GetMapping 註解）</h3>
<p>
   `@GetMapping` 標記了 REST Controller（REST 控制器）的函數，這些函數實現了與 HTTP GET 呼叫相對應的端點：
</p>
      ```kotlin
@GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
```
<h3>@RequestParam annotation（@RequestParam 註解）</h3>
<p>
   函數參數 `name` 標有 `@RequestParam` 註解。此註解表示方法參數應繫結到 Web 請求參數。
</p>
<p>
   因此，如果您在根目錄存取應用程式並提供一個名為「name」的請求參數，例如 `/?name=&lt;your-value&gt;`，則參數值將用作調用 `index()` 函數的參數。
</p>
<h3>Single-expression functions（單表達式函數） – index()</h3>
<p>
   由於 `index()` 函數僅包含一個語句，因此您可以將其宣告為 <a href="functions#single-expression-functions">單表達式函數</a>。
</p>
<p>
   這表示可以省略大括號，並且在等號 `=` 後指定主體。
</p>
<h3>Type inference for function return types（函數返回型別的型別推斷）</h3>
<p>
   `index()` 函數未明確宣告返回型別。相反，編譯器會透過查看等號 `=` 右側語句的結果來推斷返回型別。
</p>
<p>
   `Hello, $name!` 表達式的型別為 `String`，因此函數的返回型別也為 `String`。
</p>
<h3>String templates（字串模板） – $name</h3>
<p>
   `Hello, $name!` 表達式在 Kotlin 中稱為 <a href="strings#string-templates"><i>String template（字串模板）</i></a>。
</p>
<p>
   字串模板是包含嵌入式表達式的字串文字。
</p>
<p>
   這是字串串聯運算的便捷替代方案。
</p>
   

## 執行應用程式

Spring 應用程式現在已準備好執行：

1. 按一下 `main()` 方法旁邊的裝訂邊中的綠色 Run（執行）圖示：

    <img src="/img/run-spring-boot-application.png" alt="Run Spring Boot application" width="706" style={{verticalAlign: 'middle'}}/>
    
    > 您也可以在終端機中執行 `./gradlew bootRun` 命令。
    >
    

    這會在您的電腦上啟動本機伺服器。

2. 應用程式啟動後，開啟以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    您應該看到「Hello, John!」作為回應印出：

    <img src="/img/spring-application-response.png" alt="Spring Application response" width="706" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教學的下一部分中，您將學習 Kotlin 資料類別以及如何在您的應用程式中使用它們。

**[前往下一章](jvm-spring-boot-add-data-class)**