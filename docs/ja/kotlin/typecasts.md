[//]: # (title: 型チェックとキャスト)

Kotlinでは、実行時にオブジェクトの型をチェックするための型チェックを実行できます。型キャストを使用すると、オブジェクトを別の型に変換できます。

> **ジェネリクス**の型チェックとキャスト（例：`List<T>`、`Map<K,V>`）について詳しく学習するには、[ジェネリクスの型チェックとキャスト](generics.md#generics-type-checks-and-casts)を参照してください。
>
{style="tip"}

## `is` および `!is` 演算子

オブジェクトが特定の型に準拠しているかどうかを実行時にチェックするには、`is` 演算子またはその否定形である `!is` を使用します。

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## スマートキャスト

ほとんどの場合、コンパイラが自動的にオブジェクトをキャストしてくれるため、明示的なキャスト演算子を使用する必要はありません。これはスマートキャストと呼ばれます。コンパイラは、不変な値に対する型チェックと[明示的なキャスト](#unsafe-cast-operator)を追跡し、必要に応じて暗黙的な（安全な）キャストを自動的に挿入します。

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

コンパイラは、否定的なチェックがリターンにつながる場合にキャストが安全であることを認識するほど賢明です。

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 制御フロー

スマートキャストは、`if` 条件式だけでなく、[`when` 式](control-flow.md#when-expressions-and-statements)や[`while` ループ](control-flow.md#while-loops)でも機能します。

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

`if`、`when`、または`while`の条件で使用する前に`Boolean`型の変数を宣言すると、コンパイラによってその変数について収集されたすべての情報が、スマートキャストのために対応するブロック内でアクセス可能になります。

これは、ブール条件を変数に抽出するなどの場合に役立ちます。そうすることで、変数に意味のある名前を付けられ、コードの可読性が向上し、後でコード内で変数を再利用できるようになります。例：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 論理演算子

コンパイラは、`&&`または`||`演算子の左側に型チェック（通常または否定）がある場合、右側でスマートキャストを実行できます。

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

オブジェクトに対する型チェックを`or`演算子（`||`）と組み合わせると、最も近い共通のスーパータイプにスマートキャストされます。

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> 共通のスーパータイプは、[ユニオン型](https://en.wikipedia.org/wiki/Union_type)の**近似値**です。ユニオン型は[現在Kotlinではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

### インライン関数

コンパイラは、[インライン関数](inline-functions.md)に渡されるラムダ関数内でキャプチャされた変数をスマートキャストできます。

インライン関数は、暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われます。これは、インライン関数に渡されたラムダ関数がその場で呼び出されることを意味します。ラムダ関数はインプレースで呼び出されるため、コンパイラはラムダ関数がその関数本体内に含まれる変数の参照を漏洩させないことを認識しています。

コンパイラはこの知識と他の分析を組み合わせて、キャプチャされた変数をスマートキャストしても安全かどうかを判断します。例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 例外処理

スマートキャスト情報は`catch`ブロックと`finally`ブロックに引き継がれます。これにより、コンパイラがオブジェクトがNull許容型であるかどうかを追跡するため、コードの安全性が向上します。例：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### スマートキャストの前提条件

> スマートキャストは、コンパイラが、変数とチェックとその使用の間で変数が変更されないことを保証できる場合にのみ機能することに注意してください。
>
{style="warning"}

スマートキャストは以下の条件で使用できます。

<table style="none">
    <tr>
        <td>
            <code>val</code> ローカル変数
        </td>
        <td>
            [ローカルデリゲートプロパティ](delegated-properties.md)を除き、常に。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> プロパティ
        </td>
        <td>
            プロパティが<code>private</code>または<code>internal</code>である場合、またはプロパティが宣言されているのと同じ[モジュール](visibility-modifiers.md#modules)内でチェックが実行される場合。<code>open</code>プロパティやカスタムゲッターを持つプロパティではスマートキャストを使用できません。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> ローカル変数
        </td>
        <td>
            変数がチェックとその使用の間で変更されず、それを変更するラムダ内でキャプチャされておらず、かつローカルデリゲートプロパティでない場合。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> プロパティ
        </td>
        <td>
            他のコードによって変数がいつでも変更される可能性があるため、決して。
        </td>
    </tr>
</table>

## "非安全な"キャスト演算子

オブジェクトを非Null許容型に明示的にキャストするには、*非安全な*キャスト演算子`as`を使用します。

```kotlin
val x: String = y as String
```

キャストが不可能な場合、コンパイラは例外をスローします。これが*非安全*と呼ばれる理由です。

前の例で、`y`が`null`の場合、上記のコードも例外をスローします。これは、`String`が[Null許容](null-safety.md)ではないため、`null`を`String`にキャストできないためです。Null値の可能性がある場合にも例が機能するようにするには、キャストの右側にNull許容型を使用します。

```kotlin
val x: String? = y as String?
```

## "安全な"（Null許容）キャスト演算子

例外を避けるには、失敗時に`null`を返す*安全な*キャスト演算子`as?`を使用します。

```kotlin
val x: String? = y as? String
```

`as?`の右側が非Null許容型`String`であるにもかかわらず、キャストの結果はNull許容型になることに注意してください。