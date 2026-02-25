[//]: # (title: 標準入力)

> Java Scannerは動作が低速なツールです。Scannerが提供する特定の機能が必要な場合にのみ使用してください。
> そうでない場合は、通常、Kotlinの`readln()`関数を使用して[標準入力を読み取る](basic-syntax.md#read-from-the-standard-input)のが望ましいです。
>
{style="note"}

標準入力から読み取るために、Javaは`Scanner`クラスを提供しています。Kotlinでは、標準入力から読み取るための主な方法として、Javaと同様の`Scanner`クラスと`readln()`関数の2つが用意されています。

## Java Scannerを使用して標準入力から読み取る

Javaでは、通常`System.in`オブジェクトを介して標準入力にアクセスします。`Scanner`クラスをインポートしてオブジェクトを作成し、`.nextLine()`や`.nextInt()`などのメソッドを使用してさまざまなデータ型を読み取ります。

```java
// Javaの実装
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 入力を1行読み取ります。例: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // 出力: You entered: Hi there!

        // 整数を読み取ります。例: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // 出力: You entered: 08081990

        scanner.close();
    }
}
```

### KotlinでJava Scannerを使用する

KotlinはJavaライブラリとの相互運用性を備えているため、特別な設定なしでKotlinコードからJava Scannerにアクセスできます。

KotlinでJava Scannerを使用するには、`Scanner`クラスをインポートし、標準入力ストリームを表しデータの読み取り方を指定する`System.in`オブジェクトを渡して初期化する必要があります。
文字列以外の値を読み取るために、`.nextLine()`、`.next()`、`.nextInt()`などの[利用可能な読み取りメソッド](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)を使用できます。

```kotlin
// Java Scannerをインポート
import java.util.Scanner

fun main() {
    // Scannerを初期化
    val scanner = Scanner(System.`in`)

    // 文字列を1行まるごと読み取ります。例: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 文字列を読み取ります。例: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 数値を読み取ります。例: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

Java Scannerで入力を読み取る際に便利なその他のメソッドとして、`.hasNext()`、`.useDelimiter()`、`.close()`があります。

* `.hasNext()`
  メソッドは、入力に利用可能なデータがまだあるかどうかをチェックします。反復処理する要素が残っている場合はブール値の `true` を返し、入力に要素が残っていない場合は `false` を返します。

* `.useDelimiter()` メソッドは、入力要素を読み取るためのデリミタ（区切り文字）を設定します。デフォルトのデリミタは空白文字ですが、他の文字を指定することもできます。
  例えば、`.useDelimiter(",")` は、カンマで区切られた入力要素を読み取ります。

* `.close()` メソッドは、Scannerに関連付けられた入力ストリームを閉じ、それ以上Scannerを使用して入力を読み取れないようにします。

> Java Scannerの使用が終わったら、必ず `.close()` メソッドを使用してください。Java Scannerを閉じると、消費されていたリソースが解放され、プログラムが適切に動作するようになります。
>
{style="note"}

## readln() を使用して標準入力から読み取る

Kotlinには、Java Scannerのほかに `readln()` 関数があります。これは入力を読み取るための最も簡単な方法です。この関数は標準入力からテキストを1行読み取り、それを文字列として返します。

```kotlin
// 文字列を読み取ります。例: Charlotte
val name = readln()

// 文字列を読み取り、整数に変換します。例: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。