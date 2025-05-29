[//]: # (title: 型チェックとキャスト)

Kotlinでは、実行時にオブジェクトの型をチェックする型チェックを実行できます。型キャストを使用すると、オブジェクトを別の型に変換できます。

> **ジェネリクス**の型チェックとキャスト（例：`List<T>`、`Map<K,V>`）について具体的に学ぶには、[ジェネリクス型チェックとキャスト](generics.md#generics-type-checks-and-casts)を参照してください。
>
{style="tip"}

## is および !is 演算子

オブジェクトが指定された型に適合するかどうかを識別する実行時チェックを実行するには、`is`演算子またはその否定形である`!is`を使用します。

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

ほとんどの場合、コンパイラがオブジェクトを自動的にキャストしてくれるため、明示的なキャスト演算子を使用する必要はありません。
これをスマートキャストと呼びます。コンパイラは、不変な値の型チェックと[明示的なキャスト](#unsafe-cast-operator)を追跡し、必要に応じて暗黙的な（安全な）キャストを自動的に挿入します。

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

コンパイラは、否定チェックがreturnにつながる場合にキャストが安全であることを認識するほどスマートです。

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 制御フロー

スマートキャストは、`if`条件式だけでなく、[`when`式](control-flow.md#when-expressions-and-statements)や[`while`ループ](control-flow.md#while-loops)でも機能します。

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

`Boolean`型の変数を`if`、`when`、または`while`条件で使用する前に宣言すると、コンパイラがその変数について収集した情報が、スマートキャストのために対応するブロックでアクセス可能になります。

これは、論理条件を変数に抽出したい場合などに役立ちます。そうすることで、変数に意味のある名前を付けられ、コードの可読性が向上し、後でコード内で変数を再利用できるようになります。例：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // コンパイラはisCatに関する情報にアクセスできるため、
        // animalがCat型にスマートキャストされたことを認識します。
        // したがって、purr()関数を呼び出すことができます。
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

コンパイラは、`&&`または`||`演算子の左辺に型チェック（通常または否定）がある場合、右辺でスマートキャストを実行できます。

```kotlin
// `||`の右辺でxは自動的にStringにキャストされます
if (x !is String || x.length == 0) return

// `&&`の右辺でxは自動的にStringにキャストされます
if (x is String && x.length > 0) {
    print(x.length) // xは自動的にStringにキャストされます
}
```

オブジェクトの型チェックを`or`演算子（`||`）と組み合わせると、最も近い共通のスーパータイプにスマートキャストされます。

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatusは共通のスーパータイプStatusにスマートキャストされます
        signalStatus.signal()
    }
}
```

> 共通のスーパータイプは、[ユニオン型](https://en.wikipedia.org/wiki/Union_type)の**近似**です。ユニオン型は[現在Kotlinではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

### インライン関数

コンパイラは、[インライン関数](inline-functions.md)に渡されるラムダ関数内でキャプチャされた変数をスマートキャストできます。

インライン関数は、暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われます。これは、インライン関数に渡されるラムダ関数がインプレースで呼び出されることを意味します。ラムダ関数はインプレースで呼び出されるため、コンパイラはラムダ関数がその関数本体に含まれる変数の参照を漏洩できないことを認識しています。

コンパイラは、この知識と他の分析を組み合わせて、キャプチャされた変数をスマートキャストしても安全かどうかを判断します。例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // コンパイラはprocessorがローカル変数であり、inlineAction()がインライン関数であることを認識しているため、
        // processorへの参照が漏洩することはありません。
        // したがって、processorをスマートキャストしても安全です。
      
        // processorがnullでない場合、processorはスマートキャストされます
        if (processor != null) {
            // コンパイラはprocessorがnullでないことを認識しているため、
            // セーフコールは不要です
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 例外処理

スマートキャスト情報は`catch`ブロックと`finally`ブロックに渡されます。これにより、コンパイラがオブジェクトがNull許容型であるかどうかを追跡するため、コードの安全性が向上します。例：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInputはString型にスマートキャストされます
    stringInput = ""
    try {
        // コンパイラはstringInputがnullでないことを認識しています
        println(stringInput.length)
        // 0

        // コンパイラはstringInputの以前のスマートキャスト情報を破棄します。
        // これでstringInputはString?型になります。
        stringInput = null

        // 例外をトリガー
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // コンパイラはstringInputがnullになり得ることを認識しているため、
        // stringInputはNull許容のままです。
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

> スマートキャストは、コンパイラが、変数がチェックと使用の間に変更されないことを保証できる場合にのみ機能することに注意してください。
>
{style="warning"}

スマートキャストは以下の条件下で使用できます。

<table style="none">
    <tr>
        <td>
            <code>val</code> ローカル変数
        </td>
        <td>
            常に、<a href="delegated-properties.md">ローカルのデリゲートプロパティ</a>を除く。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> プロパティ
        </td>
        <td>
            プロパティが<code>private</code>、<code>internal</code>である場合、またはプロパティが宣言されている同じ<a href="visibility-modifiers.md#modules">モジュール</a>でチェックが実行される場合。スマートキャストは<code>open</code>プロパティやカスタムゲッターを持つプロパティには使用できません。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> ローカル変数
        </td>
        <td>
            変数がチェックと使用の間で変更されない場合、それを変更するラムダでキャプチャされない場合、およびローカルのデリゲートプロパティではない場合。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> プロパティ
        </td>
        <td>
            変数がいつでも他のコードによって変更される可能性があるため、使用できません。
        </td>
    </tr>
</table>

## 「安全でない (unsafe)」キャスト演算子

オブジェクトをNull非許容型に明示的にキャストするには、*安全でない*キャスト演算子`as`を使用します。

```kotlin
val x: String = y as String
```

キャストが不可能な場合、コンパイラは例外をスローします。これが*安全でない*と呼ばれる理由です。

前の例で`y`が`null`の場合、上記のコードも例外をスローします。これは、`String`が[Null許容](null-safety.md)ではないため、`null`を`String`にキャストできないためです。Null値の可能性がある例を機能させるには、キャストの右辺でNull許容型を使用します。

```kotlin
val x: String? = y as String?
```

## 「安全な (safe)」（Null許容）キャスト演算子

例外を避けるには、失敗時に`null`を返す*安全な*キャスト演算子`as?`を使用します。

```kotlin
val x: String? = y as? String
```

`as?`の右辺がNull非許容型`String`であるにもかかわらず、キャストの結果はNull許容になることに注意してください。