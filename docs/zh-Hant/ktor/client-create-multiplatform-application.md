[//]: # (title: 建立跨平台行動應用程式)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>影片</b>: <a href="https://youtu.be/_Q62iJoNOfg">Ktor 在 Kotlin 多平台行動專案中的網路功能</a>
</p>
</tldr>

<link-summary>
學習如何建立 Kotlin 多平台行動應用程式。
</link-summary>

Ktor HTTP 用戶端可用於多平台專案。在本教學中，我們將建立一個簡單的 Kotlin 多平台行動應用程式，它將傳送一個請求並接收純 HTML 文字的回應主體。

> 若要學習如何建立你的第一個 Kotlin 多平台行動應用程式，請參閱 [建立你的第一個跨平台行動應用程式](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)。

## 先決條件 {id="prerequisites"}

首先，你需要在合適的作業系統上安裝必要的工具，以設定跨平台行動開發環境。請參閱 [設定環境](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 章節來學習如何執行此操作。

> 你將需要一台搭載 macOS 的 Mac 來完成本教學中的某些步驟，其中包括撰寫 iOS 專屬程式碼以及執行 iOS 應用程式。
>
{style="note"}

## 建立新專案 {id="new-project"}

要啟動新的 Kotlin Multiplatform 專案，有兩種方法可用：

- 你可以從 Android Studio 內的範本建立專案。
- 另外，你可以使用 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) 來產生一個新專案。
  該精靈提供了自訂專案設定的選項，例如允許你排除 Android 支援或包含 Ktor 伺服器。

為了本教學的目的，我們將示範從範本建立專案的過程：

1. 在 Android Studio 中，選擇 **File | New | New Project**。
2. 在專案範本列表中選擇 **Kotlin Multiplatform App**，然後點擊 **Next**。
3. 指定應用程式的名稱，然後點擊 **Next**。在本教學中，應用程式名稱為 `KmmKtor`。
4. 在下一頁，保留預設設定，然後點擊 **Finish** 建立新專案。
   現在，請等待專案設定完成。首次執行此操作時，可能需要一些時間來下載和設定所需元件。
   > 若要檢視所產生多平台專案的完整結構，請在 [專案檢視](https://developer.android.com/studio/projects#ProjectView) 中將檢視從 **Android** 切換為 **Project**。

## 設定建構腳本 {id="build-script"}

### 更新 Kotlin Gradle 外掛程式 {id="update_gradle_plugins"}

開啟 `gradle/libs.versions.toml` 檔案並將 Kotlin 版本更新到最新：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="3"}

<include from="client-engines.md" element-id="newmm-note"/>

### 新增 Ktor 依賴項 {id="ktor-dependencies"}

要在專案中使用 Ktor HTTP 用戶端，你需要至少新增兩個依賴項：一個用戶端依賴項和一個引擎依賴項。

在 `gradle/libs.versions.toml` 檔案中新增 Ktor 版本：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5"}

<include from="client-create-new-application.topic" element-id="eap-note"/>

然後，定義 Ktor 用戶端和引擎函式庫：

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="11,19-21"}

若要新增依賴項，請開啟 `shared/build.gradle.kts` 檔案並按照以下步驟操作：

1. 要在通用程式碼中使用 Ktor 用戶端，請將 `ktor-client-core` 依賴項新增到 `commonMain` 來源集：
   ```kotlin
   ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

2. 為每個所需平台將一個 [引擎依賴項](client-engines.md) 新增到對應的來源集：
    - 對於 Android，將 `ktor-client-okhttp` 依賴項新增到 `androidMain` 來源集：
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="34-36"}

      對於 Android，你也可以使用 [其他引擎類型](client-engines.md#jvm-android)。
    - 對於 iOS，將 `ktor-client-darwin` 依賴項新增到 `iosMain`：
      ```kotlin
      ```
      {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="37-39"}

### 新增協程 {id="coroutines"}

要在 [Android 程式碼](#android-activity) 中使用協程，你需要將 `kotlinx.coroutines` 新增到你的專案中：

1. 開啟 `gradle/libs.versions.toml` 檔案並指定協程版本和函式庫：

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,4,10-11,22-23"}

2. 開啟 `build.gradle.kts` 檔案並將 `kotlinx-coroutines-core` 依賴項新增到 `commonMain` 來源集：

    ```kotlin
    ```
   {src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-30,40"}

3. 然後，開啟 `androidApp/build.gradle.kts` 並新增 `kotlinx-coroutines-android` 依賴項：

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/build.gradle.kts" include-lines="41,47,49"}

點擊 `gradle.properties` 檔案右上角的 **Sync Now** 以安裝新增的依賴項。

## 更新你的應用程式 {id="code"}

### 共用程式碼 {id="shared-code"}

若要更新 Android 和 iOS 之間共用的程式碼，請開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 檔案，並將以下程式碼新增到 `Greeting` 類別中：

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt"}

- 若要建立 HTTP 用戶端，會呼叫 `HttpClient` 建構函式。
- 掛起 (suspending) 的 `greeting` 函式用於發出 [請求](client-requests.md) 並接收 [回應](client-responses.md) 的主體 (body) 作為字串值。

### Android 程式碼 {id="android-activity"}

若要從 Android 程式碼呼叫掛起 (suspending) 的 `greeting` 函式，我們將使用 [`rememberCoroutineScope`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))。

開啟 `androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 檔案並按如下方式更新 `MainActivity` 程式碼：

```kotlin
```

{src="snippets/tutorial-client-kmm/androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt"}

在建立的範圍內，我們可以呼叫共用的 `greeting` 函式並處理可能的例外。

### iOS 程式碼 {id="ios-view"}

1. 開啟 `iosApp/iosApp/iOSApp.swift` 檔案並更新應用程式的進入點：
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/iOSApp.swift"}

2. 開啟 `iosApp/iosApp/ContentView.swift` 檔案並按如下方式更新 `ContentView` 程式碼：
   ```Swift
   ```
   {src="snippets/tutorial-client-kmm/iosApp/iosApp/ContentView.swift"}

   在 iOS 上，`greeting` 掛起函式可作為帶有回呼 (callback) 的函式使用。

## 在 Android 上啟用網際網路存取 {id="android-internet"}

我們需要做的最後一件事是為 Android 應用程式啟用網際網路存取。
開啟 `androidApp/src/main/AndroidManifest.xml` 檔案並使用 `uses-permission` 元素啟用所需權限：

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest>
```

## 執行你的應用程式 {id="run"}

若要在 Android 或 iOS 模擬器上執行所建立的多平台應用程式，請選擇 **androidApp** 或 **iosApp** 並點擊 **Run**。
模擬器應將收到的 HTML 文件顯示為純文字。

<tabs>
<tab title="Android">

![Android 模擬器](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS 模擬器](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>