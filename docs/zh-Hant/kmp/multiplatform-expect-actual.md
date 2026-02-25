[//]: # (title: expect 與 actual 宣告)

`expect` 與 `actual` 宣告讓您可以從 Kotlin Multiplatform 模組存取平台特定的 API。
您可以在通用程式碼中提供與平台無關的 API。

> 本文說明 `expect` 與 `actual` 宣告的語言機制。有關使用平台特定 API 的不同方式的一般建議，請參閱[使用平台特定 API](multiplatform-connect-to-apis.md)。
>
{style="tip"}

## expect 與 actual 宣告的規則

要定義 `expect` 與 `actual` 宣告，請遵循以下規則：

1. 在 common 原始碼集中，宣告一個標準的 Kotlin 結構。這可以是函式、屬性、類別、介面、列舉或註解。
2. 使用 `expect` 關鍵字標記此結構。這就是您的 *expect 宣告*。這些宣告可以在通用程式碼中使用，但不應包含任何實作。相反地，平台特定的程式碼會提供此實作。
3. 在每個平台特定的原始碼集中，於相同的套件中宣告相同的結構，並使用 `actual` 關鍵字標記。這就是您的 *actual 宣告*，它通常包含使用平台特定程式庫的實作。

在為特定目標進行編譯期間，編譯器會嘗試將它找到的每個 *actual* 宣告與通用程式碼中相應的 *expect* 宣告進行比對。編譯器會確保：

* common 原始碼集中的每個 `expect` 宣告在每個平台特定的原始碼集中都有一個匹配的 `actual` 宣告。
* `expect` 宣告不包含任何實作。
* 每個 `actual` 宣告與對應的 `expect` 宣告共享相同的套件，例如 `org.mygroup.myapp.MyType`。

在為不同平台產生結果程式碼時，Kotlin 編譯器會合併彼此對應的 `expect` 與 `actual` 宣告。它會為每個平台產生一個帶有其實際實作的宣告。通用程式碼中對 `expect` 宣告的每次使用都會呼叫結果平台程式碼中正確的 `actual` 宣告。

當您使用在不同目標平台之間共享的中間原始碼集時，可以宣告 `actual` 宣告。例如，假設 `iosMain` 作為在 `iosX64Main`、`iosArm64Main` 和 `iosSimulatorArm64Main` 平台原始碼集之間共享的中間原始碼集。通常只有 `iosMain` 包含 `actual` 宣告，而平台原始碼集則不包含。然後，Kotlin 編譯器將使用這些 `actual` 宣告來產生相應平台的結果程式碼。

IDE 會協助處理常見問題，包括：

* 遺漏宣告
* 包含實作的 `expect` 宣告
* 宣告簽章不符
* 不同套件中的宣告

您還可以使用 IDE 從 `expect` 導覽至 `actual` 宣告。選取裝訂邊圖示以檢視 `actual` 宣告，或使用[快速鍵](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

![從 expect 到 actual 宣告的 IDE 導覽](expect-actual-gutter.png){width=500}

## 使用 expect 與 actual 宣告的不同方法

讓我們探索使用 `expect`/`actual` 機制的不同選項，以解決存取平台 API 的問題，同時仍提供在通用程式碼中處理它們的方法。

考慮一個 Kotlin Multiplatform 專案，您需要在其中實作 `Identity` 型別，該型別應包含使用者的登入名稱和目前的處理程序 ID。該專案具有 `commonMain`、`jvmMain` 和 `nativeMain` 原始碼集，以使應用程式在 JVM 和 iOS 等原生環境中運作。

### expect 與 actual 函式

您可以定義一個 `Identity` 型別和一個工廠函式 `buildIdentity()`，該函式在 common 原始碼集中宣告，並在平台原始碼集中以不同方式實作：

1. 在 `commonMain` 中，宣告一個簡單型別並預期一個工廠函式：

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. 在 `jvmMain` 原始碼集中，使用標準 Java 程式庫實作解決方案：

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. 在 `nativeMain` 原始碼集中，使用原生相依性透過 [POSIX](https://en.wikipedia.org/wiki/POSIX) 實作解決方案：

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

  在這裡，平台函式會傳回平台特定的 `Identity` 執行個體。

> 從 Kotlin 1.9.0 開始，使用 `getlogin()` 和 `getpid()` 函式需要 `@OptIn` 註解。
>
{style="note"}

### 具有 expect 與 actual 函式的介面

如果工廠函式變得太大，請考慮使用通用的 `Identity` 介面，並在不同平台上進行不同的實作。

`buildIdentity()` 工廠函式應傳回 `Identity`，但這次，它是實作通用介面的物件：

1. 在 `commonMain` 中，定義 `Identity` 介面和 `buildIdentity()` 工廠函式：

   ```kotlin
   // 在 commonMain 原始碼集中：
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 建立介面的平台特定實作，而無需額外使用 `expect` 與 `actual` 宣告：

   ```kotlin
   // 在 jvmMain 原始碼集中：
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // 在 nativeMain 原始碼集中：
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

這些平台函式會傳回平台特定的 `Identity` 執行個體，這些執行個體實作為 `JVMIdentity` 和 `NativeIdentity` 平台型別。

#### expect 與 actual 屬性

您可以修改前面的範例，並預期一個 `val` 屬性來儲存 `Identity`。

將此屬性標記為 `expect val`，然後在平台原始碼集中將其實例化（actualize）：

```kotlin
//在 commonMain 原始碼集中：
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//在 jvmMain 原始碼集中：
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//在 nativeMain 原始碼集中：
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### expect 與 actual 物件

當 `IdentityBuilder` 在每個平台上預期為單例（singleton）時，您可以將其定義為一個 `expect object`，並讓平台將其實例化：

```kotlin
// 在 commonMain 原始碼集中：
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// 在 jvmMain 原始碼集中：
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// 在 nativeMain 原始碼集中：
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 相依注入建議

為了建立鬆散耦合的架構，許多 Kotlin 專案採用相依注入（DI）架構。DI 架構允許根據目前環境將相依性注入到組件中。

例如，您可能在測試和生產環境中注入不同的相依性，或者在部署到雲端與在本機代管時注入不同的相依性。只要相依性是透過介面表達的，就可以在編譯時期或執行時期注入任意數量的不同實作。

當相依性是平台特定時，同樣的原則也適用。在通用程式碼中，組件可以使用一般的 [Kotlin 介面](https://kotlinlang.org/docs/interfaces.html)來表達其相依性。然後可以配置 DI 架構以注入平台特定的實作，例如來自 JVM 或 iOS 模組的實作。

這意味著 `expect` 與 `actual` 宣告僅在 DI 架構的配置中需要。有關範例，請參閱[使用平台特定 API](multiplatform-connect-to-apis.md#dependency-injection-framework)。

透過這種方法，您只需使用介面和工廠函式即可採用 Kotlin Multiplatform。如果您已經在專案中使用 DI 架構來管理相依性，我們建議使用相同的方法來管理平台相依性。

### expect 與 actual 類別

> `expect` 與 `actual` 類別目前處於 [Beta](supported-platforms.md#general-kotlin-stability-levels) 階段。它們幾乎已經穩定，但未來可能需要遷移步驟。我們將盡力減少您需要進行的任何進一步更改。
>
{style="warning"}

您可以使用 `expect` 與 `actual` 類別來實作相同的解決方案：

```kotlin
// 在 commonMain 原始碼集中：
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// 在 jvmMain 原始碼集中：
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// 在 nativeMain 原始碼集中：
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

您可能已經在演示材料中看過這種方法。但是，*不建議*在可以使用介面的簡單情況下使用類別。

使用介面，您不會將設計限制為每個目標平台一個實作。此外，在測試中替換虛假實作或在單個平台上提供多個實作要容易得多。

作為一般規則，請盡可能依賴標準語言結構，而不是使用 `expect` 與 `actual` 宣告。

如果您確實決定使用 `expect` 與 `actual` 類別，Kotlin 編譯器會針對該功能的 Beta 狀態發出警告。要隱藏此警告，請將以下編譯器選項添加到您的 Gradle 組建檔案中：

```kotlin
kotlin {
    compilerOptions {
        // 套用於所有 Kotlin 原始碼集的通用編譯器選項
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 繼承自平台類別

在某些特殊情況下，對類別使用 `expect` 關鍵字可能是最佳方法。假設 `Identity` 型別在 JVM 上已經存在：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

為了適應現有的程式碼庫和架構，您對 `Identity` 型別的實作可以繼承自此型別並重用其功能：

1. 要解決此問題，請在 `commonMain` 中使用 `expect` 關鍵字宣告一個類別：

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. 在 `nativeMain` 中，提供一個實作功能的 `actual` 宣告：

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. 在 `jvmMain` 中，提供一個繼承自平台特定基底類別的 `actual` 宣告：

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

在這裡，`CommonIdentity` 型別與您自己的設計相容，同時利用了 JVM 上現有的型別。

#### 在架構中的應用

作為架構作者，您可能也會發現 `expect` 與 `actual` 宣告對您的架構很有用。

如果上面的範例是架構的一部分，使用者必須從 `CommonIdentity` 衍生出一個型別來提供顯示名稱。

在這種情況下，`expect` 宣告是抽象的，並宣告了一個抽象方法：

```kotlin
// 在架構程式碼庫的 commonMain 中：
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同樣地，`actual` 實作也是抽象的，並宣告了 `displayName` 方法：

```kotlin
// 在架構程式碼庫的 nativeMain 中：
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// 在架構程式碼庫的 jvmMain 中：
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

架構使用者需要編寫繼承自 `expect` 宣告的通用程式碼，並自行實作缺少的方法：

```kotlin
// 在使用者程式碼庫的 commonMain 中：
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 進階使用案例

關於 `expect` 與 `actual` 宣告有許多特殊情況。

### 使用型別別名來滿足 actual 宣告

`actual` 宣告的實作不需要從頭開始編寫。它可以是現有的型別，例如第三方程式庫提供的類別。

只要該型別符合與 `expect` 宣告相關的所有要求，您就可以使用它。例如，考慮這兩個 `expect` 宣告：

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

在 JVM 模組內，`java.time.Month` 列舉可用於實作第一個 `expect` 宣告，而 `java.time.LocalDate` 類別可用於實作第二個。但是，無法直接將 `actual` 關鍵字添加到這些型別。

相反地，您可以使用[型別別名](https://kotlinlang.org/docs/type-aliases.html)來連接 `expect` 宣告和平台特定的型別：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在這種情況下，在與 `expect` 宣告相同的套件中定義 `typealias` 宣告，並在其他地方建立被參照的類別。

> 由於 `LocalDate` 型別使用 `Month` 列舉，您需要在通用程式碼中將兩者都宣告為 `expect` 類別。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### actual 宣告中擴展的可見性

您可以使 `actual` 實作比相應的 `expect` 宣告更具可見性。如果您不想對通用用戶端將 API 公開為 public，這將非常有用。

目前，Kotlin 編譯器在可見性更改的情況下會發出錯誤。您可以透過在 `actual typealias` 宣告中套用 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 來隱藏此錯誤。從 Kotlin 2.0 開始，此限制將不再適用。

例如，如果您在 common 原始碼集中宣告以下 `expect` 宣告：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

您也可以在平台特定的原始碼集中使用以下 `actual` 實作：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

在這裡，一個 internal 的 `expect` 類別具有一個使用型別別名的現有 public `MyMessenger` 的 `actual` 實作。

### 實例化（Actualization）時額外的列舉項目

當在 common 原始碼集中使用 `expect` 宣告列舉時，每個平台模組都應有一個相應的 `actual` 宣告。這些宣告必須包含相同的列舉常數，但它們也可以包含額外的常數。

當您使用現有的平台列舉將預期的列舉實例化時，這非常有用。例如，考慮 common 原始碼集中的以下列舉：

```kotlin
// 在 commonMain 原始碼集中：
expect enum class Department { IT, HR, Sales }
```

當您在平台原始碼集中為 `Department` 提供 `actual` 宣告時，您可以添加額外的常數：

```kotlin
// 在 jvmMain 原始碼集中：
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// 在 nativeMain 原始碼集中：
actual enum class Department { IT, HR, Sales, Marketing }
```

但是，在這種情況下，平台原始碼集中的這些額外常數將與通用程式碼中的常數不匹配。因此，編譯器要求您處理所有額外的情況。

在 `Department` 上實作 `when` 結構的函式需要一個 `else` 子句：

```kotlin
// 需要 else 子句：
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The HR Department")
        Department.Sales -> println("The Sales Department")
        else -> println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### expect 註解類別

`expect` 與 `actual` 宣告可以與註解一起使用。例如，您可以宣告一個 `@XmlSerializable` 註解，該註解在每個平台原始碼集中必須有一個相應的 `actual` 宣告：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

重用特定平台上的現有型別可能會有所幫助。例如，在 JVM 上，您可以使用來自 [JAXB 規範](https://javaee.github.io/jaxb-v2/) 的現有型別來定義註解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

對註解類別使用 `expect` 時還有一個額外的考量。註解用於將中繼資料附加到程式碼，並且不會以型別形式出現在簽章中。對於在永遠不需要它的平台上，預期註解不一定需要有實際類別。

您只需要在使用了註解的平台上提供 `actual` 宣告。此行為預設情況下未啟用，並且需要將型別標記為 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)。

取得上面宣告的 `@XmlSerializable` 註解並添加 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果在不需要實際宣告的平台上缺少該宣告，編譯器不會產生錯誤。

## 下一步

有關使用平台特定 API 的不同方式的一般建議，請參閱[使用平台特定 API](multiplatform-connect-to-apis.md)。