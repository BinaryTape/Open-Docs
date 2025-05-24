---
title: 演算子のオーバーロード
---
Kotlin では、型に対する定義済みの演算子セットのカスタム実装を提供できます。これらの演算子には、定義済みの記号表現 (`+` や `*` など) と優先順位があります。演算子を実装するには、対応する型の特定の名前を持つ[メンバー関数](functions#member-functions)または[拡張関数](extensions)を提供します。この型は、二項演算の左辺の型、および単項演算の引数の型になります。

演算子をオーバーロードするには、対応する関数に `operator` 修飾子を付けます。

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
演算子のオーバーロードを[オーバーライド](inheritance#overriding-methods)する場合、`operator` は省略できます。

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 単項演算

### 単項プレフィックス演算子

| Expression | Translated to |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

この表は、コンパイラーがたとえば式 `+a` を処理するときに、次の手順を実行することを示しています。

* `a` の型を決定し、それを `T` とします。
* レシーバー `T` に対して、`operator` 修飾子を持ち、パラメーターを持たない関数 `unaryPlus()` を検索します。これは、メンバー関数または拡張関数を意味します。
* 関数が存在しないか、あいまいな場合は、コンパイルエラーになります。
* 関数が存在し、その戻り値の型が `R` の場合、式 `+a` は型 `R` を持ちます。

:::note
これらの演算は、他のすべての演算と同様に、[基本的な型](basic-types)に対して最適化されており、それらの関数呼び出しのオーバーヘッドは発生しません。

:::

例として、単項マイナス演算子をオーバーロードする方法を次に示します。

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```

### インクリメントとデクリメント

| Expression | Translated to |
|------------|---------------|
| `a++` | `a.inc()` + 下記参照 |
| `a--` | `a.dec()` + 下記参照 |

`inc()` 関数と `dec()` 関数は、`++` または `--` 演算が使用された変数に割り当てられる値を返す必要があります。それらは、`inc` または `dec` が呼び出されたオブジェクトを変更すべきではありません。

コンパイラーは、*後置*形式の演算子の解決のために、たとえば `a++` で次の手順を実行します。

* `a` の型を決定し、それを `T` とします。
* 型 `T` のレシーバーに適用可能な、`operator` 修飾子を持ち、パラメーターを持たない関数 `inc()` を検索します。
* 関数の戻り値の型が `T` のサブタイプであることを確認します。

式を計算する効果は次のとおりです。

* `a` の初期値を一時ストレージ `a0` に格納します。
* `a0.inc()` の結果を `a` に割り当てます。
* 式の結果として `a0` を返します。

`a--` の場合、手順は完全に類似しています。

*接頭辞*形式 `++a` および `--a` の場合、解決は同じように機能し、効果は次のとおりです。

* `a.inc()` の結果を `a` に割り当てます。
* 式の結果として `a` の新しい値を返します。

## 二項演算

### 算術演算子

| Expression | Translated to |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

この表の演算の場合、コンパイラーは *Translated to* 列の式を解決するだけです。

以下は、指定された値から始まり、オーバーロードされた `+` 演算子を使用してインクリメントできる `Counter` クラスの例です。

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 演算子

| Expression | Translated to |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

`in` および `!in` の場合、手順は同じですが、引数の順序が逆になります。

### インデックス付きアクセス演算子

| Expression | Translated to |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

角かっこは、適切な数の引数を持つ `get` および `set` の呼び出しに変換されます。

### invoke 演算子

| Expression | Translated to |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

括弧は、適切な数の引数を持つ `invoke` の呼び出しに変換されます。

### 拡張代入

| Expression | Translated to |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

代入演算の場合、たとえば `a += b` で、コンパイラーは次の手順を実行します。

* 右側の列の関数が使用可能な場合:
  * 対応する二項関数 (つまり、`plusAssign()` の場合は `plus()`) も使用可能で、`a` が可変変数であり、`plus` の戻り値の型が `a` の型のサブタイプである場合は、エラー (あいまいさ) を報告します。
  * その戻り値の型が `Unit` であることを確認し、そうでない場合はエラーを報告します。
  * `a.plusAssign(b)` のコードを生成します。
* それ以外の場合は、`a = a + b` のコードを生成しようとします (これには型チェックが含まれます: `a + b` の型は `a` のサブタイプでなければなりません)。

:::note
代入は Kotlin では *式ではありません*。

:::

### 等価演算子と不等価演算子

| Expression | Translated to |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

これらの演算子は、[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 関数でのみ機能し、カスタムの等価性チェックの実装を提供するためにオーバーライドできます。同じ名前の他の関数 (`equals(other: Foo)` など) は呼び出されません。

:::note
`===` および `!==` (同一性チェック) はオーバーロードできないため、それらに対する規約は存在しません。

:::

`==` 演算は特別です: これは `null` をスクリーニングする複雑な式に変換されます。
`null == null` は常に true であり、null 以外の `x` の場合、`x == null` は常に false であり、`x.equals()` を呼び出しません。

### 比較演算子

| Expression | Translated to |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

すべての比較は `compareTo` の呼び出しに変換され、`Int` を返す必要があります。

### プロパティ委譲演算子

`provideDelegate`、`getValue`、`setValue` 演算子関数は、[委譲されたプロパティ](delegated-properties)で説明されています。

## 名前付き関数に対する Infix 呼び出し

[Infix 関数呼び出し](functions#infix-notation)を使用すると、カスタムの Infix 演算をシミュレートできます。