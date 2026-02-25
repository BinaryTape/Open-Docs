[//]: # (title: 在 Kotlin 中使用 Java Record)

_Record_ 是 Java 中用於儲存不可變資料的[類別](https://openjdk.java.net/jeps/395)。Record 攜帶一組固定的值 —— 即 _Record 元件_ (record components)。
它們在 Java 中具有簡潔的語法，並能讓您免於編寫樣板程式碼 (boilerplate code)：

```java
// Java
public record Person (String name, int age) {}
```

編譯器會自動產生一個繼承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 類別，並包含以下成員：
* 為每個 Record 元件提供一個 private final 欄位
* 一個包含所有欄位參數的 public 建構函式
* 一組實作結構相等性的方法：`equals()`、`hashCode()`、`toString()`
* 為讀取每個 Record 元件提供一個 public 方法

Record 與 Kotlin [資料類別](data-classes.md) 非常相似。

## 在 Kotlin 程式碼中使用 Java Record

您可以像在 Kotlin 中使用具有屬性的類別一樣，使用在 Java 中宣告具有元件的 Record 類別。
要存取 Record 元件，只需使用其名稱，就像處理 [Kotlin 屬性](properties.md) 一樣：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中宣告 Record

Kotlin 僅支援對資料類別進行 Record 宣告，且該資料類別必須符合[需求](#requirements)。

要在 Kotlin 中宣告 Record 類別，請使用 `@JvmRecord` 註解：

> 將 `@JvmRecord` 套用於現有類別並非二進制相容的變更。它會改變類別屬性存取子的命名慣例。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

此 JVM 特有的註解可產生：

* 在類別檔案中產生與類別屬性相對應的 Record 元件
* 根據 Java Record 命名慣例命名的屬性存取子方法

資料類別提供 `equals()`、`hashCode()` 和 `toString()` 的方法實作。

### 需求

要使用 `@JvmRecord` 註解宣告資料類別，必須符合以下需求：

* 類別必須位於目標為 JVM 16 位元組碼的模組中（若啟用了 `-Xjvm-enable-preview` 編譯器選項，則可為 15）。
* 類別不能明確繼承任何其他類別（包括 `Any`），因為所有 JVM Record 都隱式繼承了 `java.lang.Record`。然而，該類別可以實作介面。
* 類別不能宣告任何具有支援欄位的屬性 —— 除非是從相對應的主建構函數參數初始化的屬性。
* 類別不能宣告任何具有支援欄位的可變屬性。
* 類別不能是區域的 (local)。
* 類別的主建構函數必須與類別本身具有相同的可見性。

### 啟用 JVM Record

JVM Record 需要產生的 JVM 位元組碼目標版本為 `16` 或更高。

若要明確指定，請在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven-compile-package.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 編譯器選項。

## 在 Kotlin 中為 Record 元件加上註解

<primary-label ref="experimental-general"/>

在 Java 中，Record 元件上的[註解](annotations.md)會自動傳遞到支援欄位、getter、setter 以及建構函式參數。
您可以在 Kotlin 中透過使用 [`all`](annotations.md#all-meta-target) 使用處目標來複製此行為。

> 若要使用 `all` 使用處目標，您必須選擇加入 (opt in)。請使用 `-Xannotation-target-all` 編譯器選項，或者在您的 `build.gradle.kts` 檔案中加入以下內容：
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

當您將 `@JvmRecord` 與 `@all:` 一起使用時，Kotlin 會：

* 將註解傳遞到屬性、支援欄位、建構函式參數、getter 和 setter。
* 如果註解支援 Java 的 `RECORD_COMPONENT`，則也會將註解套用到 Record 元件。

## 讓註解與 Record 元件搭配運作

要使[註解](annotations.md)同時適用於 Kotlin 屬性 **以及** Java Record 元件，請在您的註解宣告中加入以下元註解 (meta-annotations)：

* 對於 Kotlin：[`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* 對於 Java Record 元件：[`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

您現在可以將 `@ExampleClass` 套用到 Kotlin 類別和屬性，以及 Java 類別和 Record 元件。

## 進一步討論

請參閱此 [JVM Record 語言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) 以了解更多技術細節與討論。