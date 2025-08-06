[//]: # (title: プロパティ)

## プロパティの宣言

Kotlinクラスのプロパティは、`var`キーワードを使用して可変として、または`val`キーワードを使用して読み取り専用として宣言できます。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

プロパティを使用するには、その名前で参照するだけです。

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlinには'new'キーワードはありません
    result.name = address.name // アクセサーが呼び出されます
    result.street = address.street
    // ...
    return result
}
```

## GetterとSetter

プロパティを宣言するための完全な構文は次のとおりです。

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初期化子、getter、setterはオプションです。プロパティの型は、初期化子またはgetterの戻り値の型から推論できる場合はオプションです。以下に示します。

```kotlin
var initialized = 1 // 型はInt、デフォルトのgetterとsetterを持つ
// var allByDefault // ERROR: 明示的な初期化子が必要、デフォルトのgetterとsetterが暗黙的に含まれる
```

読み取り専用プロパティ宣言の完全な構文は、可変プロパティ宣言とは2つの点で異なります。`var`の代わりに`val`で始まり、setterを許可しません。

```kotlin
val simple: Int? // 型はInt、デフォルトのgetter、コンストラクタで初期化する必要がある
val inferredType = 1 // 型はIntで、デフォルトのgetterを持つ
```

プロパティに対してカスタムアクセサーを定義できます。カスタムgetterを定義すると、プロパティにアクセスするたびにそれが呼び出されます（このようにして算出プロパティを実装できます）。カスタムgetterの例を次に示します。

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // プロパティの型はgetterの戻り値の型から推論できるためオプション
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

getterから推論できる場合は、プロパティの型を省略できます。

```kotlin
val area get() = this.width * this.height
```

カスタムsetterを定義すると、プロパティの初期化時を除き、値を代入するたびにそれが呼び出されます。カスタムsetterは次のようになります。

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 文字列をパースし、他のプロパティに値を代入する
    }
```

慣例により、setterパラメーターの名前は`value`ですが、必要に応じて別の名前を選択できます。

アクセサーにアノテーションを付けたり、その可視性を変更したりする必要があるが、デフォルトの実装を変更したくない場合は、アクセサーの本体を定義せずに定義できます。

```kotlin
var setterVisibility: String = "abc"
    private set // setterはprivateで、デフォルトの実装を持つ

var setterWithAnnotation: Any? = null
    @Inject set // setterにInjectアノテーションを付与する
```

### バッキングフィールド

Kotlinでは、フィールドはプロパティの一部としてその値をメモリに保持するためにのみ使用されます。フィールドを直接宣言することはできません。ただし、プロパティがバッキングフィールドを必要とするときは、Kotlinが自動的にそれを提供します。このバッキングフィールドは、アクセサー内で`field`識別子を使用して参照できます。

```kotlin
var counter = 0 // 初期化子がバッキングフィールドに直接値を代入する
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: 実際の名前 'counter' を使用するとsetterが再帰的になる
    }
```

`field`識別子は、プロパティのアクセサー内でのみ使用できます。

バッキングフィールドは、アクセサーの少なくとも1つのデフォルト実装を使用する場合、またはカスタムアクセサーが`field`識別子を介してそれを参照する場合に、プロパティに対して生成されます。

たとえば、次のケースではバッキングフィールドは存在しません。

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### バッキングプロパティ

この_暗黙的なバッキングフィールド_の仕組みに合わないことをしたい場合は、_バッキングプロパティ_を使用するように常にフォールバックできます。

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 型引数は推論される
        }
        return _table ?: throw AssertionError("別のスレッドによってnullに設定された")
    }
```

> JVM上：デフォルトのgetterとsetterを持つprivateプロパティへのアクセスは、関数呼び出しのオーバーヘッドを避けるために最適化されています。
>
{style="note"}

## コンパイル時定数

読み取り専用プロパティの値がコンパイル時に既知である場合、`const`修飾子を使用して_コンパイル時定数_としてマークします。
このようなプロパティは、次の要件を満たす必要があります。

* トップレベルプロパティ、または[`object`宣言](object-declarations.md#object-declarations-overview)や_[コンパニオンオブジェクト](object-declarations.md#companion-objects)_のメンバーであること。
* `String`型またはプリミティブ型の値で初期化されていること。
* カスタムgetterを持つことはできない。

コンパイラは定数の使用箇所をインライン化し、定数への参照をその実際の値に置き換えます。ただし、フィールドは削除されないため、[リフレクション](reflection.md)を使用して操作できます。

このようなプロパティは、アノテーションでも使用できます。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 遅延初期化プロパティと変数

通常、非NULL許容型として宣言されたプロパティは、コンストラクタで初期化する必要があります。
しかし、そうすることが不便な場合がよくあります。たとえば、プロパティは依存性注入によって、または単体テストのセットアップメソッドで初期化されることがあります。これらの場合、コンストラクタで非NULL許容の初期化子を提供することはできませんが、クラス本体内でプロパティを参照するときにnullチェックを避けたい場合があります。

このようなケースを処理するには、プロパティを`lateinit`修飾子でマークします。

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接逆参照する
    }
}
```

この修飾子は、クラス本体内で宣言された`var`プロパティ（プライマリコンストラクタ内ではなく、プロパティがカスタムgetterまたはsetterを持たない場合のみ）、およびトップレベルプロパティやローカル変数に使用できます。プロパティまたは変数の型は非NULL許容である必要があり、プリミティブ型であってはなりません。

`lateinit`プロパティが初期化される前にアクセスすると、アクセスされたプロパティとそれが初期化されていないという事実を明確に識別する特別な例外がスローされます。

### lateinit varが初期化されているかどうかの確認

`lateinit var`がすでに初期化されているかどうかを確認するには、[そのプロパティへの参照](reflection.md#property-references)に対して`.isInitialized`を使用します。

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

このチェックは、同じ型、外側の型の一つ、または同じファイルのトップレベルで宣言されている場合に、字句的にアクセス可能なプロパティに対してのみ利用可能です。

## プロパティのオーバーライド

[プロパティのオーバーライド](inheritance.md#overriding-properties)を参照してください。

## 委譲プロパティ

最も一般的な種類のプロパティは、単にバッキングフィールドから読み取り（そして場合によっては書き込み）を行いますが、カスタムgetterとsetterを使用すると、プロパティを使ってあらゆる種類の動作を実装できます。最初の種類の単純さと2番目の種類の多様性の間に、プロパティができることの一般的なパターンがあります。いくつかの例を挙げます。遅延値、特定のキーによるマップからの読み取り、データベースへのアクセス、アクセス時にリスナーに通知する、などです。

このような一般的な動作は、[委譲プロパティ](delegated-properties.md)を使用してライブラリとして実装できます。