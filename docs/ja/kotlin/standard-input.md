[//]: # (title: 標準入力)

> Java Scannerは処理が遅いツールです。提供される特定の機能が必要な場合にのみ使用してください。
> それ以外の場合は、通常、Kotlinの`readln()`関数を使用して[標準入力から読み込む](basic-syntax.md#read-from-the-standard-input)方が好ましいです。
>
{style="note"}

標準入力から読み込むには、Javaでは`Scanner`クラスが提供されています。Kotlinでは、標準入力から読み込む主な方法が2つあります。Javaと同様の`Scanner`クラスと、`readln()`関数です。

## Java Scanner を使用して標準入力から読み込む

Javaでは、標準入力は通常`System.in`オブジェクトを介してアクセスされます。`Scanner`クラスをインポートし、オブジェクトを作成し、`.nextLine()`や`.nextInt()`のようなメソッドを使用して異なるデータ型を読み取る必要があります。

```java
//Java implementation
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Reads a single line of input. For example: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // Reads an integer. For example: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### KotlinでJava Scannerを使用する

KotlinはJavaライブラリとの相互運用性があるため、KotlinコードからJava Scannerをすぐに使用できます。

KotlinでJava Scannerを使用するには、`Scanner`クラスをインポートし、標準入力ストリームを表し、データの読み取り方法を決定する`System.in`オブジェクトを渡して初期化する必要があります。文字列以外の値を読み取るために、`.nextLine()`、`.next()`、`.nextInt()`など、[利用可能な読み取りメソッド](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)を使用できます。

```kotlin
// Imports Java Scanner
import java.util.Scanner

fun main() {
    // Initializes the Scanner
    val scanner = Scanner(System.`in`)

    // Reads a whole string line. For example: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // Reads a string. For example: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // Reads a number. For example: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

Java Scannerで入力を読み取るためのその他の便利なメソッドは、`.hasNext()`、`.useDelimiter()`、`.close()`です。

*   `.hasNext()`メソッドは、入力にさらにデータがあるかどうかを確認します。イテレートする残りの要素がある場合はブール値`true`を返し、入力に残りの要素がない場合は`false`を返します。

*   `.useDelimiter()`メソッドは、入力要素を読み取るための区切り文字を設定します。区切り文字はデフォルトで空白文字ですが、他の文字を指定することもできます。たとえば、`.useDelimiter(",")`はカンマで区切られた入力要素を読み取ります。

*   `.close()`メソッドは、Scannerに関連付けられた入力ストリームを閉じ、それ以降のScannerによる入力読み取りを防止します。

> Java Scannerの使用が完了したら、必ず`.close()`メソッドを使用してください。Java Scannerを閉じることで、消費しているリソースが解放され、プログラムが適切に動作するようになります。
>
{style="note"}

## `readln()` を使用して標準入力から読み込む

Kotlinでは、Java Scannerとは別に、`readln()`関数があります。これは入力を読み取る最も簡単な方法です。この関数は、標準入力から1行のテキストを読み取り、それを文字列として返します。

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。