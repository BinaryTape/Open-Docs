[//]: # (title: 在 Kotlin 中使用 Java 記錄)

_記錄_ 是 Java 中用於儲存不可變資料的[類別](https://openjdk.java.net/jeps/395)。記錄攜帶一組固定的值 – 即 _記錄元件_。
它們在 Java 中具有簡潔的語法，並省去了您撰寫樣板程式碼的麻煩：

```java
// Java
public record Person (String name, int age) {}
```

編譯器會自動生成一個繼承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的最終類別，並包含以下成員：
*   每個記錄元件的私有最終欄位
*   一個帶有所有欄位參數的公開建構子
*   一組實作結構相等性的方法：`equals()`、`hashCode()`、`toString()`
*   一個用於讀取每個記錄元件的公開方法

記錄與 Kotlin 的[資料類別](data-classes.md)非常相似。

## 從 Kotlin 程式碼中使用 Java 記錄

您可以將在 Java 中宣告的帶有元件的記錄類別，以與在 Kotlin 中使用帶有屬性的類別相同的方式來使用。
要存取記錄元件，只需像對[Kotlin 屬性](properties.md)一樣，使用其名稱即可：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中宣告記錄

Kotlin 僅支援對資料類別進行記錄宣告，且該資料類別必須符合[要求](#requirements)。

要在 Kotlin 中宣告一個記錄類別，請使用 `@JvmRecord` 註解：

> 將 `@JvmRecord` 應用於現有類別不是一個二進位相容的變更。它會改變類別屬性存取器的命名慣例。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

此 JVM 特有註解啟用生成：

*   類別檔案中與類別屬性相對應的記錄元件
*   根據 Java 記錄命名慣例命名的屬性存取器方法

資料類別提供了 `equals()`、`hashCode()` 和 `toString()` 方法的實作。

### 要求

要宣告一個帶有 `@JvmRecord` 註解的資料類別，它必須符合以下要求：

*   該類別必須位於目標為 JVM 16 位元組碼的模組中（如果啟用了 `-Xjvm-enable-preview` 編譯器選項，則為 15）。
*   該類別不能顯式繼承任何其他類別（包括 `Any`），因為所有 JVM 記錄都隱式繼承 `java.lang.Record`。然而，該類別可以實作介面。
*   該類別不能宣告任何帶有幕後欄位的屬性 – 除了那些從對應的主建構子參數初始化的屬性。
*   該類別不能宣告任何帶有幕後欄位且可變的屬性。
*   該類別不能是局部類別。
*   該類別的主建構子必須與類別本身一樣可見。

### 啟用 JVM 記錄

JVM 記錄要求生成的 JVM 位元組碼目標版本為 `16` 或更高。

要明確指定它，請在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 編譯器選項。

## 進一步討論

有關更進一步的技術細節和討論，請參閱這份 [JVM 記錄的語言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。