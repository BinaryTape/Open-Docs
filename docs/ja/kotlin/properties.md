---
title: プロパティ
---
## プロパティの宣言

Kotlinのクラスにおけるプロパティは、`var` キーワードを用いて可変として宣言するか、`val` キーワードを用いて読み取り専用として宣言できます。

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
    result.name = address.name // アクセッサが呼び出されます
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

イニシャライザ、ゲッター、セッターはオプションです。プロパティの型は、イニシャライザまたはゲッターの戻り値の型から推論できる場合はオプションです。
以下に示すように：

```kotlin
var initialized = 1 // 型はInt、デフォルトのゲッターとセッターがあります
// var allByDefault // ERROR: 明示的なイニシャライザが必要です、デフォルトのゲッターとセッターが暗黙的に指定されます
```

読み取り専用プロパティ宣言の完全な構文は、可変のものとは2つの点で異なります。`var`の代わりに`val`で始まり、セッターを許可しません。

```kotlin
val simple: Int? // 型はInt、デフォルトのゲッター、コンストラクタで初期化する必要があります
val inferredType = 1 // 型はIntで、デフォルトのゲッターがあります
```

プロパティのカスタムアクセッサを定義できます。カスタムゲッターを定義すると、プロパティにアクセスするたびに呼び出されます（これにより、計算されたプロパティを実装できます）。カスタムゲッターの例を次に示します。

```kotlin

class Rectangle(val width: Int, val height: Int) {
    val area: Int // ゲッターの戻り値の型から推論できるため、プロパティの型はオプションです
        get() = this.width * this.height
}

fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```

ゲッターから推論できる場合は、プロパティの型を省略できます。

```kotlin
val area get() = this.width * this.height
```

カスタムセッターを定義すると、初期化を除き、プロパティに値を代入するたびに呼び出されます。
カスタムセッターは次のようになります。

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 文字列を解析し、他のプロパティに値を割り当てます
    }
```

慣例により、セッターパラメータの名前は`value`ですが、必要に応じて別の名前を選択できます。

アクセッサにアノテーションを付けたり、その可視性を変更したりする必要があるが、デフォルトの実装を変更したくない場合は、本体を定義せずにアクセッサを定義できます。

```kotlin
var setterVisibility: String = "abc"
    private set // セッターはプライベートで、デフォルトの実装があります

var setterWithAnnotation: Any? = null
    @Inject set // セッターにInjectでアノテーションを付けます
```

### バッキングフィールド

Kotlinでは、フィールドはプロパティの一部としてのみ使用され、メモリに値を保持します。フィールドを直接宣言することはできません。
ただし、プロパティにバッキングフィールドが必要な場合、Kotlinはそれを自動的に提供します。このバッキングフィールドは、`field`識別子を使用してアクセッサで参照できます。

```kotlin
var counter = 0 // イニシャライザはバッキングフィールドを直接割り当てます
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: 実際の名前 'counter' を使用すると、セッターが再帰的になります
    }
```

`field`識別子は、プロパティのアクセッサでのみ使用できます。

バッキングフィールドは、アクセッサの少なくとも1つのデフォルト実装を使用する場合、
またはカスタムアクセッサが`field`識別子を介してそれを参照する場合に、プロパティに対して生成されます。

たとえば、次の場合にはバッキングフィールドはありません。

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### バッキングプロパティ

この_暗黙的なバッキングフィールド_スキームに適合しないことをしたい場合は、常に_バッキングプロパティ_を持つことにフォールバックできます。

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

:::note
JVMの場合：デフォルトのゲッターとセッターを持つプライベートプロパティへのアクセスは、関数呼び出しのオーバーヘッドを回避するように最適化されています。

:::

## コンパイル時定数

読み取り専用プロパティの値がコンパイル時にわかっている場合は、`const`修飾子を使用して_コンパイル時定数_としてマークします。
このようなプロパティは、次の要件を満たす必要があります。

* トップレベルのプロパティ、または[`object`宣言](object-declarations#object-declarations-overview)または_[コンパニオンオブジェクト](object-declarations#companion-objects)_のメンバである必要があります。
* `String`型またはプリミティブ型の値で初期化する必要があります
* カスタムゲッターにすることはできません

コンパイラは定数の使用箇所をインライン化し、定数への参照をその実際の値に置き換えます。ただし、フィールドは削除されないため、[リフレクション](reflection)を使用して操作できます。

このようなプロパティは、アノテーションでも使用できます。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 遅延初期化されたプロパティと変数

通常、非Nullable型として宣言されたプロパティは、コンストラクタで初期化する必要があります。
ただし、そうすることが不便な場合がよくあります。たとえば、プロパティは依存性注入によって初期化できます。
または単体テストのセットアップメソッドで初期化できます。これらの場合、コンストラクタで非Nullableイニシャライザを提供することはできません。
ただし、クラスの本体内でプロパティを参照するときに、Nullチェックを回避する必要があります。

このような場合に対処するには、プロパティに`lateinit`修飾子を付けることができます。

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

この修飾子は、クラスの本体内で宣言された`var`プロパティ（プライマリコンストラクタ内ではなく、
また、プロパティにカスタムゲッターまたはセッターがない場合にのみ）、トップレベルのプロパティ、およびローカル変数に使用できます。
プロパティまたは変数の型は、非Nullableでなければならず、プリミティブ型であってはなりません。

初期化される前に`lateinit`プロパティにアクセスすると、アクセスされているプロパティと初期化されていないという事実を明確に示す特別な例外がスローされます。

### lateinit varが初期化されているかどうかを確認する

`lateinit var`がすでに初期化されているかどうかを確認するには、[そのプロパティへの参照](reflection#property-references)で`.isInitialized`を使用します。

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

このチェックは、同じ型、外側の型のいずれか、または同じファイルのトップレベルで宣言されている場合に、字句的にアクセス可能なプロパティでのみ使用できます。

## プロパティのオーバーライド

[プロパティのオーバーライド](inheritance#overriding-properties)を参照してください

## 委譲されたプロパティ

最も一般的な種類のプロパティは、単にバッキングフィールドから読み取り（場合によっては書き込み）ますが、カスタムゲッターとセッターを使用すると、プロパティを使用してプロパティのあらゆる種類の動作を実装できます。
最初の種類の単純さと2番目の種類の多様性の間のある場所には、プロパティができることの一般的なパターンがあります。いくつかの例：遅延値、指定されたキーによるマップからの読み取り、データベースへのアクセス、アクセス時のリスナーへの通知。

このような一般的な動作は、[委譲されたプロパティ](delegated-properties)を使用してライブラリとして実装できます。