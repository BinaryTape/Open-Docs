[//]: # (title: 使用 Kotlin 创建 Spring Boot 项目)
[//]: # (description: 使用 IntelliJ IDEA 和 Kotlin 创建 Spring Boot 应用程序。)

<tldr>
    <p>这是 **Spring Boot 和 Kotlin 入门** 教程的第一部分：</p><br/>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>使用 Kotlin 创建 Spring Boot 项目</strong><br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> 向 Spring Boot 项目添加数据类<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 为 Spring Boot 项目添加数据库支持<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问<br/></p>
</tldr>

本教程的第一部分展示了如何使用 IntelliJ IDEA 中的项目向导，通过 Gradle 创建一个 Spring Boot 项目。

> 本教程不强制要求使用 Gradle 作为构建系统。如果使用 Maven，你可以遵循相同的步骤。
> 
{style="note"}

## 开始之前

下载并安装最新版 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

> 如果你使用 IntelliJ IDEA Community Edition 或其他 IDE，可以使用 [基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 生成 Spring Boot 项目。
> 
{style="tip"}

## 创建 Spring Boot 项目

使用 IntelliJ IDEA Ultimate Edition 中的项目向导，创建一个新的 Kotlin Spring Boot 项目：

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2. 在左侧面板中，选择 **New Project** | **Spring Boot**。
3. 在 **New Project** 窗口中指定以下字段和选项：
   
   * **Name**: demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 此选项指定构建系统和 DSL。
     >
     {style="tip"}

   * **Package name**: com.example.demo
   * **JDK**: Java JDK
     
     > 本教程使用 **Amazon Corretto version 23**。
     > 如果你尚未安装 JDK，可以从下拉列表中下载。
     >
     {style="note"}
   
   * **Java**: 17

   ![Create Spring Boot project](create-spring-boot-project.png){width=800}

4. 确保已指定所有字段，然后点击 **Next**。

5. 选择教程所需的以下依赖项：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   ![Set up Spring Boot project](set-up-spring-boot-project.png){width=800}

6. 点击 **Create** 以生成并设置项目。

   > IDE 将生成并打开一个新项目。下载和导入项目依赖项可能需要一些时间。
   >
   {style="tip"} 

7. 之后，你可以在 **Project 视图** 中观察到以下结构：

   ![Set up Spring Boot project](spring-boot-project-view.png){width=400}

   生成的 Gradle 项目与 Maven 的标准目录布局相对应：
   * `main/kotlin` 文件夹下有属于应用程序的包和类。
   * 应用程序的入口点是 `DemoApplication.kt` 文件的 `main()` 方法。

## 探索项目 Gradle 构建文件 {initial-collapse-state="collapsed" collapsible="true"}

打开 `build.gradle.kts` 文件：它是 Gradle Kotlin 构建脚本，其中包含了应用程序所需的依赖项列表。

这个 Gradle 文件是 Spring Boot 的标准文件，但它也包含了必要的 Kotlin 依赖项，包括 `kotlin("plugin.spring")` 这个 Kotlin Spring Gradle 插件。

以下是包含所有部分和依赖项解释的完整脚本：

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

正如你所见，Gradle 构建文件中添加了一些与 Kotlin 相关的 Artifact：

1. 在 `plugins` 代码块中，有两个 Kotlin Artifact：

   * `kotlin("jvm")` – 这个插件定义了项目中要使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 编译器插件，用于为 Kotlin 类添加 `open` 修饰符，使其与 Spring Framework 的功能兼容

2. 在 `dependencies` 代码块中，列出了一些与 Kotlin 相关的模块：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 这个模块为 Kotlin 类和数据类的序列化和反序列化添加了支持
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射库

3. 在 `dependencies` 部分之后，你可以看到 `kotlin` 插件配置代码块。你可以在这里向编译器添加额外参数，以启用或禁用各种语言特性。

在 [](gradle-compiler-options.md) 中了解更多关于 Kotlin 编译器选项的信息。

## 探索生成的 Spring Boot 应用程序

打开 `DemoApplication.kt` 文件：

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
   <def title="声明类 – class DemoApplication">
      <p>在包声明和导入语句之后，你可以看到第一个类声明，即 <code>class DemoApplication</code>。</p>
      <p>在 Kotlin 中，如果一个类不包含任何成员（属性或函数），你可以省略其类体（<code>{}</code>）。</p>
   </def>
   <def title="`@SpringBootApplication` 注解">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplication</code> 注解</a>是 Spring Boot 应用程序中的一个便利注解。
      它启用了 Spring Boot 的<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自动配置</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">组件扫描</a>，并且能够在其“应用程序类”上定义额外的配置。
      </p>
   </def>
   <def title="程序入口点 – main()">
      <p>[`main()`](basic-syntax.md#program-entry-point) 函数是应用程序的入口点。</p>
      <p>它被声明为 `DemoApplication` 类之外的<a href="functions.md#function-scope">顶层函数</a>。`main()` 函数调用 Spring 的 `runApplication(*args)` 函数以使用 Spring Framework 启动应用程序。</p>
   </def>
   <def title="可变参数 – args: Array&lt;String&gt;">
      <p>如果你查看 `runApplication()` 函数的声明，你会看到该函数的参数被标记为 [`vararg` 修饰符](functions.md#variable-number-of-arguments-varargs)：<code>vararg args: String</code>。
        这意味着你可以向函数传递可变数量的 String 参数。
      </p>
   </def>
   <def title="展开运算符 – (*args)">
      <p><code>args</code> 是 `main()` 函数的一个参数，声明为一个 String 数组。
        由于它是一个字符串数组，并且你希望将其内容传递给函数，因此请使用展开运算符（在数组前加上星号 <code>*</code>）。
      </p>
   </def>
</deflist>

## 创建控制器

应用程序已准备好运行，但我们先更新其逻辑。

在 Spring 应用程序中，控制器用于处理 Web 请求。
在与 `DemoApplication.kt` 文件相同的包中，创建 `MessageController.kt` 文件，其 `MessageController` 类如下所示：

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
   <def title="`@RestController` 注解">
      <p>你需要告诉 Spring <code>MessageController</code> 是一个 REST 控制器，因此你应该使用 <code>@RestController</code> 注解对其进行标记。</p>
      <p>此注解意味着该类将被组件扫描识别，因为它与我们的 <code>DemoApplication</code> 类位于同一包中。</p>
   </def>
   <def title="`@GetMapping` 注解">
      <p><code>@GetMapping</code> 标记了实现与 HTTP GET 调用对应的端点的 REST 控制器函数：</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="`@RequestParam` 注解">
      <p>函数参数 <code>name</code> 被 <code>@RequestParam</code> 注解标记。此注解表示方法参数应绑定到 Web 请求参数。</p>
      <p>因此，如果你在根路径访问应用程序并提供名为“name”的请求参数，例如 <code>/?name=&lt;your-value&gt;</code>，则参数值将用作调用 <code>index()</code> 函数的参数。</p>
   </def>
   <def title="单表达式函数 – index()">
      <p>由于 <code>index()</code> 函数只包含一个语句，因此你可以将其声明为<a href="functions.md#single-expression-functions">单表达式函数</a>。</p>
      <p>这意味着可以省略花括号，并在等号 <code>=</code> 之后指定函数体。</p>
   </def>
   <def title="函数返回类型的类型推断">
      <p><code>index()</code> 函数没有显式声明返回类型。相反，编译器通过查看等号 <code>=</code> 右侧语句的结果来推断返回类型。</p>
      <p>表达式 <code>Hello, $name!</code> 的类型是 <code>String</code>，因此函数的返回类型也是 <code>String</code>。</p>
   </def>
   <def title="字符串模板 – $name">
      <p>表达式 <code>Hello, $name!</code> 在 Kotlin 中称为<a href="strings.md#string-templates"><i>字符串模板</i></a>。</p>
      <p>字符串模板是包含嵌入表达式的字符串字面量。</p>
      <p>这是 String 连接操作的一个便捷替代方案。</p>
   </def>
</deflist>

## 运行应用程序

Spring 应用程序现在已准备好运行：

1. 在 `DemoApplication.kt` 文件中，点击 `main()` 方法旁边的行号槽中的绿色 **Run** 图标：

    ![Run Spring Boot application](run-spring-boot-application.png){width=706}
    
    > 你也可以在终端中运行 `./gradlew bootRun` 命令。
    >
    {style="tip"}

    这将在你的计算机上启动本地服务器。

2. 应用程序启动后，打开以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    你应该看到“Hello, John!”作为响应被打印出来：

    ![Spring Application response](spring-application-response.png){width=706}

## 下一步

在本教程的下一部分中，你将学习 Kotlin 数据类以及如何在应用程序中使用它们。

**[继续下一章](jvm-spring-boot-add-data-class.md)**