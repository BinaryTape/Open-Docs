[//]: # (title: 反射)

_反射_ 是一組語言和函式庫功能，允許您在執行時檢查程式的結構。
函數和屬性在 Kotlin 中是頭等公民，因此在使用函數式或響應式風格時，能夠檢查它們（例如，在執行時學習屬性或函數的名稱或類型）至關重要。

> Kotlin/JS 對反射功能提供了有限的支援。[深入了解 Kotlin/JS 中的反射](js-reflection.md)。
>
{style="note"}

## JVM 依賴

在 JVM 平台，Kotlin 編譯器發行版中包含使用反射功能所需的執行時組件，作為一個獨立的成品 `kotlin-reflect.jar`。這樣做的目的是為了減少不使用反射功能的應用程式所需的執行時函式庫大小。

要在 Gradle 或 Maven 專案中使用反射，請添加對 `kotlin-reflect` 的依賴：

*   在 Gradle 中：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:%kotlinVersion%"
    }
    ```

    </tab>
    </tabs>

*   在 Maven 中：
    
    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

如果您不使用 Gradle 或 Maven，請確保您的專案類別路徑中包含 `kotlin-reflect.jar`。
在其他支援的情況（使用命令列編譯器的 IntelliJ IDEA 專案）下，它會被預設添加。在命令列編譯器中，您可以使用 `-no-reflect` 編譯器選項將 `kotlin-reflect.jar` 從類別路徑中排除。

## 類別引用

最基本的反射功能是獲取 Kotlin 類別的執行時引用。要獲取對靜態已知 Kotlin 類別的引用，您可以使用_類別字面值_語法：

```kotlin
val c = MyClass::class
```

該引用是一個 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 類型的值。

>在 JVM 上：Kotlin 類別引用與 Java 類別引用不同。要獲取 Java 類別引用，請在 `KClass` 實例上使用 `.java` 屬性。
>
{style="note"}

### 綁定類別引用

您可以使用物件作為接收者，透過相同的 `::class` 語法獲取特定物件的類別引用：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

您將獲得物件的確切類別引用，例如 `GoodWidget` 或 `BadWidget`，無論接收者表達式的類型（`Widget`）是什麼。

## 可呼叫引用

函數、屬性和建構函式的引用也可以被呼叫或用作[函數類型](lambdas.md#function-types)的實例。

所有可呼叫引用的通用超類型是 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)，其中 `R` 是回傳值類型。它是屬性的屬性類型，也是建構函式所建構的類型。

### 函數引用

當您有如下宣告的具名函數時，您可以直接呼叫它 (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

或者，您可以將函數用作函數類型的值，即將其傳遞給另一個函數。為此，請使用 `::` 運算符：

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這裡 `::isOdd` 是一個函數類型 `(Int) -> Boolean` 的值。

函數引用屬於 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的其中一個子類型，具體取決於參數數量。例如，`KFunction3<T1, T2, T3, R>`。

當預期類型從上下文已知時，`::` 可以與多載函數一起使用。
例如：

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，您可以透過將方法引用儲存在具有明確指定類型的變數中來提供必要的上下文：

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

如果您需要使用類別成員或擴充函數，它需要被限定：`String::toCharArray`。

即使您使用對擴充函數的引用來初始化變數，推斷出的函數類型也不會有接收者，但它會有一個額外參數來接收接收者物件。要獲得帶有接收者的函數類型，請明確指定類型：

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 範例：函數組合

考慮以下函數：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

它回傳傳遞給它的兩個函數的組合：`compose(f, g) = f(g(*))`。
您可以將此函數應用於可呼叫引用：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 屬性引用

要在 Kotlin 中將屬性作為頭等物件存取，請使用 `::` 運算符：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表達式 `::x` 評估為 `KProperty0<Int>` 類型的屬性物件。您可以使用 `get()` 讀取其值，或使用 `name` 屬性檢索屬性名稱。有關更多資訊，請參閱 [`KProperty` 類別的文檔](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

對於可變屬性，例如 `var y = 1`，`::y` 會回傳 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 類型的值，該類型具有 `set()` 方法：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

屬性引用可以在預期單個泛型參數的函數的地方使用：

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要存取作為類別成員的屬性，請限定它，如下所示：

```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於擴充屬性：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 與 Java 反射的互操作性

在 JVM 平台上，標準函式庫包含反射類別的擴充功能，這些擴充功能提供了與 Java 反射物件之間的映射（請參閱套件 `kotlin.reflect.jvm`）。
例如，要查找後備欄位或作為 Kotlin 屬性的 getter 的 Java 方法，您可以這樣寫：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

要獲取與 Java 類別相對應的 Kotlin 類別，請使用 `.kotlin` 擴充屬性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 建構函式引用

建構函式可以像方法和屬性一樣被引用。您可以在程式預期函數類型物件的地方使用它們，該物件採用與建構函式相同的參數並回傳適當類型的物件。
建構函式透過使用 `::` 運算符並添加類別名稱來引用。考慮以下期望函數參數沒有參數且回傳類型為 `Foo` 的函數：

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即類別 `Foo` 的零參數建構函式，您可以像這樣呼叫它：

```kotlin
function(::Foo)
```

建構函式的可呼叫引用被類型化為 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的其中一個子類型，具體取決於參數數量。

### 綁定函數和屬性引用

您可以引用特定物件的實例方法：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此範例沒有直接呼叫 `matches` 方法，而是使用對它的引用。
這樣的引用被綁定到其接收者。
它可以直接呼叫（如上例所示）或在預期函數類型表達式時使用：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比較綁定引用和非綁定引用的類型。
綁定的可呼叫引用將其接收者「附加」到自身，因此接收者的類型不再是參數：

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

屬性引用也可以綁定：

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您不需要將 `this` 指定為接收者：`this::foo` 和 `::foo` 是等效的。

### 綁定建構函式引用

透過提供外部類別的實例，可以獲得對[內部類別](nested-classes.md#inner-classes)建構函式的綁定可呼叫引用：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner