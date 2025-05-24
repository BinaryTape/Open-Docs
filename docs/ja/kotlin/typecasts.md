---
title: 型チェックとキャスト
---
Kotlin では、実行時にオブジェクトの型をチェックするために型チェックを実行できます。型キャストを使用すると、オブジェクトを別の型に変換できます。

:::note
**ジェネリクス**の型チェックとキャスト（例：`List<T>`、`Map<K,V>`）について詳しく知りたい場合は、[ジェネリクスの型チェックとキャスト](generics#generics-type-checks-and-casts)を参照してください。

## is および !is 演算子

オブジェクトが特定の型に適合するかどうかを識別するランタイム チェックを実行するには、`is` 演算子またはその否定形 `!is` を使用します。

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

ほとんどの場合、コンパイラが自動的にオブジェクトをキャストするため、明示的なキャスト演算子を使用する必要はありません。
これはスマートキャストと呼ばれます。コンパイラは、イミュータブルな値の型チェックと[明示的なキャスト](#unsafe-cast-operator)を追跡し、必要に応じて暗黙的な (安全な) キャストを自動的に挿入します。

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

コンパイラは、否定的なチェックがリターンにつながる場合にキャストが安全であることを認識するほど賢いです。

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 制御フロー

スマートキャストは、`if` 条件式だけでなく、[`when` 式](control-flow#when-expressions-and-statements)や[`while` ループ](control-flow#while-loops)でも機能します。

```kotlin
when (x) {
    is Int `->` print(x + 1)
    is String `->` print(x.length + 1)
    is IntArray `->` print(x.sum())
}
```

`if`、`when`、または `while` 条件で使用する前に `Boolean` 型の変数を宣言すると、コンパイラが変数について収集した情報は、スマートキャストのために対応するブロックでアクセス可能になります。

これは、ブール条件を変数に抽出するようなことを行いたい場合に役立ちます。
これにより、変数に意味のある名前を付けることができ、コードの可読性が向上し、後でコードで変数を再利用できるようになります。
例：

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

### 論理演算子

左辺に型チェック (通常または否定) がある場合、コンパイラは `&&` または `||` 演算子の右辺でスマートキャストを実行できます。

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

オブジェクトの型チェックを `or` 演算子 (`||`) と組み合わせると、スマートキャストはそれらの最も近い共通のスーパータイプに行われます。

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

共通のスーパータイプは、[共用体型](https://en.wikipedia.org/wiki/Union_type)の**近似**です。共用体型は[現在 Kotlin ではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

### インライン関数

コンパイラは、[インライン関数](inline-functions)に渡されるラムダ関数内でキャプチャされた変数をスマートキャストできます。

インライン関数は、暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
コントラクトを持つものとして扱われます。これは、インライン関数に渡されるラムダ関数がインプレースで呼び出されることを意味します。ラムダ関数はインプレースで呼び出されるため、コンパイラはラムダ関数が関数本体に含まれる変数への参照をリークできないことを認識しています。

コンパイラは、この知識と他の分析を使用して、キャプチャされた変数をスマートキャストすることが安全かどうかを判断します。
例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

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

スマートキャスト情報は、`catch` および `finally` ブロックに渡されます。これにより、コンパイラがオブジェクトに nullable な型があるかどうかを追跡するため、コードの安全性が向上します。例：

```kotlin

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

fun main() {
    testString()
}
```

### スマートキャストの前提条件

:::caution
スマートキャストは、チェックとその使用の間で変数が変更されないことをコンパイラが保証できる場合にのみ機能することに注意してください。

:::

スマートキャストは、次の条件で使用できます。
<table >
<tr>
<td>

            `val` ローカル変数
</td>
<td>

            常に。ただし、<a href="delegated-properties">ローカル委譲プロパティ</a>は除きます。
</td>
</tr>
<tr>
<td>

            `val` プロパティ
</td>
<td>

            プロパティが `private`、`internal` である場合、またはチェックがプロパティが宣言されているのと同じ <a href="visibility-modifiers#modules">モジュール</a>で実行される場合。スマートキャストは、`open` プロパティまたはカスタムゲッターを持つプロパティでは使用できません。
</td>
</tr>
<tr>
<td>

            `var` ローカル変数
</td>
<td>

            変数がチェックとその使用の間で変更されず、それを変更するラムダでキャプチャされず、ローカル委譲プロパティでない場合。
</td>
</tr>
<tr>
<td>

            `var` プロパティ
</td>
<td>

            他のコードによっていつでも変更される可能性があるため、使用できません。
</td>
</tr>
</table>

## "Unsafe" キャスト演算子

オブジェクトを非 nullable 型に明示的にキャストするには、*unsafe* キャスト演算子 `as` を使用します。

```kotlin
val x: String = y as String
```

キャストが不可能な場合、コンパイラは例外をスローします。これが _unsafe_ と呼ばれる理由です。

前の例で、`y` が `null` の場合、上記のコードも例外をスローします。これは、`String` が [nullable](null-safety)ではないため、`null` を `String` にキャストできないためです。可能な null 値に対して例が機能するようにするには、キャストの右辺で nullable 型を使用します。

```kotlin
val x: String? = y as String?
```

## "Safe" (nullable) キャスト演算子

例外を回避するには、*safe* キャスト演算子 `as?` を使用します。これは失敗時に `null` を返します。

```kotlin
val x: String? = y as? String
```

`as?` の右辺が非 nullable 型 `String` であるという事実にもかかわらず、キャストの結果は nullable であることに注意してください。