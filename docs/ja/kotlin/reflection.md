[//]: # (title: リフレクション)

_リフレクション_は、プログラムの構造をランタイムで内省することを可能にする、一連の言語およびライブラリ機能です。関数とプロパティはKotlinにおいて第一級の存在であり、それらを内省する機能（例えば、ランタイムでプロパティや関数の名前や型を知るなど）は、関数型またはリアクティブなスタイルを使用する際に不可欠です。

> Kotlin/JSはリフレクション機能のサポートが限定的です。[Kotlin/JSにおけるリフレクションの詳細はこちら](js-reflection.md)。
>
{style="note"}

## JVMの依存関係

JVMプラットフォームでは、Kotlinコンパイラディストリビューションには、リフレクション機能の使用に必要なランタイムコンポーネントが、独立したアーティファクトである`kotlin-reflect.jar`として含まれています。これは、リフレクション機能を使用しないアプリケーションのランタイムライブラリの必要サイズを削減するために行われます。

GradleまたはMavenプロジェクトでリフレクションを使用するには、`kotlin-reflect`への依存関係を追加します。

*   Gradleの場合：

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

*   Mavenの場合：

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

GradleまたはMavenを使用しない場合、プロジェクトのクラスパスに`kotlin-reflect.jar`があることを確認してください。その他のサポートされているケース（コマンドラインコンパイラまたはAntを使用するIntelliJ IDEAプロジェクト）では、デフォルトで追加されます。コマンドラインコンパイラおよびAntでは、`-no-reflect`コンパイラオプションを使用して`kotlin-reflect.jar`をクラスパスから除外できます。

## クラス参照

最も基本的なリフレクション機能は、Kotlinクラスへのランタイム参照を取得することです。静的に既知のKotlinクラスへの参照を取得するには、_クラスリテラル_構文を使用できます。

```kotlin
val c = MyClass::class
```

この参照は [`KClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 型の値です。

> JVMにおいて：Kotlinのクラス参照はJavaのクラス参照と同じではありません。Javaのクラス参照を取得するには、`KClass`インスタンスの`.java`プロパティを使用します。
>
{style="note"}

### バウンドクラス参照

特定のオブジェクトのクラスへの参照を、オブジェクトをレシーバとして使用する同じ`::class`構文で取得できます。

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

レシーバ式の型（`Widget`）にかかわらず、`GoodWidget`や`BadWidget`といったオブジェクトの正確なクラスへの参照が取得されます。

## 呼び出し可能参照

関数、プロパティ、およびコンストラクタへの参照は、[関数型](lambdas.md#function-types)のインスタンスとして呼び出すことも、使用することもできます。

すべての呼び出し可能参照の共通スーパークラスは [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html) です。ここで `R` は戻り値の型です。プロパティの場合はプロパティ型、コンストラクタの場合は構築される型です。

### 関数参照

以下のように宣言された名前付き関数がある場合、直接呼び出すことができます（`isOdd(5)`）。

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

あるいは、関数を関数型値として使用、つまり別の関数に渡すことができます。そのためには、`::`演算子を使用します。

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

ここで`::isOdd`は関数型 `(Int) -> Boolean` の値です。

関数参照は、パラメータ数に応じて [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) サブタイプの一つに属します。例えば、`KFunction3<T1, T2, T3, R>`。

期待される型がコンテキストから既知の場合、オーバーロードされた関数で`::`を使用できます。例えば：

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

あるいは、明示的に型が指定された変数にメソッド参照を格納することで、必要なコンテキストを提供できます。

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

クラスのメンバーまたは拡張関数を使用する必要がある場合、`String::toCharArray`のように修飾する必要があります。

拡張関数への参照で変数を初期化しても、推論される関数型にはレシーバがなく、代わりにレシーバオブジェクトを受け入れる追加のパラメータが付きます。代わりにレシーバを持つ関数型にするには、型を明示的に指定します。

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 例: 関数合成

以下の関数を検討してください。

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

これは渡された2つの関数の合成を返します: `compose(f, g) = f(g(*))`。この関数を呼び出し可能参照に適用できます。

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

### プロパティ参照

Kotlinでプロパティを第一級オブジェクトとしてアクセスするには、`::`演算子を使用します。

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name)
}
```

式`::x`は`KProperty0<Int>`型のプロパティオブジェクトに評価されます。`get()`を使用してその値を読み取ったり、`name`プロパティを使用してプロパティ名を取得したりできます。詳細については、[`KProperty`クラスに関するドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)を参照してください。

`var y = 1`のような可変プロパティの場合、`::y`は`set()`メソッドを持つ [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 型の値を返します。

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

プロパティ参照は、単一のジェネリックパラメータを持つ関数が期待される場所で使用できます。

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

クラスのメンバーであるプロパティにアクセスするには、次のように修飾します。

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

拡張プロパティの場合：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Javaリフレクションとの相互運用

JVMプラットフォームでは、標準ライブラリにはJavaリフレクションオブジェクトとのマッピングを提供するリフレクションクラスの拡張が含まれています（`kotlin.reflect.jvm`パッケージを参照）。例えば、バッキングフィールドやKotlinプロパティのゲッターとして機能するJavaメソッドを見つけるには、次のように記述できます。

```kotlin
import kotlin.reflect.jvm.*

class A(val p: Int)

fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

Javaクラスに対応するKotlinクラスを取得するには、`.kotlin`拡張プロパティを使用します。

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### コンストラクタ参照

コンストラクタはメソッドやプロパティと同様に参照できます。コンストラクタと同じパラメータを取り、適切な型のオブジェクトを返す関数型オブジェクトがプログラムで期待される場所であれば、どこでも使用できます。コンストラクタは`::`演算子とクラス名を追加して参照されます。パラメータがなく戻り値の型が`Foo`である関数パラメータを期待する以下の関数を検討してください。

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

クラス`Foo`の引数なしコンストラクタである`::Foo`を使用して、次のように呼び出すことができます。

```kotlin
function(::Foo)
```

コンストラクタへの呼び出し可能参照は、パラメータ数に応じて [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) サブタイプの一つとして型付けされます。

### バウンド関数およびプロパティ参照

特定のオブジェクトのインスタンスメソッドを参照できます。

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

例では、`matches`メソッドを直接呼び出す代わりに、それへの参照を使用しています。そのような参照は、そのレシーバにバインドされています。直接呼び出すことも（上記の例のように）、関数型式が期待される場所であればいつでも使用することもできます。

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

バウンド参照とアンバウンド参照の型を比較してください。バウンドされた呼び出し可能参照はレシーバが「アタッチ」されているため、レシーバの型はもはやパラメータではありません。

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

プロパティ参照もバインドできます。

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

レシーバとして`this`を指定する必要はありません: `this::foo`と`::foo`は等価です。

### バウンドコンストラクタ参照

[inner class](nested-classes.md#inner-classes)のコンストラクタへのバウンドされた呼び出し可能参照は、外側のクラスのインスタンスを提供することで取得できます。

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner