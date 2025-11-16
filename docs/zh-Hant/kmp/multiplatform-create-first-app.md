[//]: # (title: 建立您的 Kotlin Multiplatform 應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循它 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是「**使用共享邏輯和原生 UI 建立 Kotlin Multiplatform 應用程式**」教學的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> **建立您的 Kotlin Multiplatform 應用程式**<br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> 更新使用者介面<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 新增依賴項<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共享更多邏輯<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成您的專案<br/>
    </p>
</tldr>

在這裡，您將學習如何使用 IntelliJ IDEA 建立並執行您的第一個 Kotlin Multiplatform 應用程式。

Kotlin Multiplatform 技術簡化了跨平台專案的開發。
Kotlin Multiplatform 應用程式可以在各種平台上運作，例如 iOS、Android、macOS、Windows、Linux、Web 等。

其中一個主要的 Kotlin Multiplatform 使用案例是在行動平台之間共享程式碼。
您可以在 iOS 和 Android 應用程式之間共享應用程式邏輯，並且僅在需要實作原生 UI 或使用平台 API 時才編寫平台特定程式碼。

## 建立專案

1. 在 [快速入門](quickstart.md) 中，完成 [設定您的 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment) 的指示。
2. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。
4. 在 **New Project** 視窗中指定以下欄位：
   * **Name**：GreetingKMP
   * **Group**：com.jetbrains.greeting
   * **Artifact**：greetingkmp
   
   ![建立 Compose Multiplatform 專案](create-first-multiplatform-app.png){width=800}

5. 選擇 **Android** 和 **iOS** 目標。
6. 針對 iOS，選擇 **Do not share UI** 選項以保持 UI 原生。
7. 指定所有欄位和目標後，點擊 **Create**。

> IntelliJ IDEA 可能會自動建議將專案中的 Android Gradle plugin 升級到最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> (請參閱 [相容性表格](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility))。
>
{style="note"}

## 檢查專案結構

在 IntelliJ IDEA 中，展開 `GreetingKMP` 資料夾。

這個 Kotlin Multiplatform 專案包含三個模組：

* _shared_ 是一個 Kotlin 模組，包含 Android 和 iOS 應用程式共用的邏輯 – 您在平台之間共享的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統，以幫助自動化您的建置流程。
* _composeApp_ 是一個 Kotlin 模組，建置為 Android 應用程式。它使用 Gradle 作為建置系統。composeApp 模組依賴並使用共享模組作為常規 Android 函式庫。
* _iosApp_ 是一個 Xcode 專案，建置為 iOS 應用程式。它依賴並使用共享模組作為 iOS framework。共享模組可以作為常規 framework 或 [CocoaPods 依賴項](multiplatform-cocoapods-overview.md) 使用。預設情況下，在 IntelliJ IDEA 中建立的 Kotlin Multiplatform 專案使用常規 framework 依賴項。

![基本 Multiplatform 專案結構](basic-project-structure.svg){width=700}

共享模組由三個原始碼集組成：`androidMain`、`commonMain` 和 `iosMain`。_原始碼集_ 是一個 Gradle 概念，用於將多個檔案邏輯分組，其中每個組都有自己的依賴項。在 Kotlin Multiplatform 中，共享模組中的不同原始碼集可以針對不同的平台。

共用原始碼集包含共享的 Kotlin 程式碼，而平台原始碼集使用針對每個目標的 Kotlin 程式碼。`androidMain` 使用 Kotlin/JVM，`iosMain` 使用 Kotlin/Native：

![原始碼集和模組結構](basic-project-structure-2.png){width=350}

當共享模組建置為 Android 函式庫時，共用 Kotlin 程式碼被視為 Kotlin/JVM。
當它建置為 iOS framework 時，共用 Kotlin 被視為 Kotlin/Native：

![共用 Kotlin、Kotlin/JVM 和 Kotlin/Native](modules-structure.png)

### 編寫共用宣告

共用原始碼集包含可在多個目標平台之間使用的共享程式碼。它旨在包含平台獨立的程式碼。如果您嘗試在共用原始碼集中使用平台特定的 API，IDE 將會顯示警告：

1. 開啟 `shared/src/commonMain/.../Greeting.kt` 檔案，
    您可以在其中找到自動產生的 `Greeting` 類別和 `greet()` 函式：

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 為問候語增加一些變化。
   使用 Kotlin 標準函式庫中的隨機化和 `reversed()` 呼叫更新共享程式碼以反轉文字：

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            //
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```
3. 根據 IDE 的建議導入 `kotlin.random.Random` 類別。

僅在共用 Kotlin 中編寫程式碼有明顯的限制，因為它無法使用任何平台特定功能。使用介面和 [expect/actual](multiplatform-connect-to-apis.md) 機制可解決此問題。

### 查看平台特定實作

共用原始碼集可以定義 expect 宣告 (介面、類別等)。然後，每個平台原始碼集（在本例中為 `androidMain` 和 `iosMain`）必須為 expect 宣告提供實際的平台特定實作。

在為特定平台產生程式碼時，Kotlin 編譯器會合併 expect 和 actual 宣告，並產生帶有實際實作的單一宣告。

1. 當使用 IntelliJ IDEA 建立 Kotlin Multiplatform 專案時，
   您會在 `commonMain` 模組中獲得一個包含 `Platform.kt` 檔案的範本：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   這是一個共用的 `Platform` 介面，包含有關平台資訊。

2. 在 `androidMain` 和 `iosMain` 模組之間切換。
   您會看到它們在 Android 和 iOS 原始碼集中針對相同功能有不同的實作：
    
    ```kotlin
    // Platform.android.kt in the androidMain module:
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain module:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` 中的 `name` 屬性實作使用 Android 特定程式碼，即 `android.os.Build` 依賴項。此程式碼以 Kotlin/JVM 編寫。如果您嘗試在此處存取 JVM 特定類別，例如 `java.util.Random`，此程式碼將會編譯。
    * `IOSPlatform` 中的 `name` 屬性實作使用 iOS 特定程式碼，即 `platform.UIKit.UIDevice` 依賴項。它以 Kotlin/Native 編寫，這表示您可以用 Kotlin 編寫 iOS 程式碼。此程式碼成為 iOS framework 的一部分，您稍後將在 iOS 應用程式中從 Swift 呼叫它。

3. 檢查不同原始碼集中的 `getPlatform()` 函式。其 expect 宣告沒有主體，
   並且實際實作在平台程式碼中提供：

    ```kotlin
    // Platform.kt in the commonMain source set
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.android.kt in the androidMain source set
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain source set
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

在這裡，共用原始碼集定義了一個 expect `getPlatform()` 函式，並在平台原始碼集中具有實際的實作：適用於 Android 應用程式的 `AndroidPlatform()` 和適用於 iOS 應用程式的 `IOSPlatform()`。

在為特定平台產生程式碼時，Kotlin 編譯器會將 expect 和 actual 宣告合併為一個帶有實際實作的 `getPlatform()` 函式。

這就是為什麼 expect 和 actual 宣告應該定義在同一個套件中 – 它們會合併到結果平台程式碼中的一個宣告。對所產生平台程式碼中 expect `getPlatform()` 函式的任何呼叫都會呼叫正確的實際實作。

現在您可以執行應用程式並查看所有這些實際運作。

#### 探索 expect/actual 機制 (選用) {initial-collapse-state="collapsed" collapsible="true"}

範本專案使用 expect/actual 機制來處理函式，但它也適用於大多數 Kotlin 宣告，例如屬性和類別。讓我們實作一個 expect 屬性：

1. 開啟 `commonMain` 模組中的 `Platform.kt`，並在檔案末尾添加以下內容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 編譯器抱怨此屬性在平台模組中沒有對應的 actual 宣告。

2. 嘗試立即提供實作：

   ```kotlin
   expect val num: Int = 42
   ```

   您會收到錯誤訊息，指出 expect 宣告不能有主體，在本例中是初始化器。實作必須在實際的平台模組中提供。移除初始化器。
3. 將滑鼠懸停在 `num` 屬性上，然後點擊 **Create missed actuals...**。
   選擇 `androidMain` 原始碼集。然後您可以在 `androidMain/Platform.android.kt` 中完成實作：

   ```kotlin
   actual val num: Int = 1
    ```

4. 現在為 `iosMain` 模組提供實作。將以下內容添加到 `iosMain/Platform.ios.kt`：

   ```kotlin
   actual val num: Int = 2
   ```

5. 在 `commonMain/Greeting.kt` 檔案中，將 `num` 屬性添加到 `greet()` 函式中以查看差異：

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 執行您的應用程式

您可以從 IntelliJ IDEA 執行您的 Multiplatform 應用程式，適用於 [Android](#run-your-application-on-android) 或 [iOS](#run-your-application-on-ios)。

如果您之前已經探索過 expect/actual 機制，您會看到 Android 的問候語中添加了「[1]」，iOS 中添加了「[2]」。

### 在 Android 上執行您的應用程式

1. 在執行設定列表中，選擇 **composeApp**。
2. 在設定列表旁邊選擇一個 Android 虛擬裝置，然後點擊 **Run**。

   如果列表中沒有裝置，請建立一個 [新的 Android 虛擬裝置](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![在 Android 上執行 Multiplatform 應用程式](compose-run-android.png){width=350}

   ![第一個行動 Multiplatform 應用程式在 Android 上](first-multiplatform-project-on-android-1.png){width=300}

#### 在不同的 Android 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [設定 Android 模擬器並在不同的模擬裝置上執行您的應用程式](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真實 Android 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [設定和連接硬體裝置並在其上執行您的應用程式](https://developer.android.com/studio/run/device)。

### 在 iOS 上執行您的應用程式

如果您尚未啟動 Xcode 作為初始設定的一部分，請在執行 iOS 應用程式之前執行此操作。

在 IntelliJ IDEA 中，在執行設定列表中選擇 **iosApp**，在執行設定旁邊選擇一個模擬裝置，然後點擊 **Run**。

如果列表中沒有可用的 iOS 設定，請新增一個 [新的執行設定](#run-on-a-new-ios-simulated-device)。

![在 iOS 上執行 Multiplatform 應用程式](compose-run-ios.png){width=350}

![第一個行動 Multiplatform 應用程式在 iOS 上](first-multiplatform-project-on-ios-1.png){width=300}

#### 在新的 iOS 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

如果您想在模擬裝置上執行您的應用程式，可以新增一個新的執行設定。

1. 在執行設定列表中，點擊 **Edit Configurations**。

   ![編輯執行設定](ios-edit-configurations.png){width=450}

2. 點擊設定列表上方的 **+** 按鈕，然後選擇 **Xcode Application**。

   ![iOS 應用程式的新執行設定](ios-new-configuration.png)

3. 為您的設定命名。
4. 選擇 **Working directory**。為此，請導覽至您的專案，例如 **KotlinMultiplatformSandbox**，在 `iosApp` 資料夾中。

5. 點擊 **Run** 以在新模擬裝置上執行您的應用程式。

#### 在真實 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在真實 iOS 裝置上執行您的 Multiplatform 應用程式。開始之前，
您需要設定與您的 [Apple ID](https://support.apple.com/en-us/HT204316) 關聯的團隊 ID (Team ID)。

##### 設定您的團隊 ID

若要在專案中設定團隊 ID，您可以在 IntelliJ IDEA 中使用 KDoctor 工具，或在 Xcode 中選擇您的團隊。

針對 KDoctor：

1. 在 IntelliJ IDEA 中，在終端機中執行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 將列出您系統上目前設定的所有團隊 ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，開啟 `iosApp/Configuration/Config.xcconfig` 並指定您的 Team ID。

或者，在 Xcode 中選擇團隊：

1. 前往 Xcode 並選擇 **Open a project or file**。
2. 導覽至您專案的 `iosApp/iosApp.xcworkspace` 檔案。
3. 在左側選單中，選擇 `iosApp`。
4. 導覽至 **Signing & Capabilities**。
5. 在 **Team** 列表中，選擇您的團隊。

   如果您尚未設定您的團隊，請在 **Team** 列表中使用 **Add an Account** 選項並遵循 Xcode 指示。

6. 確保組合識別碼 (Bundle Identifier) 是唯一的，並且簽署憑證 (Signing Certificate) 已成功指派。

##### 執行應用程式

使用傳輸線連接您的 iPhone。如果您已經在 Xcode 中註冊了該裝置，IntelliJ IDEA 應該會將其顯示在執行設定列表中。執行對應的 `iosApp` 設定。

如果您尚未在 Xcode 中註冊您的 iPhone，請遵循 [Apple 建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。
簡而言之，您應該：

1. 使用傳輸線連接您的 iPhone。
2. 在您的 iPhone 上，在 **Settings** | **Privacy & Security** 中啟用開發者模式。
3. 在 Xcode 中，前往頂部選單並選擇 **Window** | **Devices and Simulators**。
4. 點擊加號。選擇您連接的 iPhone 並點擊 **Add**。
5. 使用您的 Apple ID 登入以啟用裝置上的開發功能。
6. 遵循螢幕上的指示完成配對流程。

在 Xcode 中註冊您的 iPhone 後，在 IntelliJ IDEA 中 [建立新的執行設定](#run-on-a-new-ios-simulated-device)
並在 **Execution target** 列表中選擇您的裝置。執行對應的 `iosApp` 設定。

## 下一步

在教學的下一部分，您將學習如何使用平台特定函式庫更新 UI 元素。

**[繼續到下一部分](multiplatform-update-ui.md)**

### 另請參閱

* 了解如何 [建立和執行 Multiplatform 測試](multiplatform-run-tests.md) 以檢查程式碼是否正確運作。
* 了解更多關於 [專案結構](multiplatform-discover-project.md) 的資訊。
* 如果您想將現有的 Android 專案轉換為跨平台應用程式，請 [完成本教學以使您的 Android 應用程式跨平台](multiplatform-integrate-in-existing-app.md)。

## 取得協助

* **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。