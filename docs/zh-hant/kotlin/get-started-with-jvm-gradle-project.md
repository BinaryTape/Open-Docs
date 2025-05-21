---
title: "開始使用 Gradle 和 Kotlin/JVM"
---
本教學示範如何使用 IntelliJ IDEA 和 Gradle 建立 JVM 主控台應用程式。

首先，下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File**（檔案）| **New**（新增）| **Project**（專案）。
2. 在左側面板中，選擇 **Kotlin**。
3. 為新專案命名，並在必要時變更其位置。

   > 勾選 **Create Git repository**（建立 Git 儲存庫）核取方塊，將新專案置於版本控制之下。 您稍後也可以隨時執行此操作。
   >
   

   <img src="/img/jvm-new-gradle-project.png" alt="Create a console application" width="700" style={{verticalAlign: 'middle'}}/>

4. 選擇 **Gradle** 建置系統。
5. 從 **JDK list**（JDK 清單）中，選擇您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    * 如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **Add JDK**（新增 JDK）並指定 JDK 主目錄的路徑。
    * 如果您的電腦上沒有必要的 JDK，請選擇 **Download JDK**（下載 JDK）。

6. 選擇用於 Gradle 的 **Kotlin** DSL。
7. 勾選 **Add sample code**（新增範例程式碼）核取方塊，以建立包含範例 `"Hello World!"` 應用程式的檔案。

   > 您也可以啟用 **Generate code with onboarding tips**（產生帶有入門提示的程式碼）選項，以將一些額外的實用註解新增到您的範例程式碼中。
   >
   

8. 按一下 **Create**（建立）。

您已成功使用 Gradle 建立專案！

#### 為您的專案指定 Gradle 版本

您可以在 **Advanced Settings**（進階設定）區段下，透過使用 Gradle Wrapper 或 Gradle 的本機安裝，來明確指定專案的 Gradle 版本：

* **Gradle Wrapper：**
   1. 從 **Gradle distribution**（Gradle 發佈版本）清單中，選擇 **Wrapper**。
   2. 停用 **Auto-select**（自動選取）核取方塊。
   3. 從 **Gradle version**（Gradle 版本）清單中，選擇您的 Gradle 版本。
* **Local installation（本機安裝）：**
   1. 從 **Gradle distribution**（Gradle 發佈版本）清單中，選擇 **Local installation**（本機安裝）。
   2. 對於 **Gradle location**（Gradle 位置），請指定您的本機 Gradle 版本的路徑。

   <img src="/img/jvm-new-gradle-project-advanced.png" alt="Advanced settings" width="700" style={{verticalAlign: 'middle'}}/>

## 探索建置指令碼

開啟 `build.gradle.kts` 檔案。 這是 Gradle Kotlin 建置指令碼，其中包含 Kotlin 相關的 Artifacts（構件）和應用程式所需的其他部分：

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

* 1️⃣ 深入瞭解 [sources of dependencies](https://docs.gradle.org/current/userguide/declaring_repositories.html)（相依性的來源）。
* 2️⃣ [Maven Central Repository](https://central.sonatype.com/)。 它也可以是 [Google's Maven repository](https://maven.google.com/) 或您公司的私有儲存庫。
* 3️⃣ 深入瞭解 [declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html)（宣告相依性）。
* 4️⃣ 深入瞭解 [tasks](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)（任務）。
* 5️⃣ [JUnitPlatform for tests](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

如您所見，有一些 Kotlin 專用的 Artifacts（構件）已新增到 Gradle 建置檔案：

1. 在 `plugins {}` 區塊中，有 `kotlin("jvm")` Artifact（構件）。 此外掛程式定義要在專案中使用的 Kotlin 版本。

2. 在 `dependencies {}` 區塊中，有 `testImplementation(kotlin("test"))`。
   深入瞭解 [setting dependencies on test libraries](gradle-configure-project#set-dependencies-on-test-libraries)（設定測試函式庫的相依性）。

## 執行應用程式

1. 透過選擇 **View**（檢視）| **Tool Windows**（工具視窗）| **Gradle** 開啟 Gradle 視窗：

   <img src="/img/jvm-gradle-view-build.png" alt="Main.kt with main fun" width="700" style={{verticalAlign: 'middle'}}/>

2. 在 `Tasks\build\` 中執行 **build** Gradle 任務。 在 **Build**（建置）視窗中，會顯示 `BUILD SUCCESSFUL`。
   這表示 Gradle 已成功建置應用程式。

3. 在 `src/main/kotlin` 中，開啟 `Main.kt` 檔案：
   * `src` 目錄包含 Kotlin 原始程式碼檔案和資源。
   * `Main.kt` 檔案包含將列印 `Hello World!` 的範例程式碼。

4. 透過按一下裝訂邊中的綠色 **Run**（執行）圖示來執行應用程式，然後選擇 **Run 'MainKt'**。

   <img src="/img/jvm-run-app-gradle.png" alt="Running a console app" width="350" style={{verticalAlign: 'middle'}}/>

您可以在 **Run**（執行）工具視窗中看到結果：

<img src="/img/jvm-output-gradle.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>

恭喜！ 您剛剛執行了您的第一個 Kotlin 應用程式。

## 接下來呢？

深入瞭解：
* [Gradle build file properties](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)（Gradle 建置檔案屬性）。
* [Targeting different platforms and setting library dependencies](gradle-configure-project)（以不同平台為目標並設定函式庫相依性）。
* [Compiler options and how to pass them](gradle-compiler-options)（編譯器選項以及如何傳遞它們）。
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches)（增量編譯、快取支援、建置報告和 Kotlin 常駐程式）。