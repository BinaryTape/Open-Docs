---
title: リフレクション
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_Reflection_ (リフレクション) は、実行時にプログラムの構造を内省できる一連の言語機能とライブラリ機能です。
関数とプロパティはKotlinでは第一級のオブジェクトであり、(実行時にプロパティまたは関数の名前や型を学習するなど) それらを内省する機能は、関数型またはリアクティブなスタイルを使用する場合に不可欠です。

:::note
Kotlin/JS では、リフレクション機能のサポートは限定的です。[Kotlin/JS でのリフレクションの詳細](js-reflection) を参照してください。

:::

## JVM dependency (JVM の依存関係)

JVMプラットフォームでは、Kotlinコンパイラの配布物には、リフレクション機能を使用するために必要なランタイムコンポーネントが、別の成果物である `kotlin-reflect.jar` として含まれています。これは、リフレクション機能を使用しないアプリケーションのランタイムライブラリに必要なサイズを小さくするためです。

Gradle または Maven プロジェクトでリフレクションを使用するには、`kotlin-reflect` への依存関係を追加します。

* Gradle の場合:

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

* Maven の場合:
    
    ```xml
    <dependencies>
      <dependency>
          <groupId>org.jetbrains.kotlin</groupId>
          <artifactId>kotlin-reflect</artifactId>
      </dependency>
    </dependencies>
    ```

Gradle または Maven を使用しない場合は、プロジェクトのクラスパスに `kotlin-reflect.jar` があることを確認してください。
サポートされている他のケース (コマンドラインコンパイラまたは Ant を使用する IntelliJ IDEA プロジェクト) では、
デフォルトで追加されます。コマンドラインコンパイラと Ant では、`-no-reflect` コンパイラオプションを使用して、クラスパスから `kotlin-reflect.jar` を除外できます。

## Class references (クラス参照)

最も基本的なリフレクション機能は、Kotlin クラスへのランタイム参照を取得することです。静的にわかっている Kotlin クラスへの参照を取得するには、_class literal_ (クラスリテラル) 構文を使用できます。

```kotlin
val c = MyClass::class
```

この参照は、[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 型の値です。

:::note
JVM 上: Kotlin クラス参照は、Java クラス参照と同じではありません。Java クラス参照を取得するには、`KClass` インスタンスの `.java` プロパティを使用します。

:::

### Bound class references (バインドされたクラス参照)

レシーバーとしてオブジェクトを使用することで、同じ `::class` 構文を使用して、特定のオブジェクトのクラスへの参照を取得できます。

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

レシーバー式 (`Widget`) の型に関係なく、オブジェクトの正確なクラスへの参照 (例: `GoodWidget` または `BadWidget`) を取得します。

## Callable references (呼び出し可能参照)

関数、プロパティ、およびコンストラクタへの参照は、[function types](lambdas#function-types) (関数型) のインスタンスとして呼び出すことも使用することもできます。

すべての呼び出し可能参照の共通のスーパータイプは [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html) で、`R` は戻り値の型です。これはプロパティのプロパティ型であり、コンストラクタの構築された型です。

### Function references (関数参照)

以下のように名前付き関数が宣言されている場合、直接呼び出すことができます (`isOdd(5)`)。

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

または、関数を関数型の値として使用することもできます。つまり、別の関数に渡すことができます。これを行うには、`::` 演算子を使用します。

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {

    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))

}
```

ここで、`::isOdd` は関数型 `(Int) `->` Boolean` の値です。

関数参照は、パラメータ数に応じて、[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html)
サブタイプのいずれかに属します。たとえば、`KFunction3<T1, T2, T3, R>` などがあります。

`::` は、コンテキストから期待される型がわかっている場合に、オーバーロードされた関数で使用できます。
例:

```kotlin
fun main() {

    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)

}
```

または、明示的に指定された型を持つ変数にメソッド参照を格納して、必要なコンテキストを提供することもできます。

```kotlin
val predicate: (String) `->` Boolean = ::isOdd   // refers to isOdd(x: String)
```

クラスのメンバーまたは拡張関数を使用する必要がある場合は、`String::toCharArray` のように修飾する必要があります。

拡張関数への参照で変数を初期化した場合でも、推論される関数型はレシーバーを持たず、レシーバーオブジェクトを受け入れる追加のパラメータを持ちます。代わりに、レシーバーを持つ関数型にするには、型を明示的に指定します。

```kotlin
val isEmptyStringList: List<String>.() `->` Boolean = List<String>::isEmpty
```

#### Example: function composition (例: 関数の合成)

次の関数について考えてみましょう。

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}
```

これは、渡された 2 つの関数の合成を返します: `compose(f, g) = f(g(*))`。
この関数を呼び出し可能参照に適用できます。

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

### Property references (プロパティ参照)

Kotlin でプロパティを第一級オブジェクトとしてアクセスするには、`::` 演算子を使用します。

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

式 `::x` は、`KProperty0<Int>` 型のプロパティオブジェクトとして評価されます。`get()` を使用してその値を読み取るか、`name` プロパティを使用してプロパティ名を取得できます。詳細については、[`KProperty` クラスに関するドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) を参照してください。

`var y = 1` などのミュータブルプロパティの場合、`::y` は [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 型の値 ( `set()` メソッドを持つ) を返します。

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```

プロパティ参照は、単一のジェネリックパラメータを持つ関数が期待される場所で使用できます。

```kotlin
fun main() {

    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))

}
```

クラスのメンバーであるプロパティにアクセスするには、次のように修飾します。

```kotlin
fun main() {

    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))

}
```

拡張プロパティの場合:

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```

### Interoperability with Java reflection (Java リフレクションとの相互運用性)

JVM プラットフォームでは、標準ライブラリには、Java リフレクションオブジェクトとのマッピングを提供するリフレクションクラスの拡張機能が含まれています (パッケージ `kotlin.reflect.jvm` を参照)。
たとえば、Kotlin プロパティのゲッターとして機能する backing field (バッキングフィールド) または Java メソッドを見つけるには、次のように記述できます。

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

Java クラスに対応する Kotlin クラスを取得するには、`.kotlin` 拡張プロパティを使用します。

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### Constructor references (コンストラクタ参照)

コンストラクタは、メソッドやプロパティと同様に参照できます。プログラムがコンストラクタと同じパラメータを受け取り、適切な型のオブジェクトを返す関数型のオブジェクトを期待する場所で使用できます。
コンストラクタは、`::` 演算子とクラス名を追加して参照されます。パラメータがなく、戻り値の型が `Foo` である関数パラメータを想定する次の関数について考えてみましょう。

```kotlin
class Foo

fun function(factory: () `->` Foo) {
    val x: Foo = factory()
}
```

`::Foo` (クラス `Foo` の引数なしのコンストラクタ) を使用すると、次のように呼び出すことができます。

```kotlin
function(::Foo)
```

コンストラクタへの呼び出し可能参照は、パラメータ数に応じて、
[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) サブタイプのいずれかとして型指定されます。

### Bound function and property references (バインドされた関数とプロパティの参照)

特定のオブジェクトのインスタンスメソッドを参照できます。

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))

}
```

この例では、メソッド `matches` を直接呼び出す代わりに、それへの参照を使用します。
このような参照は、そのレシーバーにバインドされています。
(上記の例のように) 直接呼び出すことも、関数型の式が期待される場合はいつでも使用することもできます。

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))

}
```

バインドされた参照とバインドされていない参照の型を比較します。
バインドされた呼び出し可能参照は、そのレシーバーが「アタッチ」されているため、レシーバーの型はパラメータではなくなりました。

```kotlin
val isNumber: (CharSequence) `->` Boolean = numberRegex::matches

val matches: (Regex, CharSequence) `->` Boolean = Regex::matches
```

プロパティ参照もバインドできます。

```kotlin
fun main() {

    val prop = "abc"::length
    println(prop.get())

}
```

レシーバーとして `this` を指定する必要はありません。`this::foo` と `::foo` は同等です。

### Bound constructor references (バインドされたコンストラクタ参照)

[inner class](nested-classes#inner-classes) (インナークラス) のコンストラクタへのバインドされた呼び出し可能参照は、外部クラスのインスタンスを提供することで取得できます。

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```