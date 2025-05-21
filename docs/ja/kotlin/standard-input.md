---
title: 標準入力
---
:::note
JavaのScannerは遅いツールです。特定の機能が必要な場合にのみ使用してください。
それ以外の場合は、一般的にKotlinの`readln()`関数を使用して[標準入力から読み取る](basic-syntax#read-from-the-standard-input)方が推奨されます。

:::

標準入力から読み取るために、Javaは`Scanner`クラスを提供しています。Kotlinでは、標準入力から読み取るための主な方法が2つあります。
Javaと同様の`Scanner`クラスと、`readln()`関数です。

## Java Scannerで標準入力から読み取る

Javaでは、標準入力は通常、`System.in`オブジェクトを介してアクセスされます。`Scanner`クラスをインポートし、
オブジェクトを作成し、`.nextLine()`や`.nextInt()`などのメソッドを使用して、さまざまなデータ型を読み取る必要があります。

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

KotlinはJavaライブラリとの相互運用性があるため、
KotlinのコードからJava Scannerをすぐに利用できます。

KotlinでJava Scannerを使用するには、`Scanner`クラスをインポートし、標準入力ストリームを表し、データの読み取り方法を指示する`System.in`オブジェクトを渡して初期化する必要があります。
文字列とは異なる値を読み取るために、[利用可能な読み取りメソッド](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)を使用できます。
たとえば、`.nextLine()`、`.next()`、および`.nextInt()`などです。

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

Java Scannerで入力を読み取るためのその他の便利なメソッドは、`.hasNext()`、`.useDelimiter()`、および`.close()`です。

* `.hasNext()`
  メソッドは、入力にさらにデータがあるかどうかを確認します。反復処理する要素が残っている場合はブール値`true`を返し、入力に要素が残っていない場合は`false`を返します。

* `.useDelimiter()`メソッドは、入力要素を読み取るための区切り文字を設定します。区切り文字はデフォルトでは空白ですが、他の文字を指定できます。
  たとえば、`.useDelimiter(",")`は、コンマで区切られた入力要素を読み取ります。

* `.close()`メソッドは、Scannerに関連付けられた入力ストリームを閉じ、Scannerを使用した入力の読み取りをそれ以上行わないようにします。

:::note
Java Scannerの使用が完了したら、必ず`.close()`メソッドを使用してください。Java Scannerを閉じると、
それが消費するリソースが解放され、プログラムの適切な動作が保証されます。

:::

## readln()で標準入力から読み取る

Kotlinでは、Java Scannerとは別に、`readln()`関数があります。これは、入力を読み取る最も簡単な方法です。この関数は、
標準入力からテキスト行を読み取り、それを文字列として返します。

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

詳細については、[標準入力から読み取る](read-standard-input)を参照してください。