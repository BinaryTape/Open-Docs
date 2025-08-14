[//]: # (title: 建立跨平台行動應用程式)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>影片</b>: <a href="https://youtu.be/_Q62iJoNOfg">Ktor 在 Kotlin Multiplatform Mobile 專案中的網路應用</a> 
</p>
</tldr>

<link-summary>
學習如何建立一個 Kotlin Multiplatform Mobile 應用程式。
</link-summary>

Ktor HTTP 客戶端可以用於多平台專案。在本教學中，我們將建立一個簡單的 Kotlin Multiplatform Mobile 應用程式，它會發送請求並接收以純 HTML 文字形式呈現的回應主體。

> 若要學習如何建立您的第一個 Kotlin Multiplatform Mobile 應用程式，請參閱 [建立您的第一個跨平台行動應用程式](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)。

## 先決條件 {id="prerequisites"}

首先，您需要透過在合適的作業系統上安裝必要的工具來設定跨平台行動開發環境。請參閱 [設定環境](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 部分來了解如何執行此操作。

> 您將需要一台搭載 macOS 的 Mac 以完成本教學中的某些步驟，其中包括編寫 iOS 專用程式碼和執行 iOS 應用程式。
>
{style="note"}

## 建立新專案 {id="new-project"}

若要啟動新的 Kotlin Multiplatform 專案，有兩種可用的方法：

- 您可以在 Android Studio 中從範本建立專案。
- 此外，您可以使用 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) 來產生新專案。此精靈提供用於自訂專案設定的選項，例如允許您排除 Android 支援或包含 Ktor 伺服器。

為了本教學的目的，我們將示範從範本建立專案的過程：

1. 在 Android Studio 中，選擇 **File | New | New Project**。
2. 在專案範本清單中選擇 **Kotlin Multiplatform App**，然後點擊 **Next**。
3. 指定您的應用程式名稱，然後點擊 **Next**。在我們的教學中，應用程式名稱為 `KmmKtor`。
4. 在下一頁，保留預設設定並點擊 **Finish** 以建立新專案。現在，請等待您的專案設定完成。當您第一次執行此操作時，下載和設定所需組件可能需要一些時間。
   > 若要檢視所產生的多平台專案的完整結構，請在 [Project view](https://developer.android.com/studio/projects#ProjectView) 中從 **Android** 切換到 **Project**。

## 配置建構指令碼 {id="build-script"}

### 更新 Kotlin Gradle 外掛程式 {id="update_gradle_plugins"}

開啟 `gradle/libs.versions.toml` 檔案並將 Kotlin 版本更新為最新：

[object Promise]

undefined

### 新增 Ktor 依賴項 {id="ktor-dependencies"}

若要在專案中使用 Ktor HTTP 客戶端，您需要新增至少兩個依賴項：一個客戶端依賴項和一個引擎依賴項。

在 `gradle/libs.versions.toml` 檔案中新增 Ktor 版本：

[object Promise]

undefined

然後，定義 Ktor 客戶端和引擎函式庫：

[object Promise]

若要新增依賴項，請開啟 `shared/build.gradle.kts` 檔案並按照以下步驟操作：

1. 若要在通用程式碼中使用 Ktor 客戶端，請將 `ktor-client-core` 依賴項新增至 `commonMain` 源集：
   [object Promise]

2. 為每個所需平台將 [引擎依賴項](client-engines.md) 新增至對應的源集：
    - 對於 Android，將 `ktor-client-okhttp` 依賴項新增至 `androidMain` 源集：
      [object Promise]

      對於 Android，您也可以使用 [其他引擎類型](client-engines.md#jvm-android)。
    - 對於 iOS，將 `ktor-client-darwin` 依賴項新增至 `iosMain`：
      [object Promise]

### 新增協程 {id="coroutines"}

若要在 [Android 程式碼](#android-activity) 中使用協程，您需要將 `kotlinx.coroutines` 新增至您的專案：

1. 開啟 `gradle/libs.versions.toml` 檔案並指定協程版本和函式庫：

    [object Promise]

2. 開啟 `build.gradle.kts` 檔案並將 `kotlinx-coroutines-core` 依賴項新增至 `commonMain` 源集：

    [object Promise]

3. 然後，開啟 `androidApp/build.gradle.kts` 並新增 `kotlinx-coroutines-android` 依賴項：

[object Promise]

點擊 `gradle.properties` 檔案右上角的 **Sync Now** 以安裝新增的依賴項。

## 更新您的應用程式 {id="code"}

### 共用程式碼 {id="shared-code"}

若要更新 Android 和 iOS 之間共用的程式碼，請開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 檔案並將以下程式碼新增至 `Greeting` 類別：

[object Promise]

- 若要建立 HTTP 客戶端，會呼叫 `HttpClient` 建構函式。
- 掛起 `greeting` 函數用於發出 [請求](client-requests.md) 並接收 [回應](client-responses.md) 主體作為字串值。

### Android 程式碼 {id="android-activity"}

若要從 Android 程式碼呼叫掛起 `greeting` 函數，我們將使用 [rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))。

開啟 `androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 檔案並按如下方式更新 `MainActivity` 程式碼：

[object Promise]

在建立的作用域內，我們可以呼叫共用的 `greeting` 函數並處理可能的例外狀況。

### iOS 程式碼 {id="ios-view"}

1. 開啟 `iosApp/iosApp/iOSApp.swift` 檔案並更新應用程式的進入點：
   [object Promise]

2. 開啟 `iosApp/iosApp/ContentView.swift` 檔案並按以下方式更新 `ContentView` 程式碼：
   [object Promise]

   在 iOS 上，掛起 `greeting` 函數可作為帶有回呼的函數使用。

## 在 Android 上啟用網際網路存取 {id="android-internet"}

我們需要做的最後一件事是為 Android 應用程式啟用網際網路存取。開啟 `androidApp/src/main/AndroidManifest.xml` 檔案並使用 `uses-permission` 元素啟用所需的權限：

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## 執行您的應用程式 {id="run"}

若要在 Android 或 iOS 模擬器上執行所建立的多平台應用程式，請選擇 **androidApp** 或 **iosApp** 並點擊 **Run**。模擬器應該會將接收到的 HTML 文件顯示為純文字。

<tabs>
<tab title="Android">

![Android 模擬器](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS 模擬器](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>