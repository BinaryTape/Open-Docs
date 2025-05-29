[//]: # (title: 委譲プロパティ)

一般的な種類のプロパティの中には、必要になるたびに手動で実装することもできますが、一度実装してライブラリに追加し、後で再利用する方がより有用です。例えば、以下のものがあります:

*   _Lazy_ プロパティ: 値は最初のアクセス時にのみ計算されます。
*   _Observable_ プロパティ: リスナーは、このプロパティの変更について通知されます。
*   各プロパティに個別のフィールドを使用する代わりに、プロパティを _マップ_ に保存する。

これらの（およびその他の）ケースをカバーするため、Kotlinは_委譲プロパティ_をサポートしています:

```kotlin
class Example {
    var p: String by Delegate()
}
```

構文は `val/var <property name>: <Type> by <expression>` です。`by` の後の式は _デリゲート_ です。これは、プロパティに対応する `get()` (および `set()`) が、その `getValue()` および `setValue()` メソッドに委譲されるためです。プロパティデリゲートはインターフェースを実装する必要はありませんが、`getValue()` 関数（および `var` の場合は `setValue()`）を提供する必要があります。

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

`Delegate` のインスタンスに委譲されている `p` から読み取ると、`Delegate` の `getValue()` 関数が呼び出されます。その最初のパラメータは `p` を読み取る元のオブジェクトであり、2番目のパラメータは `p` 自体の説明（例えば、その名前を取得できます）を保持します。

```kotlin
val e = Example()
println(e.p)
```

これは以下を出力します:

```
Example@33a17727, thank you for delegating 'p' to me!
```

同様に、`p` に代入すると、`setValue()` 関数が呼び出されます。最初の2つのパラメータは同じで、3番目は代入される値を保持します:

```kotlin
e.p = "NEW"
```

これは以下を出力します:

```
NEW has been assigned to 'p' in Example@33a17727.
```

委譲されるオブジェクトの要件の仕様は、[以下](#property-delegate-requirements)で確認できます。

関数やコードブロック内で委譲プロパティを宣言できます。クラスのメンバーである必要はありません。[ローカル委譲プロパティの例](#local-delegated-properties)を以下で確認できます。

## 標準デリゲート

Kotlin標準ライブラリは、いくつかの有用な種類のデリゲートのためのファクトリメソッドを提供しています。

### Lazy プロパティ

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) はラムダを受け取り、`Lazy<T>` のインスタンスを返す関数であり、これはlazyプロパティの実装のためのデリゲートとして機能します。`get()` への最初の呼び出しは `lazy()` に渡されたラムダを実行し、結果を記憶します。それ以降の `get()` への呼び出しは、記憶された結果を単純に返します。

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

デフォルトでは、lazyプロパティの評価は*同期*されます。値は1つのスレッドでのみ計算されますが、すべてのスレッドが同じ値を見ます。複数のスレッドが同時に実行することを許可するために、初期化デリゲートの同期が不要な場合は、`LazyThreadSafetyMode.PUBLICATION` を `lazy()` のパラメータとして渡します。

プロパティを使用するスレッドと同じスレッドで常に初期化が行われると確信している場合は、`LazyThreadSafetyMode.NONE` を使用できます。これはスレッドセーフティ保証や関連するオーバーヘッドを発生させません。

### Observable プロパティ

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) は2つの引数を取ります: 初期値と変更のためのハンドラです。

ハンドラは、プロパティに代入するたびに（代入が実行された*後*に）呼び出されます。それは3つのパラメータを持ちます: 代入されるプロパティ、古い値、新しい値です:

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

代入をインターセプトして*拒否*したい場合は、`observable()` の代わりに [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) を使用します。`vetoable` に渡されるハンドラは、新しいプロパティ値の代入が実行される*前*に呼び出されます。

## 別のプロパティへの委譲

プロパティは、そのgetterとsetterを別のプロパティに委譲できます。このような委譲は、トップレベルプロパティとクラスプロパティ（メンバーおよび拡張）の両方で利用できます。デリゲートプロパティは次のいずれかです:
*   トップレベルプロパティ
*   同じクラスのメンバープロパティまたは拡張プロパティ
*   別のクラスのメンバープロパティまたは拡張プロパティ

プロパティを別のプロパティに委譲するには、デリゲート名に `::` 修飾子を使用します。例えば、`this::delegate` や `MyClass::delegate` のようにです。

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

これは、例えば、プロパティを後方互換性のある方法で名前変更したい場合に役立ちます。新しいプロパティを導入し、古いプロパティに `@Deprecated` アノテーションを付加し、その実装を委譲します。

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

## マップにプロパティを保存する

一般的なユースケースの1つは、プロパティの値をマップに保存することです。これは、JSONのパースやその他の動的なタスクの実行など、アプリケーションで頻繁に発生します。この場合、マップインスタンス自体を委譲プロパティのデリゲートとして使用できます。

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
    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25
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

ローカル変数を委譲プロパティとして宣言できます。例えば、ローカル変数をlazyにすることができます:

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 変数は、最初のアクセス時のみ計算されます。`someCondition` が失敗した場合、変数はまったく計算されません。

## プロパティデリゲートの要件

*読み取り専用*プロパティ (`val`) の場合、デリゲートは以下のパラメータを持つ `getValue()` 演算子関数を提供する必要があります:

*   `thisRef` は、*プロパティオーナー*と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。

`getValue()` はプロパティと同じ型（またはそのサブタイプ）を返す必要があります。

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

*可変*プロパティ (`var`) の場合、デリゲートは追加で以下のパラメータを持つ `setValue()` 演算子関数を提供する必要があります:

*   `thisRef` は、*プロパティオーナー*と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。
*   `value` はプロパティと同じ型（またはそのスーパータイプ）である必要があります。

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

`getValue()` および/または `setValue()` 関数は、デリゲートクラスのメンバー関数として、または拡張関数として提供できます。後者は、これらの関数を本来提供していないオブジェクトにプロパティを委譲する必要がある場合に便利です。どちらの関数も `operator` キーワードでマークする必要があります。

新しいクラスを作成せずに、匿名オブジェクトとしてデリゲートを作成することができます。その際、Kotlin標準ライブラリの `ReadOnlyProperty` および `ReadWriteProperty` インターフェースを使用します。これらは必要なメソッドを提供します: `getValue()` は `ReadOnlyProperty` で宣言され、`ReadWriteProperty` はそれを拡張して `setValue()` を追加します。これは、`ReadOnlyProperty` が期待される場合に `ReadWriteProperty` を渡すことができることを意味します。

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

内部では、Kotlinコンパイラは一部の種類の委譲プロパティに対して補助プロパティを生成し、それらに委譲します。

> 最適化の目的で、コンパイラは[いくつかのケース](#optimized-cases-for-delegated-properties)では補助プロパティを_生成しません_。[別のプロパティへの委譲](#translation-rules-when-delegating-to-another-property)の例で最適化について学びましょう。
>
{style="note"}

例えば、プロパティ `prop` の場合、隠しプロパティ `prop$delegate` を生成し、アクセサのコードはこの追加プロパティに単純に委譲します:

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

Kotlinコンパイラは、`prop` に関する必要なすべての情報を引数で提供します。最初の引数 `this` は外側のクラス `C` のインスタンスを参照し、`this::prop` は `prop` 自体を記述する `KProperty` 型のリフレクションオブジェクトです。

### 委譲プロパティの最適化されたケース

`$delegate` フィールドは、デリゲートが以下の場合に省略されます:
*   参照されるプロパティ:

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

*   同じモジュール内のバッキングフィールドとデフォルトゲッターを持つfinal `val` プロパティ:

    ```kotlin
    val impl: ReadOnlyProperty<Any?, String> = ...

    class A {
        val s: String by impl
    }
    ```

*   定数式、enumエントリー、`this`、`null`。`this` の例:

    ```kotlin
    class A {
        operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
        val s by this
    }
    ```

### 別のプロパティへの委譲時の変換ルール

別のプロパティに委譲する場合、Kotlinコンパイラは参照されるプロパティへの即時アクセスを生成します。これは、コンパイラが `prop$delegate` フィールドを生成しないことを意味します。この最適化はメモリの節約に役立ちます。

例えば、以下のコードを考えてみましょう:

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 変数のプロパティアクセサは、委譲プロパティの `getValue` および `setValue` 演算子をスキップして `impl` 変数を直接呼び出すため、`KProperty` 参照オブジェクトは不要です。

上記のコードに対して、コンパイラは以下のコードを生成します:

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

## デリゲートの提供

`provideDelegate` 演算子を定義することで、プロパティ実装が委譲されるオブジェクトを作成するロジックを拡張できます。`by` の右側に使用されるオブジェクトが `provideDelegate` をメンバー関数または拡張関数として定義している場合、その関数が呼び出されてプロパティデリゲートインスタンスが作成されます。

`provideDelegate` の可能なユースケースの1つは、プロパティの初期化時にその整合性をチェックすることです。

例えば、バインディングの前にプロパティ名をチェックするには、次のように記述できます:

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

`provideDelegate` のパラメータは `getValue` のそれらと同じです:

*   `thisRef` は、_プロパティオーナー_と同じ型か、そのスーパータイプである必要があります（拡張プロパティの場合、拡張される型である必要があります）。
*   `property` は `KProperty<*>` 型またはそのスーパータイプである必要があります。

`provideDelegate` メソッドは、`MyUI` インスタンスの作成中に各プロパティに対して呼び出され、必要な検証を直ちに行います。

プロパティとそのデリゲート間のバインディングをインターセプトするこの機能がなければ、同じ機能を実現するためにはプロパティ名を明示的に渡す必要があり、これはあまり便利ではありません:

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

生成されたコードでは、補助 `prop$delegate` プロパティを初期化するために `provideDelegate` メソッドが呼び出されます。プロパティ宣言 `val prop: Type by MyDelegate()` の生成されたコードを、[上記](#translation-rules-for-delegated-properties)の生成されたコード（`provideDelegate` メソッドが存在しない場合）と比較してください:

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

`provideDelegate` メソッドは補助プロパティの作成のみに影響し、getterやsetterのために生成されるコードには影響しないことに注意してください。

標準ライブラリの `PropertyDelegateProvider` インターフェースを使用すると、新しいクラスを作成せずにデリゲートプロバイダを作成できます。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider