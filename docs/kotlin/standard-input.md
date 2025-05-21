---
title: 标准输入
---
:::note
Java Scanner 是一个比较慢的工具。只有在需要它提供的特定功能时才使用它。
否则，通常最好使用 Kotlin 的 `readln()` 函数来[读取标准输入](basic-syntax#read-from-the-standard-input)。

:::

为了从标准输入中读取数据，Java 提供了 `Scanner` 类。Kotlin 提供了两种主要的方式从标准输入中读取数据：
与 Java 类似的 `Scanner` 类和 `readln()` 函数。

## 使用 Java Scanner 从标准输入中读取数据

在 Java 中，标准输入通常通过 `System.in` 对象访问。你需要导入 `Scanner` 类，
创建一个对象，并使用诸如 `.nextLine()` 和 `.nextInt()` 之类的方法来读取不同的数据类型：

```java
//Java 实现
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 读取单行输入。例如：Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // 读取一个整数。例如：08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### 在 Kotlin 中使用 Java Scanner

由于 Kotlin 与 Java 库的互操作性，
你可以直接从 Kotlin 代码中访问 Java Scanner。

要在 Kotlin 中使用 Java Scanner，你需要导入 `Scanner` 类，并通过传递一个代表标准输入流并指示如何读取数据的 `System.in` 对象来初始化它。
你可以使用[可用的读取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)来读取不同于字符串的值，
例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

```kotlin
// 导入 Java Scanner
import java.util.Scanner

fun main() {
    // 初始化 Scanner
    val scanner = Scanner(System.`in`)

    // 读取整行字符串。例如："Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 读取一个字符串。例如："Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 读取一个数字。例如：123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

其他使用 Java Scanner 读取输入的有用方法有 `.hasNext()`、`.useDelimiter()` 和 `.close()`：

*  `.hasNext()`
   方法检查输入中是否有更多可用数据。如果有剩余元素要迭代，则返回布尔值 `true`，如果输入中没有剩余元素，则返回 `false`。

*  `.useDelimiter()` 方法设置读取输入元素的分隔符。默认情况下，分隔符是空格，但你可以指定其他字符。
   例如，`.useDelimiter(",")` 读取由逗号分隔的输入元素。

*  `.close()` 方法关闭与 Scanner 关联的输入流，阻止进一步使用 Scanner 读取输入。

:::note
使用完 Java Scanner 后，务必使用 `.close()` 方法。关闭 Java Scanner
会释放它消耗的资源并确保程序的正常行为。

:::

## 使用 readln() 从标准输入读取数据

在 Kotlin 中，除了 Java Scanner 之外，你还可以使用 `readln()` 函数。这是读取输入最直接的方法。此函数从标准输入中读取一行
文本，并将其作为字符串返回：

```kotlin
// 读取一个字符串。例如：Charlotte
val name = readln()

// 读取一个字符串并将其转换为整数。例如：43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

更多信息，请参考 [读取标准输入](read-standard-input)。