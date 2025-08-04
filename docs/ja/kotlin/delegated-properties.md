[//]: # (title: 委譲プロパティ)

一般的なプロパティの中には、必要になるたびに手動で実装することもできますが、一度実装してライブラリに追加し、後で再利用する方がより有用なものがあります。例えば:

*   _遅延プロパティ_: 値は最初のアクセス時にのみ計算されます。
*   _監視可能プロパティ_: リスナーはこのプロパティの変更について通知されます。
*   各プロパティに個別のフィールドを持つ代わりに、プロパティを_マップ_に格納する。

これらの（およびその他の）ケースに対応するため、Kotlinは_委譲プロパティ_をサポートしています。

```kotlin
class Example {
    var p: String by Delegate()
}
```

構文は次のとおりです: `val/var <property name>: <Type> by <expression>`。`by` の後の式は_デリゲート_です。これは、プロパティに対応する `get()` (および `set()`) が、その `getValue()` および `setValue()` メソッドに委譲されるためです。プロパティデリゲートはインターフェースを実装する必要はありませんが、`getValue()` 関数 (そして `var` の場合は `setValue()` ) を提供する必要があります。

例:

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

`Delegate` のインスタンスに委譲されている `p` を読み取る場合、`Delegate` の `getValue()` 関数が呼び出されます。その最初のパラメータは `p` を読み取るオブジェクトであり、2番目のパラメータは `p` 自体の説明を保持します（たとえば、その名前を取得できます）。

```kotlin
val e = Example()
println(e.p)
```

これは次のように出力します:

```
Example@33a17727, thank you for delegating 'p' to me!
```

同様に、`p` に代入する場合、`setValue()` 関数が呼び出されます。最初の2つのパラメータは同じで、3番目のパラメータには代入される値が保持されます:

```kotlin
e.p = "NEW"
```

これは次のように出力します:
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

委譲オブジェクトの要件の仕様は、[以下](#property-delegate-requirements)にあります。

委譲プロパティは関数やコードブロック内で宣言でき、クラスのメンバーである必要はありません。[ローカル委譲プロパティ](#local-delegated-properties)の例を以下で確認できます。

## 標準デリゲート

Kotlin標準ライブラリは、いくつかの有用な種類のデリゲートのためのファクトリメソッドを提供しています。

### 遅延プロパティ

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) は、ラムダを受け取り、`Lazy<T>` のインスタンスを返す関数であり、遅延プロパティを実装するためのデリゲートとして機能します。`get()` の最初の呼び出しで、`lazy()` に渡されたラムダが実行され、結果が記憶されます。`get()` のその後の呼び出しでは、記憶された結果が単純に返されます。

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

デフォルトでは、遅延プロパティの評価は_同期されます_。値は1つのスレッドでのみ計算されますが、すべてのスレッドは同じ値を見ることになります。複数のスレッドが同時に実行できるように、初期化デリゲートの同期が不要な場合は、`lazy()` のパラメータとして `LazyThreadSafetyMode.PUBLICATION` を渡します。

プロパティを使用するスレッドと初期化が常に同じスレッドで行われると確信している場合は、`LazyThreadSafetyMode.NONE` を使用できます。これはスレッドセーフティの保証や関連するオーバーヘッドを発生させません。

### 監視可能プロパティ

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) は2つの引数を取ります。初期値と変更のためのハンドラです。

ハンドラは、プロパティに代入するたびに（代入が実行された_後_に）呼び出されます。それは3つのパラメータを持ちます。代入されるプロパティ、古い値、そして新しい値です:

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

代入をインターセプトして_拒否_したい場合は、`observable()` の代わりに [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) を使用します。`vetoable` に渡されるハンドラは、新しいプロパティ値の代入が_行われる前_に呼び出されます。

## 他のプロパティへの委譲

プロパティは、そのゲッターとセッターを別のプロパティに委譲できます。このような委譲は、トップレベルプロパティとクラスプロパティ（メンバープロパティおよび拡張プロパティ）の両方で利用可能です。デリゲートプロパティは次のいずれかです:
*   トップレベルプロパティ
*   同じクラスのメンバープロパティまたは拡張プロパティ
*   別のクラスのメンバープロパティまたは拡張プロパティ

プロパティを別のプロパティに委譲するには、デリゲート名に `::` 修飾子を使用します。たとえば、`this::delegate` や `MyClass::delegate` のようにです。

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

これは、たとえば、プロパティを後方互換性のある方法で名前変更したい場合に役立ちます。新しいプロパティを導入し、古いプロパティに `@Deprecated` アノテーションを付け、その実装を委譲します。

```kotlin
class MyClass {
   var newName: Int = 0
   @Deprecated("Use 'newName' instead", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // 通知: 'oldName: Int' は非推奨です。
   // 代わりに 'newName' を使用してください
   myClass.oldName = 42
   println(myClass.newName) // 42
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## プロパティをマップに格納する

よくあるユースケースの1つは、プロパティの値をマップに格納することです。これは、JSONのパースやその他の動的なタスクを実行するアプリケーションでよく発生します。この場合、マップインスタンス自体を委譲プロパティのデリゲートとして使用できます。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

この例では、コンストラクタはマップを受け取ります:

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委譲プロパティは、プロパティの名前に対応する文字列キーを介して、このマップから値を取得します:

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
    println(user.name) // "John Doe" を出力
    println(user.age)  // 25 を出力
//sampleEnd
}
```
{kotlin-runnable="true"}

これは、読み取り専用の `Map` の代わりに `MutableMap` を使用する場合、`var` のプロパティでも機能します:

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## ローカル委譲プロパティ

ローカル変数を委譲プロパティとして宣言できます。たとえば、ローカル変数を遅延評価にすることができます:

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 変数は、最初のアクセス時にのみ計算されます。`someCondition` が失敗した場合、その変数は全く計算されません。

## プロパティデリゲートの要件

_読み取り専用_プロパティ (`val`) の場合、デリゲートは次のパラメータを持つ `getValue()` 演算子関数を提供する必要があります:

*   `thisRef` は、_プロパティ所有者_と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合は、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。

`getValue()` は、プロパティと同じ型（またはそのサブタイプ）を返さなければなりません。

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

_可変_プロパティ (`var`) の場合、デリゲートは追加で次のパラメータを持つ `setValue()` 演算子関数を提供する必要があります:

*   `thisRef` は、_プロパティ所有者_と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合は、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。
*   `value` は、プロパティと同じ型（またはそのスーパータイプ）である必要があります。
 
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

`getValue()` および/または `setValue()` 関数は、デリゲートクラスのメンバー関数として、または拡張関数として提供できます。後者は、これらの関数を本来提供していないオブジェクトにプロパティを委譲する必要がある場合に便利です。両方の関数は `operator` キーワードでマークする必要があります。

Kotlin標準ライブラリの `ReadOnlyProperty` および `ReadWriteProperty` インターフェースを使用することで、新しいクラスを作成することなく匿名オブジェクトとしてデリゲートを作成できます。これらは必要なメソッドを提供します: `getValue()` は `ReadOnlyProperty` で宣言され、`ReadWriteProperty` はそれを拡張して `setValue()` を追加します。これは、`ReadOnlyProperty` が期待される場所であればいつでも `ReadWriteProperty` を渡せることを意味します。

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

## 委譲プロパティの変換ルール

内部的には、Kotlinコンパイラは一部の種類の委譲プロパティに対して補助プロパティを生成し、それらに委譲します。 

> 最適化のため、コンパイラは[いくつかのケースで補助プロパティを生成_しません_](#optimized-cases-for-delegated-properties)。 
> [他のプロパティへの委譲の例](#translation-rules-when-delegating-to-another-property)で最適化について学びましょう。
>
{style="note"}

例えば、プロパティ `prop` の場合、隠しプロパティ `prop$delegate` を生成し、アクセサーのコードは単にこの追加プロパティに委譲されます:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 代わりにコンパイラによって生成されるコード:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlinコンパイラは、`prop` に関する必要な情報をすべて引数で提供します。最初の引数 `this` は外側のクラス `C` のインスタンスを参照し、`this::prop` は `prop` 自体を記述する `KProperty` 型のリフレクションオブジェクトです。

### 委譲プロパティの最適化されたケース

デリゲートが次のいずれかの場合、$delegate フィールドは省略されます:
*   参照されたプロパティ:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

*   名前付きオブジェクト:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

*   同じモジュール内のバッキングフィールドとデフォルトのゲッターを持つ最終 `val` プロパティ:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

*   定数式、enumエントリ、`this`、`null`。`this` の例:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 他のプロパティへの委譲時の変換ルール

他のプロパティに委譲する場合、Kotlinコンパイラは参照されたプロパティへの直接アクセスを生成します。これは、コンパイラが `prop$delegate` フィールドを生成しないことを意味します。この最適化はメモリの節約に役立ちます。

たとえば、以下のコードを見てみましょう:

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 変数のプロパティアクセサーは、委譲プロパティの `getValue` および `setValue` 演算子をスキップして、`impl` 変数を直接呼び出すため、`KProperty` 参照オブジェクトは不要です。

上記のコードに対して、コンパイラは次のコードを生成します:

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // このメソッドはリフレクションのためにのみ必要です
}
```

## デリゲートの提供

`provideDelegate` 演算子を定義することで、プロパティの実装が委譲されるオブジェクトを作成するためのロジックを拡張できます。`by` の右側に使用されるオブジェクトが `provideDelegate` をメンバー関数または拡張関数として定義している場合、その関数が呼び出されてプロパティデリゲートインスタンスが作成されます。

`provideDelegate` の可能なユースケースの1つは、プロパティの初期化時にその一貫性をチェックすることです。

例えば、バインディング前にプロパティ名をチェックするには、次のように記述できます:

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
        // デリゲートを作成
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

`provideDelegate` のパラメータは、`getValue` のパラメータと同じです:

*   `thisRef` は、_プロパティ所有者_と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合は、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。

`provideDelegate` メソッドは、`MyUI` インスタンスの作成中に各プロパティに対して呼び出され、必要な検証をすぐに行います。

プロパティとそのデリゲート間のバインディングをインターセプトするこの機能がなければ、同じ機能を実現するためにはプロパティ名を明示的に渡す必要があり、これはあまり便利ではありません:

```kotlin
// "provideDelegate" 機能なしでプロパティ名をチェック
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // デリゲートを作成
}
```

生成されたコードでは、補助プロパティ `prop$delegate` を初期化するために `provideDelegate` メソッドが呼び出されます。プロパティ宣言 `val prop: Type by MyDelegate()` の生成されたコードを、[上記](#translation-rules-for-delegated-properties)の生成されたコード（`provideDelegate` メソッドがない場合）と比較してください:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// コンパイラによって生成されるコード 
// 'provideDelegate' 関数が利用可能な場合:
class C {
    // "provideDelegate" を呼び出して追加の "delegate" プロパティを作成
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

`provideDelegate` メソッドは補助プロパティの作成のみに影響し、ゲッターやセッターのために生成されるコードには影響しないことに注意してください。

標準ライブラリの `PropertyDelegateProvider` インターフェースを使用すると、新しいクラスを作成せずにデリゲートプロバイダを作成できます。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider
```