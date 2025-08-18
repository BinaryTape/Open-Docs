[//]: # (title: 使用平台特定 API)

在本文中，您將學習如何在開發多平台應用程式和函式庫時使用平台特定 API。

## Kotlin 多平台函式庫

在編寫使用平台特定 API 的程式碼之前，請檢查是否可以使用多平台函式庫來替代。這類函式庫提供一個通用的 Kotlin API，其針對不同平台具有不同的實作。

目前已有許多可用的函式庫，可用於實作網路、日誌記錄、分析，以及存取裝置功能等。欲了解更多資訊，請參閱[此精選清單](https://github.com/terrakok/kmm-awesome)。

## 預期與實際函式和屬性

Kotlin 提供一種語言機制，可在開發通用邏輯時存取平台特定 API：
[預期與實際宣告](multiplatform-expect-actual.md)。

透過此機制，多平台模組的通用原始碼集定義一個預期宣告，每個平台原始碼集都必須提供與該預期宣告對應的實際宣告。編譯器確保在通用原始碼集中標記為 `expect` 關鍵字的每個宣告，在所有目標平台原始碼集中都有對應標記為 `actual` 關鍵字的宣告。

這適用於大多數 Kotlin 宣告，例如函式、類別、介面、列舉、屬性和註解。本節著重於使用預期與實際函式和屬性。

![使用預期與實際函式和屬性](expect-functions-properties.svg){width=700}

在此範例中，您將在通用原始碼集中定義一個預期 `platform()` 函式，並在平台原始碼集中提供實際實作。在為特定平台產生程式碼時，Kotlin 編譯器會合併預期與實際宣告。它會產生一個 `platform()` 函式及其實際實作。預期與實際宣告應定義在相同的套件中，並在產生後的平台程式碼中合併成 _一個宣告_。任何在產生後的平台程式碼中呼叫預期 `platform()` 函式的動作，都將呼叫正確的實際實作。

### 範例：產生 UUID

假設您正在使用 Kotlin Multiplatform 開發 iOS 和 Android 應用程式，並且想要產生一個通用唯一識別碼 (UUID)。

為此，請在您的 Kotlin 多平台模組的通用原始碼集中，使用 `expect` 關鍵字宣告預期函式 `randomUUID()`。請**勿**包含任何實作程式碼。

```kotlin
// 在通用原始碼集中：
expect fun randomUUID(): String
```

在每個平台特定原始碼集（iOS 和 Android）中，提供通用模組中預期函式 `randomUUID()` 的實際實作。使用 `actual` 關鍵字來標記這些實際實作。

![使用預期與實際宣告產生 UUID](expect-generate-uuid.svg){width=700}

以下程式碼片段顯示 Android 和 iOS 的實作。平台特定程式碼使用 `actual` 關鍵字和函式的相同名稱：

```kotlin
// 在 android 原始碼集中：
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// 在 iOS 原始碼集中：
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Android 實作使用 Android 上可用的 API，而 iOS 實作則使用 iOS 上可用的 API。您可以從 Kotlin/Native 程式碼存取 iOS API。

在為 Android 產生最終平台程式碼時，Kotlin 編譯器會自動合併預期與實際宣告，並產生一個單一的 `randomUUID()` 函式及其實際的 Android 特定實作。iOS 也會重複相同的過程。

為求簡潔，本範例及後續範例均使用簡化後的原始碼集名稱「common」、「ios」和「android」。通常，這意味著 `commonMain`、`iosMain` 和 `androidMain`，類似的邏輯也可以在測試原始碼集 `commonTest`、`iosTest` 和 `androidTest` 中定義。

與預期與實際函式類似，預期與實際屬性允許您在不同平台上使用不同的值。預期與實際函式和屬性最適用於簡單情況。

## 通用程式碼中的介面

如果平台特定邏輯過於龐大和複雜，您可以透過在通用程式碼中定義一個介面來表示它，然後在平台原始碼集中提供不同的實作，從而簡化您的程式碼。

![使用介面](expect-interfaces.svg){width=700}

平台原始碼集中的實作使用其相應的依賴項：

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

當您需要通用介面時，若要注入適當的平台實作，您可以選擇以下其中一個選項，每個選項都將在下方更詳細地解釋：

* [使用預期與實際函式](#expected-and-actual-functions)
* [透過不同進入點提供實作](#different-entry-points)
* [使用依賴注入框架](#dependency-injection-framework)

### 預期與實際函式

定義一個返回此介面值的預期函式，然後定義返回其子類別的實際函式：

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

當您在通用程式碼中呼叫 `platform()` 函式時，它可以處理 `Platform` 類型的物件。當您在 Android 上執行此通用程式碼時，`platform()` 呼叫會返回 `AndroidPlatform` 類別的實例。當您在 iOS 上執行時，`platform()` 會返回 `IOSPlatform` 類別的實例。

### 不同進入點

如果您控制進入點，則無需使用預期與實際宣告即可建構每個平台產物的實作。為此，請在共享的 Kotlin 多平台模組中定義平台實作，但在平台模組中實例化它們：

```kotlin
// 共享的 Kotlin 多平台模組
// 在 commonMain 原始碼集中：
interface Platform

fun application(p: Platform) {
    // 應用程式邏輯
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
// 在 iosApp 平台模組中（使用 Swift）：
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

在 Android 上，您應該建立一個 `AndroidPlatform` 實例並將其傳遞給 `application()` 函式；而在 iOS 上，您也應該類似地建立並傳遞一個 `IOSPlatform` 實例。這些進入點不一定是您應用程式的進入點，但這是您可以呼叫共享模組特定功能的地方。

透過預期與實際函式或直接透過進入點提供正確的實作，對於簡單情境效果良好。但是，如果您的專案中使用依賴注入框架，我們建議在簡單情況下也使用它，以確保一致性。

### 依賴注入框架

現代應用程式通常使用依賴注入 (DI) 框架來建立鬆散耦合的架構。DI 框架允許根據當前環境將依賴項注入元件中。

任何支援 Kotlin Multiplatform 的 DI 框架都可以幫助您為不同平台注入不同的依賴項。

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

在這裡，Koin DSL 用於建立模組，這些模組定義了用於注入的元件。您在通用程式碼中用 `expect` 關鍵字宣告一個模組，然後使用 `actual` 關鍵字為每個平台提供平台特定實作。框架會負責在執行時期選擇正確的實作。

當您使用 DI 框架時，所有依賴項都會透過此框架注入。相同的邏輯也適用於處理平台依賴項。如果您的專案中已經有 DI 框架，我們建議您繼續使用它，而不是手動使用預期與實際函式。這樣可以避免混用兩種不同的依賴注入方式。

您也不必總是在 Kotlin 中實作通用介面。您可以在不同的 _平台模組_ 中使用另一種語言（例如 Swift）來實作。如果您選擇這種方法，則應該從 iOS 平台模組中提供實作，並使用 DI 框架：

![使用依賴注入框架](expect-di-framework.svg){width=700}

這種方法僅在您將實作放在平台模組中時才有效。它不太具擴展性，因為您的 Kotlin 多平台模組無法自給自足，並且您需要將通用介面在不同的模組中實作。

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 接下來是什麼？

* 觀看 [在 KMP 應用程式中使用平台特定 API](https://youtu.be/bSNumV04y_w) 的影片教學。
* 如需了解 expect/actual 機制的更多範例和資訊，請參閱[預期與實際宣告](multiplatform-expect-actual.md)。