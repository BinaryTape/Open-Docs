[//]: # (title: 文字)

文字は `Char` 型で表されます。
文字リテラルはシングルクォートで囲みます： `'1'`。

> JVM上では、文字はプリミティブ型の `char` として格納され、16ビットのUnicode文字を表します。
>
{style="note"}

特殊文字はエスケープ用のバックスラッシュ `\` で始まります。
以下のエスケープシーケンスがサポートされています：

* `\t` – タブ
* `\b` – バックスペース
* `
` – 改行 (LF)
* `\r` – 復帰 (CR)
* `\'` – シングルクォーテーション
* `\"` – ダブルクォーテーション
* `\\` – バックスラッシュ
* `\$` – ドル記号

それ以外の文字をエンコードするには、Unicodeエスケープシーケンス構文 `'\uFF00'` を使用します。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 追加の改行文字を出力する
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字変数の値が数字である場合、[`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 関数を使用して明示的に `Int` 数値に変換できます。

> JVM上では、[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)と同様に、Null許容（nullable）な参照が必要な場合に文字はJavaクラスにボックス化されます。
> ボックス化操作によって同一性（identity）は保持されません。
>
{style="note"}