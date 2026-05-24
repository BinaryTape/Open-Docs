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
   * **Project ID**: com.jetbrains.greetingkmp

5. 選擇 **Android** 與 **iOS** 目標。
6. 對於 iOS，選擇 **Do not share UI** 選項以保持 UI 原生化。
7. 指定完所有欄位與目標後，點擊 **Create**。

![建立 Kotlin Multiplatform 專案](create-first-multiplatform-app.png){width=700}

> IDE 可能會自動建議將專案中的 Android Gradle 外掛程式升級至最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> （請參閱 [相容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

## 檢查專案結構

在 IntelliJ IDEA 中，展開 `GreetingKMP` 資料夾。

此 Kotlin Multiplatform 專案包含以下模組：

* `androidApp` 是一個 Kotlin 模組，可組建為 Android 應用程式。它使用 Gradle 作為建構系統。
  `androidApp` 模組相依於並將共享模組視為一般的 Android 程式庫使用。
* `iosApp` 是一個 Xcode 專案，可組建為 iOS 應用程式。
  它相依於 `sharedLogic` 模組，該模組被匯出為 iOS 架構。
  使用 IDE 精靈建立的 Kotlin Multiplatform 專案透過 [直接整合](multiplatform-direct-integration.md) 使用一般的架構相依性。
* `sharedLogic` 是一個多平台模組，包含 Android 與 iOS 應用程式通用的邏輯。
* `sharedUI` 是包含 Compose Multiplatform UI 程式碼的模組：在此專案中，它僅由 Android 應用程式使用，
  但它是一個多平台模組，只要您需要，就可以被其他目標使用。

除了 `iosApp` 之外，每個模組都使用 Gradle 作為建構系統。

![基本 Multiplatform 專案結構](basic-project-structure.svg){width=700}

_原始碼集_（Source set）是一個 Gradle 概念，用於將多個檔案進行邏輯分組，其中每個分組都有自己的相依性。
在 Kotlin Multiplatform 中，共享模組中的不同原始碼集可以針對不同的平台。

`sharedLogic` 模組包含 `androidMain`、`commonMain` 與 `iosMain` 原始碼集。
`commonMain` 原始碼集包含共享的 Kotlin 程式碼，而平台特定的原始碼集則包含僅限於各平台的程式碼。
`androidMain` 使用 Kotlin/JVM，而 `iosMain` 使用 Kotlin/Native：

![原始碼集與模組結構](basic-project-structure-2.png){width=350}

當共享模組被組建為 Android 程式庫時，通用的 Kotlin 程式碼會被視為 Kotlin/JVM。
當它被組建為 iOS 架構時，通用的 Kotlin 則被視為 Kotlin/Native：

![通用 Kotlin、Kotlin/JVM 與 Kotlin/Native](modules-structure.png)

### 編寫通用宣告

通用原始碼集包含可以在多個目標平台之間使用的共享程式碼。
它旨在包含與平台無關的程式碼。如果您嘗試在通用原始碼集中使用平台特定的 API，
IDE 將顯示警告：

1. 開啟 `sharedLogic/src/commonMain/.../Greeting.kt` 檔案，
    您可以在其中找到帶有 `greet()` 函式的自動產生的 `Greeting` 類別。
2. 讓我們為問候語增加一點變化。導覽至 `GreetingUtil.kt` 檔案中 `sayHello()` 函式的定義。

3. 使用隨機化以及來自 Kotlin 標準函式庫的 `reversed()` 呼叫來更新共享程式碼，以反轉
   接收到的字串：

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord Guess what this is! > ${to.reversed()}!"
    }
    ```
4. 根據 IDE 的建議匯入 `kotlin.random.Random` 類別。

僅在通用 Kotlin 中編寫程式碼顯然有其限制，因為它無法使用任何平台特定的功能。
使用通用介面以及透過 [expect/actual](multiplatform-connect-to-apis.md) 機制的平台特定實作可以解決這個問題。

### 查看平台特定的實作

通用原始碼集可以定義預期宣告 — 介面、類別等。
在每個平台原始碼集中（在此案例中為 `androidMain` 與 `iosMain`），
您必須為預期宣告提供實際的平台特定實作。

在為特定平台產生程式碼時，Kotlin 編譯器會合併預期與實際宣告，
並產生帶有實際實作的單一宣告。

1. 使用 IntelliJ IDEA 建立 Kotlin Multiplatform 專案時，
   您會在 `sharedLogic/src/commonMain` 模組中獲得一個 `Platform.kt` 檔案：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   這是一個通用的 `Platform` 介面，旨在包含有關平台的資訊。

2. 您可以在 `androidMain` 與 `iosMain` 原始碼集中找到實作該介面的平台特定類別：
    
    ```kotlin
    // androidMain 原始碼集中的 Platform.android.kt
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // iosMain 原始碼集中的 Platform.ios.kt
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` 類別的 `name` 屬性使用了 Android 特有的程式碼，即 `android.os.Build`
      類別。這段程式碼被解釋為 Kotlin/JVM。
      如果您嘗試在此處存取 JVM 特有的類別（例如 `java.util.Random`），這段程式碼將可以編譯。
    * `IOSPlatform` 類別的 `name` 屬性使用了 iOS 特有的程式碼，即 `platform.UIKit.UIDevice`
      類別。這段程式碼被解釋為 Kotlin/Native，這代表您可以在 Kotlin 中參考 iOS 宣告。
      這段程式碼會成為 iOS 架構的一部分，並匯入到 `iosApp` 模組的 Swift 程式碼中。

3. 每個原始碼集都包含一個 `getPlatform()` 函式。
   它的 `expect` 宣告沒有主體，而 `actual` 實作則在平台程式碼中提供：

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

在這裡，通用原始碼集定義了一個預期的 `getPlatform()` 函式，並在平台原始碼集中分別擁有
Android 應用程式的 `AndroidPlatform()` 與 iOS 應用程式的 `IOSPlatform()` 實際實作。

在為特定平台產生程式碼時，Kotlin 編譯器會將 `expect` 與 `actual` 宣告合併為
帶有正確實作的單一 `getPlatform()` 函式。

這就是為什麼 `expect` 與 `actual` 宣告需要定義在同一個套件中 — 它們在最終的平台程式碼中被合併為一個宣告。
在產生的平台程式碼中對預期 `getPlatform()` 函式的任何呼叫，
都會指向正確的實際實作。

現在您可以執行應用程式並查看這一切的運作情況。

#### 建立一個 expect/actual 變數（選填） {initial-collapse-state="collapsed" collapsible="true"}

專案範本對函式使用了 expect/actual 機制，但它也適用於大多數 Kotlin 宣告，
例如屬性與類別。讓我們實作一個預期屬性：

1. 開啟 `commonMain` 模組中的 `Platform.kt`，並在檔案末尾新增以下內容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 編譯器會抱怨此屬性在平台模組中沒有對應的實際宣告。

2. 嘗試立即透過以下方式提供實作：

   ```kotlin
   expect val num: Int = 42
   ```

   您會收到一個錯誤，指出「預期屬性不得有初始設定式」，
   因為 `expect` 宣告必須沒有主體。
   實作必須在實際平台模組中提供。
3. 移除初始設定式。
4. 在 `androidMain/.../Platform.android.kt` 中新增 Android 實作如下：

    ```kotlin
    actual val num: Int = 1
    ```

5. 現在為 `iosMain` 模組中的 `num` 提供實際實作。
   將以下內容新增至 `iosMain/.../Platform.ios.kt` 檔案：

    ```kotlin
    actual val num: Int = 2
    ```

6. 在 `commonMain/.../GreetingUtil.kt` 檔案中，在 `sayHello()` 函式構成的字串中使用 `num` 屬性：

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord [$num] Guess what this is! > ${to.reversed()}!"
    }
    ```

## 執行您的應用程式

您可以從 IntelliJ IDEA 中為 Android 與 iOS 執行您的多平台應用程式。

如果您之前建立了選填的 expect/actual 屬性，您應該會看到 Android 的問候語中新增了 "[1]"，
而 iOS 則新增了 "[2]"。

### 在 Android 上執行您的應用程式

1. 在运行配置清單中，選擇 **androidApp**。
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

在 IntelliJ IDEA 中，於运行配置清單中選擇 **iosApp**，在运行配置旁選擇一個模擬裝置，
然後點擊 **Run**。

如果您清單中沒有可用的 iOS 配置，請啟動 Xcode 以填充可用的模擬器，
並重新啟動 IntelliJ IDEA。

![在 iOS 上執行多平台應用程式](compose-run-ios.png){width=350}

![iOS 上的第一個行動多平台應用程式](first-multiplatform-project-on-ios-1.png){width=350}

#### 在實體 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在實體 iOS 裝置上執行您的多平台應用程式。在開始之前，
您需要設定與您的 [Apple ID](https://support.apple.com/en-us/HT204316) 關聯的 Team ID。

##### 設定您的 Team ID

若要首次為您的專案設定新的 Team ID，請在 Xcode 中開啟專案
(**File | Open Project in Xcode**)：

1. 在左側的 Project navigator 中，選擇 **iosApp**。
2. 在 **Targets** 下選擇 **iosApp**，並切換至 **Signing & Capabilities** 索引標籤。
3. 在 **Team** 清單中，選擇您的團隊。

   如果您尚未設定團隊，請使用 **Team** 清單中的 **Add an Account** 選項並按照 Xcode 的指示操作。

4. 確保 Bundle Identifier 是唯一的，且 Signing Certificate 已成功指派。

在 Xcode 中設定團隊後，您可以在 IntelliJ IDEA 中設定或變更團隊：

1. 編輯 **iosApp** 的运行配置：

   ![編輯 iOS 运行配置](ios-edit-configurations.png){width=450}

2. 切換到 **Options** 索引標籤，在 **Development team** 下拉式選單中進行必要的更改，然後點擊 **OK**。

##### 執行應用程式

使用傳輸線連接您的 iPhone。如果您已經在 Xcode 中註冊了該裝置，IntelliJ IDEA 應該會將其顯示
在运行配置清單中。執行相對應的 `iosApp` 配置。

如果您尚未在 Xcode 中註冊您的 iPhone，請遵循 [Apple 的建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。
簡而言之，您應該：

1. Connect your iPhone with a cable.
2. 在您的 iPhone 上，於 **Settings** | **Privacy & Security** 中啟用開發者模式。
3. 在 Xcode 中，前往頂部選單並選擇 **Window** | **Devices and Simulators**。
4. 如果您的 iPhone 未顯示為已連接，點擊左下角的加號並選擇它。
5. 按照螢幕上的指示完成配對過程。

在 Xcode 中註冊 iPhone 後，當您選擇 **iosApp** 运行配置時，
它將出現在 IntelliJ IDEA 的可用裝置清單中。

## 下一步

在本教學的下一部分中，您將學習如何使用平台特定的程式庫來更新 UI 元件。

**[繼續下一步](multiplatform-update-ui.md)**

### 另請參閱

* 了解如何[建立並執行多平台測試](multiplatform-run-tests.md)以檢查程式碼是否正確運作。
* 進一步了解[專案結構](multiplatform-discover-project.md)。
* 如果您想將現有的 Android 專案轉換為跨平台應用程式，請[完成此教學以讓您的 Android 應用程式跨平台化](multiplatform-integrate-in-existing-app.md)。

## 獲取協助

* **Kotlin Slack**。獲取[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。