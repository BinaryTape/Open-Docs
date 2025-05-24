---
title: "Delegated properties"
---
いくつかの一般的な種類のプロパティは、必要なときに毎回手動で実装できますが、一度実装してライブラリに追加し、後で再利用する方が役立ちます。例：

* _遅延 (Lazy)_ プロパティ: 値は最初のアクセス時にのみ計算されます。
* _監視可能 (Observable)_ プロパティ: このプロパティへの変更についてリスナーに通知されます。
* 各プロパティに個別のフィールドを使用する代わりに、_マップ (map)_ にプロパティを格納します。

これらの（およびその他の）ケースを網羅するために、Kotlinは_委譲プロパティ (delegated properties)_ をサポートしています。

```kotlin
class Example {
    var p: String by Delegate()
}
```

構文は `val/var <プロパティ名>: <型 (Type)> by <式 (expression)>` です。`by` の後の式は_デリゲート (delegate)_ です。
プロパティに対応する `get()` (および `set()`) は、その `getValue()` メソッドと `setValue()` メソッドに委譲されるためです。
プロパティデリゲートはインターフェースを実装する必要はありませんが、`getValue()` 関数 (および `var` の場合は `setValue()`) を提供する必要があります。

例：

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

`Delegate` のインスタンスに委譲する `p` から読み取ると、`Delegate` から `getValue()` 関数が呼び出されます。
その最初のパラメータは `p` の読み取り元のオブジェクトであり、2 番目のパラメータは `p` 自体の説明を保持します
(たとえば、その名前を取得できます)。

```kotlin
val e = Example()
println(e.p)
```

これは以下を出力します。

```
Example@33a17727, thank you for delegating 'p' to me!
```

同様に、`p` に割り当てると、`setValue()` 関数が呼び出されます。最初の 2 つのパラメータは同じであり、
3 番目のパラメータは割り当てられる値を保持します。

```kotlin
e.p = "NEW"
```

これは以下を出力します。
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

委譲されたオブジェクトの要件の仕様は、[下記](#property-delegate-requirements)にあります。

委譲されたプロパティは、関数またはコードブロック内で宣言できます。クラスのメンバーである必要はありません。
[例](#local-delegated-properties)を以下に示します。

## 標準デリゲート (Standard delegates)

Kotlin 標準ライブラリは、いくつかの便利な種類のデリゲートのファクトリメソッドを提供します。

### 遅延 (Lazy) プロパティ

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) は、ラムダを受け取り、遅延プロパティを実装するためのデリゲートとして機能できる `Lazy<T>` のインスタンスを返す関数です。
`get()` の最初の呼び出しは、`lazy()` に渡されたラムダを実行し、結果を記憶します。
後続の `get()` の呼び出しは、記憶された結果を返すだけです。

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

デフォルトでは、遅延プロパティの評価は*同期*されます。値は 1 つのスレッドでのみ計算されますが、すべてのスレッド
同じ値を参照します。初期化デリゲートの同期が複数のスレッド
同時に実行できるようにする必要がない場合は、`LazyThreadSafetyMode.PUBLICATION` を `lazy()` のパラメータとして渡します。

初期化がプロパティを使用するスレッドと同じスレッドで常に発生することが確実な場合は、
`LazyThreadSafetyMode.NONE` を使用できます。スレッドセーフティの保証や関連するオーバーヘッドは発生しません。

### 監視可能 (Observable) プロパティ

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)
は、2 つの引数を受け取ります。初期値と変更のハンドラです。

ハンドラは、プロパティに割り当てるたびに呼び出されます (割り当てが実行された*後*)。3 つのパラメータがあります。
割り当てられるプロパティ、古い値、新しい値です。

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

割り当てをインターセプトして*拒否 (veto)* したい場合は、`observable()` の代わりに [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) を使用します。
`vetoable` に渡されるハンドラは、新しいプロパティ値の割り当て*前*に呼び出されます。

## 別のプロパティへの委譲

プロパティは、その getter と setter を別のプロパティに委譲できます。このような委譲は、
トップレベルとクラスプロパティ (メンバーと拡張) の両方で使用できます。デリゲートプロパティは次のいずれかになります。
* トップレベルプロパティ
* 同じクラスのメンバーまたは拡張プロパティ
* 別のクラスのメンバーまたは拡張プロパティ

プロパティを別のプロパティに委譲するには、デリゲート名で `::` 修飾子を使用します。たとえば、`this::delegate` や
`MyClass::delegate` などです。

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

これは、たとえば、後方互換性のある方法でプロパティの名前を変更する場合に役立ちます。新しいプロパティを導入し、
古いプロパティに `@Deprecated` アノテーションを付けて、その実装を委譲します。

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

## マップ (map) にプロパティを格納する

一般的なユースケースの 1 つは、プロパティの値をマップに格納することです。
これは、JSON の解析やその他の動的なタスクの実行など、アプリケーションでよく発生します。
この場合、マップインスタンス自体を委譲されたプロパティのデリゲートとして使用できます。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

この例では、コンストラクタはマップを受け取ります。

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委譲されたプロパティは、プロパティの名前に関連付けられている文字列キーを介して、このマップから値を取得します。

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

これは、読み取り専用の `Map` の代わりに `MutableMap` を使用する場合、`var` のプロパティでも機能します。

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## ローカル委譲プロパティ (Local delegated properties)

ローカル変数を委譲されたプロパティとして宣言できます。
たとえば、ローカル変数を遅延させることができます。

```kotlin
fun example(computeFoo: () `->` Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 変数は、最初のアクセス時にのみ計算されます。
`someCondition` が失敗した場合、変数はまったく計算されません。

## プロパティデリゲートの要件 (Property delegate requirements)

*読み取り専用* プロパティ (`val`) の場合、デリゲートは次のパラメータを持つ演算子関数 `getValue()` を提供する必要があります。

* `thisRef` は、*プロパティ所有者* と同じ型、またはそのスーパータイプである必要があります (拡張プロパティの場合、拡張される型である必要があります)。
* `property` は、`KProperty<*>` 型またはそのスーパータイプである必要があります。

`getValue()` は、プロパティと同じ型 (またはそのサブタイプ) を返す必要があります。

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

*可変* プロパティ (`var`) の場合、デリゲートは追加で次のパラメータを持つ演算子関数 `setValue()` を提供する必要があります。

* `thisRef` は、*プロパティ所有者* と同じ型、またはそのスーパータイプである必要があります (拡張プロパティの場合、拡張される型である必要があります)。
* `property` は、`KProperty<*>` 型またはそのスーパータイプである必要があります。
* `value` は、プロパティと同じ型 (またはそのスーパータイプ) である必要があります。
 
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

`getValue()` および/または `setValue()` 関数は、デリゲートクラスのメンバー関数として、または拡張関数として提供できます。
後者は、これらの関数を元々提供していないオブジェクトにプロパティを委譲する必要がある場合に便利です。
両方の関数は、`operator` キーワードでマークする必要があります。

Kotlin 標準ライブラリのインターフェース `ReadOnlyProperty` および `ReadWriteProperty` を使用して、新しいクラスを作成せずに匿名オブジェクトとしてデリゲートを作成できます。
これらは必要なメソッドを提供します。`getValue()` は `ReadOnlyProperty` で宣言されています。`ReadWriteProperty`
それを拡張し、`setValue()` を追加します。これは、`ReadOnlyProperty` が期待される場合はいつでも `ReadWriteProperty` を渡すことができることを意味します。

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

## 委譲されたプロパティの変換ルール (Translation rules for delegated properties)

Kotlin コンパイラは、内部的には、いくつかの種類の委譲されたプロパティの補助プロパティを生成し、それらに委譲します。

:::note
最適化のために、コンパイラはいくつかのケースでは補助プロパティを生成*しません* ([委譲されたプロパティの最適化されたケース](#optimized-cases-for-delegated-properties))。
[別のプロパティへの委譲](#translation-rules-when-delegating-to-another-property)の例で最適化について学びます。

:::

たとえば、プロパティ `prop` の場合、非表示のプロパティ `prop$delegate` が生成され、アクセサのコードは
この追加のプロパティに委譲するだけです。

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

Kotlin コンパイラは、引数に必要なすべての情報を `prop` について提供します。最初の引数 `this` は
外部クラス `C` のインスタンスを参照し、`this::prop` は `prop` 自体を記述する `KProperty` 型のリフレクションオブジェクトです。

### 委譲されたプロパティの最適化されたケース (Optimized cases for delegated properties)

デリゲートが次のいずれかの場合、`$delegate` フィールドは省略されます。
* 参照されるプロパティ:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 名前付きオブジェクト:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* バッキングフィールドとデフォルトの getter を持つ同じモジュール内の final `val` プロパティ:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 定数式、enum エントリ、`this`、`null`。`this` の例:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 別のプロパティへの委譲時の変換ルール (Translation rules when delegating to another property)

別のプロパティに委譲する場合、Kotlin コンパイラは参照されるプロパティへの直接アクセスを生成します。
つまり、コンパイラはフィールド `prop$delegate` を生成しません。この最適化は、メモリの節約に役立ちます。

たとえば、次のコードを見てください。

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 変数のプロパティアクセサは、委譲されたプロパティの `getValue` および `setValue` 演算子をスキップして、`impl` 変数を直接呼び出します。
したがって、`KProperty` 参照オブジェクトは必要ありません。

上記のコードの場合、コンパイラは次のコードを生成します。

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

## デリゲートの提供 (Providing a delegate)

`provideDelegate` 演算子を定義することにより、プロパティの実装
が委譲されるオブジェクトの作成ロジックを拡張できます。`by` の右側で使用されるオブジェクトが `provideDelegate` をメンバーまたは拡張関数として定義している場合、
その関数が呼び出されて、プロパティデリゲートインスタンスが作成されます。

`provideDelegate` の考えられるユースケースの 1 つは、初期化時にプロパティの一貫性をチェックすることです。

たとえば、バインドする前にプロパティ名をチェックするには、次のように記述できます。

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

`provideDelegate` のパラメータは、`getValue` のパラメータと同じです。

* `thisRef` は、*プロパティ所有者* と同じ型、またはそのスーパータイプである必要があります (拡張プロパティの場合、拡張される型である必要があります)。
* `property` は、`KProperty<*>` 型またはそのスーパータイプである必要があります。

`provideDelegate` メソッドは、`MyUI` インスタンスの作成中に各プロパティに対して呼び出され、
必要な検証をすぐに行います。

プロパティとそのデリゲート間のバインドをインターセプトするこの機能がない場合、同じ機能を実現するには
プロパティ名を明示的に渡す必要があり、これはあまり便利ではありません。

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

生成されたコードでは、`provideDelegate` メソッドが呼び出されて補助 `prop$delegate` プロパティが初期化されます。
プロパティ宣言 `val prop: Type by MyDelegate()` の生成されたコードを、生成されたコードと
[上記](#translation-rules-for-delegated-properties) で比較してください (`provideDelegate` メソッドが存在しない場合)。

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

`provideDelegate` メソッドは補助プロパティの作成にのみ影響し、
getter または setter 用に生成されたコードには影響しないことに注意してください。

標準ライブラリの `PropertyDelegateProvider` インターフェースを使用すると、新しいクラスを作成せずにデリゲートプロバイダーを作成できます。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property `->`
    ReadOnlyProperty<Any?, Int> {_, property `->` 42 }
}
val delegate: Int by provider
```