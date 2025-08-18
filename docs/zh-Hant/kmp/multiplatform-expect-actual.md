[//]: # (title: 預期與實際宣告)

預期與實際宣告讓您能從 Kotlin Multiplatform 模組存取平台特定 API。您可以在通用程式碼中提供平台無關的 API。

> 本文描述了預期與實際宣告的語言機制。有關使用平台特定 API 的不同方式的一般建議，請參閱 [使用平台特定 API](multiplatform-connect-to-apis.md)。
>
{style="tip"}

## 預期與實際宣告的規則

若要定義預期與實際宣告，請遵循以下規則：

1.  在通用原始碼集中，宣告一個標準的 Kotlin 結構。這可以是函式、屬性、類別、介面、列舉或註解。
2.  使用 `expect` 關鍵字標記此結構。這就是您的 _預期宣告_。這些宣告可以在通用程式碼中使用，但不應包含任何實作。相反地，平台特定程式碼會提供此實作。
3.  在每個平台特定原始碼集中，於相同的套件中宣告相同的結構，並使用 `actual` 關鍵字標記。這就是您的 _實際宣告_，通常包含使用平台特定函式庫的實作。

在針對特定目標編譯期間，編譯器會嘗試將其找到的每個 _實際_ 宣告與通用程式碼中對應的 _預期_ 宣告進行匹配。編譯器確保：

*   通用原始碼集中的每個預期宣告在每個平台特定原始碼集中都有一個匹配的實際宣告。
*   預期宣告不包含任何實作。
*   每個實際宣告都與對應的預期宣告共享相同的套件，例如 `org.mygroup.myapp.MyType`。

在為不同平台產生結果程式碼時，Kotlin 編譯器會合併相互對應的預期與實際宣告。它會為每個平台產生一個具有其實際實作的宣告。在通用程式碼中每次使用預期宣告都會呼叫結果平台程式碼中正確的實際宣告。

當您使用不同目標平台之間共享的中介原始碼集時，您可以宣告實際宣告。例如，將 `iosMain` 視為在 `iosX64Main`、`iosArm64Main` 和 `iosSimulatorArm64Main` 平台原始碼集之間共享的中介原始碼集。通常只有 `iosMain` 包含實際宣告，而不是平台原始碼集。Kotlin 編譯器隨後將使用這些實際宣告來為對應的平台生成結果程式碼。

IDE 協助處理常見問題，包括：

*   遺失的宣告
*   包含實作的預期宣告
*   不匹配的宣告簽章
*   不同套件中的宣告

您也可以使用 IDE 從預期宣告導航至實際宣告。選擇邊欄圖示以檢視實際宣告或使用[快捷鍵](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

![從預期宣告到實際宣告的 IDE 導航](expect-actual-gutter.png){width=500}

## 使用預期與實際宣告的不同方法

讓我們探索使用 expect/actual 機制的不同選項，以解決存取平台 API 的問題，同時仍在通用程式碼中提供與其協同工作的方法。

考量一個 Kotlin Multiplatform 專案，您需要在其中實作 `Identity` 型別，它應包含使用者的登入名稱和目前的處理序 ID。該專案具有 `commonMain`、`jvmMain` 和 `nativeMain` 原始碼集，以使應用程式在 JVM 和像 iOS 這樣的原生環境中工作。

### 預期與實際函式

您可以定義一個 `Identity` 型別和一個工廠函式 `buildIdentity()`，它在通用原始碼集中宣告並在平台原始碼集中以不同方式實作：

1.  在 `commonMain` 中，宣告一個簡單的型別並預期一個工廠函式：

    ```kotlin
    package identity

    class Identity(val userName: String, val processID: Long)
   
    expect fun buildIdentity(): Identity
    ```

2.  在 `jvmMain` 原始碼集中，使用標準 Java 函式庫實作解決方案：

    ```kotlin
    package identity
   
    import java.lang.System
    import java.lang.ProcessHandle

    actual fun buildIdentity() = Identity(
        System.getProperty("user.name") ?: "None",
        ProcessHandle.current().pid()
    )
    ```

3.  在 `nativeMain` 原始碼集中，使用原生依賴項實作 [POSIX](https://en.wikipedia.org/wiki/POSIX) 解決方案：

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

在這裡，平台函式會回傳平台特定的 `Identity` 實例。

> 從 Kotlin 1.9.0 開始，使用 `getlogin()` 和 `getpid()` 函式需要 `@OptIn` 註解。
>
{style="note"}

### 帶有預期與實際函式的介面

如果工廠函式變得太大，請考慮使用一個通用的 `Identity` 介面，並在不同平台上以不同方式實作它。

一個 `buildIdentity()` 工廠函式應該回傳 `Identity`，但這次，它是一個實作通用介面的物件：

1.  在 `commonMain` 中，定義 `Identity` 介面和 `buildIdentity()` 工廠函式：

    ```kotlin
    // In the commonMain source set:
    expect fun buildIdentity(): Identity
    
    interface Identity {
        val userName: String
        val processID: Long
    }
    ```

2.  建立介面的平台特定實作，無需額外使用預期與實際宣告：

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

這些平台函式會回傳平台特定的 `Identity` 實例，它們被實作為 `JVMIdentity` 和 `NativeIdentity` 平台型別。

#### 預期與實際屬性

您可以修改先前的範例，並預期一個 `val` 屬性來儲存 `Identity`。

將此屬性標記為 `expect val`，然後在平台原始碼集中實作它：

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

當 `IdentityBuilder` 預期在每個平台上都是單例時，您可以將其定義為一個預期物件，並讓平台實作它：

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

為了建立鬆耦合架構，許多 Kotlin 專案採用依賴注入 (DI) 框架。DI 框架允許根據當前環境將依賴注入到組件中。

例如，在測試和生產環境中，或是在部署到雲端與本地端託管時，您可能會注入不同的依賴。只要依賴透過介面表達，就可以注入任意數量的不同實作，無論是在編譯時還是執行時。

當依賴是平台特定時，相同的原則也適用。在通用程式碼中，一個組件可以使用常規的 [Kotlin 介面](https://kotlinlang.org/docs/interfaces.html)來表達其依賴。然後可以配置 DI 框架以注入平台特定的實作，例如來自 JVM 或 iOS 模組。

這表示預期與實際宣告僅在 DI 框架的配置中才需要。請參閱 [使用平台特定 API](multiplatform-connect-to-apis.md#dependency-injection-framework) 以獲取範例。

透過這種方法，您可以簡單地透過使用介面和工廠函式來採用 Kotlin Multiplatform。如果您已經使用 DI 框架來管理專案中的依賴，我們建議使用相同的方法來管理平台依賴。

### 預期與實際類別

> 預期與實際類別處於 [Beta](supported-platforms.md#general-kotlin-stability-levels) 階段。它們幾乎穩定，但未來可能需要遷移步驟。我們將盡力減少您需要進行的任何進一步更改。
>
{style="warning"}

您可以使用預期與實際類別來實作相同的解決方案：

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

您可能已經在演示材料中看過這種方法。但是，在介面就足夠的簡單情況下使用類別是 _不建議的_。

使用介面，您不會將設計限制為每個目標平台一個實作。此外，在測試中替換一個虛假實作或在單一平台上提供多個實作要容易得多。

作為一般規則，盡可能依賴標準語言結構，而不是使用預期與實際宣告。

如果您確實決定使用預期與實際類別，Kotlin 編譯器會警告您該功能的 Beta 狀態。要抑制此警告，請將以下編譯器選項添加到您的 Gradle 建置檔中：

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 從平台類別繼承

在某些特殊情況下，將 `expect` 關鍵字與類別一起使用可能是最佳方法。假設 `Identity` 型別已存在於 JVM 上：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

為了適應現有程式碼庫和框架，您的 `Identity` 型別實作可以繼承此型別並重用其功能：

1.  為了解決這個問題，請在 `commonMain` 中使用 `expect` 關鍵字宣告一個類別：

    ```kotlin
    expect class CommonIdentity() {
        val userName: String
        val processID: Long
    }
    ```

2.  在 `nativeMain` 中，提供一個實作該功能的實際宣告：

    ```kotlin
    actual class CommonIdentity {
        actual val userName = getlogin()?.toKString() ?: "None"
        actual val processID = getpid().toLong()
    }
    ```

3.  在 `jvmMain` 中，提供一個繼承自平台特定基礎類別的實際宣告：

    ```kotlin
    actual class CommonIdentity : Identity() {
        actual val userName = login
        actual val processID = pid
    }
    ```

在這裡，`CommonIdentity` 型別與您自己的設計相容，同時利用了 JVM 上現有的型別。

#### 在框架中的應用

作為框架作者，您也會發現預期與實際宣告對您的框架很有用。

如果上述範例是框架的一部分，使用者必須從 `CommonIdentity` 派生一個型別以提供顯示名稱。

在這種情況下，預期宣告是抽象的，並宣告了一個抽象方法：

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

同樣地，實際實作也是抽象的，並宣告了 `displayName` 方法：

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

框架使用者需要編寫繼承自預期宣告的通用程式碼，並自行實作遺失的方法：

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

## 進階使用情境

預期與實際宣告有一些特殊的使用情境。

### 使用型別別名滿足實際宣告

實際宣告的實作不必從頭編寫。它可以是一個現有的型別，例如第三方函式庫提供的類別。

只要該型別符合與預期宣告相關的所有要求，您就可以使用它。例如，考量這兩個預期宣告：

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

在 JVM 模組中，`java.time.Month` 列舉可以用來實作第一個預期宣告，而 `java.time.LocalDate` 類別則用來實作第二個。然而，無法直接將 `actual` 關鍵字添加到這些型別。

相反地，您可以使用[型別別名](https://kotlinlang.org/docs/type-aliases.html)來連接預期宣告和平台特定型別：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在這種情況下，在與預期宣告相同的套件中定義 `typealias` 宣告，並在其他地方建立所引用的類別。

> 由於 `LocalDate` 型別使用 `Month` 列舉，您需要在通用程式碼中將它們兩者都宣告為預期類別。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 實際宣告中的擴展可見性

您可以讓實際實作比對應的預期宣告更具可見性。如果您不希望將 API 作為公共 API 暴露給通用客戶端，這會很有用。

目前，Kotlin 編譯器在可見性更改的情況下會發出錯誤。您可以透過將 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 套用到實際型別別名宣告來抑制此錯誤。從 Kotlin 2.0 開始，此限制將不再適用。

例如，如果您在通用原始碼集中宣告以下預期宣告：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

您也可以在平台特定原始碼集中使用以下實際實作：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

在這裡，一個內部預期類別透過型別別名具有一個現有的公共 `MyMessenger` 的實際實作。

### 實際化時額外的列舉條目

當列舉在通用原始碼集中使用 `expect` 宣告時，每個平台模組都應該有一個對應的 `actual` 宣告。這些宣告必須包含相同的列舉常數，但也可以有額外的常數。

當您使用現有的平台列舉來實際化預期列舉時，這會很有用。例如，考量通用原始碼集中的以下列舉：

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

當您在平台原始碼集中為 `Department` 提供實際宣告時，您可以添加額外的常數：

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

然而，在這種情況下，平台原始碼集中的這些額外常數將與通用程式碼中的不匹配。因此，編譯器要求您處理所有額外的案例。

在 `Department` 上實作 `when` 結構的函式需要一個 `else` 子句：

```kotlin
// An else clause is required:
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

### 預期註解類別

預期與實際宣告可以用於註解。例如，您可以宣告一個 `@XmlSerializable` 註解，它必須在每個平台原始碼集中都有一個對應的實際宣告：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

在特定平台上重用現有型別可能會有幫助。例如，在 JVM 上，您可以使用來自 [JAXB 規範](https://javaee.github.io/jaxb-v2/) 的現有型別來定義您的註解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

將 `expect` 與註解類別一起使用時還有一個額外的考量。註解用於將元資料附加到程式碼，並且不會以型別形式出現在簽章中。對於在從未需要的平台上，預期註解不一定需要有實際類別。

您只需要在使用該註解的平台上提供 `actual` 宣告。此行為預設不啟用，並且需要將型別標記為 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)。

以上面宣告的 `@XmlSerializable` 註解為例，並添加 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果實際宣告在不需要它的平台上遺失，編譯器將不會生成錯誤。

## 下一步是什麼？

有關使用平台特定 API 的不同方式的一般建議，請參閱 [使用平台特定 API](multiplatform-connect-to-apis.md)。