[//]: # (title: 符号なし整数型)

[整数型](numbers.md#integer-types)に加え、Kotlinは符号なし整数値のために以下の型を提供します。

| 型       | サイズ (ビット) | 最小値 | 最大値                                        |
|----------|-------------|----------|-------------------------------------------------|
| `UByte`  | 8           | 0        | 255                                             |
| `UShort` | 16          | 0        | 65,535                                          |
| `UInt`   | 32          | 0        | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0        | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

符号なし型は、対応する符号付き型のほとんどの演算をサポートしています。

> 符号なし数は、対応する同じ幅の符号付き型を含む単一のストレージプロパティを持つ[インラインクラス](inline-classes.md)として実装されています。
> 符号なし整数型と符号付き整数型の間で変換する場合、
> 関数呼び出しと演算が新しい型をサポートするようにコードを更新してください。
>
{style="note"}

## 符号なし配列とレンジ

> 符号なし配列とその操作は[ベータ版](components-stability.md)です。これらはいつでも非互換な変更が行われる可能性があります。
> オプトインが必要です（詳細は下記を参照）。
>
{style="warning"}

プリミティブ型と同様に、各符号なし型にはその型の配列を表す対応する型があります。

*   `UByteArray`: 符号なしバイトの配列。
*   `UShortArray`: 符号なしショートの配列。
*   `UIntArray`: 符号なしイントの配列。
*   `ULongArray`: 符号なしロングの配列。

符号付き整数配列と同様に、ボクシングのオーバーヘッドなしで`Array`クラスに似たAPIを提供します。

符号なし配列を使用すると、この機能がまだ安定していないことを示す警告が表示されます。
警告を削除するには、`@ExperimentalUnsignedTypes`アノテーションでオプトインしてください。
クライアントがあなたのAPIの使用に明示的にオプトインする必要があるかどうかはあなた次第ですが、
符号なし配列は安定した機能ではないため、それらを使用するAPIは言語の変更によって壊れる可能性があることに留意してください。
[オプトイン要件の詳細はこちら](opt-in-requirements.md)。

[レンジとプログレッション](ranges.md)は、`UIntRange`、`UIntProgression`、`ULongRange`、`ULongProgression`クラスによって`UInt`および`ULong`でサポートされています。これらのクラスは、符号なし整数型とともに安定しています。

## 符号なし整数リテラル

符号なし整数を使いやすくするために、整数リテラルの末尾に特定の符号なし型を示す接尾辞を追加できます（`Float`の`F`や`Long`の`L`と同様です）。

*   `u`および`U`の文字は、正確な型を指定せずに符号なしリテラルを示します。
    期待される型が提供されていない場合、コンパイラはリテラルのサイズに応じて`UInt`または`ULong`を使用します。

    ```kotlin
    val b: UByte = 1u  // UByte, expected type provided
    val s: UShort = 1u // UShort, expected type provided
    val l: ULong = 1u  // ULong, expected type provided
  
    val a1 = 42u // UInt: no expected type provided, constant fits in UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
    ```

*   `uL`および`UL`は、リテラルが符号なしロングであることを明示的に指定します。

    ```kotlin
    val a = 1UL // ULong, even though no expected type provided and the constant fits into UInt
    ```

## ユースケース

符号なし数の主なユースケースは、整数の全ビット範囲を利用して正の値を表現することです。
例えば、32ビットの`AARRGGBB`形式の色のように、符号付き型に収まらない16進数定数を表現する場合などです。

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

明示的な`toByte()`リテラルキャストなしでバイト配列を初期化するために、符号なし数を使用できます。

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

もう1つのユースケースは、ネイティブAPIとの相互運用です。Kotlinは、シグネチャに符号なし型を含むネイティブ宣言を表現することを可能にします。マッピングは、セマンティクスを変更せずに符号なし整数を符号付き整数で置き換えることはありません。

### 非目標

符号なし整数は正の数とゼロのみを表現できますが、アプリケーションのドメインが非負の整数を要求する場所（例：コレクションのサイズやコレクションのインデックス値の型として）でそれらを使用することは目標ではありません。

これにはいくつかの理由があります。

*   符号付き整数を使用することで、意図しないオーバーフローを検出し、エラー状態を通知するのに役立ちます。例えば、空のリストに対する[`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)が-1になるなどです。
*   符号なし整数は、その値の範囲が符号付き整数の範囲の部分集合ではないため、符号付き整数の範囲が制限されたバージョンとして扱われることはありません。符号付き整数も符号なし整数も、互いのサブタイプではありません。