---
title: "反射 (Reflection)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_反射 (Reflection)_ 是一組語言和函式庫特性，允許你在運行時檢查程式的結構。
函式和屬性在 Kotlin 中是一等公民，能夠檢查它們（例如，在運行時了解屬性或函式的名稱或類型）對於使用函數式或反應式風格至關重要。

:::note
Kotlin/JS 對反射特性的支援有限。[瞭解更多關於 Kotlin/JS 中的反射](js-reflection)。

:::

## JVM 相依性 (dependency)

在 JVM 平台，Kotlin 編譯器發佈版包含使用反射特性所需的運行時元件，作為一個單獨的工件 (`kotlin-reflect.jar`)。
這樣做是為了減少不使用反射特性的應用程式所需的運行時函式庫大小。

若要在 Gradle 或 Maven 專案中使用反射，請新增 `kotlin-reflect` 的相依性 (dependency)：

* 在 Gradle 中：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:2.1.20"
    }
    ```

    </TabItem>
    </Tabs>

* 在 Maven 中：
    
    ```xml
    <dependencies>
      <dependency>
          <groupId>org.jetbrains.kotlin</groupId>
          <artifactId>kotlin-reflect</artifactId>
      </dependency>
    </dependencies>
    ```

如果您不使用 Gradle 或 Maven，請確保您的專案的類別路徑 (classpath) 中有 `kotlin-reflect.jar`。
在其他支援的情況下（使用命令列編譯器或 Ant 的 IntelliJ IDEA 專案），預設會新增它。在命令列編譯器和 Ant 中，您可以使用 `-no-reflect` 編譯器選項將 `kotlin-reflect.jar` 從類別路徑 (classpath) 中排除。

## 類別參考 (Class references)

最基本的反射特性是取得 Kotlin 類別的運行時參考 (runtime reference)。若要取得對靜態已知的 Kotlin 類別的參考 (reference)，您可以使用 _類別字面值 (class literal)_ 語法：

```kotlin
val c = MyClass::class
```

該參考 (reference) 是 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 類型的值。

:::note
在 JVM 上：Kotlin 類別參考 (class reference) 與 Java 類別參考 (class reference) 不同。若要取得 Java 類別參考 (class reference)，請在 `KClass` 實例上使用 `.java` 屬性。

:::

### 綁定的類別參考 (Bound class references)

您可以使用相同的 `::class` 語法，透過將物件作為接收者 (receiver) 來取得對特定物件的類別的參考 (reference)：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

您將取得對物件的確切類別的參考 (reference)，例如 `GoodWidget` 或 `BadWidget`，而與接收者 (receiver) 表達式（`Widget`）的類型無關。

## 可呼叫參考 (Callable references)

函式、屬性和建構子的參考 (reference) 也可以被呼叫或用作 [函式類型](lambdas#function-types) 的實例。

所有可呼叫參考 (callable references) 的通用父類型是 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)，
其中 `R` 是傳回值類型。它是屬性的屬性類型，以及建構子的建構類型。

### 函式參考 (Function references)

當您有一個如下宣告的具名函式時，您可以直接呼叫它 (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

或者，您可以將該函式用作函式類型值，也就是將其傳遞給另一個函式。為此，請使用 `::` 運算子：

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {

    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))

}
```

此處 `::isOdd` 是一個函式類型 `(Int) `->` Boolean` 的值。

函式參考 (function references) 屬於 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的其中一個子類型，具體取決於參數計數。例如，`KFunction3<T1, T2, T3, R>`。

當預期類型從上下文中已知時，`::` 可以與多載函式一起使用。
例如：

```kotlin
fun main() {

    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)

}
```

或者，您可以透過將方法參考 (method reference) 儲存在具有顯式指定類型的變數中來提供必要的上下文：

```kotlin
val predicate: (String) `->` Boolean = ::isOdd   // refers to isOdd(x: String)
```

如果您需要使用類別的成員或擴充函式，則需要限定它：`String::toCharArray`。

即使您使用對擴充函式的參考 (reference) 初始化變數，推斷的函式類型也不會有接收者 (receiver)，但它會有一個額外的參數接受接收者 (receiver) 物件。若要改為具有帶有接收者 (receiver) 的函式類型，請顯式指定該類型：

```kotlin
val isEmptyStringList: List<String>.() `->` Boolean = List<String>::isEmpty
```

#### 範例：函式組合 (function composition)

考慮以下函式：

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}
```

它傳回傳遞給它的兩個函式的組合：`compose(f, g) = f(g(*))`。
您可以將此函式應用於可呼叫參考 (callable references)：

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {

    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))

}
```

### 屬性參考 (Property references)

若要在 Kotlin 中將屬性作為一等物件存取，請使用 `::` 運算子：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表達式 `::x` 求值為 `KProperty0<Int>` 類型屬性物件。您可以使用 `get()` 讀取其值，或使用 `name` 屬性檢索屬性名稱。有關更多資訊，請參閱 [`KProperty` 類別的文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

對於可變屬性，例如 `var y = 1`，`::y` 傳回具有 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 類型的值，該類型具有 `set()` 方法：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```

在預期具有單一泛型參數的函式的地方，可以使用屬性參考 (property reference)：

```kotlin
fun main() {

    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))

}
```

若要存取作為類別成員的屬性，請按如下方式限定它：

```kotlin
fun main() {

    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))

}
```

對於擴充屬性：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```

### 與 Java 反射的互通性 (Interoperability)

在 JVM 平台，標準函式庫包含反射類別的擴充，這些擴充提供與 Java 反射物件之間的映射（請參閱套件 `kotlin.reflect.jvm`）。
例如，若要尋找作為 Kotlin 屬性的 getter 的後備欄位或 Java 方法，您可以編寫如下內容：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

若要取得對應於 Java 類別的 Kotlin 類別，請使用 `.kotlin` 擴充屬性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 建構子參考 (Constructor references)

可以像方法和屬性一樣參考建構子。您可以在程式預期一個函式類型物件的任何地方使用它們，該物件採用與建構子相同的參數並傳回適當類型的物件。
建構子的參考 (reference) 方式是使用 `::` 運算子並新增類別名稱。考慮以下函式，該函式預期一個沒有參數且傳回類型為 `Foo` 的函式參數：

```kotlin
class Foo

fun function(factory: () `->` Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即類別 `Foo` 的零引數建構子，您可以像這樣呼叫它：

```kotlin
function(::Foo)
```

建構子的可呼叫參考 (callable references) 的類型為 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 子類型之一，具體取決於參數計數。

### 綁定的函式和屬性參考 (Bound function and property references)

您可以參考特定物件的實例方法：

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))

}
```

此範例沒有直接呼叫方法 `matches`，而是使用對它的參考 (reference)。
這樣的參考 (reference) 綁定到它的接收者 (receiver)。
它可以直接呼叫（如上面的範例所示），或者在預期函式類型表達式時使用：

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))

}
```

比較綁定和未綁定參考 (reference) 的類型。
綁定的可呼叫參考 (callable reference) 將其接收者 (receiver) 「附加」到它，因此接收者 (receiver) 的類型不再是參數：

```kotlin
val isNumber: (CharSequence) `->` Boolean = numberRegex::matches

val matches: (Regex, CharSequence) `->` Boolean = Regex::matches
```

屬性參考 (property reference) 也可以綁定：

```kotlin
fun main() {

    val prop = "abc"::length
    println(prop.get())

}
```

您不需要將 `this` 指定為接收者 (receiver)：`this::foo` 和 `::foo` 是等效的。

### 綁定的建構子參考 (Bound constructor references)

可以透過提供外部類別的實例來取得對 [內部類別](nested-classes#inner-classes) 的建構子的綁定的可呼叫參考 (bound callable reference)：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```