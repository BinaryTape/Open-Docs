[//]: # (title: 文字)

文字は`Char`型で表されます。
文字リテラルはシングルクォートで囲みます: `'1'`。

> JVM上では、プリミティブ型である`char`として格納される文字は、16ビットのUnicode文字を表します。
>
{style="note"}

特殊文字はエスケープ用のバックスラッシュ`\`で始まります。
以下のエスケープシーケンスがサポートされています:

*   `\t` – タブ
*   `\b` – バックスペース
*   `
` – 改行 (LF)
*   `\r` – キャリッジリターン (CR)
*   `\'` – シングルクォート
*   `\"` – ダブルクォート
*   `\\` – バックスラッシュ
*   `\$` – ドル記号

その他の文字をエンコードするには、Unicodeエスケープシーケンス構文を使用します: `'\uFF00'`。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // 余分な改行文字を出力します
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字変数の値が数字である場合、[`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)関数を使用して`Int`型の数値に明示的に変換できます。

> JVM上では、nullableな参照が必要な場合、文字は[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)の場合と同様にJavaクラスにボックス化されます。
> ボックス化操作によって同一性は保持されません。
>
{style="note"}