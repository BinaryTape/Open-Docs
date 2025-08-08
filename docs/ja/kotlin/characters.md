[//]: # (title: 文字)

文字は`Char`型で表現されます。
文字リテラルはシングルクォートで囲まれます: `'1'`。

> JVMでは、`char`プリミティブ型として保存される文字は、16ビットのUnicode文字を表します。
>
{style="note"}

特殊文字はエスケープバックラッシュ`\`で始まります。
以下のエスケープシーケンスがサポートされています:

*   `\t` – タブ
*   `\b` – バックスペース
*   `
` – 改行 (LF)
*   `\r` – キャリッジリターン (CR)
*   `\'` – シングルクォーテーション
*   `\"` – ダブルクォーテーション
*   `\\` – バックスラッシュ
*   `\$` – ドル記号

他の任意の文字をエンコードするには、Unicodeエスケープシーケンス構文: `'\uFF00'`を使用します。

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('
') // Prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字変数の値が数字である場合、[`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)関数を使用して、明示的に`Int`数値に変換できます。

> JVMでは、[数値](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine)の場合と同様に、null許容参照が必要な場合に文字はJavaクラスにボックス化されます。
> ボックス化操作によって同一性は保持されません。
>
{style="note"}