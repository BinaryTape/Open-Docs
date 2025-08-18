[//]: # (title: 讓你的 Android 應用程式在 iOS 上執行 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 Android Studio，但你也可以在 IntelliJ IDEA 中跟隨操作。若 <Links href="/kmp/quickstart" summary="undefined">設定妥當</Links>，
   兩款 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
</tldr>

本教程展示如何讓現有的 Android 應用程式跨平台，使其既能在 Android 又能在 iOS 上執行。
你將能夠在同一個地方，同時為 Android 和 iOS 編寫程式碼。

本教程使用一個 [範例 Android 應用程式](https://github.com/Kotlin/kmp-integration-sample)，它只有一個畫面，用於輸入使用者名稱和密碼。這些憑證會被驗證並儲存到一個記憶體資料庫中。

為了讓你的應用程式在 iOS 和 Android 上都能執行，
你將首先透過將部分程式碼移至共用模組來使其跨平台。
之後，你將在 Android 應用程式中使用你的跨平台程式碼，然後在新的 iOS 應用程式中使用相同的程式碼。

> 如果你不熟悉 Kotlin Multiplatform，請先學習如何[從頭開始建立一個跨平台應用程式](quickstart.md)。
>
{style="tip"}

## 準備開發環境

1. 在快速入門指南中，完成[設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的說明。

   > 你需要一台搭載 macOS 的 Mac 來完成本教程中的某些步驟，例如執行 iOS 應用程式。
   > 這是由於 Apple 的要求。
   >
   {style="note"}

2. 在 Android Studio 中，從版本控制建立一個新專案：

   ```text
   https://github.com/Kotlin/kmp-integration-sample
   ```

   > `master` 分支包含專案的初始狀態 – 一個簡單的 Android 應用程式。
   > 若要查看包含 iOS 應用程式和共用模組的最終狀態，請切換到 `final` 分支。
   >
   {style="tip"}

3. 切換到 **Project** 視圖：

   ![Project view](switch-to-project.png){width="513"}

## 讓你的程式碼跨平台

為了讓你的程式碼跨平台，你將遵循以下步驟：

1. [決定要讓哪些程式碼跨平台](#decide-what-code-to-make-cross-platform)
2. [為跨平台程式碼建立一個共用模組](#create-a-shared-module-for-cross-platform-code)
3. [測試程式碼共享](#add-code-to-the-shared-module)
4. [在你的 Android 應用程式中新增對共用模組的相依性](#add-a-dependency-on-the-shared-module-to-your-android-application)
5. [使業務邏輯跨平台](#make-the-business-logic-cross-platform)
6. [在 Android 上執行你的跨平台應用程式](#run-your-cross-platform-application-on-android)

### 決定要讓哪些程式碼跨平台

決定你的 Android 應用程式的哪些程式碼更適合與 iOS 共享，哪些適合保持原生。一個簡單的規則是：盡可能多地共享你想重用的程式碼。業務邏輯對於 Android 和 iOS 通常是相同的，因此它是重用的絕佳選擇。

在你的範例 Android 應用程式中，業務邏輯儲存在 `com.jetbrains.simplelogin.androidapp.data` 套件中。你未來的 iOS 應用程式將使用相同的邏輯，因此你也應該使其跨平台。

![Business logic to share](business-logic-to-share.png){width=366}

### 為跨平台程式碼建立一個共用模組

用於 iOS 和 Android 的跨平台程式碼將儲存在共用模組中。
Android Studio 和 IntelliJ IDEA 都提供了用於為 Kotlin Multiplatform 建立共用模組的精靈。

建立一個共用模組以連接到現有的 Android 應用程式和你未來的 iOS 應用程式：

1. 在 Android Studio 中，從主選單中選擇 **File** | **New** | **New Module**。
2. 在模板列表中，選擇 **Kotlin Multiplatform Shared Module**。
   將函式庫名稱保留為 `shared` 並輸入套件名稱：

   ```text
   com.jetbrains.simplelogin.shared
   ```

3. 點擊 **Finish**。精靈會建立一個共用模組，相應地更改建置腳本，並啟動 Gradle 同步。
4. 設定完成後，你將在 `shared` 目錄中看到以下檔案結構：

   ![Final file structure inside the shared directory](shared-directory-structure.png){width="341"}

5. 確保 `shared/build.gradle.kts` 檔案中的 `kotlin.androidLibrary.minSdk` 屬性與 `app/build.gradle.kts` 檔案中相同屬性的值相符。

### 將程式碼新增到共用模組

現在你有了共用模組，
將一些通用程式碼新增到 `commonMain/kotlin/com.jetbrains.simplelogin.shared` 目錄中以供共享：

1. 建立一個新的 `Greeting` 類別，包含以下程式碼：

    ```kotlin
    package com.jetbrains.simplelogin.shared

    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 將已建立檔案中的程式碼替換為以下內容：

     * 在 `commonMain/Platform.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         interface Platform {
             val name: String
         }
        
         expect fun getPlatform(): Platform
         ```

     * 在 `androidMain/Platform.android.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
         
         import android.os.Build

         class AndroidPlatform : Platform {
             override val name: String = "Android ${Build.VERSION.SDK_INT}"
         }

         actual fun getPlatform(): Platform = AndroidPlatform()
         ```
     * 在 `iosMain/Platform.ios.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         import platform.UIKit.UIDevice

         class IOSPlatform: Platform {
             override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
         }

         actual fun getPlatform(): Platform = IOSPlatform()
         ```

如果你想更好地理解結果專案的佈局，
請參閱 [Kotlin Multiplatform 專案結構的基礎知識](multiplatform-discover-project.md)。

### 在你的 Android 應用程式中新增對共用模組的相依性

要在你的 Android 應用程式中使用跨平台程式碼，請將共用模組連接到它，將業務邏輯程式碼移動到那裡，並使此程式碼跨平台。

1. 將共用模組的相依性新增到 `app/build.gradle.kts` 檔案中：

    ```kotlin
    dependencies {
        // ...
        implementation(project(":shared"))
    }
    ```

2. 根據 IDE 的建議或使用 **File** | **Sync Project with Gradle Files** 選單項目同步 Gradle 檔案。
3. 在 `app/src/main/java/` 目錄中，開啟 `com.jetbrains.simplelogin.androidapp.ui.login` 套件中的 `LoginActivity.kt` 檔案。
4. 為了確保共用模組已成功連接到你的應用程式，透過將 `Log.i()` 呼叫新增到 `onCreate()` 方法中，將 `greet()` 函數結果傾印到日誌：

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.i("Login Activity", "Hello from shared module: " + (Greeting().greet()))
   
        // ...
    }
    ```
5. 遵循 IDE 的建議來匯入缺少的類別。
6. 在工具列中，點擊 `app` 下拉式選單，然後點擊偵錯圖示：

   ![App from list to debug](app-list-android.png){width="300"}

7. 在 **Logcat** 工具視窗中，搜尋日誌中的「Hello」，你將找到來自共用模組的問候語：

   ![Greeting from the shared module](shared-module-greeting.png){width="700"}

### 使業務邏輯跨平台

你現在可以將業務邏輯程式碼提取到 Kotlin Multiplatform 共用模組中，並使其與平台無關。
這對於在 Android 和 iOS 上重用程式碼是必要的。

1. 將 `com.jetbrains.simplelogin.androidapp.data` 的業務邏輯程式碼從 `app` 目錄移動到 `shared/src/commonMain` 目錄中的 `com.jetbrains.simplelogin.shared` 套件。

   ![Drag and drop the package with the business logic code](moving-business-logic.png){width=300}

2. 當 Android Studio 詢問你想做什麼時，選擇移動套件，然後批准重構。

   ![Refactor the business logic package](refactor-business-logic-package.png){width=300}

3. 忽略所有關於平台相關程式碼的警告，然後點擊 **Refactor Anyway**。

   ![Warnings about platform-dependent code](warnings-android-specific-code.png){width=450}

4. 透過使用跨平台 Kotlin 程式碼替換 Android 特定程式碼或使用[預期與實際宣告](multiplatform-connect-to-apis.md)連接到 Android 特定 API 來移除 Android 特定程式碼。詳細資訊請參閱以下部分：

   #### 使用跨平台程式碼替換 Android 特定程式碼 {initial-collapse-state="collapsed" collapsible="true"}

   為了讓你的程式碼在 Android 和 iOS 上都能良好執行，請盡可能將移動後的 `data` 目錄中的所有 JVM 相依性替換為 Kotlin 相依性。

   1. 在 `LoginDataValidator` 類別中，用符合電子郵件驗證模式的 Kotlin 正則表達式替換來自 `android.utils` 套件的 `Patterns` 類別：

       ```kotlin
       // Before
       private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
       ```

       ```kotlin
       // After
       private fun isEmailValid(email: String) = emailRegex.matches(email)
       
       companion object {
           private val emailRegex = 
               ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                   "\\@" +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                   "(" +
                   "\\." +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                   ")+").toRegex()
       }
       ```

   2. 移除 `Patterns` 類別的匯入指令：

       ```kotlin
       import android.util.Patterns
       ```

   3. 在 `LoginDataSource` 類別中，將 `login()` 函數中的 `IOException` 替換為 `RuntimeException`。
      `IOException` 在 Kotlin/JVM 中不可用。

          ```kotlin
          // Before
          return Result.Error(IOException("Error logging in", e))
          ```

          ```kotlin
          // After
          return Result.Error(RuntimeException("Error logging in", e))
          ```

   4. 同時移除 `IOException` 的匯入指令：

       ```kotlin
       import java.io.IOException
       ```

   #### 從跨平台程式碼連接到平台特定 API {initial-collapse-state="collapsed" collapsible="true"}

   在 `LoginDataSource` 類別中，`fakeUser` 的全局唯一識別碼 (UUID) 是使用 `java.util.UUID` 類別生成的，該類別在 iOS 上不可用。

   ```kotlin
   val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
   ```

   儘管 Kotlin 標準函式庫提供了[用於 UUID 生成的實驗性類別](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)，
   但為了練習，讓我們為此案例使用平台特定功能。

   在共用程式碼中為 `randomUUID()` 函數提供 `expect` 宣告，並為每個平台（Android 和 iOS）在對應的原始碼集中提供其 `actual` 實作。
   你可以了解更多關於[連接到平台特定 API](multiplatform-connect-to-apis.md) 的資訊。

   1. 將 `login()` 函數中的 `java.util.UUID.randomUUID()` 呼叫更改為 `randomUUID()` 呼叫，你將為每個平台實作此函數：

       ```kotlin
       val fakeUser = LoggedInUser(randomUUID(), "Jane Doe")
       ```

   2. 在 `shared/src/commonMain` 目錄的 `com.jetbrains.simplelogin.shared` 套件中建立 `Utils.kt` 檔案並提供 `expect` 宣告：

       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       expect fun randomUUID(): String
       ```

   3. 在 `shared/src/androidMain` 目錄的 `com.jetbrains.simplelogin.shared` 套件中建立 `Utils.android.kt` 檔案並提供 Android 中 `randomUUID()` 的 `actual` 實作：

       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import java.util.*
      
       actual fun randomUUID() = UUID.randomUUID().toString()
       ```

   4. 在 `shared/src/iosMain` 目錄的 `com.jetbrains.simplelogin.shared` 套件中建立 `Utils.ios.kt` 檔案並提供 iOS 中 `randomUUID()` 的 `actual` 實作：

       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import platform.Foundation.NSUUID
      
       actual fun randomUUID(): String = NSUUID().UUIDString()
       ```

   5. 在 `shared/src/commonMain` 目錄的 `LoginDataSource.kt` 檔案中匯入 `randomUUID` 函數：

      ```kotlin
      import com.jetbrains.simplelogin.shared.randomUUID
      ```

現在，Kotlin 將為 Android 和 iOS 使用平台特定的 UUID 實作。

### 在 Android 上執行你的跨平台應用程式

執行你的 Android 跨平台應用程式，確保它像以前一樣正常運作。

![Android login application](android-login.png){width=300}

## 讓你的跨平台應用程式在 iOS 上執行

一旦你將 Android 應用程式設定為跨平台，你就可以建立一個 iOS 應用程式並在其中重用共用業務邏輯。

1. [在 Xcode 中建立 iOS 專案](#create-an-ios-project-in-xcode)
2. [設定 iOS 專案以使用 KMP 框架](#configure-the-ios-project-to-use-a-kmp-framework)
3. [在 Android Studio 中設定 iOS 執行設定](#set-up-an-ios-run-configuration-in-android-studio)
4. [在 iOS 專案中使用共用模組](#use-the-shared-module-in-the-ios-project)

### 在 Xcode 中建立 iOS 專案

1. 在 Xcode 中，點擊 **File** | **New** | **Project**。
2. 選擇 iOS 應用程式的模板，然後點擊 **Next**。

   ![iOS project template](ios-project-wizard-1.png){width=700}

3. 將產品名稱指定為「simpleLoginIOS」，然後點擊 **Next**。

   ![iOS project settings](ios-project-wizard-2.png){width=700}

4. 將專案位置選擇為儲存你的跨平台應用程式的目錄，例如 `kmp-integration-sample`。

在 Android Studio 中，你將獲得以下結構：

![iOS project in Android Studio](ios-project-in-as.png){width=194}

你可以將 `simpleLoginIOS` 目錄重新命名為 `iosApp`，以與你的跨平台專案的其他頂層目錄保持一致。
要做到這一點，請關閉 Xcode，然後將 `simpleLoginIOS` 目錄重新命名為 `iosApp`。
如果在 Xcode 開啟的情況下重新命名資料夾，你會收到警告並可能損壞你的專案。

![Renamed iOS project directory in Android Studio](ios-directory-renamed-in-as.png){width=194}

### 設定 iOS 專案以使用 KMP 框架

你可以直接設定 iOS 應用程式和 Kotlin Multiplatform 建置的框架之間的整合。
此方法的替代方案在 [iOS 整合方法概覽](multiplatform-ios-integration-overview.md)中介紹，但它們超出了本教程的範圍。

1. 在 Android Studio 中，右鍵點擊 `iosApp/simpleLoginIOS.xcodeproj` 目錄並選擇 **Open In** | **Open In Associated Application** 以在 Xcode 中開啟 iOS 專案。
2. 在 Xcode 中，透過雙擊 **Project** 導航器中的專案名稱來開啟 iOS 專案設定。

3. 在左側的 **Targets** 部分，選擇 **simpleLoginIOS**，然後點擊 **Build Phases** 標籤。

4. 點擊 **+** 圖示並選擇 **New Run Script Phase**。

    ![Add a run script phase](xcode-run-script-phase-1.png){width=700}

4. 將以下腳本貼到執行腳本欄位中：

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![Add the script](xcode-run-script-phase-2.png){width=700}

5. 停用 **Based on dependency analysis** 選項。

   這確保了 Xcode 在每次建置期間都執行腳本，並且不會每次都警告缺少輸出相依性。

6. 將 **Run Script** 階段向上移動，將其放置在 **Compile Sources** 階段之前：

   ![Move the Run Script phase](xcode-run-script-phase-3.png){width=700}

7. 在 **Build Settings** 標籤上，在 **Build Options** 下停用 **User Script Sandboxing** 選項：

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果你有不同於預設 `Debug` 或 `Release` 的自訂建置設定，在 **Build Settings**
   > 標籤上，在 **User-Defined** 下新增 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定並將其設定為 `Debug` 或 `Release`。
   >
   {style="note"}

8. 在 Xcode 中建置專案（主選單中的 **Product** | **Build**）。
    如果一切設定正確，專案應該會成功建置
    （你可以安全地忽略「build phase will be run during every build」警告）。

    > 如果你在停用 **User Script Sandboxing** 選項之前建置了專案，建置可能會失敗：
    > Gradle 精靈程序可能被沙箱化，需要重新啟動。
    > 在再次建置專案之前，透過在專案目錄（在我們的範例中是 `kmp-integration-sample`）中執行此指令來停止它：
    >
    > ```shell
    > ./gradlew --stop
    > ```
    >
    {style="note"}

### 在 Android Studio 中設定 iOS 執行設定

一旦你確保 Xcode 設定正確，返回 Android Studio：

1. 在主選單中選擇 **File | Sync Project with Gradle Files**。Android Studio 會自動生成一個名為 **simpleLoginIOS** 的執行設定。

   Android Studio 會自動生成一個名為 **simpleLoginIOS** 的執行設定，並將 `iosApp`
   目錄標記為連結的 Xcode 專案。

2. 在執行設定列表中，選擇 **simpleLoginIOS**。
   選擇一個 iOS 模擬器，然後點擊 **Run** 檢查 iOS 應用程式是否正常執行。

   ![The iOS run configuration in the list of run configurations](ios-run-configuration-simplelogin.png){width=400}

### 在 iOS 專案中使用共用模組

`shared` 模組的 `build.gradle.kts` 檔案為每個 iOS 目標定義了 `binaries.framework.baseName`
屬性為 `sharedKit`。
這是 Kotlin Multiplatform 為 iOS 應用程式建置並供其使用的框架名稱。

為了測試整合，在 Swift 程式碼中新增對通用程式碼的呼叫：

1. 在 Android Studio 中，開啟 `iosApp/simpleloginIOS/ContentView.swift` 檔案並匯入框架：

   ```swift
   import sharedKit
   ```

2. 為了檢查是否正確連接，將 `ContentView` 結構更改為使用你的跨平台應用程式共用模組中的 `greet()` 函數：

   ```swift
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greet())
           .padding()
       }
   }
   ```

3. 使用 Android Studio iOS 執行設定執行應用程式以查看結果：

   ![Greeting from the shared module](xcode-iphone-hello.png){width=300}

4. 再次更新 `ContentView.swift` 檔案中的程式碼，以使用共用模組中的業務邏輯來呈現應用程式 UI：

   ```kotlin
   
   ```

5. 在 `simpleLoginIOSApp.swift` 檔案中，匯入 `sharedKit` 模組並為 `ContentView()` 函數指定引數：

    ```swift
    import SwiftUI
    import sharedKit
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
    ```

6. 再次執行 iOS 執行設定，查看 iOS 應用程式顯示登入表單。
7. 輸入「Jane」作為使用者名稱，輸入「password」作為密碼。
8. 由於你[之前已經設定了整合](#configure-the-ios-project-to-use-a-kmp-framework)，
    iOS 應用程式會使用通用程式碼驗證輸入：

   ![Simple login application](xcode-iphone-login.png){width=300}

## 享受成果 – 只需更新一次邏輯

現在你的應用程式是跨平台的了。你可以在 `shared` 模組中更新業務邏輯，並在 Android 和 iOS 上都看到結果。

1. 更改使用者密碼的驗證邏輯：「password」不應該是一個有效選項。
    為此，請更新 `LoginDataValidator` 類別的 `checkPassword()` 函數
    （要快速找到它，按兩次 <shortcut>Shift</shortcut>，貼上類別名稱，然後切換到 **Classes** 標籤）：

   ```kotlin
   package com.jetbrains.simplelogin.shared.data
   
   class LoginDataValidator {
   //...
       fun checkPassword(password: String): Result {
           return when {
               password.length < 5 -> Result.Error("Password must be >5 characters")
               password.lowercase() == "password" -> Result.Error("Password shouldn't be \"password\"")
               else -> Result.Success
           }
       }
   //...
   }
   ```

2. 從 Android Studio 執行 iOS 和 Android 應用程式以查看更改：

   ![Android and iOS applications password error](android-iphone-password-error.png){width=600}

你可以查看[本教程的最終程式碼](https://github.com/Kotlin/kmp-integration-sample/tree/final)。

## 還能共享什麼？

你已經共享了應用程式的業務邏輯，但你也可以決定共享應用程式的其他層。
例如，`ViewModel` 類別的程式碼對於 [Android](https://github.com/Kotlin/kmp-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt)
和 [iOS 應用程式](https://github.com/Kotlin/kmp-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L84)幾乎相同，
如果你的行動應用程式應該具有相同的呈現層，你可以共享它。

## 接下來是什麼？

一旦你將 Android 應用程式設定為跨平台，你就可以繼續：

*   [新增對多平台函式庫的相依性](multiplatform-add-dependencies.md)
*   [新增 Android 相依性](multiplatform-android-dependencies.md)
*   [新增 iOS 相依性](multiplatform-ios-dependencies.md)

你可以使用 Compose Multiplatform 建立跨所有平台的統一 UI：

*   [了解 Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)
*   [探索 Compose Multiplatform 的可用資源](compose-multiplatform-resources.md)
*   [建立具有共享邏輯和 UI 的應用程式](compose-multiplatform-create-first-app.md)

你也可以查看社群資源：

*   [影片：如何將 Android 專案遷移到 Kotlin Multiplatform](https://www.youtube.com/watch?v=vb-Pt8SdfEE&t=1s)
*   [影片：3 種方法讓你的 Kotlin JVM 程式碼為 Kotlin Multiplatform 做好準備](https://www.youtube.com/watch?v=X6ckI1JWjqo)