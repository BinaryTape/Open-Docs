[//]: # (title: Gradle 与 Kotlin/JVM 入门)

本教程演示了如何使用 IntelliJ IDEA 和 Gradle 创建一个 JVM 控制台应用程序。

要开始使用，请首先下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 创建一个项目

1. 在 IntelliJ IDEA 中，选择 **文件** | **新建** | **项目**。
2. 在左侧面板中，选择 **Kotlin**。
3. 为新项目命名并更改其位置（如有必要）。

   > 选择 **创建 Git 版本库** 复选框可将新项目置于版本控制之下。你可以在
   > 任何时候执行此操作。
   >
   {style="tip"}

   ![Create a console application](jvm-new-gradle-project.png){width=700}

4. 选择 **Gradle** 构建系统。
5. 从 **JDK** 列表，选择你希望在项目
   中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    * 如果 JDK 已安装在你的计算机上，但未在 IDE 中定义，请选择 **添加 JDK** 并指定 JDK 主目录的路径。
    * 如果你的计算机上没有必要的 JDK，请选择 **下载 JDK**。

6. 为 Gradle 选择 **Kotlin** DSL。
7. 选择 **添加示例代码** 复选框以创建包含示例 “Hello World!” 应用程序的文件。

   > 你还可以启用 **生成带入门提示的代码** 选项，为你的
   > 示例代码添加一些额外的有用注释。
   >
   {style="tip"}

8. 点击 **创建**。

你已成功使用 Gradle 创建了一个项目！

#### 为你的项目指定 Gradle 版本 {initial-collapse-state="collapsed" collapsible="true"}

你可以在**高级设置**部分显式指定项目的 Gradle 版本，
无论是通过 Gradle Wrapper 还是本地安装的 Gradle：

* **Gradle Wrapper:**
   1. 从 **Gradle 发行版** 列表，选择 **Wrapper**。
   2. 禁用 **自动选择** 复选框。
   3. 从 **Gradle 版本** 列表，选择你的 Gradle 版本。
* **本地安装:**
   1. 从 **Gradle 发行版** 列表，选择 **本地安装**。
   2. 对于 **Gradle 位置**，指定你的本地 Gradle 版本的路径。

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## 探索构建脚本

打开 `build.gradle.kts` 文件。这是 Gradle Kotlin 构建脚本，其中包含 Kotlin 相关的构件和应用程序所需的其他部分：

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // Kotlin version to use
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

* 1️⃣ 关于 [依赖项来源]，请参阅更多信息。
* 2️⃣ [Maven Central 版本库](https://central.sonatype.com/)。它也可以是 [Google 的 Maven 版本库](https://maven.google.com/) 或你公司的私有版本库。
* 3️⃣ 关于 [声明依赖项]，请参阅更多信息。
* 4️⃣ 关于 [任务]，请参阅更多信息。
* 5️⃣ [用于测试的 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

如你所见，Gradle 构建文件中添加了一些 Kotlin 特有的构件：

1. 在 `plugins {}` 代码块中，有 `kotlin("jvm")` 构件。此插件定义了项目中要使用的 Kotlin 版本。

2. 在 `dependencies {}` 代码块中，有 `testImplementation(kotlin("test"))`。
   关于 [设置测试库依赖项]，请参阅更多信息。

## 运行应用程序

1. 通过选择 **视图 | 工具窗口 | Gradle** 打开 Gradle 窗口：

   ![Main.kt with main fun](jvm-gradle-view-build.png){width=700}

2. 在 `Tasks\build\` 中执行 **build** Gradle 任务。在**构建**窗口中，会显示 `BUILD SUCCESSFUL`。
   这表示 Gradle 成功构建了应用程序。

3. 在 `src/main/kotlin` 中，打开 `Main.kt` 文件：
   * `src` 目录包含 Kotlin 源代码文件和资源。
   * `Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4. 通过点击侧边栏中的绿色**运行**图标并选择**运行 'MainKt'** 来运行应用程序。

   ![Running a console app](jvm-run-app-gradle.png){width=350}

你可以在**运行**工具窗口中看到结果：

![Kotlin run output](jvm-output-gradle.png){width=600}

恭喜！你刚刚运行了你的第一个 Kotlin 应用程序。

## 接下来？

关于以下内容，请参阅更多信息：
* [Gradle 构建文件属性](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
* [面向不同平台和设置库依赖项](gradle-configure-project.md)。
* [编译器选项及如何传递它们](gradle-compiler-options.md)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。