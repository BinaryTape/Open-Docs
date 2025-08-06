[//]: # (title: 使用平台專用 API)

在本文中，您將學習如何在開發多平台應用程式和函式庫時使用平台專用 API。

## Kotlin 多平台函式庫

在撰寫使用平台專用 API 的程式碼之前，請先檢查是否可以使用多平台函式庫。這種類型的函式庫提供了一個通用的 Kotlin API，針對不同的平台有不同的實作。

已有許多可用的函式庫，您可以用來實作網路、日誌記錄和分析，以及存取裝置功能等等。欲了解更多資訊，請參閱 [此精選清單](https://github.com/terrakok/kmm-awesome)。

## 預期與實際函數和屬性

Kotlin 提供了一種語言機制，用於在開發通用邏輯時存取平台專用 API：[預期與實際宣告](multiplatform-expect-actual.md)。

透過此機制，多平台模組的通用原始碼集定義了一個預期宣告，而每個平台原始碼集必須提供與該預期宣告對應的實際宣告。編譯器確保通用原始碼集中每個標記有 `expect` 關鍵字的宣告，在所有目標平台原始碼集中都有對應的 `actual` 關鍵字標記的宣告。

這適用於大多數 Kotlin 宣告，例如函數、類別、介面、列舉、屬性和註解。本節著重於使用預期與實際函數和屬性。

![使用預期與實際函數和屬性](expect-functions-properties.svg){width=700}

在此範例中，您將在通用原始碼集中定義一個預期 `platform()` 函數，並在平台原始碼集中提供實際實作。在為特定平台產生程式碼時，Kotlin 編譯器會合併預期與實際宣告。它會產生一個 `platform()` 函數及其實際實作。預期與實際宣告應在相同的套件中定義，並在產生的平台程式碼中合併為 _一個宣告_。在產生的平台程式碼中，任何對預期 `platform()` 函數的呼叫都將呼叫正確的實際實作。

### 範例：產生 UUID

假設您正在使用 Kotlin Multiplatform 開發 iOS 和 Android 應用程式，並想產生一個通用唯一識別碼 (UUID)。

為此，在您的 Kotlin 多平台模組的通用原始碼集中，使用 `expect` 關鍵字宣告預期函數 `randomUUID()`。請**勿**包含任何實作程式碼。

```kotlin
// 在通用原始碼集中：
expect fun randomUUID(): String
```

在每個特定平台原始碼集（iOS 和 Android）中，為通用模組中預期的 `randomUUID()` 函數提供實際實作。使用 `actual` 關鍵字標記這些實際實作。

![使用預期與實際宣告產生 UUID](expect-generate-uuid.svg){width=700}

以下片段顯示了 Android 和 iOS 的實作。特定平台程式碼使用 `actual` 關鍵字和相同的函數名稱：

```kotlin
// 在 Android 原始碼集中：
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// 在 iOS 原始碼集中：
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Android 實作使用 Android 上可用的 API，而 iOS 實作使用 iOS 上可用的 API。您可以從 Kotlin/Native 程式碼存取 iOS API。

在為 Android 產生最終平台程式碼時，Kotlin 編譯器會自動合併預期與實際宣告，並產生一個單一的 `randomUUID()` 函數及其實際的 Android 專用實作。iOS 也重複相同的流程。

為求簡化，此範例及以下範例均使用簡化後的原始碼集名稱「common」、「ios」和「android」。通常，這表示 `commonMain`、`iosMain` 和 `androidMain`，類似的邏輯也可以在測試原始碼集 `commonTest`、`iosTest` 和 `androidTest` 中定義。

與預期與實際函數類似，預期與實際屬性允許您在不同平台上使用不同的值。預期與實際函數和屬性對於簡單情況最有用。

## 通用程式碼中的介面

如果特定平台邏輯過於龐大且複雜，您可以透過在通用程式碼中定義一個介面來表示它，然後在平台原始碼集中提供不同的實作來簡化您的程式碼。

![使用介面](expect-interfaces.svg){width=700}

平台原始碼集中的實作使用其對應的依賴項：

```kotlin
// 在 commonMain 原始碼集中：
interface Platform {
    val name: String
}
```

```kotlin
// 在 androidMain 原始碼集中：
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// 在 iosMain 原始碼集中：
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

當您需要通用介面時，要注入適當的平台實作，您可以選擇以下選項之一，每個選項都將在下方詳細解釋：

* [使用預期與實際函數](#expected-and-actual-functions)
* [透過不同進入點提供實作](#different-entry-points)
* [使用依賴注入框架](#dependency-injection-framework)

### 預期與實際函數

定義一個回傳此介面的一個值的預期函數，然後定義回傳其子類別的實際函數：

```kotlin
// 在 commonMain 原始碼集中：
interface Platform

expect fun platform(): Platform
```

```kotlin
// 在 androidMain 原始碼集中：
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// 在 iosMain 原始碼集中：
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

當您在通用程式碼中呼叫 `platform()` 函數時，它可以使用 `Platform` 類型的物件。當您在 Android 上執行此通用程式碼時，`platform()` 呼叫會回傳 `AndroidPlatform` 類別的實例。當您在 iOS 上執行時，`platform()` 會回傳 `IOSPlatform` 類別的實例。

### 不同進入點

如果您控制進入點，您可以建構每個平台構件的實作，而無需使用預期與實際宣告。為此，在共享的 Kotlin 多平台模組中定義平台實作，但在平台模組中實例化它們：

```kotlin
// 共享的 Kotlin 多平台模組
// 在 commonMain 原始碼集中：
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// 在 androidMain 原始碼集中：
class AndroidPlatform : Platform
```

```kotlin
// 在 iosMain 原始碼集中：
class IOSPlatform : Platform
```

```kotlin
// 在 androidApp 平台模組中：
import android.app.Application
import mysharedpackage.*

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        application(AndroidPlatform())
    }
}
```

```Swift
// 在 iosApp 平台模組中 (使用 Swift)：
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

在 Android 上，您應該建立 `AndroidPlatform` 的實例並將其傳遞給 `application()` 函數，而在 iOS 上，您也應同樣地建立並傳遞 `IOSPlatform` 的實例。這些進入點不一定是您應用程式的進入點，但這是您可以呼叫共享模組特定功能的地方。

透過預期與實際函數或直接透過進入點提供正確的實作，對於簡單情境而言運作良好。然而，如果您在專案中使用依賴注入框架，我們建議在簡單情況下也使用它以確保一致性。

### 依賴注入框架

現代應用程式通常使用依賴注入 (DI) 框架來建立鬆散耦合架構。DI 框架允許根據目前環境將依賴項注入到元件中。

任何支援 Kotlin Multiplatform 的 DI 框架都可以幫助您為不同平台注入不同依賴項。

例如，[Koin](https://insert-koin.io/) 是一個支援 Kotlin Multiplatform 的依賴注入框架：

```kotlin
// 在通用原始碼集中：
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// 在 androidMain 原始碼集中：
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// 在 iosMain 原始碼集中：
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

在這裡，Koin 領域特定語言 (DSL) 建立模組，定義用於注入的元件。您在通用程式碼中用 `expect` 關鍵字宣告一個模組，然後使用 `actual` 關鍵字為每個平台提供一個特定平台實作。該框架負責在執行時選擇正確的實作。

當您使用 DI 框架時，所有依賴項都會透過此框架注入。相同的邏輯適用於處理平台依賴項。如果您專案中已有 DI 框架，我們建議繼續使用它，而不是手動使用預期與實際函數。這樣可以避免混合兩種不同方式注入依賴項。

您也不必總是在 Kotlin 中實作通用介面。您可以在另一種語言（例如 Swift）中，在不同的 _平台模組_ 中執行此操作。如果您選擇這種方法，那麼您應該使用 DI 框架從 iOS 平台模組中提供實作：

![使用依賴注入框架](expect-di-framework.svg){width=700}

這種方法僅在您將實作放在平台模組中時才有效。它不是很可擴展，因為您的 Kotlin Multiplatform 模組無法自給自足，並且您需要在不同的模組中實作通用介面。

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 下一步是什麼？

* 觀看 [在 KMP 應用程式中使用平台專用 API] 的影片教學 (https://youtu.be/bSNumV04y_w)。
* 有關預期/實際機制的更多範例和資訊，請參閱 [預期與實際宣告](multiplatform-expect-actual.md)。