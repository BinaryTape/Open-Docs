---
title: "Expected 和 actual 宣告"
---
預期 (Expected) 與實際 (Actual) 宣告讓您可以從 Kotlin 多平台模組存取平台特定的 API (Platform-specific APIs)。
您可以在通用程式碼 (Common code) 中提供平台無關的 API (Platform-agnostic APIs)。

:::note
本文描述了預期與實際宣告的語言機制。 有關使用平台特定 API 的不同方式的一般建議，請參閱[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)。

## 預期與實際宣告的規則

要定義預期與實際宣告，請遵循以下規則：

1. 在通用原始碼集合 (Common source set) 中，宣告一個標準的 Kotlin 建構 (Construct)。 這可以是函數、屬性、類別、介面、
   列舉或註解 (Annotation)。
2. 使用 `expect` 關鍵字標記此建構。 這是您的 _預期宣告 (Expected declaration)_。 這些宣告可以在
   通用程式碼中使用，但不應包含任何實作。 而是由平台特定的程式碼提供此實作。
3. 在每個平台特定的原始碼集合中，在同一個套件 (Package) 中宣告相同的建構，並使用 `actual`
   關鍵字標記它。 這是您的 _實際宣告 (Actual declaration)_，它通常包含使用平台特定函式庫的實作。

在針對特定目標進行編譯期間，編譯器會嘗試將其找到的每個 _實際_ 宣告與通用程式碼中對應的 _預期_ 宣告進行匹配。 編譯器會確保：

* 通用原始碼集合中的每個預期宣告在每個平台特定的
  原始碼集合中都有一個匹配的實際宣告。
* 預期宣告不包含任何實作。
* 每個實際宣告都與對應的預期宣告共享相同的套件，例如 `org.mygroup.myapp.MyType`。

在為不同的平台產生結果程式碼時，Kotlin 編譯器會合併彼此對應的預期和實際
宣告。 它會為每個平台產生一個具有其實際實作的宣告。
通用程式碼中預期宣告的每次使用都會呼叫
結果平台程式碼中的正確實際宣告。

當您使用在不同目標平台之間共享的中間原始碼集合時，您可以宣告實際宣告。
例如，將 `iosMain` 視為在 `iosX64Main`、`iosArm64Main` 和 `iosSimulatorArm64Main` 平台原始碼集合之間共享的中間原始碼集合。 通常只有 `iosMain` 包含實際宣告，而不是平台原始碼集合。 然後，Kotlin 編譯器將使用這些實際宣告來產生對應平台的結果程式碼。

IDE (Integrated Development Environment) 有助於解決常見問題，包括：

* 遺失的宣告
* 包含實作的預期宣告
* 不匹配的宣告簽章 (Signature)
* 不同套件中的宣告

您也可以使用 IDE 從預期宣告導航到實際宣告。 選擇裝訂邊圖示 (Gutter icon) 以檢視實際
宣告或使用[快捷鍵](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

<img src="/img/expect-actual-gutter.png" alt="IDE navigation from expected to actual declarations" width="500" style={{verticalAlign: 'middle'}}/>

## 使用預期與實際宣告的不同方法

讓我們探索使用 expect/actual 機制的不同選項，以解決存取
平台 API 的問題，同時仍然提供一種在通用程式碼中使用它們的方法。

考慮一個 Kotlin 多平台專案，您需要在其中實作 `Identity` 類型，該類型應包含使用者的
登入名稱和目前的進程 ID (Process ID)。 該專案具有 `commonMain`、`jvmMain` 和 `nativeMain` 原始碼集合，以使
應用程式可以在 JVM 和諸如 iOS 之類的本機環境中工作。

### 預期與實際函數

您可以定義一個 `Identity` 類型和一個工廠函數 (Factory function) `buildIdentity()`，該函數在通用原始碼集合中宣告，並在平台原始碼集合中以不同的方式實作：

1. 在 `commonMain` 中，宣告一個簡單的類型並預期一個工廠函數：

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. 在 `jvmMain` 原始碼集合中，使用標準 Java 函式庫實作一個解決方案：

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. 在 `nativeMain` 原始碼集合中，使用本機
   依賴項實作一個帶有 [POSIX](https://en.wikipedia.org/wiki/POSIX) 的解決方案：

   ```kotlin
   package identity
  
   import kotlinx.cinterop.toKString
   import platform.posix.getlogin
   import platform.posix.getpid

   actual fun buildIdentity() = Identity(
       getlogin()?.toKString() ?: "None",
       getpid().toLong()
   )
   ```

  在此，平台函數會傳回平台特定的 `Identity` 實例。

從 Kotlin 1.9.0 開始，使用 `getlogin()` 和 `getpid()` 函數需要 `@OptIn` 註解。

:::

### 具有預期與實際函數的介面

如果工廠函數變得太大，請考慮使用通用的 `Identity` 介面，並在
不同的平台上以不同的方式實作它。

`buildIdentity()` 工廠函數應傳回 `Identity`，但這次，它是一個實作
通用介面的物件：

1. 在 `commonMain` 中，定義 `Identity` 介面和 `buildIdentity()` 工廠函數：

   ```kotlin
   // In the commonMain source set:
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 建立介面的平台特定實作，而無需額外使用預期和實際宣告：

   ```kotlin
   // In the jvmMain source set:
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // In the nativeMain source set:
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

這些平台函數會傳回平台特定的 `Identity` 實例，這些實例實作為 `JVMIdentity`
和 `NativeIdentity` 平台類型。

#### 預期與實際屬性

您可以修改先前的範例，並預期一個 `val` 屬性來儲存 `Identity`。

將此屬性標記為 `expect val`，然後在平台原始碼集合中將其實現：

```kotlin
//In commonMain source set:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//In jvmMain source set:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//In nativeMain source set:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 預期與實際物件

當預期 `IdentityBuilder` 在每個平台上都是單例 (Singleton) 時，您可以將其定義為預期物件，並讓
平台將其實現：

```kotlin
// In the commonMain source set:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// In the jvmMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// In the nativeMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 關於依賴注入的建議

為了建立鬆散耦合的架構，許多 Kotlin 專案採用依賴注入 (Dependency Injection, DI) 框架。 DI
框架允許根據目前的環境將依賴項注入到元件中。

例如，與在本機託管相比，您可能會在測試和生產中或在部署到雲端時注入不同的依賴項。 只要透過介面表達依賴項，就可以注入任意數量的不同
實作，無論是在編譯時還是在執行時。

當依賴項是平台特定的時，也適用相同的原則。 在通用程式碼中，元件可以使用常規的 [Kotlin 介面](interfaces)表達其
依賴項。 然後，可以配置 DI 框架以注入平台特定的實作，例如，從 JVM 或 iOS 模組。

這意味著只有在 DI 框架的配置中才需要預期和實際宣告。 請參閱[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html#dependency-injection-framework)以取得範例。

透過這種方法，您只需使用介面和工廠函數即可採用 Kotlin 多平台。 如果您已經
使用 DI 框架來管理專案中的依賴項，我們建議使用相同的方法來管理
平台依賴項。

### 預期與實際類別

:::note
預期和實際類別處於 [Beta](components-stability) 階段。
它們幾乎是穩定的，但將來可能需要遷移步驟。
我們將盡最大努力最大程度地減少您需要進行的任何進一步的變更。

您可以使用預期和實際類別來實作相同的解決方案：

```kotlin
// In the commonMain source set:
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// In the jvmMain source set:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// In the nativeMain source set:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

您可能已經在演示材料中看到過這種方法。 但是，在可以使用
介面的簡單情況下使用類別是 _不建議的_。

使用介面，您不會將設計限制為每個目標平台一個實作。 此外，在
測試中替換假實作或在單一平台上提供多個實作也容易得多。

作為一般規則，請盡可能依賴標準語言建構，而不是使用預期和實際宣告。

如果您確實決定使用預期和實際類別，Kotlin 編譯器會警告您有關該功能的 Beta 狀態。 若要抑制此警告，請將以下編譯器選項新增至您的 Gradle 建置檔案：

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 從平台類別繼承

在某些特殊情況下，將 `expect` 關鍵字與類別一起使用可能是最佳方法。 假設
`Identity` 類型已經存在於 JVM 上：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

為了使其適應現有的程式碼庫和框架，您的 `Identity` 類型實作可以從此類型繼承
並重複使用其功能：

1. 為了解決此問題，請使用 `expect` 關鍵字在 `commonMain` 中宣告一個類別：

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. 在 `nativeMain` 中，提供一個實作該功能的實際宣告：

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. 在 `jvmMain` 中，提供一個從平台特定基底類別繼承的實際宣告：

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

在此，`CommonIdentity` 類型與您自己的設計相容，同時利用 JVM 上的現有類型。

#### 在框架中的應用

作為框架作者，您還可以發現預期和實際宣告對於您的框架很有用。

如果上面的範例是框架的一部分，則使用者必須從 `CommonIdentity` 衍生一個類型才能提供
顯示名稱。

在這種情況下，預期宣告是抽象的，並宣告一個抽象方法：

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同樣，實際實作是抽象的，並宣告 `displayName` 方法：

```kotlin
// In nativeMain of the framework codebase:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// In jvmMain of the framework codebase:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

框架使用者需要編寫從預期宣告繼承並自行實作遺失
方法的通用程式碼：

```kotlin
// In commonMain of the users' codebase:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 進階用法

關於預期和實際宣告，有很多特殊情況。

### 使用類型別名 (Type Alias) 來滿足實際宣告

實際宣告的實作不必從頭開始編寫。 它可以是現有類型，例如第三方函式庫提供的類別。

只要它滿足與預期宣告相關的所有要求，您就可以使用此類型。 例如，
考慮以下兩個預期宣告：

```kotlin
expect enum class Month {
    JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
    AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
}

expect class MyDate {
    fun getYear(): Int
    fun getMonth(): Month
    fun getDayOfMonth(): Int
}
```

在 JVM 模組中，可以使用 `java.time.Month` 列舉來實作第一個預期宣告，並使用 `java.time.LocalDate` 類別來實作第二個預期宣告。 但是，無法直接將 `actual` 關鍵字新增到
這些類型。

相反，您可以使用[類型別名](type-aliases)來連接預期宣告和平台特定
類型：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在這種情況下，在與預期宣告相同的套件中定義 `typealias` 宣告，並在其他地方建立
引用的類別。

由於 `LocalDate` 類型使用 `Month` 列舉，因此您需要在通用程式碼中將它們都宣告為預期類別。

:::

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 在實際宣告中擴展可見性

您可以使實際實作比對應的預期宣告更可見。 如果您不想將 API 公開為通用用戶端的公共 API，這會很有用。

目前，Kotlin 編譯器會在可見性變更的情況下發出錯誤。 您可以透過將 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 應用於實際類型別名宣告來抑制此錯誤。 從 Kotlin 2.0 開始，此限制將不適用。

例如，如果您在通用原始碼集合中宣告以下預期宣告：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

您也可以在平台特定的原始碼集合中使用以下實際實作：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

在此，內部預期類別具有使用類型別名的現有公共 `MyMessenger` 的實際實作。

### 實際化時的額外列舉條目

當使用 `expect` 在通用原始碼集合中宣告列舉時，每個平台模組都應具有
對應的 `actual` 宣告。 這些宣告必須包含相同的列舉常數，但它們也可以具有
額外的常數。

當您使用現有的平台列舉來實現預期列舉時，這會很有用。 例如，
考慮通用原始碼集合中的以下列舉：

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

當您在平台原始碼集合中為 `Department` 提供實際宣告時，您可以新增額外的常數：

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

但是，在這種情況下，平台原始碼集合中的這些額外常數將與通用程式碼中的那些常數不匹配。
因此，編譯器要求您處理所有額外的案例。

在 `Department` 上實作 `when` 建構的函數需要 `else` 子句：

```kotlin
// An else clause is required:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT `->` println("The IT Department")
        Department.HR `->` println("The HR Department")
        Department.Sales `->` println("The Sales Department")
        else `->` println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### 預期註解類別

預期和實際宣告可以用於註解。 例如，您可以宣告一個 `@XmlSerializable`
註解，該註解必須在每個平台原始碼集合中都有對應的實際宣告：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

重複使用特定平台上的現有類型可能會很有用。 例如，在 JVM 上，您可以使用
[JAXB 規範](https://javaee.github.io/jaxb-v2/)中的現有類型來定義您的註解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

將 `expect` 與註解類別一起使用時，還有一個額外的考量。 註解用於將
中繼資料附加到程式碼，並且不會在簽章中顯示為類型。 對於不需要實際類別的平台上的預期註解，這不是必需的。

您只需要在使用註解的平台上提供 `actual` 宣告。 預設情況下，不會啟用此
行為，它需要使用 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)標記該類型。

取得上面宣告的 `@XmlSerializable` 註解並新增 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果在使用該平台的平台上遺失了實際宣告，編譯器將不會產生
錯誤。

## 接下來是什麼？

有關使用平台特定 API 的不同方式的一般建議，請參閱[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)。