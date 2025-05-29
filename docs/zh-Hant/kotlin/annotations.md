[//]: # (title: 註解)

註解是用於將中繼資料附加到程式碼的方法。若要宣告註解，請在類別前面加上 `annotation` 修飾符：

```kotlin
annotation class Fancy
```

註解的其他屬性可以透過使用元註解註解註解類別來指定：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 指定了可以被註解的元素種類（例如類別、函式、屬性以及運算式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定了註解是否儲存在編譯後的類別檔案中，以及它是否可在執行時透過反射可見（預設兩者皆為 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允許在單一元素上多次使用相同的註解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定了該註解是公開 API 的一部分，並且應包含在產生出的 API 文件中顯示的類別或方法簽章中。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 用途

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

如果您需要註解類別的主建構子，您需要將 `constructor` 關鍵字新增到建構子宣告中，並在其前面新增註解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

您也可以註解屬性存取子：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 建構子

註解可以有接受參數的建構子。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允許的參數類型為：

 * 對應 Java 基本型別（Int、Long 等）的類型
 * 字串
 * 類別（`Foo::class`）
 * 列舉
 * 其他註解
 * 上述類型組成的陣列

註解參數不能具有可空類型，因為 JVM 不支援將 `null` 儲存為註解屬性的值。

如果一個註解被用作另一個註解的參數，其名稱不以 `@` 字元作為前綴：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果您需要將類別指定為註解的引數，請使用 Kotlin 類別 ([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))。Kotlin 編譯器會自動將其轉換為 Java 類別，以便 Java 程式碼可以正常存取註解和引數。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 實例化

在 Java 中，註解類型是一種介面形式，因此您可以實作它並使用實例。
作為此機制的一個替代方案，Kotlin 允許您在任意程式碼中呼叫註解類別的建構子，並以類似方式使用產生的實例。

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

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多關於註解類別實例化的資訊。

## Lambda 表達式

註解也可以用於 Lambda 表達式。它們將應用於 Lambda 主體產生出的 `invoke()` 方法。這對於像 [Quasar](https://docs.paralleluniverse.co/quasar/) 這樣的框架很有用，該框架使用註解進行並行控制。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 註解用途站點目標

當您註解屬性或主建構子參數時，有許多從對應的 Kotlin 元素產生出的 Java 元素，因此在產生出的 Java 位元組碼中有註解的多個可能位置。要指定註解應該如何精確地產生，請使用以下語法：

```kotlin
class Example(@field:Ann val foo,    // 註解 Java 欄位
              @get:Ann val bar,      // 註解 Java Getter
              @param:Ann val quux)   // 註解 Java 建構子參數
```

相同的語法可以用於註解整個檔案。為此，請在檔案頂層，於 `package` 指令之前或在檔案處於預設封裝時於所有 `import` 之前，放置一個目標為 `file` 的註解：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果您有多個具有相同目標的註解，可以透過在目標後面新增括號並將所有註解放入括號內來避免重複目標：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支援的用途站點目標的完整清單是：

  * `file`
  * `property` (具有此目標的註解對於 Java 不可見)
  * `field`
  * `get` (屬性 Getter)
  * `set` (屬性 Setter)
  * `receiver` (擴充函式或屬性的接收者參數)
  * `param` (建構子參數)
  * `setparam` (屬性 Setter 參數)
  * `delegate` (儲存委託屬性之委託實例的欄位)

要註解擴充函式的接收者參數，請使用以下語法：

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

如果您未指定用途站點目標，則目標會根據所使用的 `@Target` 註解來選擇。如果有多個適用目標，則使用以下清單中的第一個適用目標：

  * `param`
  * `property`
  * `field`

## Java 註解

Java 註解與 Kotlin 100% 相容：

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 將 @Rule 註解應用於屬性 Getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

由於用 Java 編寫的註解其參數順序未定義，因此您不能使用常規函式呼叫語法來傳遞引數。相反，您需要使用具名引數語法：

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

就像在 Java 中一樣，特殊情況是 `value` 參數；其值可以在沒有明確名稱的情況下指定：

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

### 陣列作為註解參數

如果 Java 中的 `value` 引數具有陣列類型，它在 Kotlin 中會變成 `vararg` 參數：

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

對於具有陣列類型的其他引數，您需要使用陣列字面量語法或 `arrayOf(...)`：

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

### 存取註解實例的屬性

註解實例的值作為屬性公開給 Kotlin 程式碼：

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

### 不產生 JVM 1.8+ 註解目標的能力

如果 Kotlin 註解在其 Kotlin 目標中包含 `TYPE`，則該註解會映射到其 Java 註解目標清單中的 `java.lang.annotation.ElementType.TYPE_USE`。這與 `TYPE_PARAMETER` Kotlin 目標映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標的方式相同。這對於 API 級別低於 26 的 Android 用戶端來說是個問題，因為它們的 API 中不包含這些目標。

為避免產生 `TYPE_USE` 和 `TYPE_PARAMETER` 註解目標，請使用新的編譯器引數 `-Xno-new-java-annotation-targets`。

## 可重複註解

就像 [在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 一樣，Kotlin 具有可重複註解，它們可以多次應用於單一程式碼元素。要使您的註解可重複，請使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元註解標記其宣告。這將使其在 Kotlin 和 Java 中都可重複。Kotlin 側也支援 Java 可重複註解。

與 Java 中使用的方案主要不同之處在於缺少 _包含註解_，Kotlin 編譯器會以預定義的名稱自動產生它。對於以下範例中的註解，它將產生包含註解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 編譯器會產生 @Tag.Container 包含註解
```

您可以透過應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解並將明確宣告的包含註解類別作為引數傳遞，來為包含註解設定自訂名稱：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

若要透過反射提取 Kotlin 或 Java 可重複註解，請使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函式。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解更多關於 Kotlin 可重複註解的資訊。