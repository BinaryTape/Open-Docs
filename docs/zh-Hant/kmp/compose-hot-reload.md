[//]: # (title: Compose Hot Reload)

<primary-label ref="alpha"/>

[Compose Hot Reload](https://github.com/JetBrains/compose-hot-reload) 可協助您在處理 Compose Multiplatform 專案時，視覺化並試驗 UI 變更。

目前，Compose Hot Reload 僅在您的多平台專案包含桌面目標時可用。我們正在探索未來增加對其他目標的支援。在此期間，使用桌面應用程式作為您的沙箱，可讓您快速試驗共用程式碼中的 UI 變更，而不會中斷您的工作流程。

![Compose Hot Reload](compose-hot-reload.gif){width=500}

## 將 Compose Hot Reload 新增至您的專案

Compose Hot Reload 可透過兩種方式新增：

*   [在 IntelliJ IDEA 或 Android Studio 中從零開始建立專案](#from-scratch)
*   [將其作為 Gradle 外掛程式新增至現有專案](#to-an-existing-project)

### 從零開始

本節將引導您完成在 IntelliJ IDEA 和 Android Studio 中建立包含桌面目標的多平台專案的步驟。專案建立後，Compose Hot Reload 會自動新增。

1.  在 [快速入門](quickstart.md) 中，完成[設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的指示。
2.  在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
3.  在左側面板中，選取 **Kotlin Multiplatform**。
4.  在 **New Project** 視窗中指定 **Name**、**Group** 和 **Artifact** 欄位。
5.  選取 **Desktop** 目標，然後按一下 **Create**。
    ![Create multiplatform project with desktop target](create-desktop-project.png){width=700}

### 新增至現有專案

本節將引導您完成將 Compose Hot Reload 新增至現有多平台專案的步驟。這些步驟以 [建立具有共享邏輯和 UI 的應用程式](compose-multiplatform-create-first-app.md) 教學課程中的專案作為參考。

> 要尋找 Compose Hot Reload 的最新版本，請參閱 [Releases](https://github.com/JetBrains/compose-hot-reload/releases)。
> 
{style="tip"}

1.  在您的專案中，更新版本目錄。在 `gradle/libs.versions.toml` 中，新增以下程式碼：
    ```kotlin
    composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
    ```

    > 要了解如何使用版本目錄來集中管理專案中的依賴項，請參閱我們的 [Gradle 最佳實踐](https://kotlinlang.org/gradle-best-practices.html)。

2.  在您的父專案的 `build.gradle.kts` ( `ComposeDemo/build.gradle.kts`) 中，將以下程式碼新增至您的 `plugins {}` 區塊：
    ```kotlin
    plugins {
        alias(libs.plugins.composeHotReload) apply false
    }
    ```
    這會防止 Compose Hot Reload 外掛程式在每個子專案中多次載入。

3.  在包含您的多平台應用程式的子專案的 `build.gradle.kts` ( `ComposeDemo/composeApp/build.gradle.kts`) 中，將以下程式碼新增至您的 `plugins {}` 區塊：
    ```kotlin
    plugins { 
        alias(libs.plugins.composeHotReload)
    }
    ```

4.  若要使用 Compose Hot Reload 的完整功能，您的專案必須在 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 上執行，JBR 是一個支援增強類別重新定義的 OpenJDK 分支。Compose Hot Reload 可以自動為您的專案提供相容的 JBR。為此，請將以下 Gradle 外掛程式新增到您的 `settings.gradle.kts` 檔案中：

    ```kotlin
    plugins {
        id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
    }
    ```

5.  按一下 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案：![Synchronize Gradle files](gradle-sync.png){width=50}

## 使用 Compose Hot Reload

1.  在 `desktopMain` 目錄中，開啟 `main.kt` 檔案並更新 `main()` 函數：
    ```kotlin
    fun main() = application {
        Window(
            onCloseRequest = ::exitApplication,
            alwaysOnTop = true,
            title = "composedemo",
        ) {
            App()
        }
    }
    ```
    透過將 `alwaysOnTop` 變數設定為 `true`，生成的桌面應用程式會保持在所有視窗的頂部，讓您更容易編輯程式碼並即時查看變更。

2.  在 `commonMain` 目錄中，開啟 `App.kt` 檔案並更新 `Button` 可組合項：
    ```kotlin
    Button(onClick = { showContent = !showContent }) {
        Column {
            Text(Greeting().greet())
        }
    }
    ```
    現在，按鈕的文字由 `greet()` 函數控制。

3.  在 `commonMain` 目錄中，開啟 `Greeting.kt` 檔案並更新 `greet()` 函數：
    ```kotlin
     fun greet(): String {
         return "Hello!"
     }
    ```

4.  在 `desktopMain` 目錄中，開啟 `main.kt` 檔案並按一下行號區中的 **Run** 圖示。選取 **Run 'composeApp [desktop]' with Compose Hot Reload (Alpha)**。

    ![Run Compose Hot Reload from gutter](compose-hot-reload-gutter-run.png){width=350}

    ![First Compose Hot Reload on desktop app](compose-hot-reload-hello.png){width=500}

5.  更新從 `greet()` 函數返回的字串，然後儲存檔案以查看桌面應用程式自動更新。

    ![Compose Hot Reload](compose-hot-reload.gif){width=500}

恭喜！您已經看到了 Compose Hot Reload 的實際應用。現在您可以試驗文字、圖片、格式、UI 結構等方面的變更，而無需在每次變更後重新啟動桌面執行配置。

## 獲取協助

如果您在使用 Compose Hot Reload 時遇到任何問題，請透過[建立 GitHub issue](https://github.com/JetBrains/compose-hot-reload/issues) 告知我們。