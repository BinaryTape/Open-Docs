[//]: # (title: プロパティ)

## プロパティの宣言

Kotlinのクラスにおけるプロパティは、`var`キーワードを使用して可変として、または`val`キーワードを使用して読み取り専用として宣言できます。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

プロパティを使用するには、単にその名前で参照します。

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlinには'new'キーワードはありません
    result.name = address.name // アクセサが呼び出されます
    result.street = address.street
    // ...
    return result
}
```

## ゲッターとセッター

プロパティを宣言するための完全な構文は次のとおりです。

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初期化子、ゲッター、セッターはオプションです。プロパティの型は、初期化子またはゲッターの戻り値の型から推論できる場合はオプションです。以下に示します。

```kotlin
var initialized = 1 // Int型で、デフォルトのゲッターとセッターを持ちます
// var allByDefault // エラー: 明示的な初期化子が必要です。デフォルトのゲッターとセッターが暗黙的に適用されます
```

読み取り専用プロパティ宣言の完全な構文は、可変プロパティとは2つの点で異なります。`var`の代わりに`val`で始まり、セッターを許可しません。

```kotlin
val simple: Int? // Int型で、デフォルトのゲッターを持ち、コンストラクタで初期化する必要があります
val inferredType = 1 // Int型で、デフォルトのゲッターを持ちます
```

プロパティにカスタムアクセサを定義できます。カスタムゲッターを定義すると、プロパティにアクセスするたびにそれが呼び出されます（このようにして、計算されたプロパティを実装できます）。カスタムゲッターの例を次に示します。

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // ゲッターの戻り値の型から推論できるため、プロパティの型はオプションです
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

ゲッターから推論できる場合、プロパティの型を省略できます。

```kotlin
val area get() = this.width * this.height
```

カスタムセッターを定義すると、初期化時を除いて、プロパティに値を割り当てるたびにそれが呼び出されます。カスタムセッターは次のようになります。

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 文字列を解析し、他のプロパティに値を割り当てます
    }
```

慣例として、セッターパラメータの名前は`value`ですが、好みに応じて別の名前を選択することもできます。

アクセサにアノテーションを付けたり、その可視性を変更したりする必要があるが、デフォルトの実装を変更したくない場合、本体を定義せずにアクセサを定義できます。

```kotlin
var setterVisibility: String = "abc"
    private set // セッターはprivateで、デフォルトの実装を持ちます

var setterWithAnnotation: Any? = null
    @Inject set // セッターにInjectアノテーションを付けます
```

### バッキングフィールド

Kotlinでは、フィールドはプロパティの一部として、その値をメモリに保持するためにのみ使用されます。フィールドは直接宣言できません。しかし、プロパティがバッキングフィールドを必要とする場合、Kotlinはそれを自動的に提供します。このバッキングフィールドは、アクセサ内で`field`識別子を使用して参照できます。

```kotlin
var counter = 0 // 初期化子はバッキングフィールドに直接値を割り当てます
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // エラー StackOverflow: 実際の名前 'counter' を使用するとセッターが再帰的になります
    }
```

`field`識別子は、プロパティのアクセサ内でのみ使用できます。

プロパティのバッキングフィールドは、少なくともいずれかのアクセサのデフォルト実装を使用する場合、またはカスタムアクセサが`field`識別子を介してそれを参照する場合に生成されます。

例えば、次のケースではバッキングフィールドは生成されません。

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### バッキングプロパティ

この_暗黙のバッキングフィールド_の仕組みに合わないことをしたい場合、いつでも_バッキングプロパティ_を持つことに戻ることができます。

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 型パラメータは推論されます
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> JVM上では: デフォルトのゲッターとセッターを持つプライベートプロパティへのアクセスは、関数呼び出しのオーバーヘッドを避けるために最適化されています。
>
{style="note"}

## コンパイル時定数

読み取り専用プロパティの値がコンパイル時に既知である場合、`const`修飾子を使用して_コンパイル時定数_としてマークします。そのようなプロパティは、次の要件を満たす必要があります。

*   トップレベルプロパティ、または[`object`宣言](object-declarations.md#object-declarations-overview)や_[コンパニオンオブジェクト](object-declarations.md#companion-objects)_のメンバーである必要があります。
*   `String`型またはプリミティブ型の値で初期化する必要があります。
*   カスタムゲッターであってはなりません。

コンパイラは、定数の使用箇所をインライン化し、定数への参照を実際の値に置き換えます。しかし、フィールドは削除されないため、[リフレクション](reflection.md)を使用して操作できます。

そのようなプロパティはアノテーションでも使用できます。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 遅延初期化プロパティと変数

通常、非null許容型として宣言されたプロパティは、コンストラクタで初期化する必要があります。しかし、そうすることが不便な場合も少なくありません。例えば、プロパティは依存性注入を介して、またはユニットテストのセットアップメソッドで初期化できます。これらの場合、コンストラクタで非null許容の初期化子を提供することはできませんが、クラス本体内でプロパティを参照するときにnullチェックを避けたいと考えるでしょう。

このようなケースを処理するために、プロパティを`lateinit`修飾子でマークできます。

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接逆参照
    }
}
```

この修飾子は、クラス本体内で宣言された`var`プロパティ（プライマリコンストラクタ内ではなく、プロパティがカスタムゲッターまたはセッターを持たない場合に限る）に対して、およびトップレベルプロパティとローカル変数に対して使用できます。プロパティまたは変数の型は非null許容でなければならず、プリミティブ型であってはなりません。

`lateinit`プロパティが初期化される前にアクセスすると、アクセスされたプロパティとそれが初期化されていない事実を明確に識別する特殊な例外がスローされます。

### lateinit varが初期化されているかどうかの確認

`lateinit var`がすでに初期化されているかどうかを確認するには、そのプロパティへの[参照](reflection.md#property-references)に対して`.isInitialized`を使用します。

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

このチェックは、同じ型、外側の型のいずれか、または同じファイルのトップレベルで宣言され、字句的にアクセス可能なプロパティに対してのみ利用できます。

## プロパティのオーバーライド

[プロパティのオーバーライド](inheritance.md#overriding-properties)を参照してください。

## デリゲートプロパティ

最も一般的なプロパティは、単にバッキングフィールドから読み取り（場合によっては書き込み）を行いますが、カスタムゲッターとセッターを使用すると、プロパティであらゆる種類の振る舞いを実装できます。最初の種類の単純さと2番目の種類の多様さの中間には、プロパティができることの一般的なパターンがあります。いくつかの例として、遅延初期化された値、指定されたキーによるマップからの読み取り、データベースへのアクセス、アクセス時のリスナーへの通知などがあります。

そのような一般的な振る舞いは、[デリゲートプロパティ](delegated-properties.md)を使用してライブラリとして実装できます。