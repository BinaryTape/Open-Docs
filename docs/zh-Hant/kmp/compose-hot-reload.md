[//]: # (title: Compose Hot Reload)

[Compose Hot Reload](https://github.com/JetBrains/compose-hot-reload) 協助您在開發 Compose Multiplatform 專案時，視覺化並試驗 UI 變更。

隨附的 Compose Hot Reload Gradle 外掛程式需要 Kotlin 2.1.20+ 以及與 Java 21 或更早版本相容的 JVM 目標。
若要使用 Compose Hot Reload 的完整功能，我們建議安裝 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，
該外掛程式自 IntelliJ IDEA 2025.2.2 版本以及 Android Studio Otter 2025.2.1 版本起開始提供。

在我們探索為其他目標提供支援的同時，您已經可以將桌面應用程式作為沙盒，在不中斷流程的情況下，快速試驗共用程式碼中的 UI 變更。

<img src="KotlinConf_hot_reload.animated.gif" alt="Compose Hot Reload" width="600" preview-src="KotlinConf_hot_reload.png"/>

## 將 Compose Hot Reload 新增至您的專案

Compose Hot Reload 可以透過以下兩種方式新增：

* [在 IntelliJ IDEA 或 Android Studio 中從頭開始建立專案](#from-scratch)
* [將 Gradle 外掛程式新增至現有專案](#to-an-existing-project)

### 從頭開始

本節將引導您完成在 IntelliJ IDEA 和 Android Studio 中建立具有桌面目標的多平台專案的步驟。建立專案時，Compose Hot Reload 會自動新增。

1. 在[快速入門指南](quickstart.md)中，完成[設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的說明。
2. 在 IDE 中，選取 **File** | **New** | **Project**。
3. 在左側面板中，選取 **Kotlin Multiplatform**。
4. 在 **New Project** 視窗中指定 **Name**、**Group** 和 **Artifact** 欄位。
5. 選取 **Desktop** 目標並點擊 **Create**。
   ![建立具有桌面目標的多平台專案](create-desktop-project.png){width=600 style="block"}

### 至現有專案

從 Compose Multiplatform 1.10.0 開始，Compose Hot Reload 外掛程式已[內建](whats-new-compose-110.md#compose-hot-reload-integration)並對所有包含 **桌面目標** 的專案預設啟用。

如果您的專案已經包含桌面目標，您可以升級至 Compose Multiplatform 1.10.0 或更高版本，即可開箱即用享受 Compose Hot Reload 功能。

雖然它預設為啟用，但您仍然可以明確宣告 Compose Hot Reload 外掛程式以使用特定的舊版本。

#### 較早版本的 Compose Multiplatform {initial-collapse-state="collapsed" collapsible="true"}

對於使用早於 1.10.0 之 Compose Multiplatform 版本的多平台專案，您必須配置好桌面目標，然後明確新增 Compose Hot Reload 外掛程式。
以下步驟參考自[使用共享邏輯與 UI 建立應用程式](compose-multiplatform-create-first-app.md)教學中的專案。

1. 引入桌面目標：建立 `jvmMain` 目錄，定義 `main()` 函式，並提供 `actual` 實作。
   如果您的專案已經包含桌面目標，可以跳過此步驟。
   參考範例請參閱[新增 JVM 入口點](migrate-from-android.md#optional-add-a-jvm-entry-point)。
 
2. 使用最新版本的 Compose Hot Reload 更新版本目錄（請參閱 [Releases](https://github.com/JetBrains/compose-hot-reload/releases)）。
   在 `gradle/libs.versions.toml` 中，新增以下程式碼：
   ```kotlin
   composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
   ```

   > 若要進一步了解如何使用版本目錄集中管理整個專案的相依性，請參閱我們的 [Gradle 最佳實務](https://kotlinlang.org/gradle-best-practices.html)。

3. 在父專案的 `build.gradle.kts` (`ComposeDemo/build.gradle.kts`) 中，將以下程式碼新增至 `plugins {}` 區塊：
   ```kotlin
   plugins {
       alias(libs.plugins.composeHotReload) apply false
   }
   ```
   這可以防止 Compose Hot Reload 外掛程式在您的每個子專案中被多次載入。

4. 在包含多平台應用程式的子專案 `build.gradle.kts` (`ComposeDemo/composeApp/build.gradle.kts`) 中，將以下程式碼新增至 `plugins {}` 區塊：
   ```kotlin
   plugins { 
       alias(libs.plugins.composeHotReload)
   }
   ```

5. 您的專案必須在 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 上執行，這是一個支援增強型類別重新定義的 OpenJDK 分支。
   Compose Hot Reload 可以為您的專案自動配置相容的 JBR。

   > 最新的 JetBrains Runtime 僅支援 Java 21：
   > 如果您將 Compose Hot Reload 新增至僅與 Java 22 或更新版本相容的專案，
   > 執行專案將導致連結錯誤。
   > 
   {style="warning"}

   若要允許自動配置，請將以下 Gradle 外掛程式新增至您的 `settings.gradle.kts` 檔案：

   ```kotlin
   plugins {
       id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
   }
   ```

6. 點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案：![同步 Gradle 檔案](gradle-sync.png){width=50}

## 使用 Compose Hot Reload

1. 在 `jvmMain` 目錄中，開啟 `main.kt` 檔案並更新 `main()` 函式：
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
   藉由將 `alwaysOnTop` 變數設定為 `true`，產生的桌面應用程式將保持在所有視窗的最上層，讓您更輕鬆地編輯程式碼並即時查看變更。

2. 開啟 `App.kt` 檔案並更新 `Button` 可組合項：
   ```kotlin
   Button(onClick = { showContent = !showContent }) {
       Column {
           Text(Greeting().greet())
       }
   }
   ```
   現在，按鈕的文字由 `greet()` 函式控制。

3. 開啟 `Greeting.kt` 檔案並更新 `greet()` 函式：
   ```kotlin
    fun greet(): String {
        return "Hello!"
    }
   ```

4. 開啟 `main.kt` 檔案並點擊邊欄中的 **Run** 圖示。
   選取 **Run 'composeApp [jvm]' with Compose Hot Reload**。

    ![從邊欄執行 Compose Hot Reload](compose-hot-reload-gutter-run.png){width=350}

    ![在桌面應用程式上的第一個 Compose Hot Reload](compose-hot-reload-hello.png){width=500}

5. 更新 `greet()` 函式回傳的字串，然後儲存所有檔案 (<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>)，即可看到桌面應用程式自動更新。

   ![Compose Hot Reload](compose-hot-reload.gif){width=350}

   或者，可以透過按分配的快速鍵或點擊 **Reload UI** 按鈕來明確觸發重新載入。
   您可以在 **Settings | Tools | Compose Hot Reload** 頁面修改觸發行為。

恭喜！您已經見識了 Compose Hot Reload 的實際運作。現在您可以嘗試變更文字、圖片、格式、UI 結構等，而無需在每次變更後重新啟動桌面執行配置。

## 獲取說明

如果您在使用 Compose Hot Reload 時遇到任何問題，請透過[建立 GitHub 問題](https://github.com/JetBrains/compose-hot-reload/issues)告知我們。