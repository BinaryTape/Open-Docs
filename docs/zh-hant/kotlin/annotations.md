---
title: "註解 (Annotations)"
---
註解（Annotations）是用於將元數據附加到程式碼的一種方式。要宣告一個註解，請在類別（class）前面加上 `annotation` 修飾符：

```kotlin
annotation class Fancy
```

可以通過使用元註解（meta-annotations）來註解註解類別，以此指定註解的附加屬性：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 指定可以使用該註解來註解的元素種類（例如類別、函數、屬性和表達式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定註解是否儲存在已編譯的類別檔案中，以及它在運行時是否可通過反射（reflection）可見（預設情況下，兩者都為 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允許在單個元素上多次使用同一個註解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定該註解是公共 API 的一部分，並且應包含在產生的 API 文件中顯示的類別或方法簽名中。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 用法（Usage）

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

如果您需要註解類別的主建構式（primary constructor），您需要將 `constructor` 關鍵字新增到建構式宣告中，並在其前面新增註解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

您還可以註解屬性（property）的取值器（accessors）：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 建構式（Constructors）

註解可以具有帶參數的建構式。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允許的參數類型為：

 * 對應於 Java 原始類型（primitive types）的類型（Int、Long 等）
 * 字串（Strings）
 * 類別（Classes）（`Foo::class`）
 * 列舉（Enums）
 * 其他註解
 * 上述類型的陣列（Arrays）

註解參數不能具有可為空的類型（nullable types），因為 JVM 不支援將 `null` 儲存為註解屬性的值。

如果註解用作另一個註解的參數，則其名稱不帶 `@` 字元作為前綴：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果您需要將類別指定為註解的參數，請使用 Kotlin 類別 ([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))。 Kotlin 編譯器會自動將其轉換為 Java 類別，以便 Java 程式碼可以正常存取註解和參數。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 實例化（Instantiation）

在 Java 中，註解類型是一種介面（interface）的形式，因此您可以實作它並使用一個實例（instance）。作為這種機制的替代方案，Kotlin 允許您在任意程式碼中呼叫註解類別的建構式，並以類似的方式使用產生的實例。

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation) 中了解有關註解類別實例化的更多資訊。

## Lambda 表達式（Lambdas）

註解也可以在 Lambda 表達式上使用。它們將被應用於生成 Lambda 表達式主體的 `invoke()` 方法中。 這對於像 [Quasar](https://docs.paralleluniverse.co/quasar/) 這樣的框架很有用，它使用註解進行並發控制（concurrency control）。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 註解的使用位置目標（Annotation use-site targets）

當您註解屬性或主建構式參數時，會從相應的 Kotlin 元素生成多個 Java 元素，因此在生成的 Java 字節碼（bytecode）中，註解存在多個可能的位置。 要指定應如何準確地生成註解，請使用以下語法：

```kotlin
class Example(@field:Ann val foo,    // 註解 Java 欄位（field）
              @get:Ann val bar,      // 註解 Java getter
              @param:Ann val quux)   // 註解 Java 建構式參數
```

相同的語法可用於註解整個檔案。 為此，請將帶有目標 `file` 的註解放在檔案的頂層，放在套件（package）指令之前，或者如果該檔案位於預設套件中，則放在所有引入（import）之前：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果您有多個具有相同目標的註解，則可以通過在目標後新增方括號（brackets）並將所有註解放在方括號內來避免重複目標：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支援的使用位置目標的完整列表為：

  * `file`
  * `property`（具有此目標的註解對於 Java 不可見）
  * `field`
  * `get` (屬性 getter)
  * `set` (屬性 setter)
  * `receiver`（擴充函數或屬性的接收者參數）
  * `param` (建構式參數)
  * `setparam` (屬性 setter 參數)
  * `delegate`（儲存委託屬性的委託實例的欄位）

要註解擴充函數的接收者參數，請使用以下語法：

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

如果您未指定使用位置目標，則根據正在使用的註解的 `@Target` 註解來選擇目標。 如果有多個適用的目標，則使用以下列表中第一個適用的目標：

  * `param`
  * `property`
  * `field`

## Java 註解（Java annotations）

Java 註解與 Kotlin 100% 相容：

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 將 @Rule 註解應用於屬性 getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

由於以 Java 編寫的註解的參數順序未定義，因此您不能使用常規函數呼叫語法來傳遞參數。 而是，您需要使用具名參數語法：

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

就像在 Java 中一樣，一個特例是 `value` 參數； 可以在不使用顯式名稱的情況下指定其值：

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### 陣列作為註解參數（Arrays as annotation parameters）

如果 Java 中的 `value` 參數具有陣列類型，則它在 Kotlin 中變為 `vararg` 參數：

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

對於具有陣列類型的其他參數，您需要使用陣列字面值語法（array literal syntax）或 `arrayOf(...)`：

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### 存取註解實例的屬性（Accessing properties of an annotation instance）

註解實例的值作為屬性暴露給 Kotlin 程式碼：

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### 不生成 JVM 1.8+ 註解目標的能力（Ability to not generate JVM 1.8+ annotation targets）

如果 Kotlin 註解在其 Kotlin 目標中具有 `TYPE`，則該註解會對應到其 Java 註解目標列表中的 `java.lang.annotation.ElementType.TYPE_USE`。 這就像 `TYPE_PARAMETER` Kotlin 目標對應到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。 對於 API 等級低於 26 的 Android 客戶端（Android clients）而言，這是一個問題，因為它們的 API 中沒有這些目標。

要避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 註解目標，請使用新的編譯器引數（compiler argument）`-Xno-new-java-annotation-targets`。

## 可重複的註解（Repeatable annotations）

就像 [在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 一樣，Kotlin 具有可重複的註解，可以將其多次應用於單個程式碼元素。 要使您的註解可重複，請使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元註解標記其宣告。 這將使其在 Kotlin 和 Java 中都可重複。 Kotlin 端也支援 Java 可重複的註解。

與 Java 中使用的方案的主要區別在於缺少 _包含註解_（_containing annotation_），Kotlin 編譯器會使用預定義的名稱自動生成該註解。 對於下面範例中的註解，它將生成包含註解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 編譯器生成 @Tag.Container 包含註解
```

您可以通過應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解並傳遞顯式宣告的包含註解類別作為引數，從而為包含註解設定自訂名稱：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

要通過反射提取 Kotlin 或 Java 可重複的註解，請使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函數。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations) 中了解有關 Kotlin 可重複註解的更多資訊。