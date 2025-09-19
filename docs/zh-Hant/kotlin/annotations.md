[//]: # (title: 註解)

註解是將元資料附加到程式碼的一種方式。若要宣告註解，請在類別前面加上 `annotation` 修飾符：

```kotlin
annotation class Fancy
```

註解的額外屬性可以透過使用元註解註解註解類別來指定：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 指定可以使用該註解註解的元素種類（例如類別、函式、屬性及表達式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定註解是否儲存在編譯後的類別檔案中，以及它在執行時期是否可透過反射可見（預設兩者皆為 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允許在單一元素上多次使用相同的註解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定該註解是公開 API 的一部分，應包含在產生的 API 文件中所示的類別或方法簽章中。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER,
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 用法

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

如果您需要註解類別的主要建構函式，您需要在建構函式宣告中添加 `constructor` 關鍵字，並在其前面添加註解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

您也可以註解屬性存取器：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 建構函式

註解可以具有接受參數的建構函式。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允許的參數型別為：

 * 對應 Java 原始型別的型別（Int、Long 等）
 * 字串
 * 類別（`Foo::class`）
 * 列舉
 * 其他註解
 * 上述型別的陣列

註解參數不能具有可空型別，因為 JVM 不支援將 `null` 作為註解屬性的值儲存。

如果註解用作另一個註解的參數，其名稱不會以 `@` 字元作為前綴：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果您需要將類別指定為註解的引數，請使用 Kotlin 類別（[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)）。Kotlin 編譯器會自動將其轉換為 Java 類別，以便 Java 程式碼可以正常存取註解和引數。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 實例化

在 Java 中，註解型別是一種介面，因此您可以實作它並使用實例。作為此機制的替代方案，Kotlin 允許您在任意程式碼中呼叫註解類別的建構函式，並類似地使用結果實例。

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

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解有關註解類別實例化的更多資訊。

## Lambda 運算式

註解也可以用於 Lambda 運算式。它們將應用於 Lambda 運算式主體所產生的 `invoke()` 方法。這對於像 [Quasar](https://docs.paralleluniverse.co/quasar/) 這樣的框架很有用，它使用註解進行並行控制。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 註解使用點目標

當您註解屬性或主要建構函式參數時，會從對應的 Kotlin 元素產生多個 Java 元素，因此註解在產生的 Java 位元組碼中可能有多個位置。若要精確指定如何產生註解，請使用以下語法：

```kotlin
class Example(@field:Ann val foo,    // 僅註解 Java 欄位
              @get:Ann val bar,      // 僅註解 Java 取值器
              @param:Ann val quux)   // 僅註解 Java 建構函式參數
```

相同的語法可以用於註解整個檔案。為此，請將目標為 `file` 的註解放在檔案的頂層，在套件指令之前，如果檔案位於預設套件中，則放在所有 import 語句之前：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果您有多個具有相同目標的註解，您可以透過在目標後添加方括號並將所有註解放在方括號內來避免重複目標（`all` 元目標除外）：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支援的使用點目標完整列表為：

  * `file`
  * `field`
  * `property` (具有此目標的註解在 Java 中不可見)
  * `get` (屬性取值器)
  * `set` (屬性設置器)
  * `all` (用於屬性的實驗性元目標，請參閱[下方](#all-meta-target)了解其目的和用法)
  * `receiver` (擴充函式或屬性的接收器參數)

    若要註解擴充函式的接收器參數，請使用以下語法：

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```

  * `param` (建構函式參數)
  * `setparam` (屬性設置器參數)
  * `delegate` (儲存委託屬性委託實例的欄位)

### 未指定使用點目標時的預設值

如果您未指定使用點目標，則會根據所使用註解的 `@Target` 註解選擇目標。
如果有多個適用目標，則使用以下列表中的第一個適用目標：

* `param`
* `property`
* `field`

讓我們使用 [Jakarta Bean Validation 中的 `@Email` 註解](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)：

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

使用此註解，請考慮以下範例：

```kotlin
data class User(val username: String,
                // @Email 等效於 @param:Email
                @Email val email: String) {
    // @Email 等效於 @field:Email
    @Email val secondaryEmail: String? = null
}
```

Kotlin 2.2.0 引入了一個實驗性預設規則，這應該能使註解傳播到參數、欄位和屬性的行為更具可預測性。

根據新規則，如果有多個適用目標，則選擇一個或多個，如下所示：

* 如果建構函式參數目標 (`param`) 適用，則使用它。
* 如果屬性目標 (`property`) 適用，則使用它。
* 如果欄位目標 (`field`) 適用而 `property` 不適用，則使用 `field`。

使用相同的範例：

```kotlin
data class User(val username: String,
                // @Email 現在等效於 @param:Email @field:Email
                @Email val email: String) {
    // @Email 仍等效於 @field:Email
    @Email val secondaryEmail: String? = null
}
```

如果有多個目標，並且 `param`、`property` 或 `field` 皆不適用，則該註解無效。

若要啟用新的預設規則，請在您的 Gradle 配置中使用以下行：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

無論何時您想使用舊行為，您可以：

* 在特定情況下，明確指定必要的目標，例如使用 `@param:Annotation` 而不是 `@Annotation`。
* 對於整個專案，請在您的 Gradle 建置檔案中使用此旗標：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

### `all` 元目標

<primary-label ref="experimental-opt-in"/>

`all` 目標使得將相同的註解不僅應用於參數和屬性或欄位，還應用於對應的取值器和設置器變得更加容易。

具體而言，標記為 `all` 的註解，如果適用，會傳播到：

* 建構函式參數 (`param`)，如果屬性是在主要建構函式中定義的。
* 屬性本身 (`property`)。
* 支援欄位 (`field`)，如果屬性有支援欄位。
* 取值器 (`get`)。
* 設置器參數 (`setparam`)，如果屬性定義為 `var`。
* 僅限 Java 的目標 `RECORD_COMPONENT`，如果類別具有 `@JvmRecord` 註解。

讓我們使用 [Jakarta Bean Validation 中的 `@Email` 註解](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email)，其定義如下：

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

在以下範例中，此 `@Email` 註解將應用於所有相關目標：

```kotlin
data class User(
    val username: String,
    // 將 @Email 應用於 param、field 和 get
    @all:Email val email: String,
    // 將 @Email 應用於 param、field、get 和 setparam
    @all:Email var name: String,
) {
    // 將 @Email 應用於 field 和 getter (沒有 param 因為它不在建構函式中)
    @all:Email val secondaryEmail: String? = null
}
```

您可以在主要建構函式內部和外部的任何屬性中使用 `all` 元目標。

#### 限制

`all` 目標有一些限制：

* 它不會將註解傳播到型別、潛在的擴充接收器，或上下文接收器或參數。
* 它不能與多個註解一起使用：
    ```kotlin
    @all:[A B] // 禁止，請使用 @all:A @all:B
    val x: Int = 5
    ```
* 它不能與[委託屬性](delegated-properties.md)一起使用。

#### 如何啟用

若要在您的專案中啟用 `all` 元目標，請在命令列中使用以下編譯器選項：

```Bash
-Xannotation-target-all
```

或者將其添加到您的 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

## Java 註解

Java 註解與 Kotlin 100% 相容：

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 將 @Rule 註解應用於屬性取值器
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

由於 Java 中撰寫的註解參數順序未定義，您不能使用常規函式呼叫語法來傳遞引數。相反地，您需要使用具名引數語法：

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

就像在 Java 中一樣，`value` 參數是一個特例；它的值可以在沒有明確名稱的情況下指定：

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

如果 Java 中的 `value` 引數是陣列型別，它在 Kotlin 中會變成 `vararg` 參數：

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

對於其他具有陣列型別的引數，您需要使用陣列字面量語法或 `arrayOf(...)`：

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

註解實例的值以屬性形式公開給 Kotlin 程式碼：

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

如果 Kotlin 註解在其 Kotlin 目標中包含 `TYPE`，則該註解會在其 Java 註解目標列表映射到 `java.lang.annotation.ElementType.TYPE_USE`。這就像 `TYPE_PARAMETER` Kotlin 目標映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。這對於 API 等級低於 26 的 Android 用戶端來說是個問題，這些 API 等級在 API 中沒有這些目標。

若要避免產生 `TYPE_USE` 和 `TYPE_PARAMETER` 註解目標，請使用新的編譯器引數 `-Xno-new-java-annotation-targets`。

## 可重複註解

就像[在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)一樣，Kotlin 擁有可重複註解，可以多次應用於單一程式碼元素。若要使您的註解可重複，請使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元註解標記其宣告。這將使其在 Kotlin 和 Java 中都可重複。Java 可重複註解也受到 Kotlin 的支援。

與 Java 中使用的方案主要區別在於缺少一個 _包含註解_，Kotlin 編譯器會自動生成一個預定義名稱。對於以下範例中的註解，它將產生包含註解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 編譯器產生 @Tag.Container 包含註解
```

您可以透過應用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元註解並傳遞一個明確宣告的包含註解類別作為引數來為包含註解設定自訂名稱：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

若要透過反射提取 Kotlin 或 Java 可重複註解，請使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函式。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解有關 Kotlin 可重複註解的更多資訊。