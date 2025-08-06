[//]: # (title: 建立您的 Kotlin Multiplatform 應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是<strong>建立具有共享邏輯和原生 UI 的 Kotlin Multiplatform 應用程式</strong>教學課程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>建立您的 Kotlin Multiplatform 應用程式</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> 更新使用者介面<br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> 新增依賴項<br/>       
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多邏輯<br/>
       <img src="icon-5-todo.svg" width="20" alt="第五步"/> 完成您的專案<br/>
    </p>
</tldr>

您將在此處學習如何使用 IntelliJ IDEA 建立並執行您的第一個 Kotlin Multiplatform 應用程式。

Kotlin Multiplatform 技術簡化了跨平台專案的開發。
Kotlin Multiplatform 應用程式可以在多種平台（例如 iOS、Android、macOS、Windows、Linux、web 等）上運行。

Kotlin Multiplatform 的主要用例之一是在行動平台之間共享程式碼。
您可以在 iOS 和 Android 應用程式之間共享應用程式邏輯，並且僅在需要實現原生 UI 或使用平台 API 時才編寫平台特定程式碼。

## 建立專案

1. 在 [quickstart](quickstart.md) 中，完成說明以[設定您的 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。
4. 在 **New Project** 視窗中指定以下欄位：
   * **Name**: GreetingKMP
   * **Group**: com.jetbrains.greeting
   * **Artifact**: greetingkmp
   
   ![建立 Compose Multiplatform 專案](create-first-multiplatform-app.png){width=800}

5. 選擇 **Android** 和 **iOS** 目標。
6. 對於 iOS，選擇 **Do not share UI** 選項以保持 UI 原生。
7. 指定所有欄位和目標後，按一下 **Create**。

> IntelliJ IDEA 可能會自動建議將專案中的 Android Gradle plugin 升級到最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> （請參閱[相容性表格](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

## 檢查專案結構

在 IntelliJ IDEA 中，展開 `GreetingKMP` 資料夾。

此 Kotlin Multiplatform 專案包含三個模組：

* _shared_ 是一個 Kotlin 模組，包含 Android 和 iOS 應用程式通用的邏輯 – 您在平台之間共享的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統來協助自動化您的建置過程。
* _composeApp_ 是一個 Kotlin 模組，可建置為 Android 應用程式。它使用 Gradle 作為建置系統。
  composeApp 模組依賴並使用 shared 模組作為常規 Android 函式庫。
* _iosApp_ 是一個 Xcode 專案，可建置為 iOS 應用程式。它依賴並使用 shared 模組作為 iOS
  框架。shared 模組可以用作常規框架或作為 [CocoaPods 依賴項](multiplatform-cocoapods-overview.md)。
  預設情況下，IntelliJ IDEA 中建立的 Kotlin Multiplatform 專案使用常規框架依賴項。

![基本的 Multiplatform 專案結構](basic-project-structure.svg){width=700}

shared 模組由三個來源集 (`source set`) 組成：`androidMain`、`commonMain` 和 `iosMain`。_來源集_是 Gradle
的一個概念，用於將一組文件邏輯上分組，其中每個組都有自己的依賴項。
在 Kotlin Multiplatform 中，shared 模組中的不同來源集可以針對不同的平台。

common 來源集包含共享的 Kotlin 程式碼，而平台來源集使用特定於每個目標的 Kotlin 程式碼。
`androidMain` 使用 Kotlin/JVM，`iosMain` 使用 Kotlin/Native：

![來源集和模組結構](basic-project-structure-2.png){width=350}

當 shared 模組建置為 Android 函式庫時，common Kotlin 程式碼被視為 Kotlin/JVM。
當它建置為 iOS 框架時，common Kotlin 被視為 Kotlin/Native：

![Common Kotlin、Kotlin/JVM 和 Kotlin/Native](modules-structure.png)

### 編寫常見宣告

common 來源集包含可在多個目標平台之間使用的共享程式碼。
它旨在包含平台獨立的程式碼。如果您嘗試在 common 來源集中使用平台特定的 API，
IDE 將顯示警告：

1. 開啟 `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt` 檔案
    您可以在其中找到自動生成的 `Greeting` 類別和 `greet()` 函數：

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 為問候語增加一些變化。從 Kotlin 標準函式庫導入 `kotlin.random.Random`。
    這是一個 Multiplatform 函式庫，可在所有平台上運行，並自動作為依賴項包含。
3. 使用 Kotlin 標準函式庫中的 `reversed()` 呼叫更新共享程式碼以反轉文字：

    ```kotlin
    import kotlin.random.Random
    
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```

僅在 common Kotlin 中編寫程式碼有明顯的限制，因為它不能使用任何平台特定功能。
使用介面和 [期望/實際 (expect/actual)](multiplatform-connect-to-apis.md) 機制解決了這個問題。

### 檢查平台特定實作

common 來源集可以定義期望宣告（介面、類別等）。
然後，每個平台來源集，在本例中為 `androidMain` 和 `iosMain`，
必須為期望宣告提供實際的平台特定實作。

在為特定平台生成程式碼時，Kotlin 編譯器會合併期望宣告和實際宣告，
並生成帶有實際實作的單一宣告。

1. 當使用 IntelliJ IDEA 建立 Kotlin Multiplatform 專案時，
   您將在 `commonMain` 模組中獲得一個包含 `Platform.kt` 檔案的範本：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   這是一個包含平台資訊的常見 `Platform` 介面。

2. 在 `androidMain` 和 `iosMain` 模組之間切換。
   您會看到它們對 Android 和 iOS 來源集具有相同功能的不同的實作：
    
    ```kotlin
    // Platform.android.kt 在 androidMain 模組中：
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.ios.kt 在 iosMain 模組中：
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` 中的 `name` 屬性實作使用了 Android 特定的程式碼，即 `android.os.Build`
      依賴項。此程式碼是用 Kotlin/JVM 編寫的。如果您嘗試在此處存取 JVM 特定類別，例如 `java.util.Random`，此程式碼將會編譯。
    * `IOSPlatform` 中的 `name` 屬性實作使用了 iOS 特定的程式碼，即 `platform.UIKit.UIDevice`
      依賴項。它是用 Kotlin/Native 編寫的，這意味著您可以用 Kotlin 編寫 iOS 程式碼。此程式碼成為 iOS 的一部分
      框架，您稍後將在 iOS 應用程式中從 Swift 呼叫。

3. 檢查不同來源集中的 `getPlatform()` 函數。其期望宣告沒有主體，
   實際實作在平台程式碼中提供：

    ```kotlin
    // Platform.kt 在 commonMain 來源集中
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.android.kt 在 androidMain 來源集中
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.ios.kt 在 iosMain 來源集中
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

在這裡，common 來源集定義了一個期望的 `getPlatform()` 函數，並在平台來源集中有實際的實作，
分別是 Android 應用程式的 `AndroidPlatform()` 和 iOS 應用程式的 `IOSPlatform()`。

在為特定平台生成程式碼時，Kotlin 編譯器會將期望宣告和實際宣告合併為一個帶有其實際實作的 `getPlatform()` 函數。

這就是為什麼期望宣告和實際宣告應該在同一個套件中定義 – 它們在生成的平台程式碼中合併為一個宣告。
對生成的平台程式碼中期望的 `getPlatform()` 函數的任何呼叫都會呼叫正確的實際實作。

現在您可以運行應用程式並實際觀察所有這些。

#### 探索期望/實際機制 (expect/actual mechanism) (可選) {initial-collapse-state="collapsed" collapsible="true"}

範本專案使用期望/實際機制處理函數，但它也適用於大多數 Kotlin 宣告，
例如屬性和類別。讓我們實現一個期望屬性：

1. 開啟 `commonMain` 模組中的 `Platform.kt`，並在檔案末尾添加以下內容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 編譯器會抱怨此屬性在平台模組中沒有對應的實際宣告。

2. 嘗試立即提供實作：

   ```kotlin
   expect val num: Int = 42
   ```

   您會收到一個錯誤，指出期望宣告不得有主體，在本例中為初始化器。
   實作必須在實際平台模組中提供。移除初始化器。
3. 將滑鼠懸停在 `num` 屬性上，然後按一下 **Create missed actuals...**。
   選擇 `androidMain` 來源集。然後，您可以在 `androidMain/Platform.android.kt` 中完成實作：

   ```kotlin
   actual val num: Int = 1
    ```

4. 現在為 `iosMain` 模組提供實作。將以下內容添加到 `iosMain/Platform.ios.kt`：

   ```kotlin
   actual val num: Int = 2
   ```

5. 在 `commonMain/Greeting.kt` 檔案中，將 `num` 屬性添加到 `greet()` 函數中以查看差異：

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 執行您的應用程式

您可以從 IntelliJ IDEA 執行您的 Multiplatform 應用程式，無論是針對 [Android](#run-your-application-on-android)
還是 [iOS](#run-your-application-on-ios)。

如果您之前探索過期望/實際機制，您會看到 Android 的問候語中添加了 "[1]"，iOS 的問候語中添加了 "[2]"。

### 在 Android 上執行您的應用程式

1. 在執行組態列表中，選擇 **composeApp**。
2. 在組態列表旁邊選擇一個 Android 虛擬裝置，然後按一下 **Run**。

   如果列表中沒有裝置，請建立一個[新的 Android 虛擬裝置](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![在 Android 上執行 Multiplatform 應用程式](compose-run-android.png){width=350}

   ![Android 上的第一個行動 Multiplatform 應用程式](first-multiplatform-project-on-android-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_android_other_devices"/>

### 在 iOS 上執行您的應用程式

如果您在初始設定中尚未啟動 Xcode，請在執行 iOS 應用程式之前執行此操作。

在 IntelliJ IDEA 中，在執行組態列表中選擇 **iosApp**，選擇執行組態旁邊的模擬裝置，
然後按一下 **Run**。

如果列表中沒有可用的 iOS 組態，請添加一個[新的執行組態](#run-on-a-new-ios-simulated-device)。

![在 iOS 上執行 Multiplatform 應用程式](compose-run-ios.png){width=350}

![iOS 上的第一個行動 Multiplatform 應用程式](first-multiplatform-project-on-ios-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_ios_other_devices"/>

## 下一步

在本教學課程的下一部分中，您將學習如何使用平台特定函式庫更新 UI 元素。

**[繼續前往下一部分](multiplatform-update-ui.md)**

### 參閱

* 了解如何[建立和執行 Multiplatform 測試](multiplatform-run-tests.md)以檢查程式碼是否正常運作。
* 了解更多關於[專案結構](multiplatform-discover-project.md)的資訊。
* 如果您想將現有的 Android 專案轉換為跨平台應用程式，請[完成本教學課程以使您的 Android 應用程式跨平台](multiplatform-integrate-in-existing-app.md)。

## 取得協助

* **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。