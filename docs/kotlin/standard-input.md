[//]: # (title: 标准输入)

> Java Scanner 是一个较慢的工具。仅在你需要它提供的特定功能时才使用它。
> 否则，通常更推荐使用 Kotlin 的 `readln()` 函数来[读取标准输入](basic-syntax.md#read-from-the-standard-input)。
>
{style="note"}

要从标准输入中读取，Java 提供了 `Scanner` 类。Kotlin 提供了两种主要方法来从标准输入中读取：类似于 Java 的 `Scanner` 类和 `readln()` 函数。

## 使用 Java Scanner 从标准输入中读取

在 Java 中，标准输入通常通过 `System.in` 对象进行访问。你需要导入 `Scanner` 类，创建一个对象，并使用诸如 `.nextLine()` 和 `.nextInt()` 等方法来读取不同数据类型：

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

### 在 Kotlin 中使用 Java Scanner

由于 Kotlin 与 Java 库的互操作性，你可以直接从 Kotlin 代码中访问 Java Scanner。

要在 Kotlin 中使用 Java Scanner，你需要导入 `Scanner` 类并通过传入一个 `System.in` 对象来初始化它，该对象代表标准输入流并决定如何读取数据。你可以使用[可用的读取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)来读取不同于字符串的值，例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

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

使用 Java Scanner 读取输入时，其他有用的方法包括 `.hasNext()`、`.useDelimiter()` 和 `.close()`：

*   `.hasNext()` 方法检查输入中是否还有更多可用数据。如果有剩余元素可迭代，则返回布尔值 `true`；如果输入中没有更多元素，则返回 `false`。

*   `.useDelimiter()` 方法设置读取输入元素的分隔符。默认情况下，分隔符是空格，但你可以指定其他字符。例如，`.useDelimiter(",")` 会读取用逗号分隔的输入元素。

*   `.close()` 方法关闭与 Scanner 关联的输入流，防止 Scanner 进一步用于读取输入。

> 使用完 Java Scanner 后，请务必使用 `.close()` 方法。关闭 Java Scanner 会释放它所消耗的资源，并确保程序正常运行。
>
{style="note"}

## 使用 readln() 从标准输入中读取

在 Kotlin 中，除了 Java Scanner 之外，你还可以使用 `readln()` 函数。这是读取输入最直接的方式。此函数从标准输入中读取一行文本并将其作为字符串返回：

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

有关更多信息，请参阅[读取标准输入](read-standard-input.md)。