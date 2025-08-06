[//]: # (title: 標準入力)

> Javaの`Scanner`は処理の遅いツールです。その特定の機能が必要な場合にのみ使用してください。
> そうでない場合は、Kotlinの`readln()`関数を使用して[標準入力から読み込む](basic-syntax.md#read-from-the-standard-input)方が一般的に推奨されます。
>
{style="note"}

標準入力から読み込むために、Javaでは`Scanner`クラスが提供されています。Kotlinでは、Javaと同様の`Scanner`クラスと`readln()`関数の2つの主要な方法で標準入力から読み込むことができます。

## Javaの`Scanner`で標準入力から読み込む

Javaでは、通常`System.in`オブジェクトを介して標準入力にアクセスします。`Scanner`クラスをインポートし、オブジェクトを作成して、`.nextLine()`や`.nextInt()`のようなメソッドを使用して異なるデータ型を読み取る必要があります。

```java
// Javaの実装
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 1行の入力を読み込みます。例: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // 整数を読み込みます。例: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### KotlinでJavaの`Scanner`を使用する

KotlinとJavaライブラリの相互運用性により、KotlinコードからJavaの`Scanner`にそのままアクセスできます。

KotlinでJavaの`Scanner`を使用するには、`Scanner`クラスをインポートし、標準入力ストリームを表しデータの読み取り方法を決定する`System.in`オブジェクトを渡して初期化する必要があります。
文字列以外の値を読み取るには、[利用可能な読み取りメソッド](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)を使用できます。
例えば、`.nextLine()`、`.next()`、および`.nextInt()`などです。

```kotlin
// JavaのScannerをインポートします
import java.util.Scanner

fun main() {
    // Scannerを初期化します
    val scanner = Scanner(System.`in`)

    // 文字列全体を1行読み込みます。例: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 文字列を読み込みます。例: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 数値を読み込みます。例: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

Javaの`Scanner`で入力を読み取るためのその他の便利なメソッドは、`.hasNext()`、`.useDelimiter()`、および`.close()`です。

* `.hasNext()`メソッドは、入力にさらにデータがあるかどうかをチェックします。イテレートする要素が残っている場合はブール値`true`を返し、入力に残りの要素がない場合は`false`を返します。

* `.useDelimiter()`メソッドは、入力要素を読み取るためのデリミタ（区切り文字）を設定します。デリミタはデフォルトで空白ですが、他の文字を指定することもできます。
  例えば、`.useDelimiter(",")`はカンマで区切られた入力要素を読み取ります。

* `.close()`メソッドは、`Scanner`に関連付けられた入力ストリームを閉じ、それ以降の`Scanner`での入力読み取りを防ぎます。

> Javaの`Scanner`の使用を終えたら、必ず`.close()`メソッドを使用してください。Javaの`Scanner`を閉じることで、消費していたリソースが解放され、プログラムの適切な動作が保証されます。
>
{style="note"}

## `readln()`で標準入力から読み込む

Kotlinでは、Javaの`Scanner`とは別に、`readln()`関数があります。これは入力を読み取る最も簡単な方法です。この関数は、標準入力からテキストの1行を読み取り、それを文字列として返します。

```kotlin
// 文字列を読み込みます。例: Charlotte
val name = readln()

// 文字列を読み込み、整数に変換します。例: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。