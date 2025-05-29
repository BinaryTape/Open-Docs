[//]: # (title: 反射)

_反射 (Reflection)_ 是一組語言和函式庫功能，讓您能夠在執行時內省程式的結構。函式和屬性在 Kotlin 中是第一級公民，而內省它們的能力（例如，在執行時獲取屬性或函式的名稱或類型）在使用函式式或響應式風格時至關重要。

> Kotlin/JS 對反射功能提供的支援有限。[了解更多關於 Kotlin/JS 中的反射](js-reflection.md)。
>
{style="note"}

## JVM 依賴項

在 JVM 平台上，Kotlin 編譯器發行版中包含使用反射功能所需的執行時組件，作為一個獨立的 artifact，即 `kotlin-reflect.jar`。這樣做是為了減少不使用反射功能的應用程式所需的執行時函式庫體積。

要在 Gradle 或 Maven 專案中使用反射，請新增對 `kotlin-reflect` 的依賴項：

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

如果您不使用 Gradle 或 Maven，請確保您的專案 classpath 中包含 `kotlin-reflect.jar`。在其他受支援的情況（使用命令列編譯器或 Ant 的 IntelliJ IDEA 專案）下，它預設會被添加。在命令列編譯器和 Ant 中，您可以使用 `-no-reflect` 編譯器選項將 `kotlin-reflect.jar` 從 classpath 中排除。

## 類別參考

最基本的反射功能是取得 Kotlin 類別的執行時參考。要取得對靜態已知 Kotlin 類別的參考，您可以使用_類別字面量 (class literal)_ 語法：

```kotlin
val c = MyClass::class
```

該參考是一個 `KClass` 類型的數值。

> 在 JVM 上：Kotlin 類別參考與 Java 類別參考不同。要取得 Java 類別參考，請在 `KClass` 實例上使用 `.java` 屬性。
>
{style="note"}

### 綁定類別參考

您可以使用相同的 `::class` 語法，將物件作為接收者 (receiver)，來取得特定物件類別的參考：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

您將取得物件的精確類別參考，例如 `GoodWidget` 或 `BadWidget`，無論接收者表達式的類型（`Widget`）為何。

## 可呼叫參考

對函式、屬性以及建構函式的參考，也可以被呼叫或作為[函式類型](lambdas.md#function-types)的實例使用。

所有可呼叫參考的共同超類型是 `KCallable<out R>`，其中 `R` 是回傳值類型。它是屬性的屬性類型，以及建構函式的建構類型。

### 函式參考

當您有一個如下聲明的具名函式時，您可以直接呼叫它 (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

或者，您可以將函式作為函式類型的值使用，即將它傳遞給另一個函式。為此，請使用 `::` 運算子：

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

這裡的 `::isOdd` 是一個函式類型 `(Int) -> Boolean` 的值。

函式參考屬於 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的子類型之一，具體取決於參數數量。例如，`KFunction3<T1, T2, T3, R>`。

當預期類型從上下文 (context) 中已知時，`::` 可以與重載函式一起使用。例如：

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // 指 isOdd(x: Int)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，您可以透過將方法參考儲存在具有明確指定類型的變數中來提供必要的上下文：

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // 指 isOdd(x: String)
```

如果您需要使用類別的成員或擴展函式，則需要對其進行限定：`String::toCharArray`。

即使您使用擴展函式的參考來初始化變數，推斷的函式類型也不會有接收者，但它會有一個額外的參數來接受接收者物件。要改為擁有帶有接收者的函式類型，請明確指定類型：

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 範例：函式組合

考慮以下函式：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

它回傳傳遞給它的兩個函式的組合：`compose(f, g) = f(g(*))`。您可以將此函式應用於可呼叫參考：

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

### 屬性參考

要將屬性作為第一級物件在 Kotlin 中訪問，請使用 `::` 運算子：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表達式 `::x` 求值為 `KProperty0<Int>` 類型的屬性物件。您可以使用 `get()` 讀取其值，或使用 `name` 屬性取得屬性名稱。欲了解更多資訊，請參閱 [關於 `KProperty` 類別的說明文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

對於像 `var y = 1` 這樣可變的屬性，`::y` 回傳一個 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 類型的值，它有一個 `set()` 方法：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

屬性參考可以用在需要單一泛型參數函式的地方：

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要訪問類別的成員屬性，請如下限定它：

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

對於擴展屬性：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 與 Java 反射的互操作性

在 JVM 平台上，標準函式庫包含用於反射類別的擴展，這些擴展提供與 Java 反射物件的相互映射（請參閱 `kotlin.reflect.jvm` 軟體包）。例如，要查找幕後欄位 (backing field) 或作為 Kotlin 屬性 getter 的 Java 方法，您可以這樣寫：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

要取得與 Java 類別相對應的 Kotlin 類別，請使用 `.kotlin` 擴展屬性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 建構函式參考

建構函式可以像方法和屬性一樣被參考。您可以將它們用在程式預期函式類型物件的地方，該物件接受與建構函式相同的參數並回傳適當類型的物件。透過使用 `::` 運算子並添加類別名稱來參考建構函式。考慮以下函式，它預期一個沒有參數且回傳類型為 `Foo` 的函式參數：

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即類別 `Foo` 的零參數建構函式，您可以這樣呼叫它：

```kotlin
function(::Foo)
```

對建構函式的可呼叫參考根據參數數量，被類型化為 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 子類型之一。

### 綁定函式和屬性參考

您可以參考特定物件的實例方法：

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

此範例沒有直接呼叫 `matches` 方法，而是使用對它的參考。這種參考被綁定到其接收者。它可以直接呼叫（如上述範例）或在預期函式類型表達式時使用：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比較綁定參考和非綁定參考的類型。綁定的可呼叫參考將其接收者「附著」於其上，因此接收者的類型不再是參數：

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

屬性參考也可以被綁定：

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您不需要將 `this` 指定為接收者：`this::foo` 和 `::foo` 是等效的。

### 綁定建構函式參考

綁定到[內部類別](nested-classes.md#inner-classes)建構函式的可呼叫參考，可以透過提供外部類別的實例來取得：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```