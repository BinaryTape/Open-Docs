[//]: # (title: 透過 Swift 匯出與 Swift 互通)

<primary-label ref="experimental-general"/>

Kotlin 為 Swift 匯出提供了實驗性支援。它允許您直接匯出 Kotlin 原始碼，並以符合 Swift 慣用方式的方式從 Swift 呼叫 Kotlin 程式碼，無需 Objective-C 標頭檔。

Swift 匯出讓針對 Apple 目標平台的多平台開發更加流暢。例如，如果您有一個包含頂層函式的 Kotlin 模組，Swift 匯出可實現清晰、模組專屬的匯入，從而消除了令人困惑的 Objective-C 底線和混淆名稱。

目前的 Swift 匯出功能包括：

*   **多模組支援**。每個 Kotlin 模組都會被匯出為一個獨立的 Swift 模組，簡化了函式呼叫。
*   **套件支援**。Kotlin 套件在匯出過程中會被明確保留，避免在生成的 Swift 程式碼中發生命名衝突。
*   **型別別名**。Kotlin 型別別名會被匯出並在 Swift 中保留，提高了可讀性。
*   **基本型別的強化可為空性**。與 Objective-C 互通不同，Objective-C 互通需要將 `Int?` 等型別裝箱到像 `KotlinInt` 這樣的包裝類別中以保留可為空性，而 Swift 匯出則直接轉換可為空性資訊。
*   **多載**。您可以在 Swift 中呼叫 Kotlin 的多載函式而不會產生歧義。
*   **扁平化套件結構**。您可以將 Kotlin 套件轉換為 Swift 列舉，從生成的 Swift 程式碼中移除套件前綴。
*   **模組名稱自訂**。您可以在 Kotlin 專案的 Gradle 配置中自訂最終的 Swift 模組名稱。

## 啟用 Swift 匯出

此功能目前為[實驗性](components-stability.md#stability-levels-explained)，尚未準備好用於正式環境。若要試用，請在您的 Kotlin 專案中[配置建置檔](#configure-kotlin-project)，並[設定 Xcode](#configure-xcode-project) 以整合 Swift 匯出。

### 配置 Kotlin 專案

您可以使用專案中的以下建置檔作為設定 Swift 匯出的起點：

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Set the root module name
        moduleName = "Shared"

        // Set the collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Configure external modules export
        export(project(":subproject")) {
            // Set the name for the exported module 
            moduleName = "Subproject"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.subproject.library"
        }

        // Provide compiler arguments to link tasks
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin 編譯器會自動生成所有必要的檔案（包括 `swiftmodule` 檔案、靜態 `.a` 函式庫、標頭檔和 `modulemap` 檔案），並將它們複製到應用程式的建置目錄中，您可以從 Xcode 存取這些檔案。

> 您也可以複製我們的[公開範例](https://github.com/Kotlin/swift-export-sample)，其中已設定好 Swift 匯出。
>
{style="tip"}

### 配置 Xcode 專案

若要配置 Xcode 以將 Swift 匯出整合到您的專案中：

1.  在 Xcode 中，開啟專案設定。
2.  在 **Build Phases** 頁籤中，找到帶有 `embedAndSignAppleFrameworkForXcode` 任務的 **Run Script** 階段。
3.  將該腳本替換為 Run Script 階段中的 `embedSwiftExportForXcode` 任務：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![加入 Swift 匯出腳本](xcode-swift-export-run-script-phase.png){width=700}

4.  建置專案。建置過程會在輸出目錄中生成 Swift 模組。

## 當前限制

Swift 匯出目前僅適用於使用[直接整合](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)將 iOS 框架連接到 Xcode 專案的專案。這是在 IntelliJ IDEA 中使用 Kotlin Multiplatform 外掛程式或透過[網路精靈](https://kmp.jetbrains.com/)建立的 Kotlin Multiplatform 專案的標準配置。

其他已知問題：

*   當模組在 Gradle 座標中具有相同名稱時，Swift 匯出會中斷，例如 SQLDelight 的 Runtime 模組和 Compose Runtime 模組 ([KT-80185](https://youtrack.jetbrains.com/issue/KT-80185))。
*   繼承自 `List`、`Set` 或 `Map` 的型別在匯出過程中會被忽略 ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416))。
*   `List`、`Set` 或 `Map` 的繼承者無法在 Swift 端實例化 ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417))。
*   匯出到 Swift 時，Kotlin 泛型型別參數會被型別擦除為其上限。
*   Swift 閉包可以傳入 Kotlin，但 Kotlin 無法將函式型別匯出到 Swift。
*   不支援跨語言繼承，因此 Swift 類別不能直接繼承自 Kotlin 匯出的類別或介面。
*   沒有可用的 IDE 遷移提示或自動化功能。
*   使用需要選擇加入 (opt-in) 的宣告時，您必須在 Gradle 建置檔中為 _模組層級_ 加入一個明確的 `optIn` 編譯器選項。例如，對於 `kotlinx.datetime` 函式庫：

    ```kotlin
    swiftExport {
        moduleName = "Shared"

        export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
            moduleName = "KotlinDateTime"
            flattenPackage = "kotlinx.datetime"
        }
    }

    // Add a separate opt-in block at the module level
    compilerOptions {
        optIn.add("kotlin.time.ExperimentalTime")
    }
    ```

## 映射

下表顯示了 Kotlin 概念如何映射到 Swift。

| Kotlin                 | Swift                          | 備註                   |
|:-----------------------|:-------------------------------|:-----------------------|
| `class`                | `class`                        | [備註](#classes)        |
| `object`               | `class` with `shared` property | [備註](#objects)        |
| `enum class`           | `enum`                         | [備註](#enums)          |
| `typealias`            | `typealias`                    | [備註](#type-aliases)   |
| Function               | Function                       | [備註](#functions)      |
| Property               | Property                       | [備註](#properties)     |
| Constructor            | Initializer                    | [備註](#constructors)   |
| Package                | Nested enum                    | [備註](#packages)       |
| `Boolean`              | `Bool`                         |                         |
| `Char`                 | `Unicode.UTF16.CodeUnit`       |                         |
| `Byte`                 | `Int8`                         |                         |
| `Short`                | `Int16`                        |                         |
| `Int`                  | `Int32`                        |                         |
| `Long`                 | `Int64`                        |                         |
| `UByte`                | `UInt8`                        |                         |
| `UShort`               | `UInt16`                       |                         |
| `UInt`                 | `UInt32`                       |                         |
| `ULong`                | `UInt64`                       |                         |
| `Float`                | `Float`                        |                         |
| `Double`               | `Double`                       |                         |
| `Any`                  | `KotlinBase` class             |                         |
| `Unit`                 | `Void`                         |                         |
| `Nothing`              | `Never`                        | [備註](#kotlin-nothing) |

### 宣告

#### 類別 (Classes)

Swift 匯出僅支援直接繼承自 `Any` 的最終類別，例如 `class Foo()`。它們會被轉換為繼承自特殊 `KotlinBase` 類別的 Swift 類別：

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### 物件 (Objects)

物件會被轉換為帶有私有 `init` 和靜態 `shared` 存取器的 Swift 類別：

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### 型別別名 (Type aliases)

Kotlin 型別別名會按原樣匯出：

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 列舉 (Enums)

Kotlin 的 `enum class` 宣告會被匯出為常規的原生 Swift `enum` 型別：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    public var rgb: Swift.Int32 { get }
}
```

#### 函式 (Functions)

Swift 匯出支援簡單的頂層函式和方法：

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

對於 Kotlin 的擴充函式，接收器參數會移到普通 Swift 參數的第一個位置：

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

Kotlin 帶有 [`vararg`](functions.md#variable-number-of-arguments-varargs) 的函式會映射到 Swift 的可變參數函式參數：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
public func log(messages: Swift.String...)
```

> 目前對帶有 `suspend`、`inline` 和 `operator` 關鍵字的函式支援有限。泛型型別通常不支援。
>
{style="note"}

#### 屬性 (Properties)

Kotlin 屬性會轉換為 Swift 屬性：

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### 建構子 (Constructors)

建構子會轉換為 Swift 初始化器：

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### 型別

#### kotlin.Nothing

Kotlin 的 `Nothing` 型別會轉換為 `Never` 型別：

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### 分類器型別 (Classifier types)

Swift 匯出目前僅支援直接繼承自 `Any` 的最終類別。

### 套件 (Packages)

Kotlin 套件會轉換為巢狀 Swift 列舉，以避免名稱衝突：

```kotlin
// Kotlin
// bar.kt file in foo.bar package
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// baz.kt file in foo.baz package
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

## Swift 匯出的演進

我們計劃在未來的 Kotlin 版本中擴展並逐步穩定 Swift 匯出，以改善 Kotlin 和 Swift 之間的互通性，特別是在協程 (coroutines) 和流 (flows) 方面。

您可以透過以下方式留下您的回饋：

*   在 Kotlin Slack – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
    並加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 頻道。
*   在 [YouTrack](https://kotl.in/issue) 回報問題。