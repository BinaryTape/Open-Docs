[//]: # (title: 在 Kotlin 中使用 Java 記錄)

_記錄_ 是 Java 中用於儲存不可變資料的[類別](https://openjdk.java.net/jeps/395)。記錄攜帶一組固定值 – 即 _記錄元件_。
它們在 Java 中擁有簡潔的語法，並省去您撰寫樣板程式碼的麻煩：

```java
// Java
public record Person (String name, int age) {}
```

編譯器會自動生成一個繼承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 類別，並包含以下成員：
*   一個用於每個記錄元件的私有 final 欄位
*   一個包含所有欄位參數的公有建構函式
*   一組用於實作結構相等性的方法：`equals()`、`hashCode()`、`toString()`
*   一個用於讀取每個記錄元件的公有方法

記錄與 Kotlin 的[資料類別](data-classes.md)非常相似。

## 在 Kotlin 程式碼中使用 Java 記錄

您可以像在 Kotlin 中使用具有屬性的類別一樣，使用在 Java 中宣告元件的記錄類別。
若要存取記錄元件，只需使用其名稱，就像您處理 [Kotlin 屬性](properties.md)一樣：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中宣告記錄

Kotlin 僅支援資料類別的記錄宣告，且該資料類別必須符合[要求](#requirements)。

若要在 Kotlin 中宣告記錄類別，請使用 `@JvmRecord` 註解：

> 將 `@JvmRecord` 應用於現有類別不是一個二進位相容變更。它會改變類別屬性存取器的命名慣例。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

此 JVM 專用註解啟用產生：

*   類別檔案中對應於類別屬性的記錄元件
*   根據 Java 記錄命名慣例命名的屬性存取器方法

資料類別提供了 `equals()`、`hashCode()` 和 `toString()` 方法實作。

### 要求

若要使用 `@JvmRecord` 註解宣告資料類別，它必須符合以下要求：

*   該類別必須位於目標為 JVM 16 位元組碼（如果啟用 `-Xjvm-enable-preview` 編譯器選項，則為 15）的模組中。
*   該類別不能顯式繼承任何其他類別（包括 `Any`），因為所有 JVM 記錄都隱式繼承 `java.lang.Record`。然而，該類別可以實作介面。
*   該類別不能宣告任何帶有支援欄位的屬性 – 除非它們是從相應的主要建構函式參數初始化的。
*   該類別不能宣告任何帶有支援欄位的可變屬性。
*   該類別不能是局部的。
*   該類別的主要建構函式必須與類別本身具有相同的可見性。

### 啟用 JVM 記錄

JVM 記錄需要生成的 JVM 位元組碼目標版本為 `16` 或更高。

若要顯式指定它，請在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven-compile-package.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 編譯器選項。

## 在 Kotlin 中註解記錄元件

<primary-label ref="experimental-general"/>

在 Java 中，記錄元件上的[註解](annotations.md)會自動傳播到支援欄位、getter、setter 和建構函式參數。
您可以透過使用 [`all`](annotations.md#all-meta-target) 使用點目標在 Kotlin 中複製此行為。

> 若要使用 `all` 使用點目標，您必須選擇加入。您可以透過使用 `-Xannotation-target-all` 編譯器選項或將以下內容新增至您的 `build.gradle.kts` 檔案來實現：
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

當您將 `@JvmRecord` 與 `@all:` 一起使用時，Kotlin：

*   將註解傳播到屬性、支援欄位、建構函式參數、getter 和 setter。
*   如果註解支援 Java 的 `RECORD_COMPONENT`，也會將註解應用於記錄元件。

## 使註解適用於記錄元件

若要使[註解](annotations.md)同時適用於 Kotlin 屬性 **和** Java 記錄元件，請將以下中繼註解新增至您的註解宣告：

*   針對 Kotlin：[`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
*   針對 Java 記錄元件：[`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

您現在可以將 `@ExampleClass` 應用於 Kotlin 類別和屬性，以及 Java 類別和記錄元件。

## 進一步討論

請參閱此[JVM 記錄的語言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)，以獲取更多技術細節和討論。