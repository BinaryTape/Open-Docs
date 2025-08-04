[//]: # (title: 委託屬性)

對於一些常見的屬性類型，即使您每次需要時都可以手動實作它們，但將它們實作一次、加入函式庫中並日後重複使用會更有幫助。例如：

*   延遲屬性 (Lazy properties)：值只在首次存取時計算。
*   可觀察屬性 (Observable properties)：監聽器會在屬性變更時收到通知。
*   將屬性儲存在映射 (map) 中，而不是為每個屬性單獨建立欄位。

為了解決這些（以及其他）情況，Kotlin 支援委託屬性 (delegated properties)：

```kotlin
class Example {
    var p: String by Delegate()
}
```

語法是：`val/var <property name>: <Type> by <expression>`。`by` 後面的表達式是一個委託 (delegate)，因為對應於該屬性的 `get()`（以及 `set()`）將委託給其 `getValue()` 和 `setValue()` 方法。屬性委託 (Property delegates) 不需要實作介面，但它們必須提供 `getValue()` 函數（以及 `var` 的 `setValue()`）。

例如：

```kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

當您從委託給 `Delegate` 實例的 `p` 讀取時，會呼叫 `Delegate` 中的 `getValue()` 函數。其第一個參數是您從中讀取 `p` 的物件，第二個參數則包含 `p` 本身的描述（例如，您可以取得其名稱）。

```kotlin
val e = Example()
println(e.p)
```

這將印出：

```
Example@33a17727, thank you for delegating 'p' to me!
```

同樣地，當您為 `p` 賦值時，`setValue()` 函數會被呼叫。前兩個參數相同，第三個參數則包含被賦予的值：

```kotlin
e.p = "NEW"
```

這將印出：
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

委託物件的需求規格可在[下方](#property-delegate-requirements)找到。

您可以在函數或程式碼區塊內宣告委託屬性；它不必是類別的成員。您可以在[下方](#local-delegated-properties)找到一個範例。

## 標準委託

Kotlin 標準函式庫為幾種有用的委託類型提供了工廠方法。

### 延遲屬性

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一個接受 Lambda 並返回 `Lazy<T>` 實例的函數，該實例可用作實作延遲屬性的委託。首次呼叫 `get()` 會執行傳遞給 `lazy()` 的 Lambda 並記住結果。隨後的 `get()` 呼叫只會返回記住的結果。

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main() {
    println(lazyValue)
    println(lazyValue)
}
```
{kotlin-runnable="true"}

預設情況下，延遲屬性的評估是**同步的 (synchronized)**：值只在一個執行緒中計算，但所有執行緒都會看到相同的值。如果不需要初始化委託的同步處理來允許多個執行緒同時執行它，則將 `LazyThreadSafetyMode.PUBLICATION` 作為參數傳遞給 `lazy()`。

如果您確定初始化始終會發生在您使用該屬性的同一個執行緒中，則可以使用 `LazyThreadSafetyMode.NONE`。它不會產生任何執行緒安全保證和相關的開銷。

### 可觀察屬性

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 接受兩個參數：初始值和一個用於修改的處理器。

處理器會在每次您為屬性賦值時（**在**賦值操作執行**之後**）被呼叫。它有三個參數：正在被賦值的屬性、舊值和新值：

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```
{kotlin-runnable="true"}

如果您想攔截賦值並**否決 (veto)** 它們，請使用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 而不是 `observable()`。傳遞給 `vetoable` 的處理器將在新的屬性值賦值**之前**被呼叫。

## 委託給另一個屬性

一個屬性可以將其 getter 和 setter 委託給另一個屬性。此類委託適用於頂層屬性 (top-level properties) 和類別屬性（成員屬性 (member properties) 和擴充屬性 (extension properties)）。委託屬性可以是：
*   頂層屬性
*   同一個類別的成員屬性或擴充屬性
*   另一個類別的成員屬性或擴充屬性

要將一個屬性委託給另一個屬性，請在委託名稱中使用 `::` 限定符，例如 `this::delegate` 或 `MyClass::delegate`。

```kotlin
var topLevelInt: Int = 0
class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt
    
    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}
var MyClass.extDelegated: Int by ::topLevelInt
```

這可能很有用，例如，當您想要以向後相容的方式重新命名屬性時：引入一個新屬性，使用 `@Deprecated` 註解標記舊屬性，並委託其實作。

```kotlin
class MyClass {
   var newName: Int = 0
   @Deprecated("Use 'newName' instead", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // Notification: 'oldName: Int' is deprecated.
   // Use 'newName' instead
   myClass.oldName = 42
   println(myClass.newName) // 42
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## 將屬性儲存在映射中

一個常見的用例是將屬性值儲存在映射 (map) 中。這經常出現在解析 JSON 或執行其他動態任務等應用程式中。在這種情況下，您可以將映射實例本身用作委託屬性的委託。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

在此範例中，建構函數接受一個映射：

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委託屬性透過字串鍵從此映射中獲取值，這些字串鍵與屬性名稱相關聯：

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))
//sampleStart
    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25
//sampleEnd
}
```
{kotlin-runnable="true"}

如果您使用 `MutableMap` 而非唯讀 `Map`，這也適用於 `var` 屬性：

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 區域委託屬性

您可以將區域變數宣告為委託屬性 (Local delegated properties)。例如，您可以讓一個區域變數延遲載入 (lazy)：

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 變數只會在首次存取時計算。如果 `someCondition` 失敗，該變數將完全不會被計算。

## 屬性委託要求

對於唯讀屬性 (`val`)，委託應提供一個帶有以下參數的 `operator` 函數 `getValue()`：

*   `thisRef` 必須與**屬性擁有者 (property owner)** 的類型相同或為其超類型（對於擴充屬性，它應該是被擴充的類型）。
*   `property` 必須是 `KProperty<*>` 類型或其超類型。

`getValue()` 必須返回與屬性相同類型（或其子類型）的值。

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

對於可變屬性 (`var`)，委託必須額外提供一個帶有以下參數的 `operator` 函數 `setValue()`：

*   `thisRef` 必須與**屬性擁有者 (property owner)** 的類型相同或為其超類型（對於擴充屬性，它應該是被擴充的類型）。
*   `property` 必須是 `KProperty<*>` 類型或其超類型。
*   `value` 必須與屬性相同類型（或其超類型）。
 
```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

`getValue()` 和/或 `setValue()` 函數可以作為委託類別的成員函數或作為擴充函數提供。後者在您需要將屬性委託給一個原本不提供這些函數的物件時很方便。這兩個函數都需要用 `operator` 關鍵字標記。

您可以使用 Kotlin 標準函式庫中的 `ReadOnlyProperty` 和 `ReadWriteProperty` 介面，將委託建立為匿名物件，而無需建立新類別。它們提供了所需的方法：`getValue()` 在 `ReadOnlyProperty` 中宣告；`ReadWriteProperty` 則擴充它並添加 `setValue()`。這表示只要預期 `ReadOnlyProperty`，您就可以傳遞一個 `ReadWriteProperty`。

```kotlin
fun resourceDelegate(resource: Resource = Resource()): ReadWriteProperty<Any?, Resource> =
    object : ReadWriteProperty<Any?, Resource> {
        var curValue = resource 
        override fun getValue(thisRef: Any?, property: KProperty<*>): Resource = curValue
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: Resource) {
            curValue = value
        }
    }

val readOnlyResource: Resource by resourceDelegate()  // ReadWriteProperty as val
var readWriteResource: Resource by resourceDelegate()
```

## 委託屬性的轉譯規則

在底層，Kotlin 編譯器會為某些類型的委託屬性生成輔助屬性 (auxiliary properties)，然後將其委託給這些輔助屬性。

> 為了最佳化目的，編譯器在幾種情況下**不會 (does not)** 生成輔助屬性 (auxiliary properties)。
> 透過[委託給另一個屬性](#translation-rules-when-delegating-to-another-property)的範例了解最佳化。
>
{style="note"}

例如，對於屬性 `prop`，它會生成隱藏屬性 `prop$delegate`，並且存取器的程式碼會直接委託給這個額外的屬性：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler instead:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 編譯器在參數中提供了關於 `prop` 的所有必要資訊：第一個參數 `this` 指的是外部類別 `C` 的實例，而 `this::prop` 是一個 `KProperty` 類型的反射物件，描述了 `prop` 本身。

### 委託屬性的最佳化情況

如果委託是以下情況，則會省略 `$delegate` 欄位：
*   一個被引用的屬性：

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

*   一個具名物件 (named object)：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

*   同一個模組中具有支援欄位 (backing field) 和預設 getter 的最終 `val` 屬性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

*   常數表達式 (constant expression)、列舉條目 (enum entry)、`this`、`null`。`this` 的範例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 委託給另一個屬性時的轉譯規則

當委託給另一個屬性時，Kotlin 編譯器會生成對被引用屬性的直接存取。這表示編譯器不會生成 `prop$delegate` 欄位。此最佳化有助於節省記憶體。

以下列程式碼為例：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 變數的屬性存取器會直接呼叫 `impl` 變數，跳過委託屬性的 `getValue` 和 `setValue` 運算子，因此不需要 `KProperty` 參考物件。

對於上述程式碼，編譯器會生成以下程式碼：

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // 此方法僅用於反射
}
```

## 提供委託

透過定義 `provideDelegate` 運算子，您可以擴展用於建立屬性實作所委託物件的邏輯。如果 `by` 右側使用的物件將 `provideDelegate` 定義為成員或擴充函數，該函數將被呼叫以建立屬性委託實例。

`provideDelegate` 的其中一個可能用例是在屬性初始化時檢查其一致性。

例如，要在綁定前檢查屬性名稱，您可以這樣寫：

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}
    
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // 建立委託
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate` 的參數與 `getValue` 的參數相同：

*   `thisRef` 必須與**屬性擁有者 (property owner)** 的類型相同或為其超類型（對於擴充屬性，它應該是被擴充的類型）；
*   `property` 必須是 `KProperty<*>` 類型或其超類型。

在建立 `MyUI` 實例期間，`provideDelegate` 方法會為每個屬性呼叫，並立即執行必要的驗證。

如果沒有這種攔截屬性及其委託之間綁定的能力，要實現相同的功能，您必須明確傳遞屬性名稱，這不是很方便：

```kotlin
// 無需 "provideDelegate" 功能檢查屬性名稱
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // 建立委託
}
```

在生成的程式碼中，會呼叫 `provideDelegate` 方法來初始化輔助屬性 `prop$delegate`。比較屬性宣告 `val prop: Type by MyDelegate()` 的生成程式碼與[上方](#translation-rules-for-delegated-properties)（當 `provideDelegate` 方法不存在時）的生成程式碼：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler 
// when the 'provideDelegate' function is available:
class C {
    // 呼叫 "provideDelegate" 以建立額外的 "delegate" 屬性
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

請注意，`provideDelegate` 方法只影響輔助屬性的建立，不影響 getter 或 setter 所生成的程式碼。

透過標準函式庫中的 `PropertyDelegateProvider` 介面，您可以無需建立新類別即可建立委託提供者。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider
```