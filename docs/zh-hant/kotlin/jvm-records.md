---
title: "在 Kotlin 中使用 Java Records"
---
_紀錄 (Records)_ 是 Java 中用於儲存不可變資料的 [類別 (classes)](https://openjdk.java.net/jeps/395)。 紀錄帶有一組固定的值 – 即_紀錄元件 (records components)_。
它們在 Java 中具有簡潔的語法，並能避免您編寫重複程式碼：

```java
// Java
public record Person (String name, int age) {}
```

編譯器會自動產生一個繼承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 類別，其中包含以下成員：
* 每個紀錄元件的 private final 欄位
* 一個帶有所有欄位參數的 public 建構子
* 一組用於實現結構相等性的方法：`equals()`、`hashCode()`、`toString()`
* 一個用於讀取每個紀錄元件的 public 方法

紀錄與 Kotlin [資料類別 (data classes)](data-classes) 非常相似。

## 在 Kotlin 程式碼中使用 Java 紀錄

您可以使用在 Java 中宣告的、帶有元件的紀錄類別，使用方式與您在 Kotlin 中使用帶有屬性的類別相同。
要存取紀錄元件，只需像使用 [Kotlin 屬性 (properties)](properties) 一樣使用其名稱：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中宣告紀錄

Kotlin 僅支援資料類別的紀錄宣告，且該資料類別必須滿足[需求](#requirements)。

要在 Kotlin 中宣告紀錄類別，請使用 `@JvmRecord` 註解：

:::note
將 `@JvmRecord` 應用於現有類別並非二進位制相容的更改。 它會更改類別屬性存取器的命名慣例。

:::

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

這個 JVM 特定的註解能夠生成：

* 類別檔案中與類別屬性對應的紀錄元件
* 根據 Java 紀錄命名慣例命名的屬性存取器方法

資料類別提供 `equals()`、`hashCode()` 和 `toString()` 方法的實現。

### 需求

要宣告一個帶有 `@JvmRecord` 註解的資料類別，它必須滿足以下需求：

* 該類別必須位於以 JVM 16 位元組碼為目標的模組中（如果啟用了 `-Xjvm-enable-preview` 編譯器選項，則為 15）。
* 該類別不能顯式繼承任何其他類別（包括 `Any`），因為所有 JVM 紀錄都隱式繼承 `java.lang.Record`。 但是，該類別可以實現介面。
* 該類別不能宣告任何帶有後端欄位 (backing fields) 的屬性 – 除非是那些從相應的主建構子參數初始化的屬性。
* 該類別不能宣告任何帶有後端欄位的可變屬性。
* 該類別不能是區域的 (local)。
* 類別的主建構子必須與類別本身一樣可見。

### 啟用 JVM 紀錄

JVM 紀錄需要生成的 JVM 位元組碼的 `16` 目標版本或更高版本。

要顯式指定它，請在 [Gradle](gradle-compiler-options#attributes-specific-to-jvm) 或 [Maven](maven#attributes-specific-to-jvm) 中使用 `jvmTarget` 編譯器選項。

## 深入討論

有關更多技術細節和討論，請參閱此 [JVM 紀錄的語言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records)。