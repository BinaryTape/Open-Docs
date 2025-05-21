---
title: 文字
---
文字は `Char` 型で表されます。
文字リテラルはシングルクォートで囲みます: `'1'`。

:::note
JVMでは、文字はプリミティブ型 (`char`) として格納され、16ビットの Unicode 文字を表します。

:::

特殊文字は、エスケープのバックスラッシュ `\` から始まります。
次のエスケープシーケンスがサポートされています。

* `\t` – タブ
* `\b` – バックスペース
* `
` – 改行 (LF)
* `\r` – 復帰 (CR)
* `\'` – シングルクォーテーションマーク
* `\"` – ダブルクォーテーションマーク
* `\\` – バックスラッシュ
* `\

   – ドル記号

その他の文字をエンコードするには、Unicode エスケープシーケンスの構文 `'\uFF00'` を使用します。

```kotlin
fun main() {

    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // Prints an extra newline character
    println('\uFF00')

}
```

文字変数の値が数字の場合、[`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 関数を使用して、明示的に `Int` 数値に変換できます。

:::note
JVMでは、[数値](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine)と同様に、nullable な参照が必要な場合、文字は Java クラスでボックス化されます。
同一性は、ボックス化操作によって保持されません。

:::