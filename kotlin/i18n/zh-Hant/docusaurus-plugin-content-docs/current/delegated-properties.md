---
title: "委託屬性 (Delegated properties)"
---
有些常見種類的屬性，即使每次需要時都可以手動實作，但最好還是實作一次，將它們新增到函式庫中，以便日後重複使用。 例如：

* _惰性 (Lazy)_ 屬性：值僅在第一次存取時計算。
* _可觀察 (Observable)_ 屬性：監聽器會收到此屬性變更的通知。
* 將屬性儲存在 _map_ 中，而不是為每個屬性使用單獨的欄位。

為了涵蓋這些（和其他）情況，Kotlin 支援 _委託屬性 (delegated properties)_：

```kotlin
class Example {
    var p: String by Delegate()
}
```

語法是：`val/var <屬性名稱 (property name)>: <類型 (Type)> by <表達式 (expression)>`。 `by` 後面的表達式是 _委託 (delegate)_，因為對應於該屬性的 `get()`（和 `set()`）將委託給其 `getValue()` 和 `setValue()` 方法。
屬性委託不必實作介面，但它們必須提供 `getValue()` 函式（以及 `var` 的 `setValue()`）。

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

當你從 `p` 讀取時，它會委託給 `Delegate` 的一個實例，並呼叫 `Delegate` 中的 `getValue()` 函式。
它的第一個參數是你從中讀取 `p` 的物件，第二個參數則保存 `p` 本身的描述
（例如，你可以取得它的名稱）。

```kotlin
val e = Example()
println(e.p)
```

這會印出：

```
Example@33a17727, thank you for delegating 'p' to me!
```

同樣地，當你賦值給 `p` 時，會呼叫 `setValue()` 函式。 前兩個參數相同，而
第三個參數則保存要賦予的值：

```kotlin
e.p = "NEW"
```

這會印出：
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

委託物件的需求規範可以在[下方](#property-delegate-requirements)找到。

你可以在函式或程式碼區塊內宣告委託屬性；它不必是類別的成員。
你可以在[下方](#local-delegated-properties)找到範例。

## 標準委託 (Standard delegates)

Kotlin 標準函式庫為幾種有用的委託提供了工廠方法 (factory methods)。

### 惰性屬性 (Lazy properties)

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一個接受 lambda 表達式並回傳 `Lazy<T>` 實例的函式，可用作實作惰性屬性的委託。
第一次呼叫 `get()` 會執行傳遞給 `lazy()` 的 lambda 表達式並記住結果。
後續呼叫 `get()` 只會回傳記住的結果。

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

預設情況下，惰性屬性的評估是 *同步的 (synchronized)*：該值僅在一個執行緒中計算，但所有執行緒
都會看到相同的值。 如果不需要初始化委託的同步來允許多個執行緒
同時執行它，則將 `LazyThreadSafetyMode.PUBLICATION` 作為參數傳遞給 `lazy()`。

如果你確定初始化始終發生在使用該屬性的同一個執行緒中，
則可以使用 `LazyThreadSafetyMode.NONE`。 它不承擔任何執行緒安全保證和相關的額外負擔。

### 可觀察屬性 (Observable properties)

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)
接受兩個引數：初始值和修改的處理常式 (handler)。

每次你賦值給該屬性時（在 *執行* 賦值之後），都會呼叫該處理常式。 它有三個
參數：要賦值的屬性、舊值和新值：

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new `->`
        println("$old `->` $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

如果你想要攔截賦值並 *否決 (veto)* 它們，請使用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 而不是 `observable()`。
傳遞給 `vetoable` 的處理常式將在賦予新的屬性值 *之前* 呼叫。

## 委託給另一個屬性 (Delegating to another property)

一個屬性可以將其 getter 和 setter 委託給另一個屬性。 這種委託適用於
頂層和類別屬性（成員和擴充）。 委託屬性可以是：
* 一個頂層屬性
* 同一個類別的成員或擴充屬性
* 另一個類別的成員或擴充屬性

要將屬性委託給另一個屬性，請在委託名稱中使用 `::` 限定詞，例如，`this::delegate` 或
`MyClass::delegate`。

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

例如，當你想要以向後相容的方式重新命名屬性時，這可能會很有用：引入一個新屬性，
使用 `@Deprecated` 註解標記舊屬性，並委託其實作。

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

## 將屬性儲存在 map 中 (Storing properties in a map)

一個常見的用例是將屬性的值儲存在 map 中。
這在諸如解析 JSON 或執行其他動態任務之類的應用程式中經常出現。
在這種情況下，你可以使用 map 實例本身作為委託屬性的委託。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

在此範例中，建構函式 (constructor) 接受一個 map：

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委託屬性透過字串鍵從這個 map 中取得值，這些字串鍵與屬性的名稱相關聯：

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

    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25

}
```

如果使用 `MutableMap` 而不是唯讀 `Map`，這也適用於 `var` 的屬性：

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 區域委託屬性 (Local delegated properties)

你可以將區域變數宣告為委託屬性。
例如，你可以使區域變數為惰性的：

```kotlin
fun example(computeFoo: () `->` Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 變數僅在第一次存取時計算。
如果 `someCondition` 失敗，則根本不會計算該變數。

## 屬性委託需求 (Property delegate requirements)

對於 *唯讀* 屬性 (`val`)，委託應提供一個具有以下參數的運算子函式 `getValue()`：

* `thisRef` 必須與 *屬性擁有者 (property owner)* 的類型相同，或是其父類型（對於擴充屬性，它應該是要擴充的類型）。
* `property` 必須是 `KProperty<*>` 類型或其父類型。

`getValue()` 必須回傳與屬性相同的類型（或其子類型）。

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

對於 *可變* 屬性 (`var`)，委託還必須提供一個具有以下參數的運算子函式 `setValue()`：

* `thisRef` 必須與 *屬性擁有者 (property owner)* 的類型相同，或是其父類型（對於擴充屬性，它應該是要擴充的類型）。
* `property` 必須是 `KProperty<*>` 類型或其父類型。
* `value` 必須與屬性具有相同的類型（或其父類型）。
 
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

`getValue()` 和/或 `setValue()` 函式可以作為委託類別的成員函式或作為擴充函式提供。
當你需要將屬性委託給最初不提供這些函式的物件時，後者會很方便。
這兩個函式都需要使用 `operator` 關鍵字進行標記。

你可以建立委託作為匿名物件，而無需建立新類別，方法是使用 Kotlin 標準函式庫中的介面 `ReadOnlyProperty` 和 `ReadWriteProperty`。
它們提供了所需的方法：`getValue()` 在 `ReadOnlyProperty` 中宣告；`ReadWriteProperty`
擴充它並新增 `setValue()`。 這表示你可以在預期 `ReadOnlyProperty` 的任何地方傳遞 `ReadWriteProperty`。

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

## 委託屬性的翻譯規則 (Translation rules for delegated properties)

在底層，Kotlin 編譯器會為某些種類的委託屬性產生輔助屬性，然後委託給它們。

:::note
為了最佳化目的，在某些情況下，編譯器 [_不會_ 產生輔助屬性](#optimized-cases-for-delegated-properties)。
請透過[委託給另一個屬性的範例](#translation-rules-when-delegating-to-another-property) 瞭解有關最佳化的資訊。

:::

例如，對於屬性 `prop`，它會產生隱藏屬性 `prop$delegate`，並且存取子 (accessors) 的程式碼
只會委託給這個額外的屬性：

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

Kotlin 編譯器在引數中提供了關於 `prop` 的所有必要資訊：第一個引數 `this`
指的是外部類別 `C` 的實例，而 `this::prop` 是一個 `KProperty` 類型的反射物件，用於描述 `prop` 本身。

### 委託屬性的最佳化案例 (Optimized cases for delegated properties)

如果委託是以下情況，則會省略 `$delegate` 欄位：
* 參考的屬性：

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 具名物件 (named object)：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* 在同一個模組中具有 backing field 和預設 getter 的 final `val` 屬性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 常數表達式、enum 條目、`this`、`null`。 `this` 的範例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 委託給另一個屬性時的翻譯規則 (Translation rules when delegating to another property)

委託給另一個屬性時，Kotlin 編譯器會產生對被參考屬性的直接存取。
這表示編譯器不會產生欄位 `prop$delegate`。 這種最佳化有助於節省記憶體。

以以下程式碼為例：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 變數的屬性存取子直接呼叫 `impl` 變數，跳過委託屬性的 `getValue` 和 `setValue` 運算符，
因此不需要 `KProperty` 參考物件。

對於上面的程式碼，編譯器會產生以下程式碼：

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // This method is needed only for reflection
}
```

## 提供委託 (Providing a delegate)

透過定義 `provideDelegate` 運算符，你可以擴充用於建立委託屬性實作的物件的邏輯。
如果 `by` 右側使用的物件將 `provideDelegate` 定義為成員或擴充函式，則將呼叫該函式以建立屬性委託實例。

`provideDelegate` 的一種可能的用例是在初始化時檢查屬性的一致性。

例如，要在綁定之前檢查屬性名稱，你可以編寫如下內容：

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
        // create delegate
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

* `thisRef` 必須與 *屬性擁有者 (property owner)* 的類型相同，或是其父類型（對於擴充屬性，它應該是要擴充的類型）；
* `property` 必須是 `KProperty<*>` 類型或其父類型。

在建立 `MyUI` 實例期間，會為每個屬性呼叫 `provideDelegate` 方法，並且它會立即執行
必要的驗證。

如果沒有這種攔截屬性和其委託之間的綁定的能力，為了實現相同的功能，
你必須顯式傳遞屬性名稱，這不是很方便：

```kotlin
// Checking the property name without "provideDelegate" functionality
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // create delegate
}
```

在產生的程式碼中，呼叫 `provideDelegate` 方法以初始化輔助 `prop$delegate` 屬性。
將屬性宣告 `val prop: Type by MyDelegate()` 產生的程式碼與
[上面](#translation-rules-for-delegated-properties)（當 `provideDelegate` 方法不存在時）產生的程式碼進行比較：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler 
// when the 'provideDelegate' function is available:
class C {
    // calling "provideDelegate" to create the additional "delegate" property
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

請注意，`provideDelegate` 方法僅影響輔助屬性的建立，而不影響為 getter 或 setter 產生的程式碼。

使用標準函式庫中的 `PropertyDelegateProvider` 介面，你可以建立委託提供者，而無需建立新類別。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property `->`
    ReadOnlyProperty<Any?, Int> {_, property `->` 42 }
}
val delegate: Int by provider
```