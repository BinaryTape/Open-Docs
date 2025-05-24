---
title: "使用 Kotlin 创建 Spring Boot 项目"
description: "使用 IntelliJ IDEA 创建一个基于 Kotlin 的 Spring Boot 应用程序。"
---
:::info
<p>
   这是 <strong>Spring Boot 和 Kotlin 入门</strong>教程的第一部分：
</p><br/>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>使用 Kotlin 创建 Spring Boot 项目</strong><br/><img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> 向 Spring Boot 项目添加数据类<br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 为 Spring Boot 项目添加数据库支持<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问<br/>
</p>

:::

本教程的第一部分将向你展示如何在 IntelliJ IDEA 中使用 Project Wizard（项目向导）创建 Spring Boot 项目。

## 开始之前

下载并安装最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

:::note
如果你使用的是 IntelliJ IDEA Community Edition 或其他 IDE，你可以使用 [基于 Web 的项目生成器](https://start.spring.io)生成 Spring Boot 项目。

:::

## 创建 Spring Boot 项目

通过使用 IntelliJ IDEA Ultimate Edition 中的 Project Wizard（项目向导）创建一个新的 Kotlin Spring Boot 项目：

:::note
你也可以使用 [带有 Spring Boot 插件的 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html) 创建一个新项目。

:::

1. 在 IntelliJ IDEA 中，选择 **File（文件）** | **New（新建）** | **Project（项目）**。
2. 在左侧面板中，选择 **New Project（新建项目）** | **Spring Boot**。
3. 在 Project Wizard（项目向导）窗口中指定以下字段和选项：
   
   * **Name（名称）**: demo
   * **Language（语言）**: Kotlin
   * **Type（类型）**: Gradle - Kotlin

     > 此选项指定构建系统和 DSL。
     >
     

   * **Package name（包名）**: demo
   * **JDK**: Java JDK
     
     > 本教程使用 **Amazon Corretto version 21**。
     > 如果你没有安装 JDK，你可以从下拉列表中下载它。
     >
     
   
   * **Java**: 17

   <img src="/img/create-spring-boot-project.png" alt="创建 Spring Boot 项目" width="800" style={{verticalAlign: 'middle'}}/>

4. 确保你已指定所有字段，然后单击 **Next（下一步）**。

5. 选择本教程所需的以下依赖项：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   <img src="/img/set-up-spring-boot-project.png" alt="设置 Spring Boot 项目" width="800" style={{verticalAlign: 'middle'}}/>

6. 单击 **Create（创建）** 以生成和设置项目。

   > IDE 将生成并打开一个新项目。 下载和导入项目依赖项可能需要一些时间。
   >
    

7. 完成后，你可以在 **Project view（项目视图）** 中观察到以下结构：

   <img src="/img/spring-boot-project-view.png" alt="设置 Spring Boot 项目" width="400" style={{verticalAlign: 'middle'}}/>

   生成的 Gradle 项目对应于 Maven 的标准目录布局：
   * `main/kotlin` 文件夹下有属于应用程序的包和类。
   * 应用程序的入口点是 `DemoApplication.kt` 文件的 `main()` 方法。

## 浏览项目 Gradle 构建文件

打开 `build.gradle.kts` 文件：它是 Gradle Kotlin 构建脚本，其中包含应用程序所需的依赖项列表。

Gradle 文件对于 Spring Boot 来说是标准的，但它也包含必要的 Kotlin 依赖项，包括 kotlin-spring Gradle 插件 – `kotlin("plugin.spring")`。

以下是包含所有部分和依赖项说明的完整脚本：

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

正如你所看到的，Gradle 构建文件中添加了一些与 Kotlin 相关的构件：

1. 在 `plugins` 块中，有两个 Kotlin 构件：

   * `kotlin("jvm")` – 该插件定义了项目中要使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 编译器插件，用于向 Kotlin 类添加 `open` 修饰符，以使其与 Spring Framework 功能兼容

2. 在 `dependencies` 块中，列出了一些与 Kotlin 相关的模块：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 该模块增加了对 Kotlin 类和数据类的序列化和反序列化的支持
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射库

3. 在依赖项部分之后，你可以看到 `kotlin` 插件配置块。
   你可以在此处向编译器添加额外的参数，以启用或禁用各种语言功能。

## 浏览生成的 Spring Boot 应用程序

打开 `DemoApplication.kt` 文件：

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
<h3>声明类 – class DemoApplication</h3>
<p>
   在包声明和 import 语句之后，你可以看到第一个类声明 `class DemoApplication`。
</p>
<p>
   在 Kotlin 中，如果一个类不包含任何成员（属性或函数），你可以省略类主体 (`{}`) 以获得更好的效果。
</p>
<h3>@SpringBootApplication 注解</h3>
<p>
   <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">`@SpringBootApplication annotation（@SpringBootApplication 注解）`</a> 是 Spring Boot 应用程序中的一个便捷注解。
      它启用了 Spring Boot 的 <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">auto-configuration（自动配置）</a>，<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">component scan（组件扫描）</a>，并且能够在它们的“应用程序类”上定义额外的配置。
</p>
<h3>程序入口点 – main()</h3>
<p>
   <a href="basic-syntax#program-entry-point">`main()（主函数）`</a> 函数是应用程序的入口点。
</p>
<p>
   它被声明为 `DemoApplication` 类之外的 <a href="functions#function-scope">top-level function（顶层函数）</a>。 `main()` 函数调用 Spring 的 `runApplication(*args)` 函数来启动带有 Spring Framework 的应用程序。
</p>
<h3>可变参数 – args: Array&lt;String&gt;</h3>
<p>
   如果你检查 `runApplication()` 函数的声明，你将看到该函数的参数用 <a href="functions#variable-number-of-arguments-varargs">`vararg modifier（vararg 修饰符）`</a> 标记：`vararg args: String`。
        这意味着你可以将可变数量的 String 参数传递给函数。
</p>
<h3>扩展运算符 – (*args)</h3>
<p>
   `args` 是一个声明为字符串数组的 `main()` 函数的参数。
        由于存在一个字符串数组，并且你想将其内容传递给函数，请使用扩展运算符（在数组前加上星号 `*`）。
</p>
   

## 创建一个控制器

该应用程序已准备好运行，但让我们首先更新其逻辑。

在 Spring 应用程序中，控制器用于处理 Web 请求。
在与 `DemoApplication.kt` 文件相同的包中，创建 `MessageController.kt` 文件，并将
`MessageController` 类定义如下：

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
<h3>@RestController 注解</h3>
<p>
   你需要告诉 Spring `MessageController` 是一个 REST Controller（REST 控制器），因此你应该使用 `@RestController` 注解标记它。
</p>
<p>
   此注解意味着此类将被组件扫描选取，因为它与我们的 `DemoApplication` 类位于同一包中。
</p>
<h3>@GetMapping 注解</h3>
<p>
   `@GetMapping` 标记了 REST 控制器的函数，这些函数实现了对应于 HTTP GET 调用的端点：
</p>
      ```kotlin
@GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
```
<h3>@RequestParam 注解</h3>
<p>
   函数参数 `name` 用 `@RequestParam` 注解标记。 此注解指示方法参数应绑定到 Web 请求参数。
</p>
<p>
   因此，如果你在根目录访问该应用程序并提供一个名为“name”的请求参数，如 `/?name=&lt;your-value&gt;`，则该参数值将用作调用 `index()` 函数的参数。
</p>
<h3>单表达式函数 – index()</h3>
<p>
   由于 `index()` 函数仅包含一个语句，因此你可以将其声明为 <a href="functions#single-expression-functions">single-expression function（单表达式函数）</a>。
</p>
<p>
   这意味着可以省略花括号，并且在等号 `=` 之后指定函数体。
</p>
<h3>函数返回类型的类型推断</h3>
<p>
   `index()` 函数未显式声明返回类型。 相反，编译器通过查看等号 `=` 右侧语句的结果来推断返回类型。
</p>
<p>
   `Hello, $name!` 表达式的类型为 `String`，因此该函数的返回类型也为 `String`。
</p>
<h3>字符串模板 – $name</h3>
<p>
   `Hello, $name!` 表达式在 Kotlin 中称为 <a href="strings#string-templates"><i>String template（字符串模板）</i></a>。
</p>
<p>
   字符串模板是包含嵌入式表达式的字符串字面量。
</p>
<p>
   这是字符串连接操作的便捷替代方法。
</p>
   

## 运行应用程序

Spring 应用程序现在可以运行：

1. 单击 `main()` 方法旁边装订线中的绿色 Run（运行）图标：

    <img src="/img/run-spring-boot-application.png" alt="运行 Spring Boot 应用程序" width="706" style={{verticalAlign: 'middle'}}/>
    
    > 你也可以在终端中运行 `./gradlew bootRun` 命令。
    >
    

    这将在你的计算机上启动本地服务器。

2. 应用程序启动后，打开以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    你应该看到“Hello, John!”作为响应打印出来：

    <img src="/img/spring-application-response.png" alt="Spring Application response" width="706" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教程的下一部分中，你将了解 Kotlin 数据类以及如何在应用程序中使用它们。

**[前往下一章节](jvm-spring-boot-add-data-class)**