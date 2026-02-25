[//]: # (title: 建立您的 Kotlin Multiplatform 應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 — 這兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是 <strong>建立包含共享邏輯與原生 UI 的 Kotlin Multiplatform 應用程式</strong> 教學的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>建立您的 Kotlin Multiplatform 應用程式</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> 更新使用者介面<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 新增相依性<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共享更多邏輯<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成您的專案<br/>
    </p>
</tldr>

在這裡，您將學習如何使用 IntelliJ IDEA 建立並執行您的第一個 Kotlin Multiplatform 應用程式。

Kotlin Multiplatform 技術簡化了跨平台專案的開發。
Kotlin Multiplatform 應用程式可以在多種平台上運作，例如 iOS、Android、macOS、Windows、Linux、Web 等。

Kotlin Multiplatform 的主要使用案例之一是在行動平台之間共享程式碼。
您可以在 iOS 與 Android 應用程式之間共享應用程式邏輯，並僅在需要實作原生 UI 或處理平台 API 時編寫平台特定程式碼。

## 建立專案

1. 在 [快速入門](quickstart.md) 中，完成[為 Kotlin Multiplatform 開發設定您的環境](quickstart.md#set-up-the-environment)的指示。
2. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。
4. 在 **New Project** 視窗中指定以下欄位：
   * **Name**: GreetingKMP
   * **Group**: com.jetbrains.greeting
   * **Artifact**: greetingkmp
   
   ![建立 Compose Multiplatform 專案](create-first-multiplatform-app.png){width=800}

5. 選擇 **Android** 與 **iOS** 目標。
6. 對於 iOS，選擇 **Do not share UI** 選項以保持 UI 原生化。
7. 指定完所有欄位與目標後，點擊 **Create**。

> IDE 可能會自動建議將專案中的 Android Gradle 外掛程式升級至最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> （請參閱 [相容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

## 檢查專案結構

在 IntelliJ IDEA 中，展開 `GreetingKMP` 資料夾。

此 Kotlin Multiplatform 專案包含三個模組：

* _shared_ 是一個 Kotlin 模組，包含 Android 與 iOS 應用程式通用的邏輯 — 也就是您在平台之間共享的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統，以協助自動化您的建置過程。
* _composeApp_ 是一個 Kotlin 模組，可組建為 Android 應用程式。它使用 Gradle 作為建置系統。composeApp 模組相依於 shared 模組，並將其視為一般的 Android 程式庫使用。
* _iosApp_ 是一個 Xcode 專案，可組建為 iOS 應用程式。它相依於 shared 模組並將其作為 iOS 架構（framework）使用。shared 模組可以作為一般的架構使用，也可以作為 [CocoaPods 相依性](multiplatform-cocoapods-overview.md)使用。預設情況下，在 IntelliJ IDEA 中建立的 Kotlin Multiplatform 專案使用一般的架構相依性。

![基本 Multiplatform 專案結構](basic-project-structure.svg){width=700}

shared 模組由三個原始碼集組成：`androidMain`、`commonMain` 與 `iosMain`。_原始碼集_（Source set）是一個 Gradle 概念，用於將多個檔案進行邏輯分組，其中每個分組都有自己的相依性。在 Kotlin Multiplatform 中，shared 模組中的不同原始碼集可以針對不同的平台。

通用原始碼集包含共享的 Kotlin 程式碼，而平台原始碼集則使用針對每個目標特定的 Kotlin 程式碼。`androidMain` 使用 Kotlin/JVM，而 `iosMain` 使用 Kotlin/Native：

![原始碼集與模組結構](basic-project-structure-2.png){width=350}

當 shared 模組被組建為 Android 程式庫時，通用的 Kotlin 程式碼會被視為 Kotlin/JVM。當它被組建為 iOS 架構時，通用的 Kotlin 則被視為 Kotlin/Native：

![通用 Kotlin、Kotlin/JVM 與 Kotlin/Native](modules-structure.png)

### 編寫通用宣告

通用原始碼集包含可以在多個目標平台之間使用的共享程式碼。它旨在包含與平台無關的程式碼。如果您嘗試在通用原始碼集中使用平台特定的 API，IDE 將顯示警告：

1. 開啟 `shared/src/commonMain/.../Greeting.kt` 檔案，您可以在其中找到自動產生的 `Greeting` 類別以及 `greet()` 函式：

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 讓我們為問候語增加一點變化。使用隨機化以及來自 Kotlin 標準函式庫的 `reversed()` 呼叫來更新共享程式碼，以反轉文字：

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
3. 根據 IDE 的建議匯入 `kotlin.random.Random` 類別。

僅在通用 Kotlin 中編寫程式碼顯然有其限制，因為它無法使用任何平台特定的功能。使用介面與 [expect/actual](multiplatform-connect-to-apis.md) 機制可以解決這個問題。

### 查看平台特定的實作

通用原始碼集可以定義預期宣告（expect declarations，如介面、類別等）。然後，每個平台原始碼集（在此案例中為 `androidMain` 與 `iosMain`）必須為預期宣告提供實際的平台特定實作（actual implementations）。

在為特定平台產生程式碼時，Kotlin 編譯器會合併預期與實際宣告，並產生帶有實際實作的單一宣告。

1. 使用 IntelliJ IDEA 建立 Kotlin Multiplatform 專案時，您會在 `commonMain` 模組中獲得一個包含 `Platform.kt` 檔案的範本：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   這是一個通用的 `Platform` 介面，包含有關平台的資訊。

2. 在 `androidMain` 與 `iosMain` 模組之間切換。您會看到它們對於 Android 與 iOS 原始碼集的相同功能有不同的實作：
    
    ```kotlin
    // androidMain 模組中的 Platform.android.kt：
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // iosMain 模組中的 Platform.ios.kt：
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * 來自 `AndroidPlatform` 的 `name` 屬性實作使用了 Android 特有的程式碼，即 `android.os.Build` 相依性。這段程式碼是用 Kotlin/JVM 編寫的。如果您嘗試在此處存取 JVM 特有的類別（例如 `java.util.Random`），這段程式碼將可以編譯。
    * 來自 `IOSPlatform` 的 `name` 屬性實作使用了 iOS 特有的程式碼，即 `platform.UIKit.UIDevice` 相依性。它是用 Kotlin/Native 編寫的，這意味著您可以用 Kotlin 編寫 iOS 程式碼。這段程式碼會成為 iOS 架構的一部分，稍後您將在 iOS 應用程式中從 Swift 呼叫它。

3. 檢查不同原始碼集中的 `getPlatform()` 函式。它的預期宣告沒有主體，而實際實作則在平台程式碼中提供：

    ```kotlin
    // commonMain 原始碼集中的 Platform.kt
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // androidMain 原始碼集中的 Platform.android.kt
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // iosMain 原始碼集中的 Platform.ios.kt
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

在這裡，通用原始碼集定義了一個預期的 `getPlatform()` 函式，並在平台原始碼集中分別擁有 Android 應用程式的 `AndroidPlatform()` 與 iOS 應用程式的 `IOSPlatform()` 實際實作。

在為特定平台產生程式碼時，Kotlin 編譯器會將預期與實際宣告合併為帶有其實際實作的單一 `getPlatform()` 函式。

這就是為什麼預期與實際宣告應該定義在同一個封裝（package）中 — 它們在產生的平台程式碼中被合併為一個宣告。在產生的平台程式碼中對預期 `getPlatform()` 函式的任何調用，都會呼叫正確的實際實作。

現在您可以執行應用程式並查看這一切的運作情況。

#### 探索 expect/actual 機制（選填） {initial-collapse-state="collapsed" collapsible="true"}

專案範本對函式使用了 expect/actual 機制，但它也適用於大多數 Kotlin 宣告，例如屬性與類別。讓我們實作一個預期屬性：

1. 開啟 `commonMain` 模組中的 `Platform.kt`，並在檔案末尾新增以下內容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 編譯器會抱怨此屬性在平台模組中沒有對應的實際宣告。

2. 嘗試立即透過以下方式提供實作：

   ```kotlin
   expect val num: Int = 42
   ```

   您會收到一個錯誤，指出預期宣告不得有主體，在此案例中即為初始設定式。實作必須在實際平台模組中提供。移除初始設定式。
3. 將游標懸停在 `num` 屬性上，然後點擊 **Create missed actuals...**。選擇 `androidMain` 原始碼集。接著您可以在 `androidMain/Platform.android.kt` 中完成實作：

   ```kotlin
   actual val num: Int = 1
    ```

4. 現在為 `iosMain` 模組提供實作。將以下內容新增至 `iosMain/Platform.ios.kt`：

   ```kotlin
   actual val num: Int = 2
   ```

5. 在 `commonMain/Greeting.kt` 檔案中，將 `num` 屬性新增至 `greet()` 函式以查看差異：

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 執行您的應用程式

您可以從 IntelliJ IDEA 中為 [Android](#run-your-application-on-android) 或 [iOS](#run-your-application-on-ios) 執行您的多平台應用程式。

如果您之前探索過 expect/actual 機制，您會看到 Android 的問候語中新增了 "[1]"，而 iOS 則新增了 "[2]"。

### 在 Android 上執行您的應用程式

1. 在运行配置清單中，選擇 **composeApp**。
2. 在配置清單旁選擇一個 Android 虛擬裝置，然後點擊 **Run**。

   如果您清單中沒有裝置，請建立一個[新的 Android 虛擬裝置](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![在 Android 上執行多平台應用程式](compose-run-android.png){width=350}

   ![Android 上的第一個行動多平台應用程式](first-multiplatform-project-on-android-1.png){width=300}

#### 在不同的 Android 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置 Android 模擬器並在不同的模擬裝置上執行您的應用程式](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在實體 Android 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置並連接硬體裝置並在其上執行您的應用程式](https://developer.android.com/studio/run/device)。

### 在 iOS 上執行您的應用程式

如果您尚未啟動 Xcode 作為初始設定的一部分，請在執行 iOS 應用程式之前先啟動它。

在 IntelliJ IDEA 的运行配置清單中選擇 **iosApp**，在运行配置旁選擇一個模擬裝置，然後點擊 **Run**。

如果您清單中沒有可用的 iOS 配置，請新增一個[新的运行配置](#run-on-a-new-ios-simulated-device)。

![在 iOS 上執行多平台應用程式](compose-run-ios.png){width=350}

![iOS 上的第一個行動多平台應用程式](first-multiplatform-project-on-ios-1.png){width=300}

#### 在新的 iOS 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

如果您想在模擬裝置上執行應用程式，可以新增一個新的运行配置。

1. 在运行配置清單中，點擊 **Edit Configurations**。

   ![編輯运行配置](ios-edit-configurations.png){width=450}

2. 點擊配置清單上方的 **+** 按鈕，然後選擇 **Xcode Application**。

   ![iOS 應用程式的新运行配置](ios-new-configuration.png)

3. 為您的配置命名。
4. 選擇 **Working directory**。為此，請瀏覽至您的專案（例如 **KotlinMultiplatformSandbox**）中的 `iosApp` 資料夾。

5. 點擊 **Run** 以在新的模擬裝置上執行您的應用程式。

#### 在實體 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在實體 iOS 裝置上執行您的多平台應用程式。在開始之前，您需要設定與您的 [Apple ID](https://support.apple.com/en-us/HT204316) 關聯的 Team ID。

##### 設定您的 Team ID

若要在專案中設定 Team ID，您可以使用 IntelliJ IDEA 中的 KDoctor 工具，或是在 Xcode 中選擇您的團隊。

使用 KDoctor：

1. 在 IntelliJ IDEA 的終端機中執行以下指令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 將列出目前您系統上配置的所有 Team ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，開啟 `iosApp/Configuration/Config.xcconfig` 並指定您的 Team ID。

或者，在 Xcode 中選擇團隊：

1. 前往 Xcode 並選擇 **Open a project or file**。
2. 瀏覽至專案的 `iosApp/iosApp.xcworkspace` 檔案。
3. 在左側選單中，選擇 `iosApp`。
4. 導航至 **Signing & Capabilities**。
5. 在 **Team** 清單中，選擇您的團隊。

   如果您尚未設定團隊，請使用 **Team** 清單中的 **Add an Account** 選項並按照 Xcode 的指示操作。

6. 確保 Bundle Identifier 是唯一的，且 Signing Certificate 已成功指派。

##### 執行應用程式

使用傳輸線連接您的 iPhone。如果您已經在 Xcode 中註冊了該裝置，IntelliJ IDEA 應該會將其顯示在运行配置清單中。執行相對應的 `iosApp` 配置。

如果您尚未在 Xcode 中註冊您的 iPhone，請遵循 [Apple 的建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。簡而言之，您應該：

1. 使用傳輸線連接您的 iPhone。
2. 在您的 iPhone 上，於 **Settings** | **Privacy & Security** 中啟用開發者模式。
3. 在 Xcode 中，前往頂部選單並選擇 **Window** | **Devices and Simulators**。
4. 點擊加號。選擇您連接的 iPhone 並點擊 **Add**。
5. 使用您的 Apple ID 登入以在裝置上啟用開發功能。
6. 按照螢幕上的指示完成配對過程。

在 Xcode 中註冊 iPhone 後，在 IntelliJ IDEA 中[建立一個新的运行配置](#run-on-a-new-ios-simulated-device)，並在 **Execution target** 清單中選擇您的裝置。執行相對應的 `iosApp` 配置。

## 下一步

在本教學的下一部分中，您將學習如何使用平台特定的程式庫來更新 UI 元件。

**[繼續下一步](multiplatform-update-ui.md)**

### 另請參閱

* 了解如何[建立並執行多平台測試](multiplatform-run-tests.md)以檢查程式碼是否正確運作。
* 進一步了解[專案結構](multiplatform-discover-project.md)。
* 如果您想將現有的 Android 專案轉換為跨平台應用程式，請[完成此教學以讓您的 Android 應用程式跨平台化](multiplatform-integrate-in-existing-app.md)。

## 獲取協助

* **Kotlin Slack**。獲取[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。