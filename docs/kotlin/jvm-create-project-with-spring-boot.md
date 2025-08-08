[//]: # (title: 使用 Kotlin 创建 Spring Boot 项目)

<web-summary>使用 IntelliJ IDEA 和 Kotlin 创建 Spring Boot 应用程序。</web-summary>

<tldr>
    <p>这是 **Spring Boot 和 Kotlin 入门** 教程的第一部分：</p><br/>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> **使用 Kotlin 创建 Spring Boot 项目**<br/><img src="icon-2-todo.svg" width="20" alt="第二步"/> 向 Spring Boot 项目添加数据类<br/><img src="icon-3-todo.svg" width="20" alt="第三步"/> 为 Spring Boot 项目添加数据库支持<br/><img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 访问数据库<br/></p>
</tldr>

本教程的第一部分展示了如何使用 IntelliJ IDEA 中的项目向导，通过 Gradle 创建 Spring Boot 项目。

> 本教程不需要使用 Gradle 作为构建系统。如果您使用 Maven，也可以遵循相同的步骤。
> 
{style="note"}

## 开始之前

下载并安装最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

> 如果您使用 IntelliJ IDEA Community Edition 或其他 IDE，可以使用 [基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 生成 Spring Boot 项目。
> 
{style="tip"}

## 创建 Spring Boot 项目

使用 IntelliJ IDEA Ultimate Edition 中的项目向导，通过 Kotlin 创建一个新的 Spring Boot 项目：

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。 
2. 在左侧面板中，选择 **New Project** | **Spring Boot**。
3. 在 **New Project** 窗口中指定以下字段和选项：
   
   * **名称**: demo
   * **语言**: Kotlin
   * **类型**: Gradle - Kotlin

     > 此选项指定构建系统和 DSL。
     >
     {style="tip"}

   * **包名**: com.example.demo
   * **JDK**: Java JDK
     
     > 本教程使用 **Amazon Corretto version 23**。如果您尚未安装 JDK，可以从下拉列表中下载。
     >
     {style="note"}
   
   * **Java**: 17
   
     > 如果您尚未安装 Java 17，可以从 JDK 下拉列表中下载。
     >
     {style="tip"}

   ![创建 Spring Boot 项目](create-spring-boot-project.png){width=800}

4. 确保已指定所有字段，然后点击 **Next**。

5. 选择本教程所需的以下依赖项：

   * **Web | Spring Web**
   * **SQL | Spring Data JDBC**
   * **SQL | H2 Database**

   ![设置 Spring Boot 项目](set-up-spring-boot-project.png){width=800}

6. 点击 **Create** 以生成并设置项目。

   > IDE 将生成并打开一个新项目。下载和导入项目依赖项可能需要一些时间。
   >
   {style="tip"} 

7. 之后，您可以在 **Project** 视图中观察到以下结构：

   ![设置 Spring Boot 项目](spring-boot-project-view.png){width=400}

   生成的 Gradle 项目对应于 Maven 的标准目录布局：
   * `main/kotlin` 文件夹下包含属于应用程序的包和类。
   * 应用程序的入口点是 `DemoApplication.kt` 文件的 `main()` 方法。

## 探查项目 Gradle 构建文件 {initial-collapse-state="collapsed" collapsible="true"}

打开 `build.gradle.kts` 文件：它是 Gradle Kotlin 构建脚本，其中包含应用程序所需的依赖项列表。

此 Gradle 文件是 Spring Boot 的标准配置，但它也包含必要的 Kotlin 依赖项，包括 kotlin-spring Gradle 插件 – `kotlin("plugin.spring")`。

以下是完整脚本以及所有部分和依赖项的解释：

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

如您所见，Gradle 构建文件中添加了一些与 Kotlin 相关的 artifact：

1. 在 `plugins` 代码块中，有两个 Kotlin artifact：

   * `kotlin("jvm")` – 此插件定义了项目中使用的 Kotlin 版本
   * `kotlin("plugin.spring")` – Kotlin Spring 编译器插件，用于为 Kotlin 类添加 `open` 修饰符，以便使其与 Spring Framework 特性兼容

2. 在 `dependencies` 代码块中，列出了一些与 Kotlin 相关的模块：

   * `com.fasterxml.jackson.module:jackson-module-kotlin` – 此模块增加了对 Kotlin 类和数据类的序列化和反序列化支持
   * `org.jetbrains.kotlin:kotlin-reflect` – Kotlin 反射库

3. 在依赖项部分之后，您可以看到 `kotlin` 插件配置代码块。
   您可以在此处向编译器添加额外的实参，以启用或禁用各种语言特性。

关于 Kotlin 编译器选项的更多信息，请参见 [](gradle-compiler-options.md)。

## 探查生成的 Spring Boot 应用程序

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
      <p>在包声明和导入语句之后，您会看到第一个类声明，<code>class DemoApplication</code>。</p>
      <p>在 Kotlin 中，如果一个类不包含任何成员（属性或函数），您可以省略其类体（<code>{}</code>）。</p>
   </def>
   <def title="@SpringBootApplication 注解">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation"><code>@SpringBootApplication 注解</code></a> 是 Spring Boot 应用程序中的一个便捷注解。
      它启用 Spring Boot 的<a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">自动配置</a>、<a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">组件扫描</a>，并能够在它们的“应用程序类”上定义额外的配置。
      </p>
   </def>
   <def title="程序入口点 – main()">
      <p><code>main()</code> 函数是应用程序的入口点。</p>
      <p>它被声明为 `DemoApplication` 类之外的<a href="functions.md#function-scope">顶层函数</a>。`main()` 函数调用 Spring 的 `runApplication(*args)` 函数，以 Spring Framework 启动应用程序。</p>
   </def>
   <def title="可变实参 – args: Array&lt;String&gt;">
      <p>如果您检测 `runApplication()` 函数的声明，会看到该函数的形参被 <a href="functions.md#variable-number-of-arguments-varargs"><code>vararg</code> 修饰符</a>标记：<code>vararg args: String</code>。
        这意味着您可以向该函数传递可变数量的 String 实参。
      </p>
   </def>
   <def title="展开操作符 – (*args)">
      <p><code>args</code> 是 `main()` 函数的形参，被声明为 String 数组。
        由于它是一个字符串数组，并且您希望将其内容传递给函数，请使用展开操作符（在数组前加上星号 <code>*</code>）。
      </p>
   </deflist>

## 创建控制器

应用程序已准备好运行，但我们先更新其逻辑。

在 Spring 应用程序中，控制器用于处理 Web 请求。
在与 `DemoApplication.kt` 文件相同的包中，创建 `MessageController.kt` 文件，其中包含 `MessageController` 类，如下所示：

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
   <def title="@RestController 注解">
      <p>您需要告诉 Spring <code>MessageController</code> 是一个 REST Controller，因此您应该使用 <code>@RestController</code> 注解对其进行标记。</p>
      <p>此注解意味着该类将被组件扫描识别，因为它与我们的 <code>DemoApplication</code> 类在同一个包中。</p>
   </def>
   <def title="@GetMapping 注解">
      <p><code>@GetMapping</code> 标记了实现与 HTTP GET 调用对应端点的 REST 控制器函数：</p>
      <code-block lang="kotlin">
      @GetMapping("/")
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code-block>
   </def>
   <def title="@RequestParam 注解">
      <p>函数形参 <code>name</code> 被 <code>@RequestParam</code> 注解标记。此注解表明方法形参应绑定到 Web 请求形参。</p>
      <p>因此，如果您在根路径访问应用程序并提供名为“name”的请求形参，例如 <code>/?name=&lt;your-value&gt;</code>，则该形参值将用作调用 <code>index()</code> 函数的实参。</p>
   </def>
   <def title="单表达式函数 – index()">
      <p>由于 <code>index()</code> 函数只包含一个语句，您可以将其声明为<a href="functions.md#single-expression-functions">单表达式函数</a>。</p>
      <p>这意味着可以省略花括号，并在等号 <code>=</code> 之后指定函数体。</p>
   </def>
   <def title="函数返回类型的类型推断">
      <p><code>index()</code> 函数没有显式声明返回类型。相反，编译器通过查看等号 <code>=</code> 右侧语句的结果来推断返回类型。</p>
      <p><code>Hello, $name!</code> 表达式的类型是 <code>String</code>，因此该函数的返回类型也是 <code>String</code>。</p>
   </def>
   <def title="字符串模板 – $name">
      <p><code>Hello, $name!</code> 表达式在 Kotlin 中被称为<a href="strings.md#string-templates"><i>字符串模板</i></a>。</p>
      <p>字符串模板是包含嵌入表达式的字符串字面量。</p>
      <p>这是 String 拼接操作的便捷替代方案。</p>
   </deflist>

## 运行应用程序

Spring 应用程序现已准备好运行：

1. 在 `DemoApplication.kt` 文件中，点击 `main()` 方法旁边的行槽中的绿色 **Run** 图标：

    ![运行 Spring Boot 应用程序](run-spring-boot-application.png){width=706}
    
    > 您也可以在终端中运行 `./gradlew bootRun` 命令。
    >
    {style="tip"}

    这将在您的计算机上启动本地服务器。

2. 应用程序启动后，打开以下 URL：

    ```text
    http://localhost:8080?name=John
    ```

    您应该会看到“Hello, John!”作为响应被打印出来：

    ![Spring 应用程序响应](spring-application-response.png){width=706}

## 下一步

在本教程的下一部分中，您将了解 Kotlin 数据类以及如何在应用程序中使用它们。

**[继续下一章](jvm-spring-boot-add-data-class.md)**