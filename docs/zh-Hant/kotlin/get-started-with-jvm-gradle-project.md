[//]: # (title: 開始使用 Gradle 和 Kotlin/JVM)

本教學示範如何使用 IntelliJ IDEA 和 Gradle 建立一個 JVM 主控台應用程式。

首先，若要開始，請下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
2. 在左側面板中，選擇 **Kotlin**。
3. 為新專案命名，並在必要時變更其位置。

   > 勾選 **Create Git repository** 核取方塊，將新專案置於版本控制之下。您將能夠
   > 隨時進行此操作。
   >
   {style="tip"}

   ![建立主控台應用程式](jvm-new-gradle-project.png){width=700}

4. 選擇 **Gradle** 建置系統。
5. 從 **JDK** 清單中，選擇您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    * 如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **Add JDK** 並指定 JDK 家目錄的路徑。
    * 如果您的電腦上沒有必要的 JDK，請選擇 **Download JDK**。

6. 為 Gradle 選擇 **Kotlin** DSL。
7. 勾選 **Add sample code** 核取方塊，以建立一個包含 `"Hello World!"` 範例應用程式的檔案。

   > 您也可以啟用 **Generate code with onboarding tips** 選項，為您的
   > 範例程式碼添加一些額外有用的註解。
   >
   {style="tip"}

8. 點擊 **Create**。

您已成功使用 Gradle 建立專案！

#### 為您的專案指定 Gradle 版本 {initial-collapse-state="collapsed" collapsible="true"}

您可以在 **Advanced Settings** (進階設定) 部分明確指定專案的 Gradle 版本，
可透過使用 Gradle Wrapper 或 Gradle 的本地安裝來指定：

* **Gradle Wrapper：**
   1. 從 **Gradle distribution** 清單中，選擇 **Wrapper**。
   2. 停用 **Auto-select** 核取方塊。
   3. 從 **Gradle version** 清單中，選擇您的 Gradle 版本。
* **本地安裝：**
   1. 從 **Gradle distribution** 清單中，選擇 **Local installation**。
   2. 對於 **Gradle location**，指定您本地 Gradle 版本的路徑。

   ![進階設定](jvm-new-gradle-project-advanced.png){width=700}

## 探索建置腳本

開啟 `build.gradle.kts` 檔案。這是 Gradle Kotlin 建置腳本，其中包含 Kotlin 相關的 artifacts (構件) 以及應用程式所需的其他部分：

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 要使用的 Kotlin 版本
}

group = "org.example" // 例如，公司名稱 `org.jetbrains`
version = "1.0-SNAPSHOT" // 要指派給建置構件的版本

repositories { // 依賴項的來源。請參閱 1️⃣
    mavenCentral() // Maven 中央儲存庫。請參閱 2️⃣
}

dependencies { // 您想使用的所有程式庫。請參閱 3️⃣
    // 在儲存庫中找到依賴項名稱後複製它們
    testImplementation(kotlin("test")) // Kotlin 測試程式庫
}

tasks.test { // 請參閱 4️⃣
    useJUnitPlatform() // 用於測試的 JUnitPlatform。請參閱 5️⃣
}
```

* 1️⃣ 深入了解 [依賴項來源](https://docs.gradle.org/current/userguide/declaring_repositories.html)。
* 2️⃣ [Maven 中央儲存庫](https://central.sonatype.com/)。它也可以是 [Google 的 Maven 儲存庫](https://maven.google.com/) 或您公司的私有儲存庫。
* 3️⃣ 深入了解 [宣告依賴項](https://docs.gradle.org/current/userguide/declaring_dependencies.html)。
* 4️⃣ 深入了解 [任務](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)。
* 5️⃣ [用於測試的 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

如您所見，Gradle 建置檔案中添加了一些 Kotlin 特有的 artifacts (構件)：

1. 在 `plugins {}` 區塊中，有 `kotlin("jvm")` artifact (構件)。這個外掛程式定義了要在專案中使用的 Kotlin 版本。

2. 在 `dependencies {}` 區塊中，有 `testImplementation(kotlin("test"))`。
   深入了解 [設定測試程式庫上的依賴項](gradle-configure-project.md#set-dependencies-on-test-libraries)。

## 執行應用程式

1. 透過選擇 **View** | **Tool Windows** | **Gradle** 開啟 Gradle 視窗：

   ![Main.kt 與 main 函式](jvm-gradle-view-build.png){width=700}

2. 在 `Tasks\build\` 中執行 **build** Gradle 任務。在 **Build** 視窗中，顯示 `BUILD SUCCESSFUL`。
   這表示 Gradle 已成功建置應用程式。

3. 在 `src/main/kotlin` 中，開啟 `Main.kt` 檔案：
   * `src` 目錄包含 Kotlin 原始碼檔案和資源。
   * `Main.kt` 檔案包含將印出 `Hello World!` 的範例程式碼。

4. 透過點擊行號區中的綠色 **Run** 圖示並選擇 **Run 'MainKt'** 來執行應用程式。

   ![執行主控台應用程式](jvm-run-app-gradle.png){width=350}

您可以在 **Run** 工具視窗中看到結果：

![Kotlin 執行輸出](jvm-output-gradle.png){width=600}

恭喜！您剛剛執行了您的第一個 Kotlin 應用程式。

## 接下來？

深入了解：
* [Gradle 建置檔案屬性](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
* [針對不同平台和設定程式庫依賴項](gradle-configure-project.md)。
* [編譯器選項以及如何傳遞它們](gradle-compiler-options.md)。
* [增量編譯、快取支援、建置報告和 Kotlin 守護程式](gradle-compilation-and-caches.md)。