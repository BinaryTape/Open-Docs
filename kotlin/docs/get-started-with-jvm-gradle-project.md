---
title: "Gradle 和 Kotlin/JVM 入门"
---
本教程演示了如何使用 IntelliJ IDEA 和 Gradle 创建 JVM 控制台应用程序。

首先，下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2. 在左侧面板中，选择 **Kotlin**。
3. 为新项目命名，并在必要时更改其位置。

   > 选中 **Create Git repository（创建 Git 仓库）** 复选框，将新项目置于版本控制之下。 你可以稍后随时执行此操作。
   >
   

   <img src="/img/jvm-new-gradle-project.png" alt="Create a console application" width="700" style={{verticalAlign: 'middle'}}/>

4. 选择 **Gradle** 构建系统。
5. 从 **JDK list（JDK 列表）** 中，选择要在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    * 如果 JDK 已安装在您的计算机上，但未在 IDE 中定义，请选择 **Add JDK（添加 JDK）** 并指定 JDK 主目录的路径。
    * 如果您的计算机上没有必要的 JDK，请选择 **Download JDK（下载 JDK）**。

6. 选择 Gradle 的 **Kotlin** DSL。
7. 选中 **Add sample code（添加示例代码）** 复选框以创建一个包含示例 `"Hello World!"` 应用程序的文件。

   > 你还可以启用 **Generate code with onboarding tips（生成带有入门提示的代码）** 选项，以便向你的示例代码添加一些额外的有用注释。
   >
   

8. 点击 **Create（创建）**。

你已成功创建了一个使用 Gradle 的项目！

#### 为你的项目指定 Gradle 版本

你可以通过使用 Gradle Wrapper 或本地安装的 Gradle 在 **Advanced Settings（高级设置）** 部分下显式指定项目的 Gradle 版本：

* **Gradle Wrapper:**
   1. 从 **Gradle distribution（Gradle 发行版）** 列表中，选择 **Wrapper**。
   2. 禁用 **Auto-select（自动选择）** 复选框。
   3. 从 **Gradle version（Gradle 版本）** 列表中，选择你的 Gradle 版本。
* **Local installation（本地安装）:**
   1. 从 **Gradle distribution（Gradle 发行版）** 列表中，选择 **Local installation（本地安装）**。
   2. 对于 **Gradle location（Gradle 位置）**，指定本地 Gradle 版本的路径。

   <img src="/img/jvm-new-gradle-project-advanced.png" alt="Advanced settings" width="700" style={{verticalAlign: 'middle'}}/>

## 探索构建脚本

打开 `build.gradle.kts` 文件。 这是 Gradle Kotlin 构建脚本，其中包含 Kotlin 相关的工件和应用程序所需的其他部分：

```kotlin
plugins {
    kotlin("jvm") version "2.1.20" // Kotlin version to use
}

group = "org.example" // A company name, for example, `org.jetbrains`
version = "1.0-SNAPSHOT" // Version to assign to the built artifact

repositories { // Sources of dependencies. See 1️⃣
    mavenCentral() // Maven Central Repository. See 2️⃣
}

dependencies { // All the libraries you want to use. See 3️⃣
    // Copy dependencies' names after you find them in a repository
    testImplementation(kotlin("test")) // The Kotlin test library
}

tasks.test { // See 4️⃣
    useJUnitPlatform() // JUnitPlatform for tests. See 5️⃣
}
```

* 1️⃣ 详细了解 [sources of dependencies（依赖项的来源）](https://docs.gradle.org/current/userguide/declaring_repositories.html)。
* 2️⃣ [Maven Central Repository（Maven 中央仓库）](https://central.sonatype.com/)。 它也可以是 [Google's Maven repository（Google 的 Maven 仓库）](https://maven.google.com/) 或你公司的私有仓库。
* 3️⃣ 详细了解 [declaring dependencies（声明依赖项）](https://docs.gradle.org/current/userguide/declaring_dependencies.html)。
* 4️⃣ 详细了解 [tasks（任务）](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)。
* 5️⃣ [JUnitPlatform for tests（用于测试的 JUnitPlatform）](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

正如你所看到的，Gradle 构建文件中添加了一些 Kotlin 特定的工件：

1. 在 `plugins {}` 块中，有 `kotlin("jvm")` 工件。 此插件定义了要在项目中使用的 Kotlin 版本。

2. 在 `dependencies {}` 块中，有 `testImplementation(kotlin("test"))`。
   详细了解 [setting dependencies on test libraries（设置测试库的依赖项）](gradle-configure-project#set-dependencies-on-test-libraries)。

## 运行应用程序

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 Gradle 窗口：

   <img src="/img/jvm-gradle-view-build.png" alt="Main.kt with main fun" width="700" style={{verticalAlign: 'middle'}}/>

2. 在 `Tasks\build\` 中执行 **build** Gradle 任务。 在 **Build（构建）** 窗口中，将显示 `BUILD SUCCESSFUL`。
   这意味着 Gradle 已成功构建应用程序。

3. 在 `src/main/kotlin` 中，打开 `Main.kt` 文件：
   * `src` 目录包含 Kotlin 源代码文件和资源。
   * `Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4. 通过点击边栏中的绿色 **Run（运行）** 图标来运行应用程序，然后选择 **Run 'MainKt'**。

   <img src="/img/jvm-run-app-gradle.png" alt="Running a console app" width="350" style={{verticalAlign: 'middle'}}/>

你可以在 **Run（运行）** 工具窗口中看到结果：

<img src="/img/jvm-output-gradle.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>

恭喜！ 你刚刚运行了你的第一个 Kotlin 应用程序。

## 接下来做什么？

了解更多关于：
* [Gradle build file properties（Gradle 构建文件属性）](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
* [Targeting different platforms and setting library dependencies（面向不同的平台和设置库依赖项）](gradle-configure-project)。
* [Compiler options and how to pass them（编译器选项以及如何传递它们）](gradle-compiler-options)。
* [Incremental compilation, caches support, build reports, and the Kotlin daemon（增量编译、缓存支持、构建报告和 Kotlin 守护程序）](gradle-compilation-and-caches)。