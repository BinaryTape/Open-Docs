[//]: # (title: 與 Swift/Objective-C 的互通性)

> Objective-C 函式庫的匯入功能處於 [Beta](native-c-interop-stability.md) 階段。
> 所有由 cinterop 工具從 Objective-C 函式庫產生的 Kotlin 宣告
> 都應該具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台函式庫（如 Foundation、UIKit 和 POSIX）
> 僅針對部分 API 需要選擇啟用。
>
{style="note"}

Kotlin/Native 透過 Objective-C 提供與 Swift 的間接互通性。本文檔涵蓋了如何在 Swift/Objective-C 程式碼中使用 Kotlin
宣告，以及如何在 Kotlin 程式碼中使用 Objective-C 宣告。

您可能會發現有用的其他資源：

*   [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，一個關於如何在 Swift 程式碼中使用 Kotlin 宣告的範例集合。
*   [與 Swift/Objective-C ARC 整合](native-arc-integration.md) 章節，涵蓋 Kotlin 追蹤式 GC 與 Objective-C ARC 之間整合的細節。

## 將 Swift/Objective-C 函式庫匯入 Kotlin

Objective-C 框架和函式庫可在 Kotlin 程式碼中使用，前提是它們已正確匯入建置（系統框架預設會匯入）。
更多細節請參閱：

*   [建立並配置函式庫定義檔](native-definition-file.md)
*   [配置原生函式庫的編譯](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

如果 Swift 函式庫的 API 使用 `@objc` 匯出到 Objective-C，則可以在 Kotlin 程式碼中使用。
純粹的 Swift 模組尚不支援。

## 在 Swift/Objective-C 中使用 Kotlin

Kotlin 模組如果編譯為框架，則可以在 Swift/Objective-C 程式碼中使用：

*   請參閱 [建置最終原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)，了解如何宣告二進位檔。
*   查看 [Kotlin Multiplatform 範例專案](https://github.com/Kotlin/kmm-basic-sample) 以獲取範例。

### 從 Objective-C 和 Swift 隱藏 Kotlin 宣告

<primary-label ref="experimental-opt-in"/>

為了讓您的 Kotlin 程式碼更符合 Swift/Objective-C 習慣，請使用 `@HiddenFromObjC` 註解來隱藏 Objective-C 和 Swift 中的 Kotlin 宣告。它會停用函數或屬性匯出到 Objective-C。

或者，您可以使用 `internal` 修飾符標記 Kotlin 宣告，以限制它們在編譯模組中的可見性。如果您希望從 Objective-C 和 Swift 隱藏 Kotlin 宣告，同時讓它對其他 Kotlin 模組可見，請使用 `@HiddenFromObjC`。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### 在 Swift 中使用精簡功能

<primary-label ref="experimental-opt-in"/>

`@ShouldRefineInSwift` 有助於將 Kotlin 宣告替換為使用 Swift 編寫的包裝器。該註解會將函數或屬性在產生的 Objective-C API 中標記為 `swift_private`。這些宣告會加上 `__` 前綴，使其在 Swift 中不可見。

您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友好的 API，但它們不會在 Xcode 自動完成中建議。

*   有關在 Swift 中精簡 Objective-C 宣告的更多資訊，請參閱 [官方 Apple 文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
*   有關如何使用 `@ShouldRefineInSwift` 註解的範例，請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

### 更改宣告名稱

<primary-label ref="experimental-opt-in"/>

為避免重新命名 Kotlin 宣告，請使用 `@ObjCName` 註解。它指示 Kotlin 編譯器為被註解的類別、介面或其他 Kotlin 實體使用自訂的 Objective-C 和 Swift 名稱：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// Usage with the ObjCName annotations
let array = MySwiftArray()
let index = array.index(of: "element")
```

[請參閱 Kotlin-Swift 互通百科中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### 使用 KDoc 註解提供文件

文件對於理解任何 API 至關重要。為共享的 Kotlin API 提供文件可讓您與其使用者就使用方式、注意事項等進行溝通。

在產生 Objective-C 標頭時，Kotlin 程式碼中的 [KDoc](kotlin-doc.md) 註解會轉換為對應的 Objective-C 註解。例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

將產生一個包含對應註解的 Objective-C 標頭：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 註解會嵌入到 klibs 中，並從 klibs 提取到產生的 Apple 框架中。
因此，類別和方法的註解會在 Xcode 等自動完成時顯示。
如果您前往 `.h` 檔案中的函數定義，您將看到關於 `@param`、`@return` 等標籤的註解。

已知限制：

*   依賴項文件不會匯出，除非它本身也使用 `-Xexport-kdoc` 選項進行編譯。使用此編譯器選項編譯的函式庫可能與其他編譯器版本不相容。
*   KDoc 註解主要按原樣匯出，但許多 KDoc 區塊標籤（例如 `@property`）不支援。

如有需要，您可以在 Gradle 建置檔案的 `binaries {}` 區塊中停用 KDoc 註解從 klibs 匯出到產生的 Apple 框架：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

## 映射

下表顯示了 Kotlin 概念如何映射到 Swift/Objective-C，反之亦然。

「->」和「<-」表示映射僅單向進行。

| Kotlin                 | Swift                            | Objective-C                      | 備註                                                                              |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [備註](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [備註](#initializers)                                                              |
| Property               | Property                         | Property                         | [備註 1](#top-level-functions-and-properties), [備註 2](#setters)                  |
| Method                 | Method                           | Method                           | [備註 1](#top-level-functions-and-properties), [備註 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [備註](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [備註 1](#errors-and-exceptions), [備註 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [備註](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [備註](#extensions-and-category-members)                                           |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [備註](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [備註](#primitive-types)                                                           |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [備註](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [備註](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [備註](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [備註](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [備註](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [備註](#unsupported)                                                               |

### 類別 (Classes)

#### 名稱翻譯

Objective-C 類別會以其原始名稱匯入 Kotlin。
協定會以 `Protocol` 名稱後綴作為介面匯入，例如，`@protocol Foo` -> `interface FooProtocol`。
這些類別和介面會放置在 [建置配置中指定](#importing-swift-objective-c-libraries-to-kotlin) 的套件中（預配置系統框架為 `platform.*` 套件）。

Kotlin 類別和介面的名稱在匯入 Objective-C 時會加上前綴。
該前綴源自框架名稱。

Objective-C 不支援框架中的套件。如果 Kotlin 編譯器在同一個框架中發現具有相同名稱但不同套件的 Kotlin 類別，它會重新命名它們。此演算法尚不穩定，可能會在 Kotlin 版本之間更改。為解決此問題，您可以重新命名框架中衝突的 Kotlin 類別。

#### 強連結

每當您在 Kotlin 原始碼中使用 Objective-C 類別時，它都會被標記為強連結符號。產生的建置產物會將相關符號提及為強外部參照。

這意味著應用程式在啟動期間會嘗試動態連結符號，如果它們不可用，應用程式就會崩潰。
即使從未使用過這些符號，崩潰也會發生。這些符號可能在特定裝置或作業系統版本上不可用。

為了解決此問題並避免「符號未找到」錯誤，請使用 Swift 或 Objective-C 包裝器來檢查類別是否實際可用。[請參閱 Compose Multiplatform 框架中此解決方案的實作方式](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始化器 (Initializers)

Swift/Objective-C 初始化器會作為建構子或名為 `create` 的工廠方法匯入 Kotlin。
後者發生在 Objective-C 類別或 Swift 擴展中宣告的初始化器，因為 Kotlin 沒有擴展建構子的概念。

> 在將 Swift 初始化器匯入 Kotlin 之前，請不要忘記使用 `@objc` 註解它們。
>
{style="tip"}

Kotlin 建構子會作為初始化器匯入 Swift/Objective-C。

### 設定器 (Setters)

可寫入的 Objective-C 屬性如果覆寫了父類別的唯讀屬性，則會以屬性 `foo` 的 `setFoo()` 方法來表示。對於實作為可變的協定唯讀屬性也是如此。

### 頂層函數和屬性

頂層 Kotlin 函數和屬性可作為特殊類別的成員存取。
每個 Kotlin 檔案都會被翻譯成這樣的類別，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然後您可以像這樣從 Swift 呼叫 `foo()` 函數：

```swift
MyLibraryUtilsKt.foo()
```

請參閱 Kotlin-Swift 互通百科中存取頂層 Kotlin 宣告的範例集合：

*   [頂層函數](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [頂層唯讀屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [頂層可變屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 方法名稱翻譯

一般而言，Swift 引數標籤和 Objective-C 選擇器片段會映射到 Kotlin 參數名稱。這兩個概念具有不同的語意，因此有時 Swift/Objective-C 方法可能會因 Kotlin 簽章衝突而匯入。
在這種情況下，衝突的方法可以使用命名引數從 Kotlin 呼叫，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它是：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函數如何映射到 Swift/Objective-C 的方式：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[請參閱 Kotlin-Swift 互通百科中資料類別的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

您可以在 Swift 或 Objective-C 中指定一個更慣用的名稱，而不是使用 [`@ObjCName` 註解](#change-declaration-names) 重新命名 Kotlin 宣告。

### 錯誤與例外 (Errors and exceptions)

所有 Kotlin 例外都是未檢查的，這意味著錯誤是在執行時捕捉的。然而，Swift 只有已檢查錯誤，這些錯誤是在編譯時處理的。因此，如果 Swift 或 Objective-C 程式碼呼叫一個會拋出例外的 Kotlin 方法，該 Kotlin 方法應該使用 `@Throws` 註解標記，並指定一個「預期」例外類別的列表。

當編譯到 Swift/Objective-C 框架時，具有或繼承 `@Throws` 註解的非 `suspend` 函數在 Objective-C 中表示為產生 `NSError*` 的方法，在 Swift 中表示為 `throws` 方法。
`suspend` 函數的表示總是具有完成處理器中的 `NSError*`/`Error` 參數。

當從 Swift/Objective-C 程式碼呼叫的 Kotlin 函數拋出一個例外，該例外是 `@Throws` 指定的類別之一或其子類別的實例時，該例外會作為 `NSError` 傳播。
到達 Swift/Objective-C 的其他 Kotlin 例外被視為未處理，並導致程式終止。

沒有 `@Throws` 的 `suspend` 函數只傳播 `CancellationException`（作為 `NSError`）。
沒有 `@Throws` 的非 `suspend` 函數根本不傳播 Kotlin 例外。

請注意，相反的翻譯尚未實作：Swift/Objective-C 拋出錯誤的方法不會作為拋出例外的 Kotlin 方法匯入。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 列舉 (Enums)

Kotlin 列舉會匯入 Objective-C 為 `@interface`，匯入 Swift 為 `class`。
這些資料結構具有對應每個列舉值的屬性。考慮以下 Kotlin 程式碼：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

您可以從 Swift 存取此列舉類別的屬性，如下所示：

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

要在 Swift 的 `switch` 陳述式中使用 Kotlin 列舉的變數，請提供一個 `default` 陳述式以防止編譯錯誤：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[請參閱 Kotlin-Swift 互通百科中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 暫停函數 (Suspending functions)

<primary-label ref="experimental-opt-in"/>

Kotlin 的[暫停函數](coroutines-basics.md) (`suspend`) 在產生的 Objective-C 標頭中以帶有回呼的函數形式呈現，或以 Swift/Objective-C 術語中的[完成處理器](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)形式呈現。

從 Swift 5.5 開始，Kotlin 的 `suspend` 函數也可以作為 `async` 函數從 Swift 呼叫，而無需使用完成處理器。目前，此功能仍高度實驗性，並具有某些限制。請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610) 以獲取詳細資訊。

*   了解更多關於 Swift 文件中的 [`async`/`await` 機制](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)。
*   請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md) 中的範例和有關實作相同功能的第三方函式庫的建議。

### 擴展與類別成員 (Extensions and category members)

Objective-C 類別和 Swift 擴展的成員通常會作為擴展匯入 Kotlin。這就是為什麼這些宣告在 Kotlin 中無法覆寫，以及擴展初始化器無法作為 Kotlin 建構子使用的原因。

> 目前有兩個例外。從 Kotlin 1.8.20 開始，在與 NSView 類別（來自 AppKit 框架）或 UIView 類別（來自 UIKit 框架）相同的標頭中宣告的類別成員會作為這些類別的成員匯入。這意味著您可以覆寫從 NSView 或 UIView 子類別化的方法。
>
{style="note"}

Kotlin 對「常規」Kotlin 類別的擴展會分別匯入 Swift 和 Objective-C 作為擴展和類別成員。Kotlin 對其他類型的擴展則視為 [頂層宣告](#top-level-functions-and-properties)，並帶有額外的接收者參數。這些類型包括：

*   Kotlin `String` 類型
*   Kotlin 集合類型和子類型
*   Kotlin `interface` 類型
*   Kotlin 基本型別
*   Kotlin `inline` 類別
*   Kotlin `Any` 類型
*   Kotlin 函數型別和子類型
*   Objective-C 類別和協定

[請參閱 Kotlin-Swift 互通百科中的範例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 單例 (Kotlin singletons)

Kotlin 單例（使用 `object` 宣告建立，包括 `companion object`）會匯入 Swift/Objective-C 為具有單一實例的類別。

該實例可透過 `shared` 和 `companion` 屬性取得。

對於以下 Kotlin 程式碼：

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

存取這些物件的方式如下：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> 透過 `[MySingleton mySingleton]` 在 Objective-C 中和 `MySingleton()` 在 Swift 中存取物件已被棄用。
>
{style="note"}

請參閱 Kotlin-Swift 互通百科中的更多範例：

*   [如何使用 `shared` 存取 Kotlin 物件](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [如何從 Swift 存取 Kotlin 伴隨物件的成員](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### 基本型別 (Primitive types)

Kotlin 基本型別的裝箱會映射到特殊的 Swift/Objective-C 類別。例如，`kotlin.Int` 裝箱在 Swift 中表示為 `KotlinInt` 類別實例（或在 Objective-C 中表示為 `${prefix}Int` 實例，其中 `prefix` 是框架的名稱前綴）。
這些類別源自 `NSNumber`，因此實例是支援所有相應操作的適當 `NSNumber`。

當 `NSNumber` 用作 Swift/Objective-C 參數型別或回傳值時，它不會自動翻譯為 Kotlin 基本型別。原因是 `NSNumber` 型別未提供足夠關於包裝的基本值型別資訊，例如，靜態上不知道 `NSNumber` 是 `Byte`、`Boolean` 還是 `Double`。因此，Kotlin 基本值應[手動轉換為和從 `NSNumber` 轉換](#casting-between-mapped-types)。

### 字串 (Strings)

當 Kotlin `String` 傳遞給 Swift 時，它首先會匯出為 Objective-C 物件，然後 Swift 編譯器會再次複製它以進行 Swift 轉換。這會導致額外的執行時間開銷。

為避免這種情況，請直接將 Kotlin 字串作為 Objective-C `NSString` 存取。
[請參閱轉換範例](#see-the-conversion-example)。

#### NSMutableString

`NSMutableString` Objective-C 類別在 Kotlin 中不可用。
`NSMutableString` 的所有實例在傳遞給 Kotlin 時都會被複製。

### 集合 (Collections)

#### Kotlin -> Objective-C -> Swift

當 Kotlin 集合傳遞給 Swift 時，它首先會轉換為 Objective-C 等效項，然後 Swift 編譯器會複製整個集合並將其轉換為 [映射表](#mappings) 中描述的 Swift 原生集合。

最後的這種轉換會導致效能成本。為防止這種情況，當在 Swift 中使用 Kotlin 集合時，請明確將它們轉換為其 Objective-C 對應項：`NSDictionary`、`NSArray` 或 `NSSet`。

##### 請參閱轉換範例 {initial-collapse-state="collapsed" collapsible="true"}

例如，以下 Kotlin 宣告：

```kotlin
val map: Map<String, String>
```

在 Swift 中可能看起來像這樣：

```Swift
map[key]?.count ?? 0
```

在這裡，`map` 會隱式轉換為 Swift 的 `Dictionary`，其字串值會映射到 Swift 的 `String`。
這會導致效能成本。

為避免轉換，請明確將 `map` 轉換為 Objective-C 的 `NSDictionary`，並將值作為 `NSString` 存取：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

這可確保 Swift 編譯器不會執行額外的轉換步驟。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 集合會映射到 Kotlin，如 [映射表](#mappings) 中所述，但 `NSMutableSet` 和 `NSMutableDictionary` 除外。

`NSMutableSet` 不會轉換為 Kotlin 的 `MutableSet`。要將物件傳遞給 Kotlin `MutableSet`，請明確建立此類 Kotlin 集合。為此，例如，在 Kotlin 中使用 `mutableSetOf()` 函數，或在 Swift 中使用 `KotlinMutableSet` 類別，在 Objective-C 中使用 `${prefix}MutableSet`（`prefix` 是框架名稱前綴）。
`MutableMap` 也是如此。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 函數型別 (Function types)

Kotlin 函數型別物件（例如，Lambda 運算式）在 Swift 中會轉換為閉包，在 Objective-C 中會轉換為區塊。
[請參閱 Kotlin-Swift 互通百科中帶有 Lambda 的 Kotlin 函數範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

然而，在翻譯函數和函數型別時，參數和回傳值的型別映射方式存在差異。在後者情況下，基本型別會映射到其裝箱表示。Kotlin `Unit` 回傳值在 Swift/Objective-C 中表示為對應的 `Unit` 單例。此單例的值可以像任何其他 Kotlin `object` 一樣檢索。請參閱上方[表格](#mappings)中的單例。

考慮以下 Kotlin 函數：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

它在 Swift 中表示如下：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

您可以像這樣呼叫它：

```swift
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

#### Objective-C 區塊型別中的明確參數名稱

您可以為 Kotlin 的函數型別新增明確的參數名稱，以便匯出到 Objective-C 標頭。如果沒有它們，
Xcode 的自動完成會建議呼叫 Objective-C 函數，且 Objective-C 區塊中沒有參數名稱，
而產生的區塊會觸發 Clang 警告。

要啟用明確的參數名稱，請將以下 [二進位檔選項](native-binary-options.md) 新增到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

例如，對於以下 Kotlin 程式碼：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 會將參數名稱從 Kotlin 函數型別轉發到 Objective-C 區塊型別，讓 Xcode 可以在建議中使用它們：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> 此選項僅影響 Objective-C 互通。它適用於在 Xcode 中從 Objective-C 呼叫生成的 Objective-C 程式碼，
> 通常不影響從 Swift 進行的呼叫。
>
{style="note"}

### 泛型 (Generics)

Objective-C 支援在類別中定義的「輕量級泛型」，功能集相對有限。Swift 可以匯入在類別上定義的泛型，以協助向編譯器提供額外的型別資訊。

Objective-C 和 Swift 的泛型功能支援與 Kotlin 不同，因此翻譯不可避免地會遺失一些資訊，但支援的功能仍保留有意義的資訊。

有關如何在 Swift 中使用 Kotlin 泛型的具體範例，請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

#### 限制

Objective-C 泛型不支援 Kotlin 或 Swift 的所有功能，因此翻譯中會遺失一些資訊。

泛型只能在類別上定義，不能在介面（Objective-C 和 Swift 中的協定）或函數上定義。

#### 可為空性 (Nullability)

Kotlin 和 Swift 都將可為空性定義為型別規範的一部分，而 Objective-C 則在型別的方法和屬性上定義可為空性。因此，以下 Kotlin 程式碼：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

在 Swift 中看起來像這樣：

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

為了支援潛在的可為空型別，Objective-C 標頭需要將 `myVal` 定義為可為空回傳值。

為緩解此問題，當定義您的泛型類別時，如果泛型型別「絕不」應為空，請提供一個不可為空型別約束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

這將強制 Objective-C 標頭將 `myVal` 標記為不可為空。

#### 變異性 (Variance)

Objective-C 允許泛型宣告為共變或逆變。Swift 不支援變異性。來自 Objective-C 的泛型類別可以根據需要強制轉換。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 約束 (Constraints)

在 Kotlin 中，您可以為泛型型別提供上限。Objective-C 也支援此功能，但在更複雜的情況下不適用，且目前 Kotlin - Objective-C 互通不支援。這裡的例外是，不可為空的上限會使 Objective-C 方法/屬性不可為空。

#### 停用

要在沒有泛型的情況下編寫框架標頭，請在您的建置檔案中新增以下編譯器選項：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前向宣告 (Forward declarations)

若要匯入前向宣告，請使用 `objcnames.classes` 和 `objcnames.protocols` 套件。例如，
若要匯入在 Objective-C 函式庫中以 `library.package` 宣告的 `objcprotocolName` 前向宣告，
請使用特殊的前向宣告套件：`import objcnames.protocols.objcprotocolName`。

考慮兩個 objcinterop 函式庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，
另一個在另一個套件中具有實際實作：

```ObjC
// First objcinterop library
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// Second objcinterop library
// Header:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// Implementation:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

若要在兩個函式庫之間傳輸物件，請在您的 Kotlin 程式碼中使用明確的 `as` 轉換：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 您只能從對應的真實類別轉換為 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
> 否則，您將收到錯誤。
>
{style="note"}

## 映射類型之間的轉換 (Casting between mapped types)

編寫 Kotlin 程式碼時，可能需要將物件從 Kotlin 類型轉換為等效的 Swift/Objective-C 類型（反之亦然）。在這種情況下，可以使用普通的 Kotlin 轉換，例如：

```kotlin
@file:Suppress("CAST_NEVER_SUCCEEDS")
import platform.Foundation.*

val nsNumber = 42 as NSNumber
val nsArray = listOf(1, 2, 3) as NSArray
val nsString = "Hello" as NSString
val string = nsString as String
```

IDE 可能會錯誤地發出「This cast can never succeed」警告。
在這種情況下，請使用 `@Suppress("CAST_NEVER_SUCCEEDS")` 註解。

## 子類別化 (Subclassing)

### 從 Swift/Objective-C 子類別化 Kotlin 類別和介面

Kotlin 類別和介面可以被 Swift/Objective-C 類別和協定子類別化。

### 從 Kotlin 子類別化 Swift/Objective-C 類別和協定

Swift/Objective-C 類別和協定可以使用 Kotlin `final` 類別進行子類別化。非 `final` 的 Kotlin 類別
繼承 Swift/Objective-C 型別目前尚不支援，因此不可能宣告繼承 Swift/Objective-C 型別的複雜類別階層。

一般方法可以使用 `override` Kotlin 關鍵字進行覆寫。在這種情況下，覆寫方法必須具有與被覆寫方法相同的參數名稱。

有時需要覆寫初始化器，例如在子類別化 `UIViewController` 時。作為 Kotlin 建構子匯入的初始化器可以使用 `@OverrideInit` 註解標記的 Kotlin 建構子進行覆寫：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆寫建構子必須具有與被覆寫建構子相同的參數名稱和型別。

要覆寫具有衝突 Kotlin 簽章的不同方法，您可以將 `@ObjCSignatureOverride` 註解新增到類別。
如果從 Objective-C 類別繼承了幾個具有相同引數型別但不同引數名稱的函數，該註解會指示 Kotlin 編譯器忽略衝突的重載。

預設情況下，Kotlin/Native 編譯器不允許呼叫非指定 Objective-C 初始化器作為 `super()` 建構子。如果指定初始化器在 Objective-C 函式庫中未正確標記，此行為可能會不方便。若要停用這些編譯器檢查，請在函式庫的 [`.def` 檔案](native-definition-file.md) 中新增 `disableDesignatedInitializerChecks = true`。

## C 功能

有關函式庫使用一些純粹的 C 功能（例如不安全指標、結構等）的範例情況，請參閱 [與 C 的互通性](native-c-interop.md)。

## 不支援的功能 (Unsupported)

Kotlin 程式語言的一些功能尚未映射到 Objective-C 或 Swift 的相應功能。
目前，以下功能在產生的框架標頭中未正確公開：

*   行內類別 (Inline classes)（引數映射為底層基本型別或 `id`）
*   實作標準 Kotlin 集合介面（`List`、`Map`、`Set`）及其他特殊類別的自訂類別
*   Objective-C 類別的 Kotlin 子類別