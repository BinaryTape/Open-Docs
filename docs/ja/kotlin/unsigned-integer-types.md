---
title: 符号なし整数型
---
[integer types](numbers#integer-types)に加え、Kotlinでは符号なし整数値に対して次の型が提供されています。

| Type     | Size (bits) | Min value | Max value                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

符号なし型は、符号付きの対応する型のほとんどの演算をサポートしています。

:::note
符号なし数値は、同じ幅の対応する符号付きの型を含む単一のストレージプロパティを持つ[inline classes](inline-classes)として実装されます。符号なし整数型と符号付き整数型の間で変換する場合は、関数呼び出しと演算が新しい型をサポートするようにコードを更新してください。

:::

## 符号なし配列と範囲

:::caution
符号なし配列とそれらに対する演算は[Beta](components-stability)版です。予告なく互換性のない変更が行われる可能性があります。オプトインが必要です（詳細は下記参照）。

:::

プリミティブと同様に、各符号なし型には、その型の配列を表す対応する型があります。

* `UByteArray`: 符号なしバイトの配列。
* `UShortArray`: 符号なしShortの配列。
* `UIntArray`: 符号なしIntの配列。
* `ULongArray`: 符号なしLongの配列。

符号付き整数配列と同様に、ボックス化のオーバーヘッドなしに `Array` クラスと同様のAPIを提供します。

符号なし配列を使用すると、この機能がまだ安定していないことを示す警告が表示されます。警告を削除するには、`@ExperimentalUnsignedTypes` アノテーションを使用してオプトインしてください。クライアントがAPIの使用に明示的にオプトインする必要があるかどうかを判断するのはあなた次第ですが、符号なし配列は安定した機能ではないため、それらを使用するAPIは言語の変更によって破損する可能性があることに注意してください。[オプトイン要件の詳細](opt-in-requirements)をご覧ください。

[Ranges and progressions](ranges) は、`UInt` および `ULong` に対して、`UIntRange`、`UIntProgression`、`ULongRange`、および `ULongProgression` クラスによってサポートされています。符号なし整数型とともに、これらのクラスは安定しています。

## 符号なし整数リテラル

符号なし整数を使いやすくするために、特定の符号なし型を示すサフィックスを整数リテラルに追加できます（`Float` の `F` や `Long` の `L` と同様）。

* `u` および `U` 文字は、正確な型を指定せずに符号なしリテラルを示します。
    期待される型が指定されていない場合、コンパイラはリテラルのサイズに応じて `UInt` または `ULong` を使用します。

    ```kotlin
    val b: UByte = 1u  // UByte, expected type provided
    val s: UShort = 1u // UShort, expected type provided
    val l: ULong = 1u  // ULong, expected type provided
  
    val a1 = 42u // UInt: no expected type provided, constant fits in UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
    ```

* `uL` および `UL` は、リテラルが符号なし long であることを明示的に指定します。

    ```kotlin
    val a = 1UL // ULong, even though no expected type provided and the constant fits into UInt
    ```

## ユースケース

符号なし数値の主なユースケースは、整数のビット範囲全体を利用して正の値を表現することです。たとえば、32ビットの `AARRGGBB` 形式の色など、符号付き型に収まらない16進定数を表現する場合などです。

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

明示的な `toByte()` リテラルキャストなしで、符号なし数値を使用してバイト配列を初期化できます。

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

もう1つのユースケースは、ネイティブAPIとの相互運用性です。Kotlinでは、シグネチャに符号なし型を含むネイティブ宣言を表現できます。マッピングは、符号なし整数を符号付き整数に置き換えることはなく、セマンティクスを変更せずに維持します。

### 非目標

符号なし整数は正の数とゼロのみを表すことができますが、アプリケーションドメインが非負の整数を必要とする場合に使用することは目標ではありません。たとえば、コレクションサイズまたはコレクションインデックス値の型として。

これにはいくつかの理由があります。

* 符号付き整数を使用すると、偶発的なオーバーフローを検出し、エラー状態を通知するのに役立ちます。たとえば、空のリストの場合の[`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)が -1 など。
* 符号なし整数の値の範囲は符号付き整数の範囲のサブセットではないため、符号なし整数は範囲が制限されたバージョンの符号付き整数として扱うことはできません。符号付き整数も符号なし整数も、互いにサブタイプではありません。
  ```