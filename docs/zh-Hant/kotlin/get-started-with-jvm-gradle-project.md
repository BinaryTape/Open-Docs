[//]: # (title: 開始使用 Gradle 與 Kotlin/JVM)

本教學示範如何使用 IntelliJ IDEA 與 Gradle 建立一個 JVM 主控台應用程式。

若要開始，請先下載並安裝最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1.  在 IntelliJ IDEA 中，選取「**檔案 (File)**」 | 「**新增 (New)**」 | 「**專案 (Project)**」。
2.  在左側面板中，選取 **Kotlin**。
3.  為新專案命名，並在必要時更改其位置。

    > 勾選「**建立 Git 儲存庫 (Create Git repository)**」核取方塊，將新專案置於版本控制之下。您可以在任何時候稍後再進行此操作。
    >
    {style="tip"}

    ![建立主控台應用程式](jvm-new-gradle-project.png){width=700}

4.  選取 **Gradle** 建置系統。
5.  從 **JDK** 列表中，選取您專案中要使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    *   如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選取「**新增 JDK (Add JDK)**」並指定 JDK 主目錄的路徑。
    *   如果您電腦上沒有必要的 JDK，請選取「**下載 JDK (Download JDK)**」。

6.  選取 Gradle 的 **Kotlin** DSL。
7.  勾選「**新增範例程式碼 (Add sample code)**」核取方塊，建立一個包含範例「`Hello World!`」應用程式的檔案。

    > 您也可以啟用「**產生包含入門提示的程式碼 (Generate code with onboarding tips)**」選項，為您的範例程式碼新增一些額外有用的註解。
    >
    {style="tip"}

8.  點擊「**建立 (Create)**」。

您已成功使用 Gradle 建立專案！

#### 為您的專案指定 Gradle 版本 {initial-collapse-state="collapsed" collapsible="true"}

您可以在「**進階設定 (Advanced Settings)**」區段下明確指定專案的 Gradle 版本，可以透過使用 Gradle Wrapper 或 Gradle 的本機安裝來指定：

*   **Gradle Wrapper：**
    1.  從「**Gradle 發佈 (Gradle distribution)**」列表中，選取「**Wrapper**」。
    2.  取消勾選「**自動選取 (Auto-select)**」核取方塊。
    3.  從「**Gradle 版本 (Gradle version)**」列表中，選取您的 Gradle 版本。
*   **本機安裝：**
    1.  從「**Gradle 發佈 (Gradle distribution)**」列表中，選取「**本機安裝 (Local installation)**」。
    2.  對於「**Gradle 位置 (Gradle location)**」，請指定本機 Gradle 版本的路徑。

    ![進階設定](jvm-new-gradle-project-advanced.png){width=700}

## 探索建置腳本

開啟 `build.gradle.kts` 檔案。這是 Gradle Kotlin 建置腳本，其中包含與 Kotlin 相關的構件 (artifacts) 和應用程式所需的其他部分：

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 要使用的 Kotlin 版本
}

group = "org.example" // 公司名稱，例如 `org.jetbrains`
version = "1.0-SNAPSHOT" // 指派給建置構件的版本

repositories { // 依賴項的來源。見 1️⃣
    mavenCentral() // Maven Central Repository。見 2️⃣
}

dependencies { // 您想使用的所有函式庫。見 3️⃣
    // 在儲存庫中找到依賴項名稱後複製
    testImplementation(kotlin("test")) // Kotlin 測試函式庫
}

tasks.test { // 見 4️⃣
    useJUnitPlatform() // 用於測試的 JUnitPlatform。見 5️⃣
}
```

*   1️⃣ 深入了解[依賴項的來源](https://docs.gradle.org/current/userguide/declaring_repositories.html)。
*   2️⃣ [Maven Central Repository](https://central.sonatype.com/)。它也可以是 [Google 的 Maven 儲存庫](https://maven.google.com/)或您公司的私有儲存庫。
*   3️⃣ 深入了解[宣告依賴項](https://docs.gradle.org/current/userguide/declaring_dependencies.html)。
*   4️⃣ 深入了解[任務](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)。
*   5️⃣ [用於測試的 JUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

如您所見，Gradle 建置檔案中新增了一些 Kotlin 特定的構件：

1.  在 `plugins {}` 區塊中，有 `kotlin("jvm")` 構件。此外掛程式 (plugin) 定義了專案中要使用的 Kotlin 版本。

2.  在 `dependencies {}` 區塊中，有 `testImplementation(kotlin("test"))`。深入了解[設定測試函式庫的依賴項](gradle-configure-project.md#set-dependencies-on-test-libraries)。

## 執行應用程式

1.  透過選取「**檢視 (View)**」 | 「**工具視窗 (Tool Windows)**」 | 「**Gradle**」來開啟 Gradle 視窗：

    ![包含 main 函式的 Main.kt](jvm-gradle-view-build.png){width=700}

2.  在 `Tasks\build\` 中執行 **build** Gradle 任務。在「**建置 (Build)**」視窗中，會出現 `BUILD SUCCESSFUL`。這表示 Gradle 成功建置了應用程式。

3.  在 `src/main/kotlin` 中，開啟 `Main.kt` 檔案：
    *   `src` 目錄包含 Kotlin 原始碼檔案和資源。
    *   `Main.kt` 檔案包含將印出 `Hello World!` 的範例程式碼。

4.  點擊邊欄 (gutter) 中的綠色「**執行 (Run)**」圖示並選取「**執行 'MainKt' (Run 'MainKt')**」來執行應用程式。

    ![執行主控台應用程式](jvm-run-app-gradle.png){width=350}

您可以在「**執行 (Run)**」工具視窗中看到結果：

![Kotlin 執行輸出](jvm-output-gradle.png){width=600}

恭喜！您剛剛執行了第一個 Kotlin 應用程式。

## 接下來呢？

深入了解：
*   [Gradle 建置檔案屬性](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
*   [針對不同平台和設定函式庫依賴項](gradle-configure-project.md)。
*   [編譯器選項以及如何傳遞它們](gradle-compiler-options.md)。
*   [增量編譯、快取支援、建置報告和 Kotlin 守護程式 (daemon)](gradle-compilation-and-caches.md)。