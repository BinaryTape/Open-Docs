[//]: # (title: 與 Swift/Objective-C 的互通性)

> Objective-C 庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。
> 所有由 cinterop 工具從 Objective-C 庫產生的 Kotlin 宣告
> 都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台庫（如 Foundation、UIKit 和 POSIX）
> 僅對某些 API 要求選擇性加入。
>
{style="note"}

Kotlin/Native 透過 Objective-C 提供與 Swift 的間接互通性。本文件涵蓋如何在 Swift/Objective-C 程式碼中使用 Kotlin 宣告，以及在 Kotlin 程式碼中使用 Objective-C 宣告。

您可能會發現其他有用的資源：

* [Kotlin-Swift 互通性百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)：關於如何在 Swift 程式碼中使用 Kotlin 宣告的範例集合。
* [與 Swift/Objective-C ARC 的整合](native-arc-integration.md)章節：涵蓋 Kotlin 的追蹤式垃圾收集（GC）與 Objective-C 的 ARC 之間整合的詳細資訊。

## 將 Swift/Objective-C 庫匯入 Kotlin

如果 Objective-C 架構與庫已正確匯入至組建中（系統架構預設會匯入），則可以在 Kotlin 程式碼中使用它們。更多詳細資訊，請參閱：

* [建立並設定程式庫定義檔案](native-definition-file.md)
* [為原生庫設定編譯](https://kotlinlang.org/docs/multiplatform/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

如果 Swift 庫的 API 透過 `@objc` 匯出至 Objective-C，則可以在 Kotlin 程式碼中使用該 Swift 庫。目前尚不支援純 Swift 模組。

## 在 Swift/Objective-C 中使用 Kotlin

Kotlin 模組如果編譯為架構，則可以在 Swift/Objective-C 程式碼中使用：

* 請參閱[建置最終原生二進位檔案](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)以了解如何宣告二進位檔案。
* 檢視 [Kotlin Multiplatform 範例專案](https://github.com/Kotlin/kmm-basic-sample)以獲取範例。

### 對 Objective-C 和 Swift 隱藏 Kotlin 宣告

<primary-label ref="experimental-opt-in"/>

為了讓您的 Kotlin 程式碼對 Swift/Objective-C 更友善，請使用 `@HiddenFromObjC` 註解來對 Objective-C 和 Swift 隱藏 Kotlin 宣告。這會停用將函式或屬性匯出至 Objective-C。

或者，您可以使用 `internal` 修飾詞標記 Kotlin 宣告，以限制它們在編譯模組中的可見性。如果您想對 Objective-C 和 Swift 隱藏 Kotlin 宣告，同時保持其對其他 Kotlin 模組的可見性，請使用 `@HiddenFromObjC`。

[在 Kotlin-Swift 互通性百科中檢視範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### 在 Swift 中使用精煉（Refining）

<primary-label ref="experimental-opt-in"/>

`@ShouldRefineInSwift` 有助於將 Kotlin 宣告替換為用 Swift 編寫的包裝函式。該註解在產生的 Objective-C API 中將函式或屬性標記為 `swift_private`。此類宣告會獲得 `__` 前綴，這使得它們在 Swift 中不可見。

您仍然可以在 Swift 程式碼中使用這些宣告來建立對 Swift 友善的 API，但它們不會出現在 Xcode 的自動補全建議中。

* 有關在 Swift 中精煉 Objective-C 宣告的更多資訊，請參閱 [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
* 有關如何使用 `@ShouldRefineInSwift` 註解的範例，請參閱 [Kotlin-Swift 互通性百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

### 變更宣告名稱

<primary-label ref="experimental-opt-in"/>

為了避免重新命名 Kotlin 宣告，請使用 `@ObjCName` 註解。它會指示 Kotlin 編譯器為標註的類別、介面或其他 Kotlin 實體使用自訂的 Objective-C 和 Swift 名稱：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// 使用 ObjCName 註解的用法
let array = MySwiftArray()
let index = array.index(of: "element")
```

[在 Kotlin-Swift 互通性百科中檢視另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### 透過 KDoc 註解提供文件

文件對於理解任何 API 都至關重要。為共用的 Kotlin API 提供文件可讓您與其使用者溝通使用方式、注意事項等。

產生 Objective-C 標頭檔時，Kotlin 程式碼中的 [KDoc](kotlin-doc.md) 註解會轉換為對應的 Objective-C 註解。例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * 印出引數的總和。
 * 正確處理總和不符合 32 位元整數的情況。
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

將產生帶有對應註解的 Objective-C 標頭檔：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 註解會嵌入 klibs 中，並從 klibs 提取到產生的 Apple 架構中。因此，類別和方法的註解會出現在自動補全中，例如在 Xcode 中。如果您跳轉到 `.h` 檔案中的函式定義，您將看到 `@param`、`@return` 和類似標籤的註解。

已知限制：

* 除非使用 `-Xexport-kdoc` 選項編譯，否則不會匯出相依性文件。使用此編譯器選項編譯的庫可能與其他編譯器版本不相容。
* KDoc 註解大多按原樣匯出，但許多 KDoc 區塊標籤（如 `@property`）尚不支援。

如有必要，您可以在 Gradle 建置檔案的 `binaries {}` 區塊中，停用將 KDoc 註解從 klibs 匯出到產生的 Apple 架構：

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

## 對應

下表顯示了 Kotlin 概念如何對應到 Swift/Objective-C，反之亦然。

「->」和「<-」表示對應僅為單向。

| Kotlin | Swift | Objective-C | 註解 |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class` | `class` | `@interface` | [註解](#classes) |
| `interface` | `protocol` | `@protocol` | |
| `constructor`/`create` | Initializer | Initializer | [註解](#initializers) |
| 屬性 | 屬性 | 屬性 | [註解 1](#top-level-functions-and-properties), [註解 2](#setters) |
| 方法 | 方法 | 方法 | [註解 1](#top-level-functions-and-properties), [註解 2](#method-names-translation) |
| `enum class` | `class` | `@interface` | [註解](#enums) |
| `suspend` -> | `completionHandler:`/ `async` | `completionHandler:` | [註解 1](#errors-and-exceptions), [註解 2](#suspending-functions) |
| `@Throws fun` | `throws` | `error:(NSError**)error` | [註解](#errors-and-exceptions) |
| 擴充 | 擴充 | Category member | [註解](#extensions-and-category-members) |
| `companion` 成員 <- | Class method or property | Class method or property | |
| `null` | `nil` | `nil` | |
| `Singleton` | `shared` 或 `companion` 屬性 | `shared` 或 `companion` 屬性 | [註解](#kotlin-singletons) |
| 原始型別 | Primitive type / `NSNumber` | | [註解](#primitive-types) |
| `Unit` 傳回型別 | `Void` | `void` | |
| `String` | `String` | `NSString` | [註解](#strings) |
| `String` | `NSMutableString` | `NSMutableString` | [註解](#nsmutablestring) |
| `List` | `Array` | `NSArray` | |
| `MutableList` | `NSMutableArray` | `NSMutableArray` | |
| `Set` | `Set` | `NSSet` | |
| `MutableSet` | `NSMutableSet` | `NSMutableSet` | [註解](#collections) |
| `Map` | `Dictionary` | `NSDictionary` | |
| `MutableMap` | `NSMutableDictionary` | `NSMutableDictionary` | [註解](#collections) |
| 函式型別 | Function type | Block pointer type | [註解](#function-types) |
| 內嵌類別 | 不支援 | 不支援 | [註解](#unsupported) |

### 類別

#### 名稱轉換

Objective-C 類別以其原始名稱匯入 Kotlin。協定以帶有 `Protocol` 名稱後綴的介面匯入，例如 `@protocol Foo` -> `interface FooProtocol`。這些類別和介面被放置在[組建組態中指定的](#importing-swift-objective-c-libraries-to-kotlin)套件中（預配置的系統架構為 `platform.*` 套件）。

Kotlin 類別和介面的名稱在匯入到 Objective-C 時會加上前綴。該前綴衍生自架構名稱。

Objective-C 不支援架構中的套件。如果 Kotlin 編譯器在同一個架構中發現名稱相同但套件不同的 Kotlin 類別，它會重新命名它們。此演算法目前尚不穩定，可能會在 Kotlin 版本之間變更。為了規避此問題，您可以在架構中重新命名衝突的 Kotlin 類別。

#### 強烈連結

每當您在 Kotlin 原始碼中使用 Objective-C 類別時，它都會被標記為強烈連結符號。產生的建置產物會將相關符號提及為強烈外部參考。

這意味著應用程式在啟動期間會嘗試動態連結符號，如果符號不可用，應用程式就會崩潰。即使符號從未被使用過，崩潰也會發生。在特定的裝置或 OS 版本上，符號可能不可用。

為了規避此問題並避免「Symbol not found」錯誤，請使用一個檢查類別是否實際可用的 Swift 或 Objective-C 包裝函式。[查看此規避方法在 Compose Multiplatform 架構中的實作方式](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始設定式

Swift/Objective-C 初始設定式會以建構函式或名為 `create` 的工廠方法匯入 Kotlin。後者發生在 Objective-C 分類（category）或 Swift 擴充中宣告的初始設定式，因為 Kotlin 沒有擴充建構函式的概念。

> 在將 Swift 初始設定式匯入 Kotlin 之前，別忘了用 `@objc` 標註它們。
>
{style="tip"}

Kotlin 建構函式會以初始設定式匯入 Swift/Objective-C。

### Setters

覆寫父類別唯讀屬性的可寫 Objective-C 屬性，對於屬性 `foo` 會表示為 `setFoo()` 方法。實作為可變的協定唯讀屬性也是如此。

### 頂層函式與屬性

頂層 Kotlin 函式和屬性可以作為特殊類別的成員來存取。每個 Kotlin 檔案都會被轉換為這樣一個類別，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然後您可以像這樣從 Swift 呼叫 `foo()` 函式：

```swift
MyLibraryUtilsKt.foo()
```

在 Kotlin-Swift 互通性百科中查看存取頂層 Kotlin 宣告的範例集合：

* [頂層函式](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
* [頂層唯讀屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
* [頂層可變屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 方法名稱轉換

通常，Swift 引數標籤和 Objective-C selector 片段會對應到 Kotlin 參數名稱。這兩個概念具有不同的語意，因此有時 Swift/Objective-C 方法匯入時可能會帶有衝突的 Kotlin 簽章。在這種情況下，可以使用具名引數從 Kotlin 呼叫衝突的方法，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中為：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函式如何對應到 Swift/Objective-C：

| Kotlin | Swift | Objective-C |
|--------------|----------------|---------------|
| `equals()` | `isEquals(_:)` | `isEquals:` |
| `hashCode()` | `hash` | `hash` |
| `toString()` | `description` | `description` |

[在 Kotlin-Swift 互通性百科中檢視資料類別的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

您可以在 Swift 或 Objective-C 中指定更具慣用性的名稱，而不是使用 [`@ObjCName` 註解](#change-declaration-names)重新命名 Kotlin 宣告。

### 錯誤與例外

所有 Kotlin 例外都是非受檢的，這意味著錯誤是在執行時擷取的。然而，Swift 只有在編譯時處理的受檢錯誤。因此，如果 Swift 或 Objective-C 程式碼呼叫擲回例外的 Kotlin 方法，則該 Kotlin 方法應使用 `@Throws` 註解進行標記，並指定「預期」例外類別的清單。

編譯為 Swift/Objective-C 架構時，具有或繼承 `@Throws` 註解的非 `suspend` 函式在 Objective-C 中表示為產生 `NSError*` 的方法，在 Swift 中表示為 `throws` 方法。`suspend` 函式的表示形式在完成處理常式中始終具有 `NSError*`/`Error` 參數。

當從 Swift/Objective-C 程式碼呼叫的 Kotlin 函式擲回 `@Throws` 指定類別之一或其子類別的執行個體時，例外會傳播為 `NSError`。其他到達 Swift/Objective-C 的 Kotlin 例外被視為未處理，並會導致程式終止。

沒有 `@Throws` 的 `suspend` 函式僅傳播 `CancellationException`（作為 `NSError`）。沒有 `@Throws` 的非 `suspend` 函式完全不傳播 Kotlin 例外。

請注意，目前尚未實作相反的反向轉換：Swift/Objective-C 擲回錯誤的方法不會作為擲回例外的形式匯入 Kotlin。

[在 Kotlin-Swift 互通性百科中檢視範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 列舉

Kotlin 列舉在 Objective-C 中匯入為 `@interface`，在 Swift 中匯入為 `class`。這些資料結構具有對應於每個列舉值的屬性。考慮這段 Kotlin 程式碼：

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

[在 Kotlin-Swift 互通性百科中檢視另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 暫停函式

<primary-label ref="experimental-opt-in"/>

Kotlin 的[暫停函式](coroutines-basics.md) (`suspend`) 在產生的 Objective-C 標頭檔中呈現為帶有回呼的函式，或以 Swift/Objective-C 術語稱為[完成處理常式](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)。

從 Swift 5.5 開始，Kotlin 的 `suspend` 函式也可以從 Swift 中作為 `async` 函式呼叫，而無需使用完成處理常式。目前，此功能高度實驗性且具有某些限制。詳情請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610)。

* 在 [Swift 文件中進一步了解 `async`/`await` 機制](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)。
* 在 [Kotlin-Swift 互通性百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)中檢視範例，以及對實作相同功能的第三方庫的建議。

### 擴充與分類成員

Objective-C 分類（category）和 Swift 擴充（extension）的成員通常作為擴充匯入 Kotlin。這就是為什麼這些宣告不能在 Kotlin 中被覆寫，且擴充初始設定式不能作為 Kotlin 建構函式使用的原因。

> 目前有兩個例外。從 Kotlin 1.8.20 開始，在與 NSView 類別（來自 AppKit 架構）或 UIView 類別（來自 UIKit 架構）相同的標頭檔中宣告的分類成員，會作為這些類別的成員匯入。這意味著您可以覆寫繼承自 NSView 或 UIView 的方法。
>
{style="note"}

「一般」Kotlin 類別的 Kotlin 擴充會分別作為擴充和分類成員匯入 Swift 和 Objective-C。其他型別的 Kotlin 擴充被視為帶有額外接收者參數的[頂層宣告](#top-level-functions-and-properties)。這些型別包括：

* Kotlin `String` 型別
* Kotlin 集合型別及其子型別
* Kotlin `interface` 型別
* Kotlin 原始型別
* Kotlin `inline` 類別
* Kotlin `Any` 型別
* Kotlin 函式型別及其子型別
* Objective-C 類別和協定

[在 Kotlin-Swift 互通性百科中檢視範例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 單例

Kotlin 單例（使用 `object` 宣告建立，包括 `companion object`）會作為具有單一執行個體的類別匯入 Swift/Objective-C。

該執行個體可透過 `shared` 和 `companion` 屬性取得。

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

> 在 Objective-C 中透過 `[MySingleton mySingleton]` 存取物件以及在 Swift 中透過 `MySingleton()` 存取物件的方式已被棄用。
> 
{style="note"}

在 Kotlin-Swift 互通性百科中查看更多範例：

* [如何使用 `shared` 存取 Kotlin 物件](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
* [如何從 Swift 存取 Kotlin companion 物件的成員](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### 原始型別

Kotlin 原始型別的裝箱（boxing）會對應到特殊的 Swift/Objective-C 類別。例如，`kotlin.Int` 裝箱在 Swift 中表示為 `KotlinInt` 類別執行個體（或在 Objective-C 中表示為 `${prefix}Int` 執行個體，其中 `prefix` 是架構名稱的前綴）。這些類別衍生自 `NSNumber`，因此執行個體是正確的 `NSNumber`，支援所有對應的操作。

當 `NSNumber` 型別用作 Swift/Objective-C 參數型別或傳回值時，不會自動轉換為 Kotlin 原始型別。原因是 `NSNumber` 型別沒有提供足夠的關於裝箱原始值型別的資訊，例如，靜態上無法得知 `NSNumber` 是 `Byte`、`Boolean` 還是 `Double`。因此 Kotlin 原始值應該[手動在 `NSNumber` 之間進行轉換](#casting-between-mapped-types)。

### 字串

當 Kotlin `String` 傳遞給 Swift 時，它首先匯出為 Objective-C 物件，然後 Swift 編譯器會再次複製它以進行 Swift 轉換。這會導致額外的執行時開銷。

為了避免這種情況，可以在 Swift 中直接將 Kotlin 字串作為 Objective-C 的 `NSString` 存取。
[查看轉換範例](#see-the-conversion-example)。

#### NSMutableString

Objective-C 類別 `NSMutableString` 在 Kotlin 中不可用。所有 `NSMutableString` 執行個體在傳遞給 Kotlin 時都會被複製。

### 集合

#### Kotlin -> Objective-C -> Swift

當 Kotlin 集合傳遞給 Swift 時，它首先轉換為對應的 Objective-C 等效項，然後 Swift 編譯器會複製整個集合，並將其轉換為 Swift 原生集合，如[對應表](#mappings)中所述。

最後一次轉換會導致效能開銷。為了防止這種情況，在 Swift 中使用 Kotlin 集合時，請將它們明確轉換為對應的 Objective-C 型別：`NSDictionary`、`NSArray` 或 `NSSet`。

##### 查看轉換範例 {initial-collapse-state="collapsed" collapsible="true"}

例如，以下 Kotlin 宣告：

```kotlin
val map: Map<String, String>
```

在 Swift 中，可能看起來像這樣：

```Swift
map[key]?.count ?? 0
```

這裡，`map` 被隱式轉換為 Swift 的 `Dictionary`，其字串值被對應到 Swift 的 `String`。這會導致效能成本。

為了避免轉換，請明確將 `map` 轉換為 Objective-C 的 `NSDictionary` 並改為以 `NSString` 存取值：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

這可確保 Swift 編譯器不會執行額外的轉換步驟。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 集合對應到 Kotlin，如[對應表](#mappings)中所述，除了 `NSMutableSet` 和 `NSMutableDictionary`。

`NSMutableSet` 不會轉換為 Kotlin 的 `MutableSet`。要將物件傳遞給 Kotlin `MutableSet`，請明確建立此類 Kotlin 集合。為此，請使用 Kotlin 中的 `mutableSetOf()` 函式，或 Swift 中的 `KotlinMutableSet` 類別以及 Objective-C 中的 `${prefix}MutableSet`（`prefix` 是架構名稱前綴）。對於 `MutableMap` 也是如此。

[在 Kotlin-Swift 互通性百科中檢視範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 函式型別

Kotlin 函式型別物件（例如 lambda）在 Swift 中轉換為閉包（closure），在 Objective-C 中轉換為 block。
[在 Kotlin-Swift 互通性百科中檢視具有 lambda 的 Kotlin 函式範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

然而，在轉換函式與函式型別時，參數型別與傳回值的對應方式有所不同。在後一種情況下，原始型別會對應到其裝箱表示。Kotlin `Unit` 傳回值在 Swift/Objective-C 中表示為對應的 `Unit` 單例。此單例的值可以像任何其他 Kotlin `object` 一樣檢索。參見[上表](#mappings)中的單例。

考慮以下 Kotlin 函式：

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

#### Objective-C block 型別中的明確參數名稱

Kotlin 為匯出的 Objective-C 標頭檔中的函式型別加入明確的參數名稱。Xcode 的自動補全隨後會在 Objective-C block 中呼叫 Objective-C 函式時建議這些名稱。

例如，對於以下 Kotlin 程式碼：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 將參數名稱從 Kotlin 函式型別轉發至 Objective-C block 型別，允許 Xcode 在建議中使用它們：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> 此選項僅影響 Objective-C 互通性。它適用於在 Xcode 中從 Objective-C 呼叫產生的 Objective-C 程式碼，通常不影響從 Swift 進行的呼叫。
>
{style="note"}

如果您遇到問題，可以在 `gradle.properties` 檔案中使用以下[二進位選項](native-binary-options.md)停用明確參數名稱：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

請在我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 中回報此類問題。

### 泛型

Objective-C 支援在類別中定義的「輕量級泛型」，其功能集相對有限。Swift 可以匯入類別上定義的泛型，以協助向編譯器提供額外的型別資訊。

Objective-C 和 Swift 的泛型功能支援與 Kotlin 不同，因此轉換不可避免地會遺失一些資訊，但支援的功能仍保留了有意義的資訊。

有關如何在 Swift 中使用 Kotlin 泛型的具體範例，請參閱 [Kotlin-Swift 互通性百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

#### 限制

Objective-C 泛型並不支援 Kotlin 或 Swift 的所有功能，因此轉換中會遺失一些資訊。

泛型只能定義在類別上，不能定義在介面（Objective-C 和 Swift 中的協定）或函式上。

#### 可 null 性

Kotlin 和 Swift 都將可 null 性定義為型別規格的一部分，而 Objective-C 在型別的方法和屬性上定義可 null 性。因此，以下 Kotlin 程式碼：

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

為了支援潛在的可 null 型別，Objective-C 標頭檔需要將 `myVal` 定義為具有可 null 傳回值。

為了緩解這種情況，在定義泛型類別時，如果泛型型別應該 *永遠不* 為 null，請提供不可 null 的型別約束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

這將強制 Objective-C 標頭檔將 `myVal` 標記為不可 null。

#### 差異（Variance）

Objective-C 允許將泛型宣告為協變或逆變。Swift 不支援差異。來自 Objective-C 的泛型類別可以根據需要進行強制轉換。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 約束

在 Kotlin 中，您可以為泛型型別提供上界（upper bounds）。Objective-C 也支援此功能，但在更複雜的情況下無法使用，目前 Kotlin - Objective-C 互通性尚不支援。此處的例外是不可 null 的上界將使 Objective-C 方法/屬性成為不可 null。

#### 停用

要讓寫出的架構標頭檔不帶泛型，請在建置檔案中加入以下編譯器選項：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前向宣告

要匯入前向宣告，請使用 `objcnames.classes` 和 `objcnames.protocols` 套件。例如，要匯入在具有 `library.package` 的 Objective-C 庫中宣告的 `objcprotocolName` 前向宣告，請使用特殊的前向宣告套件：`import objcnames.protocols.objcprotocolName`。

考慮兩個 objcinterop 庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一個在另一個套件中具有實際實作：

```ObjC
// 第一個 objcinterop 庫
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// 第二個 objcinterop 庫
// 標頭檔：
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// 實作：
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

要在兩個庫之間轉移物件，請在 Kotlin 程式碼中使用明確的 `as` 轉換：

```kotlin
// Kotlin 程式碼：
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 您只能從對應的真實類別轉換為 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。否則，您將收到錯誤。
>
{style="note"}

## 在對應型別之間進行轉換

編寫 Kotlin 程式碼時，可能需要將物件從 Kotlin 型別轉換為等效的 Swift/Objective-C 型別，或反之亦然。在這種情況下，您可以使用 [`as` 轉換](typecasts.md#unsafe-cast-operator)，例如：

```kotlin
@file:Suppress("CAST_NEVER_SUCCEEDS")
import platform.Foundation.*

val nsNumber = 42 as NSNumber
val nsArray = listOf(1, 2, 3) as NSArray
val nsString = "Hello" as NSString
val string = nsString as String
```

IDE 可能會錯誤地發出「This cast can never succeed」警告。在這種情況下，請使用 `@Suppress("CAST_NEVER_SUCCEEDS")` 註解。

## 子類化

### 從 Swift/Objective-C 子類化 Kotlin 類別和介面

Kotlin 類別和介面可以被 Swift/Objective-C 類別和協定子類化。

### 從 Kotlin 子類化 Swift/Objective-C 類別和協定

Swift/Objective-C 類別和協定可以用 Kotlin `final` 類別進行子類化。繼承 Swift/Objective-C 型別的非 `final` Kotlin 類別目前尚不支援，因此無法宣告繼承 Swift/Objective-C 型別的複雜類別階層。

可以使用 `override` Kotlin 關鍵字覆寫普通方法。在這種情況下，覆寫的方法必須具有與被覆寫方法相同的參數名稱。

有時需要覆寫初始設定式，例如子類化 `UIViewController` 時。匯入為 Kotlin 建構函式的初始設定式可以由標註有 `@OverrideInit` 註解的 Kotlin 建構函式覆寫：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆寫的建構函式必須具有與被覆寫建構函式相同的參數名稱和型別。

要覆寫具有衝突 Kotlin 簽章的不同方法，可以向類別加入 `@ObjCSignatureOverride` 註解。該註解指示 Kotlin 編譯器忽略衝突的多載，以防從 Objective-C 類別繼承了數個引數型別相同但引數名稱不同的函式。

預設情況下，Kotlin/Native 編譯器不允許呼叫非指定 Objective-C 初始設定式作為 `super()` 建構函式。如果指定初始設定式在 Objective-C 庫中未正確標記，此行為可能會帶來不便。要停用這些編譯器檢查，請在程式庫的 [`.def` 檔案](native-definition-file.md)中加入 `disableDesignatedInitializerChecks = true`。

## C 功能

查看[與 C 的互通性](native-c-interop.md)，以獲取庫使用某些純 C 功能（如不安全指標、結構等）的範例。

## 不支援

Kotlin 程式語言的某些功能尚未對應到 Objective-C 或 Swift 的相應功能。目前，產生的架構標頭檔中尚未正確公開以下功能：

* 內嵌類別（引數對應為底層原始型別或 `id`）
* 實作標準 Kotlin 集合介面（`List`、`Map`、`Set`）的自訂類別以及其他特殊類別
* Objective-C 類別的 Kotlin 子類別